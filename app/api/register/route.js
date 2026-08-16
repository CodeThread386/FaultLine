import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { TRACKS } from "@/lib/tracks-meta";
import { writeAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { teamName, registerNumber, name, email, phone, track, teammateCount, teammates } = body || {};

    if (!teamName?.trim()) {
      return NextResponse.json({ error: "Team name is required." }, { status: 400 });
    }
    if (!registerNumber?.trim()) {
      return NextResponse.json({ error: "Leader Register number is required." }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Leader Name is required." }, { status: 400 });
    }
    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "Valid Leader Email ID is required." }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: "Leader Phone number is required." }, { status: 400 });
    }
    if (!track?.trim() || !TRACKS.includes(track.trim())) {
      return NextResponse.json(
        { error: `Please select a valid track (${TRACKS.join(", ")}).` },
        { status: 400 }
      );
    }

    const count = parseInt(teammateCount || 0, 10);
    const totalMembers = 1 + count;

    if (totalMembers < 3 || totalMembers > 5) {
      return NextResponse.json(
        { error: "A team must consist of minimum 3 and maximum 5 members." },
        { status: 400 }
      );
    }

    const cleanedTeammates = [];

    if (Array.isArray(teammates)) {
      for (let i = 0; i < count; i++) {
        const tm = teammates[i] || {};
        if (!tm.name?.trim()) {
          return NextResponse.json({ error: `Teammate #${i + 1} Name is required.` }, { status: 400 });
        }
        if (!tm.registerNumber?.trim()) {
          return NextResponse.json({ error: `Teammate #${i + 1} Register Number is required.` }, { status: 400 });
        }
        if (!tm.email?.trim() || !tm.email.includes("@")) {
          return NextResponse.json({ error: `Teammate #${i + 1} Email is required.` }, { status: 400 });
        }
        cleanedTeammates.push({
          name: tm.name.trim(),
          register_number: tm.registerNumber.trim().toUpperCase(),
          email: tm.email.trim().toLowerCase(),
          phone: tm.phone?.trim() || null
        });
      }
    }

    const leader = {
      register_number: registerNumber.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim()
    };

    const allMembers = [leader, ...cleanedTeammates];
    const allEmails = allMembers.map((m) => m.email);
    const allRegNums = allMembers.map((m) => m.register_number);

    if (new Set(allEmails).size !== allEmails.length) {
      return NextResponse.json({ error: "Duplicate email within the team." }, { status: 400 });
    }
    if (new Set(allRegNums).size !== allRegNums.length) {
      return NextResponse.json({ error: "Duplicate register number within the team." }, { status: 400 });
    }

    const db = getSupabaseServerClient();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable." }, { status: 500 });
    }

    const { data: teamNameTaken } = await db
      .from("teams")
      .select("id")
      .ilike("name", teamName.trim())
      .maybeSingle();
    if (teamNameTaken) {
      return NextResponse.json({ error: "Team name already taken." }, { status: 409 });
    }

    const { data: dupeUsers } = await db
      .from("users")
      .select("email, register_number")
      .or(`email.in.(${allEmails.join(",")}),register_number.in.(${allRegNums.join(",")})`);
    if (dupeUsers?.length) {
      return NextResponse.json(
        { error: "One or more emails or register numbers are already registered." },
        { status: 409 }
      );
    }

    const { data: trackRow } = await db
      .from("tracks")
      .select("id")
      .eq("name", track.trim())
      .maybeSingle();
    if (!trackRow) {
      return NextResponse.json({ error: "Track not found in database." }, { status: 400 });
    }

    const { data: insertedUsers, error: usersError } = await db
      .from("users")
      .insert(
        allMembers.map((m) => ({
          email: m.email,
          name: m.name,
          register_number: m.register_number,
          phone: m.phone,
          role: "participant",
          track_id: trackRow.id
        }))
      )
      .select();

    if (usersError) {
      console.error("Users insert error:", usersError);
      return NextResponse.json({ error: "Could not create user records." }, { status: 500 });
    }

    const leaderUser = insertedUsers.find((u) => u.email === leader.email);

    const { data: team, error: teamError } = await db
      .from("teams")
      .insert({
        name: teamName.trim(),
        leader_id: leaderUser.id,
        track_id: trackRow.id,
        registered: false
      })
      .select()
      .single();

    if (teamError) {
      await db.from("users").delete().in("id", insertedUsers.map((u) => u.id));
      console.error("Team insert error:", teamError);
      return NextResponse.json({ error: "Could not create team." }, { status: 500 });
    }

    const { error: linkError } = await db
      .from("team_members")
      .insert(insertedUsers.map((u) => ({ team_id: team.id, user_id: u.id })));

    if (linkError) {
      await db.from("teams").delete().eq("id", team.id);
      await db.from("users").delete().in("id", insertedUsers.map((u) => u.id));
      console.error("team_members insert error:", linkError);
      return NextResponse.json({ error: "Could not link team members." }, { status: 500 });
    }

    try {
      await writeAudit(db, {
        actorId: null,
        action: "team_registration",
        payload: { teamId: team.id, teamName: team.name, track: track.trim(), memberCount: totalMembers }
      });
    } catch (dbErr) {
      console.warn("Audit log write skipped:", dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Registration submitted. Your team is pending approval.",
      teamId: team.id
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration processing failed. Please try again." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { TRACKS } from "@/lib/tracks-meta";
import { writeAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { registerNumber, name, email, phone, track, teammateCount, teammates } = body || {};

    if (!registerNumber?.trim()) {
      return NextResponse.json(
        { error: "Leader Register number is required." },
        { status: 400 }
      );
    }
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Leader Name is required." },
        { status: 400 }
      );
    }
    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid Leader Email ID is required." },
        { status: 400 }
      );
    }
    if (!phone?.trim()) {
      return NextResponse.json(
        { error: "Leader Phone number is required." },
        { status: 400 }
      );
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
          return NextResponse.json(
            { error: `Teammate #${i + 1} Name is required.` },
            { status: 400 }
          );
        }
        if (!tm.registerNumber?.trim()) {
          return NextResponse.json(
            { error: `Teammate #${i + 1} Register Number is required.` },
            { status: 400 }
          );
        }
        cleanedTeammates.push({
          name: tm.name.trim(),
          register_number: tm.registerNumber.trim().toUpperCase(),
          email: tm.email?.trim()?.toLowerCase() || "",
          phone: tm.phone?.trim() || ""
        });
      }
    }

    const regData = {
      register_number: registerNumber.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      track: track.trim(),
      total_team_size: totalMembers,
      teammate_count: count,
      teammates: cleanedTeammates,
      registered_at: new Date().toISOString()
    };

    try {
      const db = getSupabaseServerClient();
      if (db) {
        await writeAudit(db, {
          actorId: null,
          action: "participant_registration",
          payload: regData
        });
      }
    } catch (dbErr) {
      console.warn("Audit log registration save skipped:", dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully.",
      registration: regData
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Registration processing failed. Please try again." },
      { status: 500 }
    );
  }
}

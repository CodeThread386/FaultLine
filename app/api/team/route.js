import { revalidatePath } from "next/cache";
import { ApiError, withApiRoute } from "@/lib/api-route";
import { DEMO_MODE } from "@/lib/demo";
import { getMembershipForUser } from "@/lib/participant-data";
import { isCanonicalTrackName } from "@/lib/tracks";
import { isValidUuid, parseJsonBody, sanitizeText } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(async ({ session }) => {
  const membership = await getMembershipForUser(session.user.id);
  return { team: membership?.teams || null };
});

export const POST = withApiRoute(
  async ({ req, session, db }) => {
    if (DEMO_MODE) {
      throw new ApiError("Teams are pre-assigned for the demo. Use your login number only.", 403);
    }

    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    const name = sanitizeText(body.name, 120);
    const track_id = body.track_id;
    const member_emails = Array.isArray(body.member_emails)
      ? body.member_emails.map((e) => sanitizeText(e, 120).toLowerCase()).filter(Boolean)
      : [];

    if (!name || !isValidUuid(track_id)) {
      throw new ApiError("Valid team name and track are required", 400);
    }

    const existing = await getMembershipForUser(session.user.id);
    if (existing?.team_id) throw new ApiError("User is already in a team", 409);

    const { data: existingLed } = await db
      .from("teams")
      .select("id")
      .eq("leader_id", session.user.id)
      .eq("registered", true)
      .maybeSingle();
    if (existingLed) throw new ApiError("You already registered a team", 409);

    const { data: trackRow } = await db.from("tracks").select("id, name").eq("id", track_id).maybeSingle();
    if (!trackRow || !isCanonicalTrackName(trackRow.name)) {
      throw new ApiError("Select a valid event track", 400);
    }

    const { data: team, error: teamErr } = await db
      .from("teams")
      .insert({ name, leader_id: session.user.id, track_id, registered: true })
      .select("*")
      .single();

    if (teamErr) throw new ApiError(teamErr.message, 400);

    const memberRows = [{ team_id: team.id, user_id: session.user.id }];

    if (member_emails.length) {
      const { data: users } = await db.from("users").select("id, email").in("email", member_emails);
      for (const user of users || []) {
        if (user.id === session.user.id) continue;
        memberRows.push({ team_id: team.id, user_id: user.id });
      }
    }

    const { error: membersErr } = await db.from("team_members").upsert(memberRows, {
      onConflict: "team_id,user_id",
      ignoreDuplicates: false
    });
    if (membersErr) {
      await db.from("teams").delete().eq("id", team.id);
      throw new ApiError(membersErr.message, 400);
    }

    const { data: track } = await db.from("tracks").select("name").eq("id", track_id).maybeSingle();
    await db.from("activity_feed").insert({
      message: `A new team joined ${track?.name ? `[${track.name}]` : "[track]"}`,
      public: true
    });

    revalidatePath("/dashboard", "layout");

    return { team };
  },
  { role: "participant", limit: 20 }
);

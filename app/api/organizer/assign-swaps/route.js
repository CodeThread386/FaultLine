import { ApiError, withApiRoute } from "@/lib/api-route";
import { assignCircularSwaps } from "@/lib/swap";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ db }) => {
    const { data: phase1 } = await db.from("phases").select("id").eq("name", "phase_1").single();
    if (!phase1) throw new ApiError("Phase 1 not found", 404);

    await db.from("swaps").delete().eq("phase_id", phase1.id);

    const { data: tracks } = await db.from("tracks").select("id, name");
    const summary = [];

    for (const track of tracks || []) {
      const { data: teams } = await db
        .from("teams")
        .select("id")
        .eq("track_id", track.id)
        .eq("registered", true);
      const teamIds = (teams || []).map((t) => t.id);
      if (!teamIds.length) continue;

      const { data: submissions } = await db
        .from("submissions")
        .select("team_id")
        .eq("phase_id", phase1.id)
        .in("team_id", teamIds);
      const eligibleTeamIds = (submissions || []).map((s) => s.team_id);
      if (!eligibleTeamIds.length) continue;

      if (eligibleTeamIds.length === 1) {
        summary.push({ track: track.name, assigned: "manual organizer codebase required", count: 1 });
        continue;
      }

      const pairs = assignCircularSwaps(eligibleTeamIds);
      const rows = pairs.map((p) => ({ ...p, phase_id: phase1.id, unlocked: false }));
      if (rows.length) {
        const { error } = await db.from("swaps").insert(rows);
        if (error) throw new ApiError(error.message, 400);
      }
      summary.push({ track: track.name, count: rows.length });
    }

    await db.from("activity_feed").insert({
      message: "Swap assignments prepared for all tracks.",
      public: false
    });

    return { summary };
  },
  { role: "organizer", limit: 10 }
);

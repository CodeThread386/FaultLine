import { ApiError, withApiRoute } from "@/lib/api-route";
import { writeAudit } from "@/lib/audit";
import { assignCircularSwaps } from "@/lib/swap";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ session, db }) => {
    const { data: phase1 } = await db.from("phases").select("id").eq("name", "phase_1").single();
    if (!phase1) throw new ApiError("Phase 1 not found", 404);

    const { data: tracks } = await db.from("tracks").select("id, name");
    const allRows = [];
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
      for (const p of pairs) {
        allRows.push({
          receiving_team_id: p.receiving_team_id,
          assigned_team_id: p.assigned_team_id,
          unlocked: false
        });
      }
      summary.push({ track: track.name, count: pairs.length });
    }

    const { error: rpcError } = await db.rpc("replace_swaps_for_phase", {
      p_phase_id: phase1.id,
      p_rows: allRows
    });

    if (rpcError) {
      await db.from("swaps").delete().eq("phase_id", phase1.id);
      if (allRows.length) {
        const rows = allRows.map((r) => ({ ...r, phase_id: phase1.id }));
        const { error } = await db.from("swaps").insert(rows);
        if (error) throw new ApiError(error.message, 400);
      }
    }

    await db.from("activity_feed").insert({
      message: "Swap assignments prepared for all tracks.",
      public: false
    });

    await writeAudit(db, {
      actorId: session.user.id,
      action: "swaps.assign",
      payload: { summary }
    });

    return { summary };
  },
  { role: "admin", limit: 10 }
);

import { withApiRoute } from "@/lib/api-route";
import { filterEventPhases } from "@/lib/phase-control";
import { computeTeamMarks } from "@/lib/team-scoring";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const [{ data: phases }, { data: teams }, { data: tracks }, { count: notifCount }] =
      await Promise.all([
        db.from("phases").select("*").order("name"),
        db
          .from("teams")
          .select("id, name, registered, track_id, created_at, tracks(name), leader_id")
          .order("created_at"),
        db.from("tracks").select("id, name"),
        db.from("notifications").select("*", { count: "exact", head: true })
      ]);

    const phaseIds = Object.fromEntries((phases || []).map((p) => [p.name, p.id]));
    const { data: submissions } = await db
      .from("submissions")
      .select("team_id, phase_id, submitted_at, locked");
    const { data: swaps } = await db.from("swaps").select("id, receiving_team_id, unlocked");
    const { data: reviews } = await db.from("reviews").select("id, team_id, phase_id, score, round");

    const submissionByTeamPhase = {};
    for (const s of submissions || []) {
      submissionByTeamPhase[`${s.team_id}:${s.phase_id}`] = s;
    }

    const teamsEnriched = (teams || []).map((team) => {
      const p1 = submissionByTeamPhase[`${team.id}:${phaseIds.phase_1}`];
      const p2 = submissionByTeamPhase[`${team.id}:${phaseIds.phase_2}`];
      const teamSwaps = (swaps || []).filter((sw) => sw.receiving_team_id === team.id);
      const teamReviews = (reviews || []).filter((r) => r.team_id === team.id);
      const marks = computeTeamMarks(teamReviews, phaseIds);

      return {
        ...team,
        phase_1_submitted: Boolean(p1?.submitted_at),
        phase_2_submitted: Boolean(p2?.submitted_at),
        swap_unlocked: teamSwaps.some((sw) => sw.unlocked),
        review_count: teamReviews.length,
        phase_1_marks: marks.phase_1_marks,
        phase_2_marks: marks.phase_2_marks,
        total_marks: marks.total_marks,
        phase_1_rounds: marks.phase_1_rounds,
        phase_2_rounds: marks.phase_2_rounds
      };
    });

    return {
      phases: filterEventPhases(phases),
      tracks: tracks || [],
      teams: teamsEnriched,
      stats: {
        team_count: teamsEnriched.length,
        registered_count: teamsEnriched.filter((t) => t.registered).length,
        phase_1_submissions: teamsEnriched.filter((t) => t.phase_1_submitted).length,
        phase_2_submissions: teamsEnriched.filter((t) => t.phase_2_submitted).length,
        swap_count: (swaps || []).length,
        notification_count: notifCount || 0
      }
    };
  },
  { role: "organizer", limit: 60 }
);

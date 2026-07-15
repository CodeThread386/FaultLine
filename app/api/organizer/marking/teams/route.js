import { withApiRoute } from "@/lib/api-route";
import { getTeamReviews } from "@/lib/review-round";
import { JUDGE_ROUNDS } from "@/lib/judge-rubric";
import { isValidUuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

const ROUNDS_PER_PHASE = JUDGE_ROUNDS.length;
const TOTAL_ROUNDS = ROUNDS_PER_PHASE * 2;

export const GET = withApiRoute(
  async ({ req, db }) => {
    const trackId = req.nextUrl.searchParams.get("track_id");
    if (!isValidUuid(trackId)) {
      return { teams: [] };
    }

    const [{ data: teams, error }, { data: phases }] = await Promise.all([
      db
        .from("teams")
        .select("id, name, registered, track_id, tracks(name)")
        .eq("track_id", trackId)
        .eq("registered", true)
        .order("name"),
      db.from("phases").select("id, name").in("name", ["phase_1", "phase_2"])
    ]);

    if (error) throw new Error(error.message);

    const phaseIds = Object.fromEntries((phases || []).map((p) => [p.name, p.id]));

    const enriched = await Promise.all(
      (teams || []).map(async (team) => {
        const reviews = await getTeamReviews(db, team.id);
        const scoredRounds = reviews.filter(
          (r) =>
            (r.phase_id === phaseIds.phase_1 || r.phase_id === phaseIds.phase_2) &&
            JUDGE_ROUNDS.some((jr) => jr.value === r.round || r.round)
        ).length;

        return {
          ...team,
          review_count: reviews.length,
          scored_rounds: scoredRounds,
          total_rounds: TOTAL_ROUNDS,
          fully_scored: scoredRounds >= TOTAL_ROUNDS
        };
      })
    );

    return { teams: enriched };
  },
  { role: "organizer" }
);

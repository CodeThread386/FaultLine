import { withApiRoute } from "@/lib/api-route";
import { normalizeJudgeRound } from "@/lib/judge-rubric";
import { judgedTeamIdsForRound } from "@/lib/review-round";
import { isValidUuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ req, db }) => {
    const trackId = req.nextUrl.searchParams.get("track_id");
    const phaseId = req.nextUrl.searchParams.get("phase_id");
    const round = req.nextUrl.searchParams.get("round");

    let query = db
      .from("teams")
      .select("id, name, registered, track_id, tracks(name)")
      .eq("registered", true)
      .order("name");

    if (trackId && trackId !== "all" && isValidUuid(trackId)) {
      query = query.eq("track_id", trackId);
    }

    const { data: teams, error } = await query;
    if (error) throw new Error(error.message);

    let judgedIds = new Set();
    if (phaseId && isValidUuid(phaseId) && round) {
      judgedIds = await judgedTeamIdsForRound(db, {
        phaseId,
        round: normalizeJudgeRound(round)
      });
    }

    return {
      teams: (teams || []).map((t) => ({
        ...t,
        judged: judgedIds.has(t.id)
      }))
    };
  },
  { role: "judge" }
);

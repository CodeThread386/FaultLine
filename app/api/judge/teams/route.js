import { withApiRoute } from "@/lib/api-route";
import { normalizeJudgeRound } from "@/lib/judge-rubric";
import { judgedTeamIdsForRound } from "@/lib/review-round";
import { isValidUuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ req, session, db }) => {
    const trackIdParam = req.nextUrl.searchParams.get("track_id");
    const phaseId = req.nextUrl.searchParams.get("phase_id");
    const round = normalizeJudgeRound(req.nextUrl.searchParams.get("round") || "visit_1");
    const isFinalsRound = round === "final_pitch";

    const { data: judge } = await db
      .from("users")
      .select("track_id")
      .eq("id", session.user.id)
      .maybeSingle();

    let query = db
      .from("teams")
      .select("id, name, registered, track_id, tracks(name)")
      .eq("registered", true)
      .order("name");

    if (isFinalsRound) {
      if (trackIdParam && trackIdParam !== "all" && isValidUuid(trackIdParam)) {
        query = query.eq("track_id", trackIdParam);
      }
    } else if (judge?.track_id) {
      query = query.eq("track_id", judge.track_id);
    } else {
      return { teams: [], judge_track_id: null, finals_round: false };
    }

    const { data: teams, error } = await query;
    if (error) throw new Error(error.message);

    let judgedIds = new Set();
    if (phaseId && isValidUuid(phaseId)) {
      judgedIds = await judgedTeamIdsForRound(db, { phaseId, round });
    }

    return {
      teams: (teams || []).map((t) => ({
        ...t,
        judged: judgedIds.has(t.id)
      })),
      judge_track_id: judge?.track_id ?? null,
      finals_round: isFinalsRound
    };
  },
  { role: "judge" }
);

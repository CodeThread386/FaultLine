import { ApiError, withApiRoute } from "@/lib/api-route";
import { getRubric, normalizeJudgeRound, validateScores } from "@/lib/judge-rubric";
import { saveReview } from "@/lib/review-round";
import { assertOrganizerCanScoreTeam } from "@/lib/team-access";
import { clampRoundScore, MAX_ROUND_SCORE } from "@/lib/team-scoring";
import { isValidUuid, parseJsonBody, sanitizeText } from "@/lib/validate";

const rounds = new Set(["visit_1", "visit_2", "final_pitch"]);

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ req, session, db }) => {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    const round = normalizeJudgeRound(body.round || "visit_1");
    if (!rounds.has(round)) throw new ApiError("Invalid round", 400);
    if (!isValidUuid(body.team_id) || !isValidUuid(body.phase_id)) {
      throw new ApiError("Select team and phase", 400);
    }

    const teamGate = await assertOrganizerCanScoreTeam(db, body.team_id);
    if (!teamGate.ok) throw new ApiError(teamGate.error, teamGate.status);

    const { data: phase } = await db.from("phases").select("name").eq("id", body.phase_id).single();
    if (!phase || !["phase_1", "phase_2"].includes(phase.name)) {
      throw new ApiError("Invalid phase", 400);
    }

    const rubric = getRubric(phase.name, round);
    const validated = validateScores(body.scores, rubric);
    if (!validated.ok) throw new ApiError(validated.error, 400);

    const row = {
      judge_id: session.user.id,
      team_id: body.team_id,
      phase_id: body.phase_id,
      round,
      score: clampRoundScore(validated.total),
      scores: validated.scores,
      notes: sanitizeText(body.notes, 2000) || null,
      locked: true
    };

    const saved = await saveReview(db, row);
    if (!saved.ok) {
      const msg = saved.error?.message || "Could not save review";
      throw new ApiError(msg, 400);
    }

    await db.from("activity_feed").insert({
      message: `Organizer saved ${round} marks for team (${validated.total}/100)`,
      public: false
    });

    return {
      score: clampRoundScore(validated.total),
      max_score: MAX_ROUND_SCORE,
      updated: saved.updated || false
    };
  },
  { role: "organizer", limit: 60 }
);

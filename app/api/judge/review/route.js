import { ApiError, withApiRoute } from "@/lib/api-route";
import { getEventSettings } from "@/lib/event-settings";
import { assertJudgeCanScoreTeam } from "@/lib/team-access";
import { getRubric, normalizeJudgeRound, validateScores } from "@/lib/judge-rubric";
import {
  findTeamRoundReview,
  insertReview,
  isDuplicateTeamRoundError,
  isRoundConstraintError
} from "@/lib/review-round";
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

    const settings = await getEventSettings(db);
    if (settings.judge_scoring_open === false) {
      throw new ApiError("Organizer has closed judge scoring", 403);
    }

    const round = normalizeJudgeRound(body.round || settings.judge_round || "visit_1");
    if (!rounds.has(round)) throw new ApiError("Invalid round", 400);
    if (!isValidUuid(body.team_id) || !isValidUuid(body.phase_id)) {
      throw new ApiError("Select team and phase", 400);
    }

    const teamGate = await assertJudgeCanScoreTeam(db, body.team_id, {
      judgeId: session.user.id,
      round
    });
    if (!teamGate.ok) throw new ApiError(teamGate.error, teamGate.status);

    const { data: phase } = await db.from("phases").select("name").eq("id", body.phase_id).single();
    if (!phase || !["phase_1", "phase_2"].includes(phase.name)) {
      throw new ApiError("Invalid phase", 400);
    }

    const rubric = getRubric(phase.name, round);
    const validated = validateScores(body.scores, rubric);
    if (!validated.ok) throw new ApiError(validated.error, 400);

    const existing = await findTeamRoundReview(db, {
      teamId: body.team_id,
      phaseId: body.phase_id,
      round
    });
    if (existing) {
      if (existing.judge_id === session.user.id) {
        throw new ApiError("You already scored this team for this round", 409);
      }
      throw new ApiError(
        "Another judge has already scored this team for this round. Pick a different team.",
        409
      );
    }

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

    let inserted = await insertReview(db, row);
    if (!inserted.ok && row.scores && inserted.error?.message?.includes("scores")) {
      const { scores, ...fallback } = row;
      inserted = await insertReview(db, fallback);
    }

    if (!inserted.ok) {
      const msg = inserted.error?.message || "Could not save review";
      if (inserted.duplicate || isDuplicateTeamRoundError(msg)) {
        throw new ApiError(
        "Another judge has already scored this team for this round. Pick a different team.",
        409
      );
      }
      if (isRoundConstraintError(msg)) {
        throw new ApiError(
          "Database round constraint is outdated. Re-apply schema.sql reviews.round check in Supabase, then try again.",
          400
        );
      }
      throw new ApiError(msg, 400);
    }

    await db.from("activity_feed").insert({
      message: `Judge submitted ${round} review (${validated.total}/100)`,
      public: false
    });

    return { score: clampRoundScore(validated.total), max_score: MAX_ROUND_SCORE };
  },
  { role: "judge", limit: 40 }
);

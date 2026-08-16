import { ApiError, withApiRoute } from "@/lib/api-route";
import { writeAudit } from "@/lib/audit";
import { getEventSettings, setEventSetting } from "@/lib/event-settings";
import { JUDGE_ROUNDS, normalizeJudgeRound } from "@/lib/judge-rubric";
import { parseJsonBody } from "@/lib/validate";

const ROUNDS = new Set(JUDGE_ROUNDS.map((r) => r.value));

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const settings = await getEventSettings(db);
    return settings;
  },
  { role: "admin", limit: 60 }
);

export const POST = withApiRoute(
  async ({ req, session, db }) => {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    if (body.judge_round !== undefined) {
      const round = normalizeJudgeRound(body.judge_round);
      if (!ROUNDS.has(round)) throw new ApiError("Invalid judge round", 400);
      const { error } = await setEventSetting(db, "judge_round", round);
      if (error) throw new ApiError(error.message || String(error), 400);

      const label = JUDGE_ROUNDS.find((r) => r.value === round)?.label || round;
      await db.from("notifications").insert({
        message: `Judges are now scoring: ${label}.`,
        sent_by: session.user.id
      });
    }

    if (body.judge_scoring_open !== undefined) {
      const { error } = await setEventSetting(db, "judge_scoring_open", Boolean(body.judge_scoring_open));
      if (error) throw new ApiError(error.message || String(error), 400);
    }

    await writeAudit(db, {
      actorId: session.user.id,
      action: "judge.control",
      payload: {
        judge_round: body.judge_round,
        judge_scoring_open: body.judge_scoring_open
      }
    });

    return await getEventSettings(db);
  },
  { role: "admin", limit: 30 }
);

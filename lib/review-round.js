import { normalizeJudgeRound } from "./judge-rubric.js";

/** Canonical rounds used by the app UI and API */
export const CANONICAL_ROUNDS = ["visit_1", "visit_2", "final_pitch"];

/** Legacy Supabase check constraint (pre migration_judge_rounds_v2.sql) */
const LEGACY_DB_ROUNDS = {
  visit_1: "mid_build",
  visit_2: "pre_final",
  final_pitch: "finals"
};

const LEGACY_TO_CANONICAL = Object.fromEntries(
  Object.entries(LEGACY_DB_ROUNDS).map(([canonical, legacy]) => [legacy, canonical])
);

export function toCanonicalRound(round) {
  if (!round) return "visit_1";
  const normalized = normalizeJudgeRound(round);
  return LEGACY_TO_CANONICAL[round] || normalized;
}

/** Values that may appear in reviews.round for a given canonical round */
export function roundDbVariants(canonicalRound) {
  const canonical = normalizeJudgeRound(canonicalRound);
  const legacy = LEGACY_DB_ROUNDS[canonical];
  return legacy ? [canonical, legacy] : [canonical];
}

export function isRoundConstraintError(message) {
  return Boolean(message?.includes("reviews_round_check"));
}

/** Any judge — at most one review per team per phase per round. */
export async function findTeamRoundReview(db, { teamId, phaseId, round }) {
  const variants = roundDbVariants(round);

  const { data, error } = await db
    .from("reviews")
    .select("id, judge_id, round")
    .eq("team_id", teamId)
    .eq("phase_id", phaseId)
    .in("round", variants)
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function judgedTeamIdsForRound(db, { phaseId, round }) {
  const variants = roundDbVariants(round);
  const { data, error } = await db
    .from("reviews")
    .select("team_id")
    .eq("phase_id", phaseId)
    .in("round", variants);

  if (error) throw error;
  return new Set((data || []).map((r) => r.team_id));
}

export function isDuplicateTeamRoundError(message) {
  return Boolean(
    message?.includes("reviews_team_phase_round") ||
    message?.includes("duplicate key") ||
    message?.includes("unique constraint")
  );
}

/**
 * Insert a review row, using legacy round names when the DB has not been migrated yet.
 */
export async function insertReview(db, row) {
  const canonical = normalizeJudgeRound(row.round);
  const attempts = [
    { ...row, round: canonical },
    { ...row, round: LEGACY_DB_ROUNDS[canonical] }
  ].filter((r) => r.round);

  let lastError = null;
  for (const attempt of attempts) {
    let row = attempt;
    for (let pass = 0; pass < 2; pass += 1) {
      const { error } = await db.from("reviews").insert(row);
      if (!error) return { ok: true, round: row.round };

      lastError = error;
      if (error.message?.includes("scores") && row.scores) {
        const { scores, ...withoutScores } = row;
        row = withoutScores;
        continue;
      }
      if (isDuplicateTeamRoundError(error.message)) {
        return { ok: false, error: lastError, duplicate: true };
      }
      if (!isRoundConstraintError(error.message)) break;
      break;
    }
  }

  return { ok: false, error: lastError };
}

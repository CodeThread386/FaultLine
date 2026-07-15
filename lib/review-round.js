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

async function tryInsert(db, payload) {
  const { error } = await db.from("reviews").insert(payload);
  if (!error) return { ok: true };

  if (isDuplicateTeamRoundError(error.message)) {
    return { ok: false, error, duplicate: true };
  }

  if (error.message?.includes("scores") && payload.scores) {
    const { scores, ...withoutScores } = payload;
    const retry = await db.from("reviews").insert(withoutScores);
    if (!retry.error) return { ok: true };
    if (isDuplicateTeamRoundError(retry.error?.message)) {
      return { ok: false, error: retry.error, duplicate: true };
    }
    return { ok: false, error: retry.error };
  }

  return { ok: false, error };
}

/**
 * Insert a review row; tries canonical round then legacy name if DB is not migrated.
 */
export async function updateReview(db, reviewId, updates) {
  const { error } = await db.from("reviews").update(updates).eq("id", reviewId);
  if (error) return { ok: false, error };
  return { ok: true };
}

/** Insert or update a review for a team/phase/round (organizer can edit). */
export async function saveReview(db, row) {
  const existing = await findTeamRoundReview(db, {
    teamId: row.team_id,
    phaseId: row.phase_id,
    round: row.round
  });

  if (existing) {
    const { judge_id, ...updates } = row;
    const result = await updateReview(db, existing.id, {
      ...updates,
      submitted_at: new Date().toISOString()
    });
    if (result.ok) return { ok: true, updated: true, round: row.round };
    return { ok: false, error: result.error };
  }

  const inserted = await insertReview(db, row);
  if (inserted.ok) return { ok: true, updated: false, round: inserted.round };
  return inserted;
}

export async function getTeamReviews(db, teamId) {
  const { data, error } = await db
    .from("reviews")
    .select("id, team_id, phase_id, round, score, scores, notes, submitted_at")
    .eq("team_id", teamId);

  if (error) throw error;
  return data || [];
}

export async function insertReview(db, row) {
  const canonical = normalizeJudgeRound(row.round);
  const roundsToTry = [...new Set([canonical, LEGACY_DB_ROUNDS[canonical]].filter(Boolean))];

  let lastError = null;
  for (const round of roundsToTry) {
    const result = await tryInsert(db, { ...row, round });
    if (result.ok) return { ok: true, round };
    lastError = result.error;
    if (result.duplicate) return { ok: false, error: lastError, duplicate: true };
    if (!isRoundConstraintError(lastError?.message)) break;
  }

  return { ok: false, error: lastError };
}

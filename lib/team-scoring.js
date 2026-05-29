import { CANONICAL_ROUNDS, toCanonicalRound } from "./review-round.js";

export const MAX_ROUND_SCORE = 100;
export const MAX_PHASE_SCORE = MAX_ROUND_SCORE * CANONICAL_ROUNDS.length; // 300
export const MAX_TOTAL_SCORE = MAX_PHASE_SCORE * 2; // 600
export const ROUNDS_PER_PHASE = CANONICAL_ROUNDS.length;

/** Clamp a single judging round score (0–100). */
export function clampRoundScore(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return 0;
  return Math.min(MAX_ROUND_SCORE, Math.max(0, Math.round(n)));
}

/**
 * Per phase: visit_1, visit_2, final_pitch each 0–100 (one judge per team per round).
 * Phase total = sum of those three rounds, max 300.
 */
export function computePhaseMarks(teamReviews, phaseId) {
  const byRound = {};

  for (const review of teamReviews || []) {
    if (review.phase_id !== phaseId) continue;
    const round = toCanonicalRound(review.round);
    if (!CANONICAL_ROUNDS.includes(round)) continue;
    byRound[round] = clampRoundScore(review.score);
  }

  const sum = CANONICAL_ROUNDS.reduce((acc, round) => acc + (byRound[round] ?? 0), 0);
  const phaseMarks = Math.min(MAX_PHASE_SCORE, sum);

  return { phaseMarks, roundScores: byRound };
}

export function computeTeamMarks(teamReviews, phaseIds) {
  const p1 = computePhaseMarks(teamReviews, phaseIds.phase_1);
  const p2 = computePhaseMarks(teamReviews, phaseIds.phase_2);

  return {
    phase_1_marks: p1.phaseMarks,
    phase_2_marks: p2.phaseMarks,
    total_marks: Math.min(MAX_TOTAL_SCORE, p1.phaseMarks + p2.phaseMarks),
    phase_1_rounds: p1.roundScores,
    phase_2_rounds: p2.roundScores
  };
}

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampRoundScore,
  computePhaseMarks,
  computeTeamMarks,
  MAX_PHASE_SCORE,
  MAX_ROUND_SCORE,
  MAX_TOTAL_SCORE
} from "../lib/team-scoring.js";

describe("team-scoring", () => {
  it("clamps round scores to 0–100", () => {
    assert.equal(clampRoundScore(150), 100);
    assert.equal(clampRoundScore(-5), 0);
    assert.equal(clampRoundScore(72), 72);
  });

  it("phase marks sum three rounds, max 300 per phase", () => {
    const phaseId = "p1";
    const { phaseMarks } = computePhaseMarks(
      [
        { phase_id: phaseId, round: "visit_1", score: 100 },
        { phase_id: phaseId, round: "visit_2", score: 100 },
        { phase_id: phaseId, round: "final_pitch", score: 100 }
      ],
      phaseId
    );
    assert.equal(phaseMarks, 300);
    assert.equal(MAX_PHASE_SCORE, 300);
  });

  it("sums partial rounds as they are completed", () => {
    const phaseId = "p1";
    const { phaseMarks } = computePhaseMarks(
      [
        { phase_id: phaseId, round: "visit_1", score: 80 },
        { phase_id: phaseId, round: "visit_2", score: 90 }
      ],
      phaseId
    );
    assert.equal(phaseMarks, 170);
  });

  it("overall is phase1 + phase2 capped at 600", () => {
    const ids = { phase_1: "p1", phase_2: "p2" };
    const marks = computeTeamMarks(
      [
        { phase_id: "p1", round: "visit_1", score: 100 },
        { phase_id: "p1", round: "visit_2", score: 100 },
        { phase_id: "p1", round: "final_pitch", score: 100 },
        { phase_id: "p2", round: "visit_1", score: 60 }
      ],
      ids
    );
    assert.equal(marks.phase_1_marks, 300);
    assert.equal(marks.phase_2_marks, 60);
    assert.equal(marks.total_marks, 360);
    assert.equal(MAX_ROUND_SCORE, 100);
    assert.equal(MAX_TOTAL_SCORE, 600);
  });
});

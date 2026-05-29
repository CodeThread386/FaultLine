import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  roundDbVariants,
  toCanonicalRound,
  isRoundConstraintError,
  isDuplicateTeamRoundError
} from "../lib/review-round.js";

describe("review-round", () => {
  it("maps legacy DB rounds to canonical", () => {
    assert.equal(toCanonicalRound("mid_build"), "visit_1");
    assert.equal(toCanonicalRound("pre_final"), "visit_2");
    assert.equal(toCanonicalRound("finals"), "final_pitch");
  });

  it("includes legacy variants for duplicate checks", () => {
    assert.deepEqual(roundDbVariants("visit_1"), ["visit_1", "mid_build"]);
    assert.deepEqual(roundDbVariants("visit_2"), ["visit_2", "pre_final"]);
  });

  it("detects round constraint errors", () => {
    assert.equal(isRoundConstraintError('violates check constraint "reviews_round_check"'), true);
    assert.equal(isRoundConstraintError("other"), false);
  });

  it("detects duplicate team round errors", () => {
    assert.equal(isDuplicateTeamRoundError("duplicate key value violates unique constraint"), true);
    assert.equal(isDuplicateTeamRoundError("other"), false);
  });
});

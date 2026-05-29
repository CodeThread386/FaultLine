import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  participantLoginNumbers,
  RESERVED_LOGIN_NUMBERS,
  teamIndexForLogin
} from "../lib/login-codes.js";

describe("login-codes", () => {
  it("has 18 participant numbers with no staff overlap", () => {
    const nums = participantLoginNumbers();
    assert.equal(nums.length, 18);
    for (const n of nums) {
      assert.equal(RESERVED_LOGIN_NUMBERS.has(n), false);
    }
  });

  it("maps login numbers to team index", () => {
    assert.equal(teamIndexForLogin(1), 1);
    assert.equal(teamIndexForLogin(3), 1);
    assert.equal(teamIndexForLogin(4), 2);
    assert.equal(teamIndexForLogin(18), 6);
    assert.equal(teamIndexForLogin(19), null);
    assert.equal(teamIndexForLogin(20), null);
  });
});

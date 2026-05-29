import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEMO_PARTICIPANT_COUNT,
  DEMO_TEAM_COUNT,
  MEMBERS_PER_TEAM,
  loginsForTeam,
  participantLoginNumbers,
  teamRoster,
  teamIndexForLogin
} from "../lib/login-codes.js";

describe("sync-config", () => {
  it("participant count matches team × members", () => {
    assert.equal(DEMO_PARTICIPANT_COUNT, DEMO_TEAM_COUNT * MEMBERS_PER_TEAM);
    assert.equal(participantLoginNumbers().length, DEMO_PARTICIPANT_COUNT);
  });

  it("roster has contiguous teams with 3 logins each", () => {
    const roster = teamRoster();
    assert.equal(roster.length, DEMO_TEAM_COUNT);
    for (const row of roster) {
      assert.equal(row.logins.length, MEMBERS_PER_TEAM);
    }
    const flat = roster.flatMap((r) => r.logins);
    assert.deepEqual(flat, participantLoginNumbers());
  });

  it("maps logins to correct team index", () => {
    assert.equal(teamIndexForLogin(1), 1);
    assert.equal(teamIndexForLogin(3), 1);
    assert.equal(teamIndexForLogin(4), 2);
    assert.equal(teamIndexForLogin(18), 6);
    assert.deepEqual(loginsForTeam(1), [1, 2, 3]);
    assert.deepEqual(loginsForTeam(6), [16, 17, 18]);
  });
});

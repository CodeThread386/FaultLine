import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getParticipantAssignment, getParticipantAssignments, isParticipantEmail } from "../lib/participant-emails.js";

describe("participant assignments", () => {
  it("returns the hardcoded assignment for a known participant email", () => {
    const assignment = getParticipantAssignment("shreyas.menon2025@vitstudent.ac.in");

    assert.deepEqual(assignment, {
      email: "shreyas.menon2025@vitstudent.ac.in",
      teamNumber: 1,
      teamName: "Team Aurora",
      track: "Banking"
    });
  });

  it("returns null for an unknown email", () => {
    assert.equal(getParticipantAssignment("someone@example.com"), null);
  });

  it("exposes the hardcoded participant assignments", () => {
    const assignments = getParticipantAssignments();

    assert.equal(assignments.length, 4);
    assert.equal(isParticipantEmail("sara.kj2025@vitstudent.ac.in"), true);
    assert.equal(isParticipantEmail("not-a-participant@example.com"), false);
  });
});

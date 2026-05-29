import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAllowedParticipantEmail } from "../lib/email-domain.js";

describe("auth-users policy", () => {
  it("rejects non-vit emails for google sign-in policy", () => {
    assert.equal(isAllowedParticipantEmail("hacker@evil.com"), false);
    assert.equal(isAllowedParticipantEmail("a@vitstudent.ac.in"), true);
  });
});

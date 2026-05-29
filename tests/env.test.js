import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAllowedParticipantEmail, getAllowedEmailDomain } from "../lib/email-domain.js";

describe("env", () => {
  it("allows vitstudent emails by default", () => {
    assert.equal(isAllowedParticipantEmail("student@vitstudent.ac.in"), true);
    assert.equal(isAllowedParticipantEmail("x@gmail.com"), false);
  });

  it("reports allowed domain", () => {
    assert.ok(getAllowedEmailDomain().includes("vitstudent"));
  });
});

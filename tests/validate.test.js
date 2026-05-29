import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidGithubUrl, isValidPhase, isValidUuid, sanitizeText } from "../lib/validate.js";

describe("validate", () => {
  it("accepts canonical phases only", () => {
    assert.equal(isValidPhase("phase_1"), true);
    assert.equal(isValidPhase("finals"), false);
  });

  it("validates github urls", () => {
    assert.equal(isValidGithubUrl("https://github.com/org/repo"), true);
    assert.equal(isValidGithubUrl("http://gitlab.com/x/y"), false);
  });

  it("validates uuids", () => {
    assert.equal(isValidUuid("00000000-0000-4000-8000-000000000001"), true);
    assert.equal(isValidUuid("not-a-uuid"), false);
  });

  it("sanitizes text length", () => {
    assert.equal(sanitizeText("  hello  "), "hello");
    assert.equal(sanitizeText("x".repeat(100), 10).length, 10);
  });
});

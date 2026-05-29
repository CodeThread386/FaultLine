import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidUuid } from "../lib/validate.js";

describe("notifications API contract", () => {
  it("accepts uuid for single delete", () => {
    assert.equal(isValidUuid("550e8400-e29b-41d4-a716-446655440000"), true);
  });

  it("rejects invalid delete id", () => {
    assert.equal(isValidUuid("not-a-uuid"), false);
  });
});

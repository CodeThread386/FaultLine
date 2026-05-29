import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  areSubmissionsOpen,
  canSubmitToPhase,
  filterEventPhases,
  getPhaseDisplayStatus
} from "../lib/phase-control.js";

describe("phase-control", () => {
  const future = new Date(Date.now() + 60_000).toISOString();
  const past = new Date(Date.now() - 60_000).toISOString();

  it("filters event phases", () => {
    const phases = filterEventPhases([
      { name: "finals", status: "locked" },
      { name: "phase_1", status: "active" },
      { name: "phase_2", status: "locked" }
    ]);
    assert.equal(phases.length, 2);
    assert.equal(phases[0].name, "phase_1");
  });

  it("opens only when active and before deadline", () => {
    assert.equal(areSubmissionsOpen({ status: "active", submission_deadline: future }), true);
    assert.equal(areSubmissionsOpen({ status: "active", submission_deadline: past }), false);
    assert.equal(areSubmissionsOpen({ status: "locked", submission_deadline: future }), false);
  });

  it("gates submissions with clear reasons", () => {
    const open = canSubmitToPhase({ status: "active", submission_deadline: future }, null);
    assert.equal(open.ok, true);
    const locked = canSubmitToPhase({ status: "locked", submission_deadline: future }, null);
    assert.equal(locked.ok, false);
  });

  it("reports display status", () => {
    assert.equal(getPhaseDisplayStatus({ status: "active", submission_deadline: future }).code, "open");
    assert.equal(getPhaseDisplayStatus({ status: "closed" }).code, "stopped");
  });
});

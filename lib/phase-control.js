import { isValidPhase, PHASE_NAMES } from "./validate.js";

/** Only phase_1 and phase_2 exist for this event (no legacy "finals" row). */
export function filterEventPhases(phases) {
  return (phases || []).filter((p) => PHASE_NAMES.has(p.name));
}

const PHASE_LABELS = {
  phase_1: "Phase 1",
  phase_2: "Phase 2"
};

/** Map organizer UI actions to internal phase updates */
const ACTION_MAP = {
  start: "activate",
  activate: "activate",
  unlock: "unlock",
  stop: "lock",
  lock: "lock"
};

export async function getPhaseByName(db, phaseName) {
  if (!isValidPhase(phaseName)) return null;
  const { data } = await db.from("phases").select("*").eq("name", phaseName).maybeSingle();
  return data;
}

export function isPastDeadline(phase) {
  return Boolean(phase?.submission_deadline && new Date() > new Date(phase.submission_deadline));
}

/** Whether participants can submit repo links right now */
export function areSubmissionsOpen(phase) {
  if (!phase || phase.status !== "active") return false;
  if (isPastDeadline(phase)) return false;
  return true;
}

export function getPhaseDisplayStatus(phase) {
  if (!phase) return { label: "Unknown", code: "unknown" };
  if (phase.status === "active") {
    if (isPastDeadline(phase)) return { label: "Deadline passed", code: "deadline" };
    return { label: "Submissions open", code: "open" };
  }
  if (phase.status === "closed") return { label: "Stopped", code: "stopped" };
  return { label: "Not started", code: "locked" };
}

export function formatDeadline(iso) {
  if (!iso) return "No deadline set";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

/** Participant phase header — uses organizer-set deadline, not hardcoded clock times. */
export function formatPhaseScheduleLine(phase, { fallback = "Schedule set by organizers" } = {}) {
  if (!phase) return fallback;
  if (phase.status === "active" && phase.submission_deadline) {
    return `Submissions open · closes ${formatDeadline(phase.submission_deadline)}`;
  }
  if (phase.submission_deadline) {
    return `Deadline ${formatDeadline(phase.submission_deadline)}`;
  }
  const label = getPhaseDisplayStatus(phase).label;
  return `${label} · ${fallback}`;
}

async function applyPhaseActionFallback(db, { phase, internal, messages, organizerId, phaseName }) {
  if (internal === "activate" || internal === "unlock") {
    await db.from("phases").update({ status: "active" }).eq("id", phase.id);
    await db.from("submissions").update({ locked: false }).eq("phase_id", phase.id);
  }

  if (internal === "lock") {
    await db.from("phases").update({ status: "closed" }).eq("id", phase.id);
    await db.from("submissions").update({ locked: true }).eq("phase_id", phase.id);
  }

  await db.from("notifications").insert({
    message: messages[internal],
    sent_by: organizerId
  });

  await db.from("activity_feed").insert({
    message: messages[internal],
    public: true
  });

  const { data: updated } = await db.from("phases").select("*").eq("id", phase.id).single();
  return { phase: updated };
}

export async function applyPhaseAction(db, { phaseName, action, organizerId }) {
  const phase = await getPhaseByName(db, phaseName);
  if (!phase) return { error: "Invalid phase", status: 400 };

  const internal = ACTION_MAP[action];
  if (!internal) return { error: "Invalid action", status: 400 };

  const label = PHASE_LABELS[phaseName] || phaseName;

  const messages = {
    activate: `${label} submissions are now open.`,
    unlock: `${label} has been unlocked by organizers.`,
    lock: `${label} submissions have been stopped.`
  };

  const { data: rpcRows, error: rpcError } = await db.rpc("apply_phase_action", {
    p_phase_name: phaseName,
    p_internal_action: internal,
    p_message: messages[internal],
    p_organizer_id: organizerId
  });

  if (!rpcError && rpcRows?.length) {
    return { phase: rpcRows[0] };
  }

  const rpcMissing =
    rpcError?.code === "PGRST202" ||
    rpcError?.message?.includes("apply_phase_action") ||
    rpcError?.message?.includes("Could not find the function");

  if (rpcError && !rpcMissing) {
    return { error: rpcError.message, status: 400 };
  }

  return applyPhaseActionFallback(db, {
    phase,
    internal,
    messages,
    organizerId,
    phaseName
  });
}

export async function setPhaseDeadline(db, phaseName, submissionDeadline) {
  const phase = await getPhaseByName(db, phaseName);
  if (!phase) return { error: "Invalid phase", status: 400 };

  const deadline = submissionDeadline ? new Date(submissionDeadline) : null;
  if (deadline && Number.isNaN(deadline.getTime())) {
    return { error: "Invalid deadline", status: 400 };
  }

  const { data: updated, error } = await db
    .from("phases")
    .update({ submission_deadline: deadline ? deadline.toISOString() : null })
    .eq("id", phase.id)
    .select("*")
    .single();

  if (error) return { error: error.message, status: 400 };
  return { phase: updated };
}

export function canSubmitToPhase(phase, existingSubmission) {
  if (!phase) return { ok: false, reason: "Invalid phase" };
  if (phase.status !== "active") {
    return {
      ok: false,
      reason: phase.status === "closed" ? "Submissions stopped by organizers" : "Submissions not open yet"
    };
  }
  if (isPastDeadline(phase)) {
    return { ok: false, reason: "Submission deadline has passed" };
  }
  if (existingSubmission?.locked) return { ok: false, reason: "Submission locked" };
  return { ok: true };
}

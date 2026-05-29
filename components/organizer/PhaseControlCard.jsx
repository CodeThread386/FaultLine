"use client";

import { formatDeadline, getPhaseDisplayStatus } from "@/lib/phase-control";

const STATUS_STYLES = {
  open: "bg-fl-green/15 text-fl-green",
  stopped: "bg-fl-red/15 text-fl-red",
  deadline: "bg-fl-amber/15 text-fl-amber",
  locked: "bg-fl-bg3 text-fl-muted"
};

export default function PhaseControlCard({
  phaseName,
  title,
  subtitle,
  phase,
  deadlineValue,
  onDeadlineChange,
  onStart,
  onStop,
  onSaveDeadline,
  busy
}) {
  const display = getPhaseDisplayStatus(phase);
  const isOpen = display.code === "open";
  const statusClass = STATUS_STYLES[display.code] || STATUS_STYLES.locked;

  return (
    <div className="fl-card p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-xs text-fl-muted">{subtitle}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{display.label}</span>
      </div>

      <div className="mb-4 rounded-lg border border-fl-border bg-fl-bg2 px-4 py-3 text-sm">
        <div className="font-mono text-[10px] uppercase tracking-wide text-fl-muted">Link submission deadline</div>
        <div className="mt-1 font-semibold">{formatDeadline(phase?.submission_deadline)}</div>
        <p className="mt-1 text-xs text-fl-muted">
          Teams can submit GitHub links while this phase is started and before this time.
        </p>
      </div>

      <label className="mb-1 block font-mono text-[10px] uppercase tracking-wide text-fl-muted">
        Set deadline (date & time)
      </label>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="datetime-local"
          className="fl-input mb-0 flex-1"
          value={deadlineValue || ""}
          onChange={(e) => onDeadlineChange(phaseName, e.target.value)}
        />
        <button
          type="button"
          disabled={!!busy || !deadlineValue}
          onClick={() => onSaveDeadline(phaseName)}
          className="rounded-lg border border-fl-border px-4 py-2 text-sm font-bold hover:bg-fl-bg3 disabled:opacity-40"
        >
          Save deadline
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!!busy || isOpen}
          onClick={() => onStart(phaseName)}
          className="rounded-lg bg-fl-green py-3 text-sm font-bold text-white hover:bg-fl-green/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start phase
        </button>
        <button
          type="button"
          disabled={!!busy || !isOpen}
          onClick={() => onStop(phaseName)}
          className="rounded-lg bg-fl-red py-3 text-sm font-bold text-white hover:bg-fl-red/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Stop phase
        </button>
      </div>
    </div>
  );
}

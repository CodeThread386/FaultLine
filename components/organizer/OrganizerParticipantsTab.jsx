"use client";

import PhaseControlCard from "@/components/organizer/PhaseControlCard";
import ParticipantNotificationsPanel from "@/components/notifications/ParticipantNotificationsPanel";
import { MAX_PHASE_SCORE, MAX_TOTAL_SCORE } from "@/lib/team-scoring";
import { PHASE_ORDER, PHASE_UI } from "@/components/organizer/useOrganizerConsole";

export default function OrganizerParticipantsTab({
  overview,
  phases,
  deadlines,
  setDeadlines,
  busy,
  msg,
  setMsg,
  notifRefresh,
  onNotifMutate,
  act,
  startPhase,
  stopPhase,
  saveDeadline
}) {
  return (
    <div className="mt-8 space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-fl-muted">Phase control</h2>
          <p className="mt-1 text-sm text-fl-muted">
            Set a link submission deadline, then press <strong>Start phase</strong> when ready and{" "}
            <strong>Stop phase</strong> when done. Nothing opens automatically.
          </p>
        </div>

        {PHASE_ORDER.map((name) => {
          const phase = phases.find((p) => p.name === name);
          const ui = PHASE_UI[name];
          return (
            <PhaseControlCard
              key={name}
              phaseName={name}
              title={ui.title}
              subtitle={ui.sub}
              phase={phase}
              deadlineValue={deadlines[name] || ""}
              onDeadlineChange={(phaseName, value) =>
                setDeadlines((d) => ({ ...d, [phaseName]: value }))
              }
              onStart={startPhase}
              onStop={stopPhase}
              onSaveDeadline={saveDeadline}
              busy={busy}
            />
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-fl-muted">Lunch — codebase swaps</h2>
        <p className="text-sm text-fl-muted">
          Swaps are separate from phase timing. Unlock swaps so teams can see inherited codebases, then start
          Phase 2 submissions when you are ready.
        </p>
        <button
          type="button"
          disabled={!!busy}
          onClick={() => act("Swaps assigned", "/api/organizer/assign-swaps")}
          className="fl-btn-primary w-full py-4"
        >
          1. Assign codebase swaps
        </button>
        <button
          type="button"
          disabled={!!busy}
          onClick={() => act("Swaps unlocked", "/api/organizer/unlock-phase2")}
          className="fl-btn-primary w-full py-4"
        >
          2. Show swaps to teams
        </button>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <div className="fl-card flex flex-col p-4">
          <h2 className="mb-1 text-sm font-bold">Announce to participants</h2>
          <p className="mb-3 text-xs text-fl-muted">Sends to everyone&apos;s notification tab instantly.</p>
          <textarea
            className="fl-textarea mb-3 min-h-[120px] flex-1"
            rows={4}
            placeholder="e.g. Phase 1 link submissions close in 15 minutes"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button
            type="button"
            disabled={!msg.trim() || !!busy}
            onClick={() => act("Broadcast", "/api/organizer/notify", { message: msg })}
            className="fl-btn-primary w-full"
          >
            Send to everyone
          </button>
        </div>

        <ParticipantNotificationsPanel
          apiUrl="/api/organizer/notifications"
          embedded
          manageable
          refreshKey={notifRefresh}
          onMutate={onNotifMutate}
          pollMs={15000}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-fl-muted">Teams</h2>
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {(overview?.teams || []).map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-fl-border bg-fl-bg2 px-4 py-3 text-sm"
            >
              <span className="font-semibold">{t.name}</span>
              <span className="text-fl-muted">{t.tracks?.name || "—"}</span>
              <span className="font-mono text-xs text-fl-muted">
                P1 {t.phase_1_marks ?? 0}/{MAX_PHASE_SCORE} + P2 {t.phase_2_marks ?? 0}/{MAX_PHASE_SCORE} ={" "}
                <span className="text-fl-accent">
                  {t.total_marks ?? 0}/{MAX_TOTAL_SCORE}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

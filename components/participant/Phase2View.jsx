"use client";

import Countdown from "@/components/participant/Countdown";
import PhaseSubmissionForm from "@/components/participant/PhaseSubmissionForm";
import { useEventSync } from "@/components/providers/EventSyncProvider";
import { areSubmissionsOpen, formatPhaseScheduleLine } from "@/lib/phase-control";

const RULES = [
  "You receive a GitHub repo and a one-paragraph brief — that's all the documentation you get",
  "You must rebuild the system cleanly — not patch it. Full rebuild, proper architecture, good UX",
  "Your rebuild must pass the same functional requirements as the original system's track spec",
  "Submit your rebuilt repo + a brief explanation of your architecture decisions",
  "Top teams present their full arc — original disaster, diagnosis, clean rebuild"
];

const AWARDS = [
  { name: "⚡ Best Redemption Arc", desc: "Biggest before/after transformation" },
  { name: "🏗️ Cleanest Rebuild", desc: "Best architecture and code quality" },
  { name: "🏆 FaultLine Champion", desc: "Best across both phases" }
];

export default function Phase2View({ submission, initialSwap }) {
  const { getPhase, swap } = useEventSync();
  const phase = getPhase("phase_2");
  const open = areSubmissionsOpen(phase);
  const swapData = swap ?? initialSwap;
  const unlocked = swapData?.unlocked;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-fl-border px-10 py-8">
        <div>
          <h1 className="fl-display text-[clamp(1.75rem,4vw,2.25rem)]">Phase 2 — The Redemption Round</h1>
          <p className="mt-1 text-sm text-fl-muted">
            {formatPhaseScheduleLine(phase, { fallback: "Unlocks after organizer assigns swaps" })}
          </p>
        </div>
        {open && phase?.submission_deadline && (
          <Countdown deadline={phase.submission_deadline} label="Closes in" />
        )}
      </div>

      <div className="grid gap-8 px-10 py-8 lg:grid-cols-[1fr_320px]">
        <div>
          {!unlocked ? (
            <div className="mb-8 fl-glass rounded-sm border border-fl-border p-12 text-center fl-fade-in">
              <p className="fl-label mb-4">Locked</p>
              <h2 className="fl-display text-2xl">Codebase swap happens at lunch</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-fl-muted">
                During lunch, organizers assign each team a codebase from another team in the same track.
                Come back at 2:00 PM — your Phase 2 assignment will be waiting here.
              </p>
            </div>
          ) : (
            <div className="mb-8 fl-glass rounded-sm border border-fl-border bg-gradient-to-br from-white/[0.04] to-transparent p-8 text-center fl-fade-in">
              <p className="fl-label mb-3">Assigned</p>
              <h2 className="fl-display text-2xl">Your Assigned Codebase</h2>
              <p className="mt-2 text-sm text-fl-muted">Inherited disaster — your job is to fix it properly.</p>
              {swapData?.repo_url && (
                <a
                  href={swapData.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-sm border border-fl-border bg-fl-bg3 px-4 py-2.5 font-mono text-xs transition hover:border-fl-accent"
                >
                  {swapData.repo_url}
                </a>
              )}
              {swapData?.description && (
                <div className="mx-auto mt-6 max-w-lg fl-card fl-accent-bar p-5 text-left">
                  <div className="fl-label mb-2">Brief</div>
                  <p className="text-sm leading-relaxed text-fl-muted">{swapData.description}</p>
                </div>
              )}
            </div>
          )}

          <section className="mb-8">
            <div className="fl-block-title">What to Expect</div>
            <div className="space-y-3">
              {RULES.map((rule, i) => (
                <div key={rule} className="flex gap-3 text-sm leading-relaxed">
                  <span className="shrink-0 font-mono text-[10px] text-fl-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section className="mb-8">
            <div className="fl-block-title">Your Submission</div>
            <PhaseSubmissionForm
              phaseName="phase_2"
              phase={phase}
              submission={submission}
              disabled={!unlocked}
              disabledMessage={!unlocked ? "Swaps unlock after lunch when organizers publish them." : undefined}
              submitLabel="Submit Phase 2"
            />
          </section>

          <section>
            <div className="fl-block-title">Phase 2 Awards</div>
            {AWARDS.map((a) => (
              <div key={a.name} className="mb-2 rounded-md bg-fl-bg3 p-3">
                <div className="text-sm font-bold">{a.name}</div>
                <div className="text-[11px] text-fl-muted">{a.desc}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}

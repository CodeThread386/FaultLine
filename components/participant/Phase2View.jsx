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
  {
    name: "BEST REDEMPTION ARC",
    desc: "Biggest before/after transformation"
  },
  {
    name: "CLEANEST REBUILD",
    desc: "Best architecture and code quality"
  },
  {
    name: "FAULTLINE CHAMPION",
    desc: "Best across both phases"
  }
];

function BracketPanel({ children, className = "" }) {
  return (
    <div className={`relative p-6 ${className}`}>
      <span className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b border-l border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b border-r border-[#F5F5F0]" />
      {children}
    </div>
  );
}

export default function Phase2View({ submission, initialSwap }) {
  const { getPhase, swap } = useEventSync();

  const phase = getPhase("phase_2");
  const open = areSubmissionsOpen(phase);

  const swapData = swap ?? initialSwap;
  const unlocked = swapData?.unlocked;

  return (
    <>
      <div className="border-b border-white/10 px-10 py-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[#FF2318]">
              CHAOS PROTOCOL // PHASE 02
            </div>

            <h1 className="fl-display text-[clamp(2.2rem,5vw,4.5rem)]">
              PHASE 2 — THE
              <br />
              <span
                className="fl-glitch inline-block"
                data-text="REDEMPTION ROUND"
              >
                REDEMPTION ROUND
              </span>
            </h1>

            <p className="mt-4 text-sm text-[#8A8A84]">
              {formatPhaseScheduleLine(phase, {
                fallback: "Unlocks after organizer assigns swaps"
              })}
            </p>
          </div>

          {open && phase?.submission_deadline && (
            <Countdown
              deadline={phase.submission_deadline}
              label="Submission Window"
            />
          )}
        </div>
      </div>

      <div className="grid gap-8 px-10 py-5 lg:grid-cols-[1fr_360px]">
        <div>
          {!unlocked ? (
            <section className="mb-10">
              <BracketPanel className="text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FF2318]">
                  Locked
                </div>

                <h2 className="mt-4 fl-display text-2xl">
                  Codebase Swap Happens At Lunch
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#8A8A84]">
                  During lunch, organizers assign each team a codebase from
                  another team in the same track. Come back at 2:00 PM — your
                  Phase 2 assignment will be waiting here.
                </p>
              </BracketPanel>
            </section>
          ) : (
            <section className="mb-10">
              <BracketPanel>
                <div className="text-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FF2318]">
                    Assigned
                  </div>

                  <h2 className="mt-3 fl-display text-2xl">
                    Your Assigned Codebase
                  </h2>

                  <p className="mt-3 text-sm text-[#8A8A84]">
                    Inherited disaster — your job is to fix it properly.
                  </p>

                  {swapData?.repo_url && (
                    <a
                      href={swapData.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-block border border-[#F5F5F0] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5F5F0] shadow-[4px_4px_0_#FF2318] transition hover:border-[#00E0FF] hover:shadow-[4px_4px_0_#00E0FF]"
                    >
                      View Repository
                    </a>
                  )}
                </div>

                {swapData?.description && (
                  <div className="mt-8">
                    <div className="fl-block-title">Brief</div>

                    <BracketPanel>
                      <p className="text-sm leading-relaxed text-[#8A8A84]">
                        {swapData.description}
                      </p>
                    </BracketPanel>
                  </div>
                )}
              </BracketPanel>
            </section>
          )}

          <section>
            <div className="fl-block-title">What To Expect</div>

            <BracketPanel>
              <div className="space-y-5">
                {RULES.map((rule, i) => (
                  <div key={rule} className="flex gap-4">
                    <div className="min-w-[48px] font-mono text-[10px] uppercase tracking-[0.3em] text-[#FF2318]">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="text-sm leading-relaxed text-[#F5F5F0]">
                      {rule}
                    </div>
                  </div>
                ))}
              </div>
            </BracketPanel>
          </section>
        </div>

        <div>
          <section className="mb-10">
            <div className="fl-block-title">Your Submission</div>

            <PhaseSubmissionForm
              phaseName="phase_2"
              phase={phase}
              submission={submission}
              disabled={!unlocked}
              disabledMessage={
                !unlocked
                  ? "Swaps unlock after lunch when organizers publish them."
                  : undefined
              }
              submitLabel="Submit Phase 2"
            />
          </section>

          <section>
            <div className="fl-block-title">Phase 2 Awards</div>

            <BracketPanel>
              <div className="space-y-4">
                {AWARDS.map((a, i) => (
                  <div
                    key={a.name}
                    className={`pl-4 border-l ${
                      i === 0
                        ? "border-[#FF2318]"
                        : "border-[#F5F5F0]"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F5F5F0]">
                      {a.name}
                    </div>

                    <div className="mt-1 text-xs text-[#8A8A84]">
                      {a.desc}
                    </div>
                  </div>
                ))}
              </div>
            </BracketPanel>
          </section>
        </div>
      </div>
    </>
  );
}
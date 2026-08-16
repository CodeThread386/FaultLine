"use client";

import Countdown from "@/components/participant/Countdown";
import PhaseSubmissionForm from "@/components/participant/PhaseSubmissionForm";
import { useEventSync } from "@/components/providers/EventSyncProvider";
import { areSubmissionsOpen, formatPhaseScheduleLine } from "@/lib/phase-control";

const RULES = [
  "The system must be functional — it must run and complete the core flow without crashing",
  "Everything else must be as broken, unmaintainable, and creatively terrible as possible",
  "Submit a GitHub repo link — the repo must be public or shared with organizers",
  "Submit a one-paragraph description of what your system does — this becomes the only documentation Phase 2 teams receive",
  "You may resubmit before the deadline. After the deadline, submissions are permanently locked.",
  "Judges will walk to your workspace for mid-build and pre-final reviews. No prep needed."
];

const STACK = [
  "HTML/CSS/JS",
  "React",
  "Next.js",
  "Python",
  "Java",
  "Node.js",
  "Any DB or none"
];

const AWARDS = [
  {
    name: "UI FROM HELL",
    desc: "Most creatively infuriating frontend"
  },
  {
    name: "DUMPSTER FIRE ARCHITECTURE",
    desc: "Worst backend, most cursed codebase"
  },
  {
    name: "BEST VILLAIN PITCH",
    desc: "Most entertaining presentation"
  }
];

export default function Phase1View({ team, submission }) {
  const { getPhase } = useEventSync();

  const phase = getPhase("phase_1");
  const open = areSubmissionsOpen(phase);
  const trackName = team?.tracks?.name || "Your track";

  return (
    <>
      <div className="border-b border-white/10 px-4 md:px-10 py-6 md:py-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[#FF2318]">
              CHAOS PROTOCOL // PHASE 01
            </div>

            <h1 className="fl-display text-[clamp(2.2rem,5vw,4.5rem)]">
              PHASE 1 — BUILD THE
              <br />
              <span
                className="fl-glitch inline-block"
                data-text="WORST SYSTEM"
              >
                WORST SYSTEM
              </span>
            </h1>

            <p className="mt-4 text-sm text-[#8A8A84]">
              <span className="font-mono uppercase tracking-[0.18em] text-[#F5F5F0]">
                {trackName}
              </span>
              {" · "}
              {formatPhaseScheduleLine(phase, {
                fallback: "Phase 1 schedule TBA"
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

      <div className="grid gap-8 px-4 md:px-10 py-5 grid-cols-1 lg:grid-cols-[1fr_360px]">
        <div>
          <section className="mb-10">
            <div className="fl-block-title">Track Spec</div>

            <div className="fl-bracket-panel">
              <p className="text-sm leading-relaxed text-[#8A8A84]">
                Your system must meet the{" "}
                <strong className="text-[#F5F5F0]">
                  minimum functional requirements
                </strong>{" "}
                for{" "}
                <span className="font-mono uppercase tracking-[0.15em] text-[#F5F5F0]">
                  {trackName}
                </span>
                . Everything else — how broken, confusing, or architecturally
                cursed it is — is entirely up to you.
              </p>

              {team?.tracks?.functional_spec && (
                <p className="mt-4 text-sm leading-relaxed text-[#8A8A84]">
                  {team.tracks.functional_spec}
                </p>
              )}
            </div>
          </section>

          <section className="mb-10">
            <div className="fl-block-title">Rules</div>

            <div className="fl-bracket-panel">
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
            </div>
          </section>

          <section>
            <div className="fl-block-title">Allowed Stack</div>

            <div className="flex flex-wrap gap-3">
              {STACK.map((s, i) => (
                <span
                  key={s}
                  className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] ${
                    i === 0 || i === 3
                      ? "border-[#FF2318] text-[#F5F5F0]"
                      : "border-[#F5F5F0] text-[#F5F5F0]"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section className="mb-10">
            <div className="fl-block-title">Submission</div>

            <PhaseSubmissionForm
              phaseName="phase_1"
              phase={phase}
              submission={submission}
              submitLabel="Submit Phase 1"
            />
          </section>

          <section>
            <div className="fl-block-title">Phase 1 Awards</div>

            <div className="fl-bracket-panel">
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
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
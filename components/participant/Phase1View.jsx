"use client";

import Countdown from "@/components/participant/Countdown";
import PhaseSubmissionForm from "@/components/participant/PhaseSubmissionForm";
import { useEventSync } from "@/components/providers/EventSyncProvider";
import { areSubmissionsOpen } from "@/lib/phase-control";

const RULES = [
  "The system must be functional — it must run and complete the core flow without crashing",
  "Everything else must be as broken, unmaintainable, and creatively terrible as possible",
  "Submit a GitHub repo link — the repo must be public or shared with organizers",
  "Submit a one-paragraph description of what your system does — this becomes the only documentation Phase 2 teams receive",
  "You may resubmit before the deadline. After the deadline, submissions are permanently locked.",
  "Judges will walk to your workspace for mid-build and pre-final reviews. No prep needed."
];

const STACK = ["HTML/CSS/JS", "React", "Next.js", "Python", "Java", "Node.js", "Any DB or none"];

const AWARDS = [
  { name: "🖥️ UI from Hell", desc: "Most creatively infuriating frontend" },
  { name: "🗑️ Dumpster Fire Architecture", desc: "Worst backend, most cursed codebase" },
  { name: "🎭 Best Villain Pitch", desc: "Most entertaining presentation" }
];

export default function Phase1View({ team, submission }) {
  const { getPhase } = useEventSync();
  const phase = getPhase("phase_1");
  const open = areSubmissionsOpen(phase);
  const trackName = team?.tracks?.name || "Your track";

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-fl-border px-10 py-8">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight">Phase 1 — Build the Worst System</h1>
          <p className="mt-1 text-sm text-fl-muted">{trackName} · 9:15 AM to 12:45 PM</p>
        </div>
        {open && phase?.submission_deadline && (
          <Countdown deadline={phase.submission_deadline} label="Closes in" />
        )}
      </div>

      <div className="grid gap-8 px-10 py-8 lg:grid-cols-[1fr_320px]">
        <div>
          <section className="mb-8">
            <div className="fl-block-title">Track Spec</div>
            <div className="rounded-lg border border-fl-border border-l-[3px] border-l-fl-red bg-fl-bg2 p-5">
              <p className="text-sm leading-relaxed text-fl-muted">
                Your system must meet the <strong className="text-fl-text">minimum functional requirements</strong>{" "}
                for {trackName}. Everything else — how broken, confusing, or architecturally cursed it is — is
                entirely up to you.
              </p>
              {team?.tracks?.functional_spec && (
                <p className="mt-3 text-sm leading-relaxed text-fl-muted">{team.tracks.functional_spec}</p>
              )}
            </div>
          </section>

          <section className="mb-8">
            <div className="fl-block-title">Rules</div>
            <div className="space-y-3">
              {RULES.map((rule, i) => (
                <div key={rule} className="flex gap-3 text-sm leading-relaxed">
                  <span className="shrink-0 font-mono text-[11px] text-fl-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="fl-block-title">Allowed Stack</div>
            <div className="flex flex-wrap gap-2">
              {STACK.map((s) => (
                <span key={s} className="rounded-md border border-fl-border bg-fl-bg3 px-3 py-1.5 font-mono text-xs">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section className="mb-8">
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

"use client";

import { useEventSync } from "@/components/providers/EventSyncProvider";

const PHASE_LABELS = {
  phase_1: "Phase 1",
  phase_2: "Phase 2"
};

const PHASE_ORDER = ["phase_1", "phase_2"];

const SCHEDULE = [
  { time: "Kickoff", title: "Event briefing", desc: "Rules, tracks, dashboard walkthrough" },
  { time: "Phase 1", title: "Build the worst system", desc: "Teams ship deliberately broken repos" },
  { time: "Mid-review", title: "Judge walkthrough", desc: "Judges visit workspaces — no slides" },
  { time: "Lock P1", title: "Phase 1 submissions close", desc: "Repos locked on dashboard" },
  { time: "Lunch", title: "Codebase swaps", desc: "Organizers assign cross-team repos" },
  { time: "Phase 2", title: "Redemption round", desc: "Rebuild inherited codebase cleanly" },
  { time: "Closing", title: "Awards", desc: "Phase 1 + Phase 2 marks combined for winners" }
];

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function LiveScheduleView() {
  const { phases: livePhases, activity } = useEventSync();

  const eventPhases = PHASE_ORDER.map((name) => livePhases.find((p) => p.name === name)).filter(Boolean);
  const activePhase = eventPhases.find((p) => p.status === "active");

  return (
    <>
      <div className="border-b border-fl-border px-10 py-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fl-red/30 bg-fl-red/10 px-3 py-1 font-mono text-xs text-fl-red">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fl-red" />
          LIVE
          {activePhase ? ` — ${PHASE_LABELS[activePhase.name] || activePhase.name}` : ""}
        </div>
        <h1 className="text-[28px] font-extrabold tracking-tight">Schedule + Live View</h1>
        <p className="mt-1 text-sm text-fl-muted">Real-time phase status and activity feed</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px]">
        <div className="border-r border-fl-border px-10 py-8">
          <div className="fl-block-title">Event flow</div>
          <div className="relative border-l border-fl-border pl-6">
            {SCHEDULE.map((item, i) => (
              <div key={item.time} className="relative mb-8">
                <div
                  className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 ${
                    i === 0 && activePhase ? "border-fl-red bg-fl-red" : "border-fl-border bg-fl-bg2"
                  }`}
                />
                <div className="font-mono text-[11px] text-fl-red">{item.time}</div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-fl-muted">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="fl-block-title mt-10">Phase status</div>
          <div className="space-y-2">
            {eventPhases.map((phase) => (
              <div key={phase.id} className="flex items-center justify-between fl-card px-4 py-3">
                <span className="font-semibold text-sm">{PHASE_LABELS[phase.name] || phase.name}</span>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase ${
                    phase.status === "active"
                      ? "bg-fl-green/10 text-fl-green"
                      : phase.status === "closed"
                        ? "bg-fl-red/10 text-fl-red"
                        : "bg-fl-bg3 text-fl-muted"
                  }`}
                >
                  {phase.status === "active" ? "open" : phase.status === "closed" ? "stopped" : "not started"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="fl-block-title">Activity feed</div>
          <div className="space-y-4">
            {activity.length === 0 && (
              <p className="text-sm text-fl-muted">Waiting for event updates...</p>
            )}
            {activity.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="shrink-0 font-mono text-[11px] text-fl-muted">
                  {formatTime(item.created_at)}
                </span>
                <p className="text-sm leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

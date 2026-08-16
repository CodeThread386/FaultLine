"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEventSync } from "@/components/providers/EventSyncProvider";

const PHASE_LABELS = {
  phase_1: "Phase 1",
  phase_2: "Phase 2"
};

const PHASE_ORDER = ["phase_1", "phase_2"];

const SCHEDULE = [
  { time: "Kickoff", title: "Event briefing", desc: "Rules, tracks, dashboard walkthrough" },
  { time: "Phase 1", title: "Build the worst system", desc: "Teams ship deliberately broken repos", href: "/dashboard/phase-1" },
  { time: "Mid-review", title: "Judge walkthrough", desc: "Judges visit workspaces — no slides" },
  { time: "Lock P1", title: "Phase 1 submissions close", desc: "Repos locked on dashboard" },
  { time: "Lunch", title: "Codebase swaps", desc: "Organizers assign cross-team repos" },
  { time: "Phase 2", title: "Redemption round", desc: "Rebuild inherited codebase cleanly", href: "/dashboard/phase-2" },
  { time: "Closing", title: "Awards", desc: "Phase 1 + Phase 2 marks combined for winners" }
];

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function LiveScheduleView() {
  const { data: session } = useSession();
  const { phases: livePhases, activity } = useEventSync();

  const isLoggedIn = !!session?.user;

  const eventPhases = PHASE_ORDER.map((name) => livePhases.find((p) => p.name === name)).filter(Boolean);
  const activePhase = eventPhases.find((p) => p.status === "active");

  const getTargetHref = (dashboardPath) => {
    if (!isLoggedIn) {
      return `/login?callbackUrl=${encodeURIComponent(dashboardPath)}`;
    }
    return dashboardPath;
  };

  return (
    <>
      <div className="border-b border-fl-border px-4 md:px-10 py-6 md:py-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-fl-border bg-fl-bg3 px-3 py-1 font-mono text-[10px] uppercase tracking-caption text-fl-accent">
          <span className="fl-live-dot" />
          LIVE
          {activePhase ? ` — ${PHASE_LABELS[activePhase.name] || activePhase.name}` : ""}
        </div>
        <h1 className="fl-display text-[clamp(1.75rem,4vw,2.25rem)]">Schedule + Live View</h1>
        <p className="mt-1 text-sm text-fl-muted">Real-time phase status and activity feed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        <div className="border-b lg:border-b-0 lg:border-r border-fl-border px-4 md:px-10 py-6 md:py-8">
          <div className="fl-block-title">Event flow</div>
          <div className="relative border-l border-fl-border pl-6">
            {SCHEDULE.map((item, i) => (
              <div key={item.time} className="relative mb-8">
                <div
                  className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 ${
                    ((i === 1 && activePhase?.name === "phase_1") || (i === 5 && activePhase?.name === "phase_2") || (i === 0 && activePhase))
                      ? "border-fl-accent bg-fl-accent"
                      : "border-fl-border bg-fl-bg2"
                  }`}
                />
                <div className="font-mono text-[10px] uppercase tracking-caption text-fl-muted">{item.time}</div>
                <div className="font-semibold flex items-center justify-between">
                  <span>{item.title}</span>
                  {item.href && (
                    <Link
                      href={getTargetHref(item.href)}
                      className="inline-flex items-center gap-1 rounded-sm border border-fl-border bg-fl-bg3 px-2 py-0.5 font-mono text-[10px] uppercase tracking-caption text-fl-accent hover:border-fl-accent transition-colors ml-2 shrink-0"
                    >
                      {item.time} {isLoggedIn ? "Dashboard" : "Login"} →
                    </Link>
                  )}
                </div>
                <div className="text-sm text-fl-muted">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="fl-block-title mt-10">Phase status</div>
          <div className="space-y-2">
            {eventPhases.map((phase) => {
              const dashboardPath = phase.name === "phase_1" ? "/dashboard/phase-1" : "/dashboard/phase-2";
              const targetHref = getTargetHref(dashboardPath);
              return (
                <Link
                  key={phase.id}
                  href={targetHref}
                  className="flex items-center justify-between fl-card px-4 py-3 hover:border-fl-accent transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm group-hover:text-fl-accent transition-colors">
                      {PHASE_LABELS[phase.name] || phase.name}
                    </span>
                    <span className="font-mono text-[10px] text-fl-accent uppercase tracking-caption opacity-0 group-hover:opacity-100 transition-opacity">
                      {isLoggedIn ? "Open Dashboard →" : "Log in to view →"}
                    </span>
                  </div>
                  <span
                    className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-caption ${
                      phase.status === "active"
                        ? "fl-status-open"
                        : phase.status === "closed"
                          ? "fl-status-closed"
                          : "bg-fl-bg3 text-fl-muted"
                    }`}
                  >
                    {phase.status === "active" ? "open" : phase.status === "closed" ? "stopped" : "not started"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="px-4 md:px-6 py-6 md:py-8">
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



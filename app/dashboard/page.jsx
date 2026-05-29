import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardWelcome from "@/components/participant/DashboardWelcome";
import Countdown from "@/components/participant/Countdown";
import {
  getNotificationsForUser,
  getPhases,
  getSubmission,
  getTeamForUser,
  getTeamMembers
} from "@/lib/participant-data";
import { getTrackMeta } from "@/lib/tracks-meta";
import { redirect } from "next/navigation";

function initials(name, email) {
  const base = name || email || "?";
  return base
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const team = await getTeamForUser(session.user.id);

  if (!team) {
    return <DashboardWelcome userName={session.user.name} />;
  }

  if (!team.registered) redirect("/dashboard/holding");

  const members = await getTeamMembers(team.id);
  const phases = await getPhases();
  const phase1 = phases.find((p) => p.name === "phase_1");
  const phase2 = phases.find((p) => p.name === "phase_2");
  const p1Sub = await getSubmission(team.id, "phase_1");
  const p2Sub = await getSubmission(team.id, "phase_2");
  const notifications = await getNotificationsForUser(session.user.id, 5);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const track = team.tracks;
  const meta = getTrackMeta(track?.name);
  const phase1Active = phase1?.status === "active";
  const phase2Active = phase2?.status === "active";

  const nextSteps = [];
  if (phase1Active && !p1Sub?.repo_url) nextSteps.push({ label: "Submit Phase 1 repo", href: "/dashboard/phase-1", urgent: true });
  if (phase1Active && p1Sub?.repo_url) nextSteps.push({ label: "Phase 1 submitted — keep building", href: "/dashboard/phase-1", urgent: false });
  if (phase2Active && !p2Sub?.repo_url) nextSteps.push({ label: "Check swap & submit Phase 2", href: "/dashboard/phase-2", urgent: true });
  if (unreadCount > 0) nextSteps.push({ label: `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`, href: "/dashboard/notifications", urgent: true });

  return (
    <>
      <div className="border-b border-fl-border px-10 py-8">
        <p className="fl-label mb-2">Mission Control</p>
        <h1 className="text-[28px] font-extrabold tracking-tight">{team.name}</h1>
        <p className="mt-1 text-sm text-fl-muted">
          {meta.icon} {track?.name} ·{" "}
          {phase1Active ? "Phase 1 active" : phase2Active ? "Phase 2 active" : "Stand by for updates"}
        </p>
      </div>

      {nextSteps.length > 0 && (
        <div className="mx-10 mt-8 fl-card border-l-[3px] border-l-fl-red p-5">
          <div className="fl-label mb-3">What to do now</div>
          <ul className="space-y-2">
            {nextSteps.map((step) => (
              <li key={step.label}>
                <Link
                  href={step.href}
                  className={`text-sm font-semibold hover:text-fl-red ${step.urgent ? "text-fl-text" : "text-fl-muted"}`}
                >
                  → {step.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 px-10 py-8 md:grid-cols-4">
        <div className="fl-card p-5">
          <div className="fl-label mb-2">Track</div>
          <div className="text-2xl">{meta.icon}</div>
          <div className="mt-1 text-sm font-bold">{track?.name}</div>
        </div>
        <div className="fl-card p-5">
          <div className="fl-label mb-2">Phase 1</div>
          <div className={`text-xl font-extrabold ${p1Sub?.repo_url ? "text-fl-green" : "text-fl-amber"}`}>
            {p1Sub?.repo_url ? "Done" : "Pending"}
          </div>
        </div>
        <div className="fl-card p-5">
          <div className="fl-label mb-2">Phase 2</div>
          <div className={`text-xl font-extrabold ${p2Sub?.repo_url ? "text-fl-green" : "text-fl-amber"}`}>
            {p2Sub?.repo_url ? "Done" : phase2Active ? "Open" : "Locked"}
          </div>
        </div>
        <div className="fl-card p-5">
          <div className="fl-label mb-2">Timer</div>
          {phase1Active && phase1?.submission_deadline ? (
            <Countdown deadline={phase1.submission_deadline} compact />
          ) : (
            <span className="font-mono text-xl text-fl-muted">—</span>
          )}
        </div>
      </div>

      <div className="mx-10 mb-8 grid gap-6 lg:grid-cols-2">
        <div className="fl-card p-6">
          <div className="fl-block-title">Track briefing</div>
          <p className="text-sm leading-relaxed text-fl-muted">
            {track?.functional_spec ||
              "Build the worst functional system in your domain. Phase 2 teams only get your repo URL and description."}
          </p>
        </div>
        <div className="fl-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="fl-block-title mb-0 border-0 pb-0">Recent updates</div>
            <Link href="/dashboard/notifications" className="text-xs font-semibold text-fl-red hover:underline">
              View all
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-fl-muted">No notifications yet.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n.id} className="flex gap-2 text-sm">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? "bg-fl-border" : "bg-fl-red"}`}
                  />
                  <span className={n.read ? "text-fl-muted" : "text-fl-text"}>{n.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-10 mb-8 fl-card p-6">
        <div className="mb-4 text-sm font-bold">Event progress</div>
        <div className="relative flex">
          <div className="absolute left-3.5 right-3.5 top-3.5 h-0.5 bg-fl-border" />
          {[
            { label: "Kickoff", done: true },
            { label: "Phase 1", current: phase1Active, done: p1Sub?.repo_url },
            { label: "Swap", current: false },
            { label: "Phase 2", current: phase2Active, done: p2Sub?.repo_url },
            { label: "Awards", current: false }
          ].map((step) => (
            <div key={step.label} className="relative z-10 flex-1 text-center">
              <div
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-[11px] ${
                  step.done
                    ? "border-fl-red bg-fl-red text-white"
                    : step.current
                      ? "border-fl-red bg-fl-bg text-fl-red"
                      : "border-fl-border bg-fl-bg3 text-fl-muted"
                }`}
              >
                {step.done ? "✓" : "—"}
              </div>
              <div className={`mt-2 text-[11px] ${step.current ? "font-bold" : "text-fl-muted"}`}>
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-10 mb-10 fl-card p-6">
        <div className="fl-block-title">Squad ({members.length})</div>
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 border-b border-fl-border py-3 last:border-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fl-bg3 text-sm font-bold">
              {initials(member.name, member.email)}
            </div>
            <div>
              <div className="text-sm font-semibold">{member.name || member.email}</div>
              <div className="font-mono text-[11px] text-fl-muted">{member.email}</div>
            </div>
            {team.leader_id === member.id && (
              <span className="ml-auto rounded border border-fl-amber px-2 py-0.5 font-mono text-[10px] text-fl-amber">
                LEADER
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

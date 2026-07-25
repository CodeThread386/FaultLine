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
import styles from "./DashboardHome.module.css";

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
    <div className={`${styles.home} min-h-screen w-full overflow-hidden pb-32`}>

      {/* Faint corner reticle — decorative only, static, low opacity */}
      <svg className="fixed top-20 right-20 w-40 h-40 opacity-[0.06] pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5,10" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" />
      </svg>

      {/* ---------- Hero ---------- */}
      <div className={`${styles.hero} ${styles.homePanel}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <p className={styles.eyebrow}>Mission Control</p>
            <h1 className={`${styles.headline} text-[clamp(3rem,8vw,7rem)] tracking-tighter leading-[0.9]`}>
              {team.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span
                className={styles.glitch}
                data-text={team.name.split(" ").slice(-1)[0]}
              >
                {team.name.split(" ").slice(-1)[0]}
              </span>
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className={styles.statusTag}>
              {meta.icon} {track?.name}
            </p>
            <p className={styles.statusTag}>
              {phase1Active ? "PHASE 1 ACTIVE" : phase2Active ? "PHASE 2 ACTIVE" : "STAND BY"}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Action Required ---------- */}
      {nextSteps.length > 0 && (
        <div className={`${styles.actionPanel} ${styles.homePanel} mx-8 md:mx-12 mt-8`}>
          <div className={styles.sectionLabel}>Action Required</div>
          <ul className="flex flex-col gap-4">
            {nextSteps.map((step) => (
              <li key={step.label}>
                <Link
                  href={step.href}
                  className={`${styles.actionLink} group flex items-center justify-between gap-6 px-6 py-5 text-2xl md:text-3xl tracking-tight ${
                    step.urgent ? styles.actionLinkUrgent : ""
                  }`}
                >
                  <span>{step.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">&gt;&gt;&gt;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------- Status row: Track / Phase 1 / Phase 2 / Timer ---------- */}
      <div className="w-full px-8 md:px-12 grid grid-cols-1 gap-x-12 gap-y-8 py-16 md:grid-cols-4 mt-8">
        <div className={`${styles.card} ${styles.homePanel}`}>
          <div className={styles.cardLabel}>Track</div>
          <div className={styles.cardIcon}>{meta.icon}</div>
          <div className={styles.cardValue}>{track?.name}</div>
        </div>

        <div className={`${styles.card} ${styles.homePanel}`}>
          <div className={styles.cardLabel}>Phase 1</div>
          <div className={styles.cardValue}>
            {p1Sub?.repo_url ? "DONE" : "PENDING"}
          </div>
        </div>

        <div className={`${styles.card} ${styles.homePanel}`}>
          <div className={styles.cardLabel}>Phase 2</div>
          <div className={styles.cardValue}>
            {p2Sub?.repo_url ? "DONE" : phase2Active ? "OPEN" : "LOCKED"}
          </div>
        </div>

        <div className={`${styles.card} ${styles.homePanel}`}>
          <div className={styles.cardLabel}>Timer</div>
          {phase1Active && phase1?.submission_deadline ? (
            <Countdown deadline={phase1.submission_deadline} compact className={styles.timer} />
          ) : (
            <span className={`${styles.timer} opacity-40`}>--:--</span>
          )}
        </div>
      </div>

      {/* ---------- Briefing / System Log ---------- */}
      <div className="w-full px-8 md:px-12 grid gap-x-12 gap-y-8 lg:grid-cols-2 mt-8">
        <div className={`${styles.briefing} ${styles.homePanel}`}>
          <div className={styles.cardLabel}>Briefing</div>
          <p className="text-2xl md:text-3xl leading-snug uppercase mt-4">
            {track?.functional_spec ||
              "Build the worst functional system in your domain. Phase 2 teams only get your repo URL and description."}
          </p>
        </div>

        <div className={`${styles.log} ${styles.homePanel}`}>
          <div className="flex items-center justify-between mb-8">
            <div className={styles.cardLabel}>System Log</div>
            <Link href="/dashboard/notifications" className={styles.actionLink}>
              View all
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className="text-xl uppercase opacity-40">No events logged.</p>
          ) : (
            <ul className="flex flex-col gap-5">
              {notifications.map((n) => (
                <li key={n.id} className="flex gap-4 text-lg uppercase items-start">
                  <span
                    className={`mt-1.5 h-3 w-3 shrink-0 border ${
                      n.read ? "border-white/30 bg-transparent" : "border-[--home-red] bg-[--home-red]"
                    }`}
                  />
                  <span className={n.read ? "opacity-40" : ""}>{n.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ---------- Event Progress ---------- */}
      <div className={`${styles.progress} ${styles.homePanel} mx-8 md:mx-12 mt-8`}>
        <div className={styles.cardLabel}>Event Progress</div>
        <div className="relative flex mt-16">
          <div className="absolute left-0 right-0 top-[14px] h-px bg-white/20" />
          {[
            { label: "Kickoff", done: true },
            { label: "Phase 1", current: phase1Active, done: p1Sub?.repo_url },
            { label: "Swap", current: false },
            { label: "Phase 2", current: phase2Active, done: p2Sub?.repo_url },
            { label: "Awards", current: false }
          ].map((step) => (
            <div key={step.label} className="relative z-10 flex-1 text-center">
              <div
                className={`mx-auto flex h-8 w-8 items-center justify-center text-sm font-bold border ${
                  step.done
                    ? "bg-white text-black border-white"
                    : step.current
                      ? "border-[--home-red] text-[--home-red]"
                      : "border-white/25 text-transparent"
                }`}
              >
                {step.done ? "✓" : step.current ? "!" : ""}
              </div>
              <div
                className={`mt-4 text-xs uppercase tracking-widest ${
                  step.current ? "text-[--home-red]" : "opacity-40"
                }`}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Squad ---------- */}
      <div className="w-full mt-24 mb-16 px-8 md:px-12">
        <div className={styles.cardLabel}>Squad</div>
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {members.map((member) => (
            <div key={member.id} className={`${styles.squadMember} ${styles.homePanel} flex items-center gap-6`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/30 text-xl font-bold uppercase">
                {initials(member.name, member.email)}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xl font-bold uppercase tracking-tight truncate">
                  {member.name || member.email}
                </div>
                <div className="text-sm uppercase opacity-40 mt-1 truncate">{member.email}</div>
              </div>
              {team.leader_id === member.id && (
                <span className={styles.roleTag}>Root</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
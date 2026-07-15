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
    <div className="min-h-screen bg-black w-full overflow-hidden fl-tech-grid pb-32">
      <div className="fl-scanline"></div>

      {/* Target Reticles background */}
      <svg className="fixed top-20 right-20 w-48 h-48 opacity-10 animate-spin-slow pointer-events-none mix-blend-difference" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5,10"/>
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="2"/>
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2"/>
      </svg>

      <div className="w-full px-4 py-20 md:px-8 md:py-32 relative overflow-visible bg-black mb-16 border-t-[12px] border-b-[12px] border-white transform -skew-y-2 mt-8 z-10">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-white mix-blend-difference blur-[200px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end transform rotate-2">
          <div>
            <p className="mb-4 text-white font-display text-2xl uppercase tracking-widest bg-white/20 inline-block px-4">Mission Control</p>
            <h1 
              className="fl-display text-[clamp(4rem,10vw,8rem)] tracking-tighter leading-[0.8] text-white mix-blend-difference relative z-10 animate-jitter"
              style={{ WebkitTextStroke: "2px white" }}
            >
              {team.name}
            </h1>
          </div>
          <div className="mt-8 md:mt-0 text-right transform -rotate-3">
            <p className="text-xl text-white font-display font-black uppercase tracking-widest bg-white text-black px-4 py-2 mb-2 inline-block shadow-[4px_4px_0_0_#ffffff]">
              {meta.icon} {track?.name}
            </p>
            <br/>
            <p className="text-sm font-display font-black tracking-widest uppercase text-white/50 inline-block border-2 border-white p-2 animate-pulse">
              {phase1Active ? "PHASE 1 ACTIVE" : phase2Active ? "PHASE 2 ACTIVE" : "STAND BY"}
            </p>
          </div>
        </div>
      </div>

      {nextSteps.length > 0 && (
        <div className="w-full mt-16 fl-card p-12 md:p-24 relative z-20 transform -rotate-1 hover:rotate-0 border-y-[16px] border-white bg-black">
          <div className="mb-12 font-display uppercase font-black text-white text-5xl bg-white text-black inline-block px-6 py-2 shadow-[12px_12px_0_0_#ffffff]">Action Required</div>
          <ul className="space-y-8 flex flex-col items-start">
            {nextSteps.map((step) => (
              <li key={step.label} className="w-full md:w-3/4">
                <Link
                  href={step.href}
                  className={`group w-full flex items-center justify-between text-4xl md:text-6xl font-display uppercase tracking-tighter transition-all p-6 border-4 border-transparent hover:border-white ${step.urgent ? "text-black bg-white hover:bg-black hover:text-white" : "text-transparent hover:bg-white hover:text-black"}`}
                  style={!step.urgent ? { WebkitTextStroke: "2px white" } : {}}
                >
                  <span>{step.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity animate-jitter">&gt;&gt;&gt;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full px-4 md:px-12 grid grid-cols-1 gap-12 py-16 md:grid-cols-4 mt-24 relative z-10">
        <div className="fl-card p-12 transform rotate-3 hover:scale-105 duration-200 border-8 border-white">
          <div className="font-display font-black uppercase text-white/50 mb-8 bg-white/20 inline-block px-4 py-1 text-xl">Track</div>
          <div className="text-[6rem] mb-6 leading-none">{meta.icon}</div>
          <div className="text-4xl font-display font-black tracking-tight uppercase leading-none">{track?.name}</div>
        </div>
        <div className="fl-card p-12 transform -rotate-3 hover:scale-105 duration-200 translate-y-12 border-8 border-white">
          <div className="font-display font-black uppercase text-white/50 mb-8 bg-white/20 inline-block px-4 py-1 text-xl">Phase 1</div>
          <div className={`text-6xl font-display tracking-tighter uppercase ${p1Sub?.repo_url ? "text-white" : "text-transparent"}`} style={!p1Sub?.repo_url ? { WebkitTextStroke: "3px white" } : {}}>
            {p1Sub?.repo_url ? "DONE" : "PENDING"}
          </div>
        </div>
        <div className="fl-card p-12 transform rotate-2 hover:scale-105 duration-200 border-8 border-white">
          <div className="font-display font-black uppercase text-white/50 mb-8 bg-white/20 inline-block px-4 py-1 text-xl">Phase 2</div>
          <div className={`text-6xl font-display tracking-tighter uppercase ${p2Sub?.repo_url ? "text-white" : phase2Active ? "text-white animate-jitter inline-block" : "text-transparent"}`} style={(!p2Sub?.repo_url && !phase2Active) ? { WebkitTextStroke: "3px white" } : {}}>
            {p2Sub?.repo_url ? "DONE" : phase2Active ? "OPEN" : "LOCKED"}
          </div>
        </div>
        <div className="fl-card p-12 transform -skew-x-6 hover:scale-105 duration-200 translate-y-16 border-8 border-white bg-white">
          <div className="font-display font-black uppercase text-black/50 mb-8 bg-black/10 inline-block px-4 py-1 text-xl">Timer</div>
          {phase1Active && phase1?.submission_deadline ? (
            <Countdown deadline={phase1.submission_deadline} compact />
          ) : (
            <span className="font-display font-black text-6xl tracking-tighter text-transparent mix-blend-difference" style={{ WebkitTextStroke: "3px black" }}>--:--</span>
          )}
        </div>
      </div>

      <div className="w-full mt-32 grid gap-16 lg:grid-cols-2 relative z-20">
        <div className="fl-card p-16 transform -skew-y-1 border-r-[24px] border-y-[12px] border-white -ml-8">
          <div className="font-display font-black uppercase text-3xl text-white mb-12 bg-white text-black inline-block px-6 py-2 animate-shake shadow-[12px_12px_0_0_#ffffff]">Briefing</div>
          <p className="text-4xl font-display font-black leading-tight text-white uppercase">
            {track?.functional_spec ||
              "Build the worst functional system in your domain. Phase 2 teams only get your repo URL and description."}
          </p>
        </div>
        <div className="fl-card p-16 transform rotate-1 border-l-[24px] border-y-[12px] border-white -mr-8">
          <div className="mb-12 flex flex-col items-start border-b-8 border-white pb-8">
            <div className="font-display font-black uppercase text-4xl text-white">System Log</div>
            <Link href="/dashboard/notifications" className="mt-6 text-2xl font-display uppercase font-black text-black bg-white hover:bg-transparent hover:text-white border-4 border-transparent hover:border-white transition-colors px-6 py-2 shadow-[6px_6px_0_0_#ffffff]">
              VIEW ALL
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className="text-3xl font-display font-black text-white/30 uppercase">No events logged.</p>
          ) : (
            <ul className="space-y-8">
              {notifications.map((n) => (
                <li key={n.id} className="flex gap-8 text-2xl font-display font-black uppercase items-start">
                  <span
                    className={`mt-2 h-6 w-6 shrink-0 border-4 border-white ${n.read ? "bg-transparent" : "bg-white animate-jitter shadow-[6px_6px_0_0_#ffffff]"}`}
                  />
                  <span className={n.read ? "text-white/40" : "text-white leading-tight"}>{n.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-8 mt-24 md:mx-12 fl-card p-12 relative z-10 border-l-[16px] border-l-white">
        <div className="font-display font-black uppercase text-3xl text-white mb-16 transform -rotate-1 inline-block">Event Progress</div>
        <div className="relative flex">
          <div className="absolute left-0 right-0 top-[20px] h-2 bg-white" />
          {[
            { label: "Kickoff", done: true },
            { label: "Phase 1", current: phase1Active, done: p1Sub?.repo_url },
            { label: "Swap", current: false },
            { label: "Phase 2", current: phase2Active, done: p2Sub?.repo_url },
            { label: "Awards", current: false }
          ].map((step) => (
             <div key={step.label} className="relative z-10 flex-1 text-center group">
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center font-display font-black text-2xl transition-all duration-200 transform group-hover:scale-125 group-hover:rotate-6 ${
                  step.done
                    ? "bg-white text-black border-4 border-black"
                    : step.current
                      ? "bg-black border-4 border-white text-white animate-jitter shadow-[4px_4px_0_0_#ffffff]"
                      : "bg-black border-4 border-white/30 text-transparent"
                }`}
              >
                {step.done ? "X" : step.current ? "!" : ""}
              </div>
              <div className={`mt-8 text-xl font-display font-black uppercase tracking-widest ${step.current ? "text-white bg-white text-black px-2 inline-block shadow-[4px_4px_0_0_#ffffff]" : "text-white/40"}`}>
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-40 mb-32 relative z-10 overflow-hidden py-32 border-y-8 border-white bg-black">
        <svg className="absolute left-0 top-0 w-full h-[200px] pointer-events-none mix-blend-difference" preserveAspectRatio="none">
           <path d="M0,50 L100,50 L150,0 L200,50 L1000,50" stroke="white" strokeWidth="4" fill="none" className="animate-jitter opacity-50 w-full"/>
        </svg>

        <div className="font-display font-black uppercase text-[12rem] md:text-[20rem] text-transparent absolute -top-16 -left-16 mix-blend-difference pointer-events-none transform -rotate-2" style={{ WebkitTextStroke: "4px white", opacity: 0.15, lineHeight: 0.8 }}>SQUAD</div>
        <div className="w-full px-4 md:px-12 grid gap-12 md:grid-cols-2 mt-24 relative z-10">
          {members.map((member, i) => (
            <div
              key={member.id}
              className={`flex items-center gap-8 p-8 bg-black border-[12px] border-white hover:-translate-y-4 hover:shadow-[16px_16px_0_0_#ffffff] transition-all transform ${i % 2 === 0 ? "rotate-2" : "-rotate-2 translate-y-12"}`}
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-white text-black text-5xl font-display font-black uppercase">
                {initials(member.name, member.email)}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-4xl font-display font-black uppercase tracking-tight truncate text-white">{member.name || member.email}</div>
                <div className="font-display font-bold uppercase text-xl text-white/50 mt-2 truncate bg-white/10 inline-block px-3">{member.email}</div>
              </div>
              {team.leader_id === member.id && (
                <span className="shrink-0 ml-auto border-8 border-white bg-white text-black px-6 py-4 font-display text-2xl uppercase font-black shadow-[8px_8px_0_0_#ffffff] transform rotate-12">
                  ROOT
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

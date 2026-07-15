"use client";

import OrganizerHomeTab from "@/components/organizer/OrganizerHomeTab";
import OrganizerMarksTab from "@/components/organizer/OrganizerMarksTab";
import OrganizerParticipantsTab from "@/components/organizer/OrganizerParticipantsTab";
import { ORGANIZER_TABS, useOrganizerConsole } from "@/components/organizer/useOrganizerConsole";

export default function OrganizerPage() {
  const {
    tab,
    setTab,
    overview,
    notifRefresh,
    msg,
    setMsg,
    toast,
    busy,
    deadlines,
    setDeadlines,
    scoreFilter,
    setScoreFilter,
    act,
    startPhase,
    stopPhase,
    saveDeadline,
    reload
  } = useOrganizerConsole();

  const phases = overview?.phases || [];

  return (
    <div className="w-full px-4 py-16 md:px-12 md:py-32 relative z-10">
      
      {/* Corner crosshairs */}
      <svg className="absolute top-10 right-10 w-16 h-16 opacity-50" viewBox="0 0 100 100">
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="2"/>
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4,4"/>
      </svg>

      <div className="relative inline-block transform -rotate-2 mb-24">
        <h1 className="fl-display text-[clamp(6rem,15vw,12rem)] tracking-tighter leading-none text-white mix-blend-difference" style={{ letterSpacing: "-0.08em" }}>
          <span className="block transform -translate-x-8 animate-jitter">ROOT</span>
          <span className="block text-transparent transform translate-x-12 -translate-y-8" style={{ WebkitTextStroke: "4px white" }}>CONSOLE</span>
        </h1>
        <div className="absolute top-1/2 left-0 w-[150%] h-[30%] bg-white mix-blend-difference rotate-6 pointer-events-none animate-shake"></div>
      </div>
      
      <p className="mt-8 text-4xl font-display font-black uppercase text-white mb-24 leading-tight max-w-5xl border-l-[24px] border-white pl-12 transform skew-x-6">
        <span className="text-black bg-white px-4 py-2 mr-6 animate-pulse inline-block">WARNING</span> 
        Start and stop phases manually. Set link submission deadlines per phase. Strictly monitored environment.
      </p>

      <div className="mt-32 flex flex-wrap gap-8 border-b-[12px] border-white pb-16 relative transform -skew-y-1">
        {ORGANIZER_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-10 py-6 text-4xl font-display uppercase font-black transition-all transform hover:-translate-y-4 hover:rotate-2 ${
              tab === t.id ? "bg-white text-black shadow-[16px_16px_0_0_#ffffff] scale-110 z-10" : "bg-black text-white border-8 border-white hover:bg-white hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {toast && (
        <div className="mt-8 rounded-none border-l-4 border-l-fl-text bg-fl-bg3 px-6 py-4 text-sm font-mono tracking-widest text-fl-text">
          {toast}
        </div>
      )}

      <div className="mt-8">
        {tab === "home" && (
          <OrganizerHomeTab
            overview={overview}
            scoreFilter={scoreFilter}
            setScoreFilter={setScoreFilter}
          />
        )}

        {tab === "participants" && (
          <OrganizerParticipantsTab
            overview={overview}
            phases={phases}
            deadlines={deadlines}
            setDeadlines={setDeadlines}
            busy={busy}
            msg={msg}
            setMsg={setMsg}
            notifRefresh={notifRefresh}
            onNotifMutate={() => setNotifRefresh((n) => n + 1)}
            act={act}
            startPhase={startPhase}
            stopPhase={stopPhase}
            saveDeadline={saveDeadline}
          />
        )}

        {tab === "marks" && (
          <OrganizerMarksTab tracks={overview?.tracks || []} onSaved={reload} />
        )}
      </div>
    </div>
  );
}

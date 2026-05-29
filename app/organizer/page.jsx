"use client";

import OrganizerHomeTab from "@/components/organizer/OrganizerHomeTab";
import OrganizerJudgesTab from "@/components/organizer/OrganizerJudgesTab";
import OrganizerParticipantsTab from "@/components/organizer/OrganizerParticipantsTab";
import { ORGANIZER_TABS, useOrganizerConsole } from "@/components/organizer/useOrganizerConsole";

export default function OrganizerPage() {
  const {
    tab,
    setTab,
    overview,
    judgeCtrl,
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
    setJudgeRound
  } = useOrganizerConsole();

  const phases = overview?.phases || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Organizer</h1>
      <p className="mt-1 text-sm text-fl-muted">
        Start and stop phases manually. Set link submission deadlines per phase.
      </p>

      <div className="mt-6 flex gap-2 border-b border-fl-border pb-2">
        {ORGANIZER_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-4 py-2 text-sm font-bold transition ${
              tab === t.id ? "bg-fl-red text-white" : "text-fl-muted hover:bg-fl-bg3"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {toast && (
        <div className="mt-4 rounded-lg border border-fl-green/30 bg-fl-green/10 px-4 py-3 text-sm text-fl-green">
          {toast}
        </div>
      )}

      {tab === "home" && (
        <OrganizerHomeTab
          overview={overview}
          judgeCtrl={judgeCtrl}
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

      {tab === "judges" && (
        <OrganizerJudgesTab
          judgeCtrl={judgeCtrl}
          busy={busy}
          act={act}
          setJudgeRound={setJudgeRound}
          tracks={overview?.tracks || []}
        />
      )}
    </div>
  );
}

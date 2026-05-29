"use client";

import { useState } from "react";
import { JUDGE_PHASE_INFO } from "@/lib/judge-phase-info";
import JudgeScoreForm from "@/components/judge/JudgeScoreForm";

const SUB_TABS = [
  { id: "marks", label: "Give marks" },
  { id: "info", label: "Info" }
];

export default function JudgePhaseView({ phaseName }) {
  const [tab, setTab] = useState("marks");
  const info = JUDGE_PHASE_INFO[phaseName];

  return (
    <div className="w-full min-w-0">
      <div className="mb-4 flex w-full gap-2">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${
              tab === t.id
                ? t.id === "marks"
                  ? "bg-fl-red text-white"
                  : "bg-fl-bg3 text-fl-text"
                : "bg-fl-bg2 text-fl-muted hover:text-fl-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "marks" && <JudgeScoreForm phaseName={phaseName} />}

      {tab === "info" && info && (
        <div className="fl-card w-full p-5 text-sm">
          <h2 className="text-base font-extrabold">{info.title}</h2>
          <p className="mt-2 leading-relaxed text-fl-muted">{info.summary}</p>
          <ul className="mt-4 space-y-2 text-fl-muted">
            {info.points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-fl-red">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-fl-muted">
            Visit round is set by organizers and shown on the marks tab.
          </p>
        </div>
      )}
    </div>
  );
}

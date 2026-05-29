"use client";

import { useCallback, useEffect, useState } from "react";
import { JUDGE_ROUNDS, normalizeJudgeRound } from "@/lib/judge-rubric";
import { MAX_PHASE_SCORE, MAX_TOTAL_SCORE } from "@/lib/team-scoring";
import { apiFetch } from "@/lib/http/client";

export default function OrganizerJudgesTab({ judgeCtrl, busy, act, setJudgeRound, tracks = [] }) {
  const activeRound = normalizeJudgeRound(judgeCtrl?.judge_round || "visit_1");
  const [judges, setJudges] = useState([]);
  const [assignBusy, setAssignBusy] = useState("");

  const loadJudges = useCallback(async () => {
    try {
      const data = await apiFetch("/api/organizer/judges");
      setJudges(data.judges || []);
    } catch {
      /* keep list */
    }
  }, []);

  useEffect(() => {
    loadJudges();
  }, [loadJudges, busy]);

  const assignTrack = async (userId, trackId) => {
    setAssignBusy(userId);
    try {
      await apiFetch("/api/organizer/judges", {
        method: "PATCH",
        body: JSON.stringify({ user_id: userId, track_id: trackId || null })
      });
      await loadJudges();
    } finally {
      setAssignBusy("");
    }
  };

  return (
    <div className="mt-8 space-y-8">
      <section className="fl-card p-4">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-fl-muted">Active judge round</h2>
        <p className="mb-4 text-sm text-fl-muted">
          Each round scores out of 100 (visit 1, visit 2, final pitch). Phase total = sum of those three (max{" "}
          {MAX_PHASE_SCORE}). One judge per team per round. Overall max {MAX_TOTAL_SCORE}.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {JUDGE_ROUNDS.map((r) => (
            <button
              key={r.value}
              type="button"
              disabled={!!busy}
              onClick={() => setJudgeRound(r.value)}
              className={`rounded-lg py-4 text-sm font-bold transition ${
                activeRound === r.value
                  ? "bg-fl-red text-white"
                  : "border border-fl-border bg-fl-bg2 hover:border-fl-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </section>

      <section className="fl-card p-4">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-fl-muted">Judge track assignment</h2>
        <p className="mb-4 text-sm text-fl-muted">
          Visit rounds only show teams on the judge&apos;s assigned track. Final pitch shows all teams.
        </p>
        {judges.length === 0 ? (
          <p className="text-sm text-fl-muted">No judges found. Pre-provision judges in Supabase before event day.</p>
        ) : (
          <ul className="space-y-2">
            {judges.map((j) => (
              <li
                key={j.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-fl-border bg-fl-bg2 px-3 py-2 text-sm"
              >
                <span>
                  {j.name || j.email}
                  {j.tracks?.name ? (
                    <span className="ml-2 text-fl-muted">({j.tracks.name})</span>
                  ) : (
                    <span className="ml-2 text-amber-400">(no track)</span>
                  )}
                </span>
                <select
                  disabled={!!busy || assignBusy === j.id}
                  value={j.track_id || ""}
                  onChange={(e) => assignTrack(j.id, e.target.value || null)}
                  className="rounded border border-fl-border bg-fl-bg px-2 py-1 text-sm"
                >
                  <option value="">Unassigned</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="fl-card p-4">
        <h2 className="mb-3 text-sm font-bold">Scoring gate</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!!busy}
            onClick={() => act("Scoring open", "/api/organizer/judge-control", { judge_scoring_open: true })}
            className="rounded-lg bg-fl-green/20 py-3 text-sm font-bold text-fl-green"
          >
            Allow scoring
          </button>
          <button
            type="button"
            disabled={!!busy}
            onClick={() => act("Scoring closed", "/api/organizer/judge-control", { judge_scoring_open: false })}
            className="rounded-lg bg-fl-red/20 py-3 text-sm font-bold text-fl-red"
          >
            Pause scoring
          </button>
        </div>
      </section>
    </div>
  );
}

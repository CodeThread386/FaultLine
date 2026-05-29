"use client";

import { formatDeadline, getPhaseDisplayStatus } from "@/lib/phase-control";
import { JUDGE_ROUNDS, normalizeJudgeRound } from "@/lib/judge-rubric";
import { MAX_PHASE_SCORE, MAX_TOTAL_SCORE } from "@/lib/team-scoring";
import { PHASE_ORDER, PHASE_UI } from "@/components/organizer/useOrganizerConsole";

export default function OrganizerHomeTab({ overview, judgeCtrl, scoreFilter, setScoreFilter }) {
  const stats = overview?.stats;
  const phases = overview?.phases || [];
  const activeRound = normalizeJudgeRound(judgeCtrl?.judge_round || "visit_1");

  const scoreKey =
    scoreFilter === "phase_1" ? "phase_1_marks" : scoreFilter === "phase_2" ? "phase_2_marks" : "total_marks";
  const rankedTeams = [...(overview?.teams || [])].sort(
    (a, b) => (b[scoreKey] ?? 0) - (a[scoreKey] ?? 0)
  );

  return (
    <div className="mt-8 space-y-6">
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="fl-card p-4 text-center">
            <div className="text-3xl font-extrabold text-fl-red">{stats.registered_count}</div>
            <div className="text-xs text-fl-muted">Teams registered</div>
          </div>
          <div className="fl-card p-4 text-center">
            <div className="text-3xl font-extrabold">{stats.phase_1_submissions}</div>
            <div className="text-xs text-fl-muted">Phase 1 submitted</div>
          </div>
          <div className="fl-card p-4 text-center">
            <div className="text-3xl font-extrabold">{stats.phase_2_submissions}</div>
            <div className="text-xs text-fl-muted">Phase 2 submitted</div>
          </div>
        </div>
      )}

      <div className="fl-card p-4">
        <div className="fl-block-title mb-3">Phase status</div>
        <div className="space-y-3">
          {PHASE_ORDER.map((name) => {
            const phase = phases.find((p) => p.name === name);
            const ui = PHASE_UI[name];
            const display = getPhaseDisplayStatus(phase);
            return (
              <div
                key={name}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-fl-border bg-fl-bg2 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold">{ui.title}</div>
                  <div className="text-xs text-fl-muted">
                    Deadline: {formatDeadline(phase?.submission_deadline)}
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    display.code === "open"
                      ? "bg-fl-green/15 text-fl-green"
                      : display.code === "stopped" || display.code === "deadline"
                        ? "bg-fl-red/15 text-fl-red"
                        : "bg-fl-bg3 text-fl-muted"
                  }`}
                >
                  {display.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-fl-muted">Control phases under the Participants tab.</p>
      </div>

      <div className="fl-card p-4">
        <div className="fl-block-title mb-2">Active judge round</div>
        <p className="text-sm font-bold text-fl-red">
          {JUDGE_ROUNDS.find((r) => r.value === activeRound)?.label || activeRound}
        </p>
        <p className="mt-1 text-xs text-fl-muted">3 rounds per phase · change under Judges tab</p>
      </div>

      <div className="fl-card p-4">
        <div className="fl-block-title mb-3">Leaderboard</div>
        <div className="mb-4 flex gap-2">
          {[
            { id: "phase_1", label: "Top Phase 1" },
            { id: "phase_2", label: "Top Phase 2" },
            { id: "overall", label: "Top overall" }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setScoreFilter(f.id)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                scoreFilter === f.id ? "bg-fl-red text-white" : "bg-fl-bg3 text-fl-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {rankedTeams.length === 0 && <p className="text-sm text-fl-muted">No scores yet.</p>}
          {rankedTeams.map((t, i) => {
            const missingSubmission =
              scoreFilter === "phase_1"
                ? !t.phase_1_submitted
                : scoreFilter === "phase_2"
                  ? !t.phase_2_submitted
                  : false;

            return (
              <div
                key={t.id}
                className={`flex items-center justify-between rounded-lg border bg-fl-bg2 px-4 py-3 text-sm ${
                  missingSubmission ? "border-fl-red/60" : "border-fl-border"
                }`}
              >
                <span className={`font-mono ${missingSubmission ? "text-fl-red/80" : "text-fl-muted"}`}>
                  #{i + 1}
                </span>
                <span
                  className={`flex-1 px-3 font-semibold ${missingSubmission ? "text-fl-red" : ""}`}
                  title={missingSubmission ? "No repo submitted for this phase" : undefined}
                >
                  {t.name}
                  {missingSubmission && (
                    <span className="ml-2 text-xs font-normal text-fl-red/90">· not submitted</span>
                  )}
                </span>
                <span className="text-right font-mono text-xs">
                  <span className="text-fl-muted">
                    P1 {t.phase_1_marks ?? 0}/{MAX_PHASE_SCORE}
                  </span>
                  {" · "}
                  <span className="text-fl-muted">
                    P2 {t.phase_2_marks ?? 0}/{MAX_PHASE_SCORE}
                  </span>
                  {" · "}
                  <span className="font-bold text-fl-red">
                    {scoreFilter === "overall"
                      ? `${t[scoreKey] ?? 0}/${MAX_TOTAL_SCORE}`
                      : `${t[scoreKey] ?? 0}/${MAX_PHASE_SCORE}`}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

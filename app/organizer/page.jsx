"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/http/client";
import PhaseControlCard from "@/components/organizer/PhaseControlCard";
import { formatDeadline, getPhaseDisplayStatus } from "@/lib/phase-control";
import { JUDGE_ROUNDS, normalizeJudgeRound } from "@/lib/judge-rubric";
import ParticipantNotificationsPanel from "@/components/notifications/ParticipantNotificationsPanel";
import { MAX_PHASE_SCORE, MAX_TOTAL_SCORE } from "@/lib/team-scoring";

const PHASE_ORDER = ["phase_1", "phase_2"];

const PHASE_UI = {
  phase_1: { title: "Phase 1", sub: "Build worst system · repo link submission" },
  phase_2: { title: "Phase 2", sub: "Redemption rebuild · repo link submission" }
};

const TABS = [
  { id: "home", label: "Home" },
  { id: "participants", label: "Participants" },
  { id: "judges", label: "Judges" }
];

function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function OrganizerPage() {
  const [tab, setTab] = useState("home");
  const [overview, setOverview] = useState(null);
  const [judgeCtrl, setJudgeCtrl] = useState(null);
  const [notifRefresh, setNotifRefresh] = useState(0);
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState("");
  const [deadlines, setDeadlines] = useState({ phase_1: "", phase_2: "" });
  const [scoreFilter, setScoreFilter] = useState("overall");

  const load = useCallback(async () => {
    try {
      const [ov, jc] = await Promise.all([
        apiFetch("/api/organizer/overview"),
        apiFetch("/api/organizer/judge-control")
      ]);
      setOverview(ov);
      const dl = {};
      for (const name of PHASE_ORDER) {
        const p = (ov.phases || []).find((x) => x.name === name);
        if (p) dl[name] = toLocalInput(p.submission_deadline);
      }
      setDeadlines((prev) => ({ ...prev, ...dl }));
      setJudgeCtrl(jc);
    } catch {
      /* keep last state */
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, [load]);

  const act = async (label, route, payload = {}) => {
    setBusy(label);
    setToast("");
    try {
      await apiFetch(route, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setToast(`✓ ${label}`);
      if (label.includes("Broadcast")) {
        setMsg("");
        setNotifRefresh((n) => n + 1);
      }
      await load();
    } catch (err) {
      setToast(err.message || "Failed");
    } finally {
      setBusy("");
    }
  };

  const startPhase = (phase) =>
    act(`Started ${PHASE_UI[phase]?.title}`, "/api/organizer/phase", { phase, action: "start" });

  const stopPhase = (phase) =>
    act(`Stopped ${PHASE_UI[phase]?.title}`, "/api/organizer/phase", { phase, action: "stop" });

  const saveDeadline = async (phase) => {
    if (!deadlines[phase]) {
      setToast("Pick a date and time first");
      return;
    }
    const label = `Deadline saved — ${PHASE_UI[phase]?.title}`;
    setBusy(label);
    setToast("");
    try {
      await apiFetch("/api/organizer/phase-deadline", {
        method: "POST",
        body: JSON.stringify({ phase, submission_deadline: deadlines[phase] })
      });
      setToast(`✓ ${label}`);
      await load();
    } catch (err) {
      setToast(err.message || "Failed");
    } finally {
      setBusy("");
    }
  };

  const setJudgeRound = (round) => act(`Round: ${round}`, "/api/organizer/judge-control", { judge_round: round });

  const stats = overview?.stats;
  const phases = overview?.phases || [];
  const activeRound = normalizeJudgeRound(judgeCtrl?.judge_round || "visit_1");

  const scoreKey =
    scoreFilter === "phase_1" ? "phase_1_marks" : scoreFilter === "phase_2" ? "phase_2_marks" : "total_marks";
  const rankedTeams = [...(overview?.teams || [])].sort(
    (a, b) => (b[scoreKey] ?? 0) - (a[scoreKey] ?? 0)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Organizer</h1>
      <p className="mt-1 text-sm text-fl-muted">
        Start and stop phases manually. Set link submission deadlines per phase.
      </p>

      <div className="mt-6 flex gap-2 border-b border-fl-border pb-2">
        {TABS.map((t) => (
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
                    <span className="text-fl-muted">P1 {t.phase_1_marks ?? 0}/{MAX_PHASE_SCORE}</span>
                    {" · "}
                    <span className="text-fl-muted">P2 {t.phase_2_marks ?? 0}/{MAX_PHASE_SCORE}</span>
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
      )}

      {tab === "participants" && (
        <div className="mt-8 space-y-8">
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-fl-muted">Phase control</h2>
              <p className="mt-1 text-sm text-fl-muted">
                Set a link submission deadline, then press <strong>Start phase</strong> when ready and{" "}
                <strong>Stop phase</strong> when done. Nothing opens automatically.
              </p>
            </div>

            {PHASE_ORDER.map((name) => {
              const phase = phases.find((p) => p.name === name);
              const ui = PHASE_UI[name];
              return (
                <PhaseControlCard
                  key={name}
                  phaseName={name}
                  title={ui.title}
                  subtitle={ui.sub}
                  phase={phase}
                  deadlineValue={deadlines[name] || ""}
                  onDeadlineChange={(phaseName, value) =>
                    setDeadlines((d) => ({ ...d, [phaseName]: value }))
                  }
                  onStart={startPhase}
                  onStop={stopPhase}
                  onSaveDeadline={saveDeadline}
                  busy={busy}
                />
              );
            })}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-fl-muted">Lunch — codebase swaps</h2>
            <p className="text-sm text-fl-muted">
              Swaps are separate from phase timing. Unlock swaps so teams can see inherited codebases, then start
              Phase 2 submissions when you are ready.
            </p>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => act("Swaps assigned", "/api/organizer/assign-swaps")}
              className="fl-btn-primary w-full py-4"
            >
              1. Assign codebase swaps
            </button>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => act("Swaps unlocked", "/api/organizer/unlock-phase2")}
              className="fl-btn-primary w-full py-4"
            >
              2. Show swaps to teams
            </button>
          </section>

          <section className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
            <div className="fl-card flex flex-col p-4">
              <h2 className="mb-1 text-sm font-bold">Announce to participants</h2>
              <p className="mb-3 text-xs text-fl-muted">
                Sends to everyone&apos;s notification tab instantly.
              </p>
              <textarea
                className="fl-textarea mb-3 min-h-[120px] flex-1"
                rows={4}
                placeholder="e.g. Phase 1 link submissions close in 15 minutes"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <button
                type="button"
                disabled={!msg.trim() || !!busy}
                onClick={() => act("Broadcast", "/api/organizer/notify", { message: msg })}
                className="fl-btn-primary w-full"
              >
                Send to everyone
              </button>
            </div>

            <ParticipantNotificationsPanel
              apiUrl="/api/organizer/notifications"
              embedded
              refreshKey={notifRefresh}
              pollMs={15000}
            />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-fl-muted">Teams</h2>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {(overview?.teams || []).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-fl-border bg-fl-bg2 px-4 py-3 text-sm"
                >
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-fl-muted">{t.tracks?.name || "—"}</span>
                  <span className="font-mono text-xs text-fl-muted">
                    P1 {t.phase_1_marks ?? 0}/{MAX_PHASE_SCORE} + P2 {t.phase_2_marks ?? 0}/{MAX_PHASE_SCORE} ={" "}
                    <span className="text-fl-red">{t.total_marks ?? 0}/{MAX_TOTAL_SCORE}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "judges" && (
        <div className="mt-8 space-y-8">
          <section className="fl-card p-4">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-fl-muted">
              Active judge round
            </h2>
            <p className="mb-4 text-sm text-fl-muted">
              Each round scores out of 100 (visit 1, visit 2, final pitch). Phase total = sum of those
              three (max {MAX_PHASE_SCORE}). One judge per team per round. Overall max {MAX_TOTAL_SCORE}.
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
      )}
    </div>
  );
}

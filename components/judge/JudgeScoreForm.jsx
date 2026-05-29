"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { computeTotalScore, getRubric } from "@/lib/judge-rubric";
import { MAX_ROUND_SCORE } from "@/lib/team-scoring";

function shortId(uuid) {
  return uuid ? uuid.slice(0, 8) : "";
}

export default function JudgeScoreForm({ phaseName }) {
  const [tracks, setTracks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [trackId, setTrackId] = useState("all");
  const [teamId, setTeamId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [activeRound, setActiveRound] = useState("visit_1");
  const [roundLabel, setRoundLabel] = useState("In-person visit 1");
  const [scoringOpen, setScoringOpen] = useState(true);
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [ctxReady, setCtxReady] = useState(false);

  const rubric = useMemo(() => getRubric(phaseName, activeRound), [phaseName, activeRound]);

  const loadContext = useCallback(async () => {
    try {
      const res = await fetch("/api/judge/context");
      const d = await res.json();
      if (!res.ok) return;

      setTracks(d.tracks || []);
      const round = d.active_round || "visit_1";
      setActiveRound(round);
      setScoringOpen(d.scoring_open !== false);
      const roundMeta = (d.rounds || []).find((r) => r.value === round);
      setRoundLabel(roundMeta?.label || round);
      const phase = (d.phases || []).find((p) => p.name === phaseName);
      if (phase) setPhaseId(phase.id);
    } finally {
      setCtxReady(true);
    }
  }, [phaseName]);

  useEffect(() => {
    loadContext();
    const id = setInterval(loadContext, 20000);
    return () => clearInterval(id);
  }, [loadContext]);

  useEffect(() => {
    if (!phaseId) return;
    const params = new URLSearchParams({
      track_id: trackId && trackId !== "all" ? trackId : "all",
      phase_id: phaseId,
      round: activeRound
    });
    fetch(`/api/judge/teams?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setTeams(d.teams || []);
        setTeamId("");
      });
  }, [trackId, phaseId, activeRound]);

  useEffect(() => {
    const init = {};
    for (const f of rubric) init[f.key] = "";
    setScores(init);
  }, [rubric]);

  const totalPreview = useMemo(() => computeTotalScore(scores, rubric), [scores, rubric]);

  const submit = async (e) => {
    e.preventDefault();
    if (!teamId) {
      setResult("Select a team.");
      return;
    }
    const picked = teams.find((t) => t.id === teamId);
    if (picked?.judged) {
      setResult("This team was already judged for this round.");
      return;
    }
    setLoading(true);
    setResult("");
    const res = await fetch("/api/judge/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_id: teamId,
        phase_id: phaseId,
        round: activeRound,
        scores,
        notes
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setResult(data.error);
    else {
      setResult(`Saved · ${data.score ?? totalPreview}/${MAX_ROUND_SCORE}`);
      setNotes("");
      const init = {};
      for (const f of rubric) init[f.key] = "";
      setScores(init);
    }
  };

  return (
    <form onSubmit={submit} className="fl-card w-full p-5">
      <div className="mb-4 flex w-full items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase text-fl-muted">Current round</span>
        <span className="shrink-0 rounded-full bg-fl-red/15 px-2.5 py-1 text-xs font-bold text-fl-red">
          {roundLabel}
        </span>
      </div>
      {!scoringOpen && (
        <p className="mb-4 rounded-md bg-fl-amber/10 px-3 py-2 text-xs text-fl-amber">
          Scoring paused by organizer.
        </p>
      )}

      <label className="mb-1 block font-mono text-[10px] text-fl-muted">
        Filter by track (optional)
      </label>
      <select
        className="fl-input mb-3 w-full"
        value={trackId}
        onChange={(e) => setTrackId(e.target.value)}
      >
        <option value="all">All teams — every track</option>
        {tracks.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <label className="mb-1 block font-mono text-[10px] text-fl-muted">Team</label>
      <select
        className="fl-input mb-4 w-full"
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        required
        disabled={!teams.length}
      >
        <option value="">{ctxReady ? "Select team…" : "Loading teams…"}</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id} disabled={t.judged}>
            {shortId(t.id)} — {t.name}
            {t.tracks?.name ? ` [${t.tracks.name}]` : ""}
            {t.judged ? " — already judged" : ""}
          </option>
        ))}
      </select>

      <div className="mb-4 w-full space-y-3">
        <div className="text-xs font-bold uppercase text-fl-muted">Marks (0–10 each)</div>
        {rubric.map((field) => (
          <div key={field.key} className="w-full">
            <label className="mb-1 block text-xs font-semibold leading-tight">{field.label}</label>
            <input
              type="number"
              min={0}
              max={field.max}
              step={1}
              inputMode="numeric"
              className="fl-input mb-0 w-full"
              placeholder="0–10"
              value={scores[field.key] ?? ""}
              onChange={(e) => setScores((s) => ({ ...s, [field.key]: e.target.value }))}
              required
              disabled={!scoringOpen}
            />
          </div>
        ))}
      </div>

      <div className="mb-4 w-full text-center font-mono text-lg">
        Total <span className="font-extrabold text-fl-red">{totalPreview}</span>
        <span className="text-fl-muted">/100</span>
      </div>

      <label className="mb-1 block font-mono text-[10px] text-fl-muted">Notes (optional)</label>
      <textarea
        className="fl-textarea mb-4 w-full"
        rows={2}
        placeholder="Quick note…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={!scoringOpen}
      />

      <button
        type="submit"
        className="fl-btn-primary w-full py-3 text-base"
        disabled={loading || !scoringOpen || !teamId}
      >
        {loading ? "Saving…" : "Save marks"}
      </button>

      {result && (
        <p className={`mt-3 text-center text-sm ${result.startsWith("Saved") ? "text-fl-green" : "text-fl-red"}`}>
          {result}
        </p>
      )}
    </form>
  );
}

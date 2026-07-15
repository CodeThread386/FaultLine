"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { computeTotalScore } from "@/lib/judge-rubric";
import { MAX_ROUND_SCORE } from "@/lib/team-scoring";
import { apiFetch } from "@/lib/http/client";
import { PHASE_UI } from "@/components/organizer/useOrganizerConsole";

function RoundForm({ phaseName, phaseId, round, rubric, existingReview, teamId, onSaved }) {
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const init = {};
    for (const f of rubric) {
      init[f.key] = existingReview?.scores?.[f.key] ?? "";
    }
    setScores(init);
    setNotes(existingReview?.notes || "");
    setExpanded(false);
  }, [rubric, existingReview]);

  const totalPreview = useMemo(() => computeTotalScore(scores, rubric), [scores, rubric]);
  const hasScore = Boolean(existingReview?.score != null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const data = await apiFetch("/api/organizer/marking/review", {
        method: "POST",
        body: JSON.stringify({
          team_id: teamId,
          phase_id: phaseId,
          round: round.value,
          scores,
          notes
        })
      });
      setResult(`Saved · ${data.score ?? totalPreview}/${MAX_ROUND_SCORE}`);
      onSaved?.();
    } catch (err) {
      setResult(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-fl-border bg-fl-bg2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm"
      >
        <span className="font-semibold">{round.label}</span>
        <span className="flex items-center gap-2">
          {hasScore && (
            <span className="fl-status-open px-2 py-0.5">
              {existingReview.score}/{MAX_ROUND_SCORE}
            </span>
          )}
          <span className="text-fl-muted">{expanded ? "▾" : "▸"}</span>
        </span>
      </button>

      {expanded && (
        <form onSubmit={submit} className="border-t border-fl-border px-4 pb-4 pt-3">
          <div className="mb-3 space-y-3">
            {rubric.map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-xs font-semibold">{field.label}</label>
                <input
                  type="number"
                  min={0}
                  max={field.max}
                  step={1}
                  inputMode="numeric"
                  className="fl-input w-full"
                  placeholder={`0–${field.max}`}
                  value={scores[field.key] ?? ""}
                  onChange={(e) => setScores((s) => ({ ...s, [field.key]: e.target.value }))}
                  required
                />
              </div>
            ))}
          </div>

          <div className="mb-3 text-center font-mono text-sm">
            Total <span className="font-extrabold text-fl-accent">{totalPreview}</span>
            <span className="text-fl-muted">/{MAX_ROUND_SCORE}</span>
          </div>

          <label className="mb-1 block font-mono text-[10px] text-fl-muted">Notes (optional)</label>
          <textarea
            className="fl-textarea mb-3 w-full"
            rows={2}
            placeholder="Quick note…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit" className="fl-btn-primary w-full py-2 text-sm" disabled={loading}>
            {loading ? "Saving…" : hasScore ? "Update marks" : "Save marks"}
          </button>

          {result && (
            <p
              className={`mt-2 text-center text-xs ${result.startsWith("Saved") ? "text-fl-success" : "text-fl-accent"}`}
            >
              {result}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default function OrganizerTeamMarks({ team, trackName, onBack, onSaved }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/organizer/marking/team?team_id=${team.id}`);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [team.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = () => {
    load();
    onSaved?.();
  };

  if (loading) {
    return (
      <div className="mt-8">
        <button type="button" onClick={onBack} className="mb-4 text-sm font-semibold text-fl-muted">
          ← Back to teams
        </button>
        <p className="text-sm text-fl-muted">Loading marks…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-8">
        <button type="button" onClick={onBack} className="mb-4 text-sm font-semibold text-fl-muted">
          ← Back to teams
        </button>
        <p className="text-sm text-fl-red">Could not load team marks.</p>
      </div>
    );
  }

  const phases = data.phases || [];
  const roundsByPhase = data.rounds || {};

  return (
    <div className="mt-8 space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-fl-muted hover:text-fl-text">
        ← Back to {trackName || "teams"}
      </button>

      <div>
        <h2 className="fl-display text-xl">{team.name}</h2>
        {trackName && <p className="text-sm text-fl-muted">{trackName}</p>}
      </div>

      {phases.map((phase) => {
        const ui = PHASE_UI[phase.name];
        const rounds = roundsByPhase[phase.name] || [];
        return (
          <section key={phase.id} className="fl-card p-4">
            <h3 className="mb-1 font-bold">{ui?.title || phase.name}</h3>
            <p className="mb-4 text-xs text-fl-muted">{ui?.sub}</p>
            <div className="space-y-2">
              {rounds.map((round) => (
                <RoundForm
                  key={`${phase.name}:${round.value}`}
                  phaseName={phase.name}
                  phaseId={phase.id}
                  round={round}
                  rubric={round.rubric}
                  existingReview={round.review}
                  teamId={team.id}
                  onSaved={handleSaved}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

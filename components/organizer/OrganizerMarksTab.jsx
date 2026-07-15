"use client";

import { useCallback, useEffect, useState } from "react";
import { MAX_PHASE_SCORE, MAX_ROUND_SCORE } from "@/lib/team-scoring";
import { apiFetch } from "@/lib/http/client";
import OrganizerTeamMarks from "@/components/organizer/OrganizerTeamMarks";

export default function OrganizerMarksTab({ tracks = [], onSaved }) {
  const [view, setView] = useState("tracks");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTeams = useCallback(async (trackId) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/organizer/marking/teams?track_id=${trackId}`);
      setTeams(data.teams || []);
    } catch {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "teams" && selectedTrack?.id) {
      loadTeams(selectedTrack.id);
    }
  }, [view, selectedTrack, loadTeams]);

  const openTrack = (track) => {
    setSelectedTrack(track);
    setSelectedTeam(null);
    setView("teams");
  };

  const openTeam = (team) => {
    setSelectedTeam(team);
    setView("marks");
  };

  const goBack = () => {
    if (view === "marks") {
      setSelectedTeam(null);
      setView("teams");
      if (selectedTrack?.id) loadTeams(selectedTrack.id);
      onSaved?.();
    } else if (view === "teams") {
      setSelectedTrack(null);
      setTeams([]);
      setView("tracks");
    }
  };

  if (view === "marks" && selectedTeam) {
    return (
      <OrganizerTeamMarks
        team={selectedTeam}
        trackName={selectedTrack?.name}
        onBack={goBack}
        onSaved={() => {
          onSaved?.();
          if (selectedTrack?.id) loadTeams(selectedTrack.id);
        }}
      />
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {view !== "tracks" && (
        <button
          type="button"
          onClick={goBack}
          className="text-sm font-semibold text-fl-muted hover:text-fl-text"
        >
          ← Back
        </button>
      )}

      {view === "tracks" && (
        <section className="fl-card p-4">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-fl-muted">Enter marks</h2>
          <p className="mb-4 text-sm text-fl-muted">
            Select a track, then a team. Score each phase across 3 rounds (visit 1, visit 2, final
            pitch). Each round is out of {MAX_ROUND_SCORE}; phase total max {MAX_PHASE_SCORE}.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {tracks.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => openTrack(track)}
                className="rounded-sm border border-fl-border bg-fl-bg2 px-4 py-5 text-left transition hover:border-fl-accent hover:bg-fl-bg3"
              >
                <div className="font-bold">{track.name}</div>
                <div className="mt-1 text-xs text-fl-muted">View teams →</div>
              </button>
            ))}
          </div>
          {tracks.length === 0 && (
            <p className="text-sm text-fl-muted">No tracks configured yet.</p>
          )}
        </section>
      )}

      {view === "teams" && selectedTrack && (
        <section className="fl-card p-4">
          <h2 className="mb-1 text-lg font-bold">{selectedTrack.name}</h2>
          <p className="mb-4 text-sm text-fl-muted">Select a team to enter or edit marks.</p>

          {loading && <p className="text-sm text-fl-muted">Loading teams…</p>}

          {!loading && teams.length === 0 && (
            <p className="text-sm text-fl-muted">No registered teams on this track.</p>
          )}

          <ul className="space-y-2">
            {teams.map((team) => (
              <li key={team.id}>
                <button
                  type="button"
                  onClick={() => openTeam(team)}
                  className="flex w-full items-center justify-between rounded-sm border border-fl-border bg-fl-bg2 px-4 py-3 text-left text-sm transition hover:border-fl-accent"
                >
                  <span className="font-semibold">{team.name}</span>
                  <span
                    className={`rounded-sm px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-caption ${
                      team.fully_scored
                        ? "fl-status-open"
                        : team.scored_rounds > 0
                          ? "fl-status-pending"
                          : "bg-fl-bg3 text-fl-muted"
                    }`}
                  >
                    {team.scored_rounds ?? 0}/{team.total_rounds ?? 6} scored
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

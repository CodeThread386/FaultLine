"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/http/client";
import { DEMO_MODE } from "@/lib/demo";
import { getTrackMeta } from "@/lib/tracks-meta";

export default function RegisterTeamPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [trackId, setTrackId] = useState("");
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [memberRows, setMemberRows] = useState([{ email: "" }]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      router.replace("/dashboard");
      return;
    }

    apiFetch("/api/tracks")
      .then((d) => setTracks(d.tracks || []))
      .catch((err) => setResult(err.message || "Could not load tracks."))
      .finally(() => setTracksLoading(false));

    apiFetch("/api/team")
      .then((d) => {
        if (d.team?.registered) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  const addMember = () => setMemberRows([...memberRows, { email: "" }]);

  const removeMember = (index) => {
    if (memberRows.length <= 1) return;
    setMemberRows(memberRows.filter((_, i) => i !== index));
  };

  const updateMember = (index, email) => {
    const next = [...memberRows];
    next[index] = { email };
    setMemberRows(next);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!trackId) {
      setResult("Select a track.");
      return;
    }
    setLoading(true);
    setResult("");
    const member_emails = memberRows.map((r) => r.email.trim().toLowerCase()).filter(Boolean);
    try {
      await apiFetch("/api/team", {
        method: "POST",
        body: JSON.stringify({ name, track_id: trackId, member_emails })
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setResult(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl px-10 py-10">
      <p className="fl-label mb-2">Registration</p>
      <h1 className="text-[28px] font-extrabold tracking-tight">Register Your Team</h1>
      <p className="mt-2 text-sm text-fl-muted">Team leader only · 3–5 members · VIT emails</p>

      <div className="mt-6 rounded-lg border border-fl-border border-l-[3px] border-l-fl-red bg-fl-bg2 p-5 text-sm leading-relaxed text-fl-muted">
        One-time setup. Add teammate emails now or they can join after their first login. You can
        remove a row if you added it by mistake.
      </div>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <div>
          <label className="mb-2 block font-mono text-xs text-fl-muted">Team Name</label>
          <input
            className="fl-input"
            placeholder="Team NullPointers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="fl-block-title">Choose Track</div>
          {tracksLoading && (
            <p className="text-sm text-fl-muted">Loading tracks…</p>
          )}
          {!tracksLoading && tracks.length === 0 && (
            <p className="text-sm text-fl-red">
              No tracks available. Ask organizers to run seed.sql or update_tracks.sql in Supabase.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {tracks.map((track) => {
              const meta = getTrackMeta(track.name);
              const selected = trackId === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setTrackId(track.id)}
                  className={`rounded-lg border p-4 text-center transition ${
                    selected
                      ? "border-fl-red bg-fl-red/5"
                      : "border-fl-border bg-fl-bg2 hover:border-fl-muted"
                  }`}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <div className="mt-2 text-xs font-bold">{track.name}</div>
                  <div className="mt-1 text-[10px] text-fl-muted">{meta.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="fl-block-title">Teammate emails</div>
          {memberRows.map((row, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input
                className="fl-input mb-0 flex-1"
                type="email"
                placeholder={`teammate${i + 1}@example.com`}
                value={row.email}
                onChange={(e) => updateMember(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeMember(i)}
                disabled={memberRows.length <= 1}
                className="shrink-0 rounded-md border border-fl-border px-3 text-sm text-fl-muted transition hover:border-fl-red hover:text-fl-red disabled:cursor-not-allowed disabled:opacity-30"
                title="Remove teammate"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMember}
            className="w-full rounded-md border border-dashed border-fl-border py-2.5 text-sm text-fl-muted transition hover:border-fl-red hover:text-fl-red"
          >
            + Add teammate
          </button>
        </div>

        <button type="submit" className="fl-btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register Team"}
        </button>
        {result && <p className="text-sm text-fl-red">{result}</p>}
      </form>
    </div>
  );
}

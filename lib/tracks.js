import { TRACKS, TRACK_SPECS } from "@/lib/tracks-meta";

/** Canonical FaultLine tracks — exact names only */
export { TRACKS };

export function isCanonicalTrackName(name) {
  return TRACKS.includes(name);
}

/** Filter to the 5 event tracks and preserve this display order */
export function sortCanonicalTracks(tracks = []) {
  const byName = new Map((tracks || []).filter((t) => isCanonicalTrackName(t.name)).map((t) => [t.name, t]));
  return TRACKS.map((name) => byName.get(name)).filter(Boolean);
}

/** Read canonical tracks only — does not mutate DB (use ensureCanonicalTracks to seed). */
export async function loadCanonicalTracks(db) {
  const { data, error } = await db.from("tracks").select("*").in("name", TRACKS);
  if (error) throw error;
  return sortCanonicalTracks(data || []);
}

/** Upsert all 5 event tracks (migrations / repair) */
export async function ensureCanonicalTracks(db) {
  const rows = TRACKS.map((name) => ({
    name,
    functional_spec: TRACK_SPECS[name]
  }));

  const { error } = await db.from("tracks").upsert(rows, { onConflict: "name" });
  if (error) throw new Error(error.message);

  const { data, error: readError } = await db.from("tracks").select("*").in("name", TRACKS);
  if (readError) throw new Error(readError.message);

  return sortCanonicalTracks(data || []);
}

import { withApiRoute } from "@/lib/api-route";
import { getEventSettings } from "@/lib/event-settings";
import { getRubric, JUDGE_ROUNDS } from "@/lib/judge-rubric";
import { sortCanonicalTracks } from "@/lib/tracks";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ session, db }) => {
    const settings = await getEventSettings(db);
    const activeRound = settings.judge_round || "visit_1";

    const [{ data: tracks }, { data: phases }, { data: judge }] = await Promise.all([
      db.from("tracks").select("id, name, functional_spec"),
      db.from("phases").select("id, name, status").in("name", ["phase_1", "phase_2"]),
      db.from("users").select("track_id").eq("id", session.user.id).maybeSingle()
    ]);

    return {
      judge_track_id: judge?.track_id ?? null,
      rounds: JUDGE_ROUNDS,
      active_round: activeRound,
      scoring_open: settings.judge_scoring_open !== false,
      tracks: sortCanonicalTracks(tracks || []),
      phases: phases || [],
      rubric: {
        phase_1: getRubric("phase_1", activeRound),
        phase_2: getRubric("phase_2", activeRound)
      }
    };
  },
  { role: "judge", limit: 60 }
);

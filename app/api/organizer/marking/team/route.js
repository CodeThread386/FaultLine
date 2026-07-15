import { ApiError, withApiRoute } from "@/lib/api-route";
import { getRubric, JUDGE_ROUNDS } from "@/lib/judge-rubric";
import { getTeamReviews, toCanonicalRound } from "@/lib/review-round";
import { isValidUuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ req, db }) => {
    const teamId = req.nextUrl.searchParams.get("team_id");
    if (!isValidUuid(teamId)) throw new ApiError("Invalid team", 400);

    const [{ data: team, error: teamErr }, { data: phases }] = await Promise.all([
      db
        .from("teams")
        .select("id, name, registered, track_id, tracks(name)")
        .eq("id", teamId)
        .maybeSingle(),
      db.from("phases").select("id, name, status").in("name", ["phase_1", "phase_2"])
    ]);

    if (teamErr) throw new Error(teamErr.message);
    if (!team?.id) throw new ApiError("Team not found", 404);

    const reviews = await getTeamReviews(db, teamId);
    const reviewByKey = {};
    for (const r of reviews) {
      const phase = (phases || []).find((p) => p.id === r.phase_id);
      if (!phase) continue;
      const round = toCanonicalRound(r.round);
      reviewByKey[`${phase.name}:${round}`] = {
        id: r.id,
        score: r.score,
        scores: r.scores || {},
        notes: r.notes || "",
        round,
        submitted_at: r.submitted_at
      };
    }

    const rounds = {};
    for (const phase of phases || []) {
      rounds[phase.name] = JUDGE_ROUNDS.map((r) => ({
        ...r,
        rubric: getRubric(phase.name, r.value),
        review: reviewByKey[`${phase.name}:${r.value}`] || null
      }));
    }

    return {
      team,
      phases: phases || [],
      rounds
    };
  },
  { role: "organizer" }
);

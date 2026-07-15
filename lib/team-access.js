import { getMembershipForUser } from "@/lib/participant-data";

/** Ensure the user belongs to the team before reading/writing team-scoped data. */
export async function assertUserTeamAccess(userId, teamId) {
  if (!userId || !teamId) {
    return { ok: false, error: "Forbidden", status: 403 };
  }

  const membership = await getMembershipForUser(userId);
  if (!membership?.team_id || membership.team_id !== teamId) {
    return { ok: false, error: "Forbidden", status: 403 };
  }

  return { ok: true, membership, team: membership.teams };
}

/** Organizer can score any registered team. */
export async function assertOrganizerCanScoreTeam(db, teamId) {
  const { data: team } = await db
    .from("teams")
    .select("id, registered, track_id")
    .eq("id", teamId)
    .maybeSingle();

  if (!team?.id || !team.registered) {
    return { ok: false, error: "Team not found", status: 404 };
  }

  return { ok: true, team };
}

/**
 * @deprecated Judges removed — use assertOrganizerCanScoreTeam.
 */
export async function assertJudgeCanScoreTeam(db, teamId, { judgeId, round } = {}) {
  const { data: team } = await db
    .from("teams")
    .select("id, registered, track_id")
    .eq("id", teamId)
    .maybeSingle();

  if (!team?.id || !team.registered) {
    return { ok: false, error: "Team not found", status: 404 };
  }

  const isFinalsRound = round === "final_pitch";
  if (!isFinalsRound && judgeId) {
    const { data: judge } = await db
      .from("users")
      .select("track_id")
      .eq("id", judgeId)
      .maybeSingle();

    if (judge?.track_id && team.track_id !== judge.track_id) {
      return {
        ok: false,
        error: "This team is outside your assigned track.",
        status: 403
      };
    }
  }

  return { ok: true, team };
}

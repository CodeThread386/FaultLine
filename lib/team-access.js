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

/** Judges may score any registered team (track filter is UI-only). */
export async function assertJudgeCanScoreTeam(db, teamId) {
  const { data: team } = await db
    .from("teams")
    .select("id, registered")
    .eq("id", teamId)
    .maybeSingle();

  if (!team?.id || !team.registered) {
    return { ok: false, error: "Team not found", status: 404 };
  }

  return { ok: true };
}

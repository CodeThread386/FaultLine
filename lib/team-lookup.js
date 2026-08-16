// lib/team-lookup.js
//
// Replaces the old lib/participant-emails.js hardcoded list.
// Looks up whether an email belongs to a registered user, and whether
// their team has been approved (teams.registered = true) yet.

export async function getMembershipByEmail(db, email) {
  const normalized = email?.toLowerCase()?.trim();
  if (!normalized) return null;

  const { data: user, error } = await db
    .from("users")
    .select(
      `
      id,
      name,
      email,
      track_id,
      team_members (
        team_id,
        teams (
          id,
          name,
          registered
        )
      )
    `
    )
    .eq("email", normalized)
    .maybeSingle();

  if (error) {
    console.error("getMembershipByEmail error:", error);
    return null;
  }

  return user;
}
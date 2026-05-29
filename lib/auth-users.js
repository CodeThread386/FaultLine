import { isAllowedParticipantEmail } from "@/lib/env";
import { pickPrimaryRole } from "@/lib/roles";

/**
 * Find or create user from Google OAuth profile.
 * Only @vitstudent.ac.in (or AUTH_ALLOWED_EMAIL_DOMAIN) may sign in.
 */
export async function upsertUserFromGoogle(db, profile) {
  const email = profile?.email?.toLowerCase()?.trim();
  if (!email || !isAllowedParticipantEmail(email)) {
    return { error: "Only VIT student emails are allowed for this event." };
  }

  const name = profile.name || email.split("@")[0];

  let { data: user } = await db.from("users").select("id, name, email, role").eq("email", email).maybeSingle();

  if (!user) {
    const { data: created, error } = await db
      .from("users")
      .insert({ email, name, role: "participant" })
      .select("id, name, email, role")
      .single();

    if (error) return { error: error.message };
    user = created;

    await db.from("user_roles").upsert(
      { user_id: user.id, role: "participant" },
      { onConflict: "user_id,role" }
    );
  }

  const { data: roleRows } = await db.from("user_roles").select("role").eq("user_id", user.id);
  const roles = (roleRows || []).map((r) => r.role);
  if (!roles.length && user.role) roles.push(user.role);
  if (!roles.length) {
    return { error: "Account has no assigned role. Contact organizers." };
  }

  return {
    user: {
      id: user.id,
      name: user.name || name,
      email: user.email,
      role: pickPrimaryRole(roles),
      roles,
      loginNumber: null
    }
  };
}

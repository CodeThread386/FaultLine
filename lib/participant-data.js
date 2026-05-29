import { filterEventPhases } from "@/lib/phase-control";
import { getSupabaseServerClient } from "@/lib/supabase";

const TEAM_MEMBER_SELECT =
  "team_id, teams(id, name, registered, track_id, leader_id, tracks(id, name, functional_spec))";

export async function getMembershipForUser(userId) {
  const db = getSupabaseServerClient();
  const { data, error } = await db
    .from("team_members")
    .select(TEAM_MEMBER_SELECT)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const { data: ledTeam, error: ledErr } = await db
    .from("teams")
    .select("id, name, registered, track_id, leader_id, tracks(id, name, functional_spec)")
    .eq("leader_id", userId)
    .eq("registered", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ledErr) throw ledErr;
  if (!ledTeam) return null;

  return {
    team_id: ledTeam.id,
    teams: ledTeam
  };
}

/** Call after team registration — not on read paths. */
export async function ensureLeaderTeamMembership(db, leaderId, teamId) {
  await db.from("team_members").upsert(
    { team_id: teamId, user_id: leaderId },
    { onConflict: "team_id,user_id" }
  );
}

export async function getTeamForUser(userId) {
  const membership = await getMembershipForUser(userId);
  return membership?.teams || null;
}

export async function requireRegisteredTeam(userId) {
  const membership = await getMembershipForUser(userId);
  if (!membership?.team_id) return { error: "Team not found", status: 404 };
  if (!membership.teams?.registered) {
    return { error: "Team registration incomplete", status: 403 };
  }
  return { membership, team: membership.teams, teamId: membership.team_id };
}

export async function getTeamMembers(teamId) {
  if (!teamId) return [];
  const db = getSupabaseServerClient();
  const { data } = await db
    .from("team_members")
    .select("user_id, users(id, name, email)")
    .eq("team_id", teamId);

  return (data || []).map((row) => row.users).filter(Boolean);
}

export async function getPhases() {
  const db = getSupabaseServerClient();
  const { data } = await db
    .from("phases")
    .select("*")
    .in("name", ["phase_1", "phase_2"])
    .order("name");
  return filterEventPhases(data);
}

export async function getSwapForTeam(teamId) {
  if (!teamId) return { unlocked: false };
  const db = getSupabaseServerClient();

  const { data: phase1 } = await db.from("phases").select("id").eq("name", "phase_1").maybeSingle();

  const { data: swap } = await db
    .from("swaps")
    .select("*")
    .eq("receiving_team_id", teamId)
    .order("id")
    .limit(1)
    .maybeSingle();

  if (!swap?.unlocked) return { unlocked: false };

  let submissionQuery = db
    .from("submissions")
    .select("repo_url, description")
    .eq("team_id", swap.assigned_team_id);

  if (phase1?.id) {
    submissionQuery = submissionQuery.eq("phase_id", phase1.id);
  }

  const { data: submission } = await submissionQuery.maybeSingle();

  return {
    unlocked: true,
    repo_url: submission?.repo_url || null,
    description: submission?.description || null
  };
}

export async function getSubmission(teamId, phaseName) {
  if (!teamId) return null;
  const db = getSupabaseServerClient();
  const { data: phase } = await db.from("phases").select("id").eq("name", phaseName).maybeSingle();
  if (!phase) return null;

  const { data } = await db
    .from("submissions")
    .select("*")
    .eq("team_id", teamId)
    .eq("phase_id", phase.id)
    .maybeSingle();

  return data;
}

export async function getUnreadNotificationCount(userId) {
  const db = getSupabaseServerClient();
  const { count: total } = await db
    .from("notifications")
    .select("*", { count: "exact", head: true });

  if (!total) return 0;

  const { count: read } = await db
    .from("notification_reads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return Math.max(0, (total || 0) - (read || 0));
}

export async function getNotificationsForUser(userId, limit = 100) {
  const db = getSupabaseServerClient();

  const { data: rows, error } = await db.rpc("get_notifications_for_user", {
    p_user_id: userId,
    p_limit: limit
  });

  if (!error && rows) {
    return rows.map((n) => ({
      id: n.id,
      message: n.message,
      created_at: n.created_at,
      read: Boolean(n.read)
    }));
  }

  const { data: notifications } = await db
    .from("notifications")
    .select("id, message, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!notifications?.length) return [];

  const ids = notifications.map((n) => n.id);
  const { data: reads } = await db
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", userId)
    .in("notification_id", ids);

  const readIds = new Set((reads || []).map((r) => r.notification_id));

  return notifications.map((n) => ({
    ...n,
    read: readIds.has(n.id)
  }));
}

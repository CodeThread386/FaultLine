import { ApiError, withApiRoute } from "@/lib/api-route";
import { writeAudit } from "@/lib/audit";
import { parseJsonBody, isValidUuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const { data: roleRows, error: roleErr } = await db
      .from("user_roles")
      .select("user_id")
      .eq("role", "judge");

    if (roleErr) throw new Error(roleErr.message);

    const ids = (roleRows || []).map((r) => r.user_id);
    if (!ids.length) return { judges: [] };

    const { data: judges, error } = await db
      .from("users")
      .select("id, name, email, track_id, tracks(id, name)")
      .in("id", ids);

    if (error) throw new Error(error.message);

    const list = (judges || []).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return { judges: list };
  },
  { role: "admin", limit: 60 }
);

export const PATCH = withApiRoute(
  async ({ req, session, db }) => {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    const userId = body.user_id;
    const trackId = body.track_id;

    if (!isValidUuid(userId)) throw new ApiError("user_id is required", 400);
    if (trackId !== null && trackId !== undefined && !isValidUuid(trackId)) {
      throw new ApiError("Invalid track_id", 400);
    }

    const { data: roleRow } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "judge")
      .maybeSingle();

    if (!roleRow) throw new ApiError("User is not a judge", 404);

    const { data: updated, error } = await db
      .from("users")
      .update({ track_id: trackId || null })
      .eq("id", userId)
      .select("id, name, email, track_id, tracks(id, name)")
      .single();

    if (error) throw new ApiError(error.message, 400);

    await writeAudit(db, {
      actorId: session.user.id,
      action: "judge.track_assign",
      payload: { user_id: userId, track_id: trackId || null }
    });

    return { judge: updated };
  },
  { role: "admin", limit: 30 }
);

import { ApiError, withApiRoute } from "@/lib/api-route";
import { writeAudit } from "@/lib/audit";
import { deleteAllNotifications, deleteNotificationById } from "@/lib/notifications";
import { isValidUuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

/** Same payload shape as GET /api/notifications (participant tab). */
export const GET = withApiRoute(
  async ({ db }) => {
    const { data: notifications, error } = await db
      .from("notifications")
      .select("id, message, created_at, sent_by, users(name, email)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    const list = (notifications || []).map((n) => ({
      id: n.id,
      message: n.message,
      created_at: n.created_at,
      read: false
    }));

    return {
      notifications: list,
      unread_count: list.length
    };
  },
  { role: "admin", limit: 60 }
);

/** DELETE ?id=<uuid> — one notification. DELETE ?all=1 — clear entire feed. */
export const DELETE = withApiRoute(
  async ({ req, session, db }) => {
    const all =
      req.nextUrl.searchParams.get("all") === "1" ||
      req.nextUrl.searchParams.get("all") === "true";

    if (all) {
      const deleted = await deleteAllNotifications(db);
      await writeAudit(db, {
        actorId: session.user.id,
        action: "notifications.clear_all",
        payload: { deleted }
      });
      return { deleted, cleared: true };
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!isValidUuid(id)) {
      throw new ApiError("Valid notification id required (or use ?all=1)", 400);
    }

    const { data: existing } = await db.from("notifications").select("id").eq("id", id).maybeSingle();
    if (!existing) throw new ApiError("Notification not found", 404);

    await deleteNotificationById(db, id);
    await writeAudit(db, {
      actorId: session.user.id,
      action: "notifications.delete",
      payload: { id }
    });
    return { deleted: 1, id };
  },
  { role: "admin", limit: 30 }
);

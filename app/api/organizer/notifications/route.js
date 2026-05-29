import { withApiRoute } from "@/lib/api-route";

export const dynamic = "force-dynamic";

/** Same payload shape as GET /api/notifications (participant tab). */
export const GET = withApiRoute(
  async ({ db }) => {
    const { data: notifications, error } = await db
      .from("notifications")
      .select("id, message, created_at")
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
  { role: "organizer", limit: 60 }
);

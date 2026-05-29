import { getNotificationsForUser } from "@/lib/participant-data";
import { withApiRoute } from "@/lib/api-route";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ session }) => {
    const notifications = await getNotificationsForUser(session.user.id);
    const unread_count = notifications.filter((n) => !n.read).length;
    return { notifications, unread_count };
  },
  { limit: 120 }
);

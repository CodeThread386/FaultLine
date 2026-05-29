import { ApiError, withApiRoute } from "@/lib/api-route";
import { isValidUuid, parseJsonBody } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(async ({ req, session, db }) => {
  let body = {};
  try {
    body = await parseJsonBody(req);
  } catch {
    body = {};
  }

  const userId = session.user.id;

  if (body.notification_id) {
    if (!isValidUuid(body.notification_id)) {
      throw new ApiError("Invalid notification id", 400);
    }
    await db.from("notification_reads").upsert(
      { notification_id: body.notification_id, user_id: userId },
      { onConflict: "notification_id,user_id" }
    );
    return {};
  }

  const { data: notifications } = await db.from("notifications").select("id");
  const rows = (notifications || []).map((n) => ({
    notification_id: n.id,
    user_id: userId
  }));
  if (rows.length) {
    await db.from("notification_reads").upsert(rows, { onConflict: "notification_id,user_id" });
  }

  return { marked: rows.length };
});

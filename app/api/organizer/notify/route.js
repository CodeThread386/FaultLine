import { ApiError, withApiRoute } from "@/lib/api-route";
import { writeAudit } from "@/lib/audit";
import { parseJsonBody, sanitizeText } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ req, session, db }) => {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    const message = sanitizeText(body.message, 500);
    if (!message) throw new ApiError("message is required", 400);

    await db.from("notifications").insert({ message, sent_by: session.user.id });
    await db.from("activity_feed").insert({
      message: `Organizer broadcast: ${message}`,
      public: true
    });

    await writeAudit(db, {
      actorId: session.user.id,
      action: "notify.broadcast",
      payload: { message_preview: message.slice(0, 120) }
    });

    return {};
  },
  { role: "organizer", limit: 30 }
);

import { withApiRoute } from "@/lib/api-route";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ session, db }) => {
    await db.from("swaps").update({ unlocked: true }).not("id", "is", null);

    await db.from("notifications").insert({
      message: "Your Phase 2 codebase swap is ready. Check the Phase 2 tab.",
      sent_by: session.user.id
    });

    await db.from("activity_feed").insert({
      message: "Codebase swaps are now visible to teams.",
      public: true
    });

    return { message: "Swaps unlocked for teams" };
  },
  { role: "organizer", limit: 20 }
);

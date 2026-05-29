import { ApiError, withApiRoute } from "@/lib/api-route";
import { writeAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ session, db }) => {
    const { data: phase1 } = await db.from("phases").select("id").eq("name", "phase_1").maybeSingle();
    if (!phase1?.id) throw new ApiError("Phase 1 not found", 404);

    const { count: swapCount, error: countErr } = await db
      .from("swaps")
      .select("*", { count: "exact", head: true })
      .eq("phase_id", phase1.id);

    if (countErr) throw new ApiError(countErr.message, 400);
    if (!swapCount) {
      throw new ApiError(
        "No swap assignments found. Run “Assign codebase swaps” before unlocking Phase 2.",
        400
      );
    }

    await db.from("swaps").update({ unlocked: true }).eq("phase_id", phase1.id);

    await db.from("notifications").insert({
      message: "Your Phase 2 codebase swap is ready. Check the Phase 2 tab.",
      sent_by: session.user.id
    });

    await db.from("activity_feed").insert({
      message: "Codebase swaps are now visible to teams.",
      public: true
    });

    await writeAudit(db, {
      actorId: session.user.id,
      action: "swaps.unlock",
      payload: { swap_count: swapCount }
    });

    return { message: "Swaps unlocked for teams" };
  },
  { role: "organizer", limit: 20 }
);

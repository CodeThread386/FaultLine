import { withApiRoute } from "@/lib/api-route";
import { filterEventPhases } from "@/lib/phase-control";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const [{ data: phases }, { data: activity }] = await Promise.all([
      db
        .from("phases")
        .select("id, name, status, submission_deadline")
        .in("name", ["phase_1", "phase_2"])
        .order("name"),
      db
        .from("activity_feed")
        .select("id, message, created_at")
        .eq("public", true)
        .order("created_at", { ascending: false })
        .limit(50)
    ]);

    return {
      phases: filterEventPhases(phases),
      activity: activity || []
    };
  },
  { auth: false, limit: 120 }
);

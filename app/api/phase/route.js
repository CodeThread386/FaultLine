import { withApiRoute } from "@/lib/api-route";
import { filterEventPhases } from "@/lib/phase-control";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const { data, error } = await db
      .from("phases")
      .select("id, name, status, submission_deadline")
      .in("name", ["phase_1", "phase_2"])
      .order("name");

    if (error) {
      return {
        error: error.message,
      };
    }

    return {
      phases: filterEventPhases(data),
    };
  },
  { auth: false }
);
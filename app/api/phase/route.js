import { withApiRoute } from "@/lib/api-route";
import { filterEventPhases } from "@/lib/phase-control";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(async ({ db }) => {
  const { data } = await db
    .from("phases")
    .select("id, name, status, submission_deadline")
    .in("name", ["phase_1", "phase_2"])
    .order("name");
  return { phases: filterEventPhases(data) };
});

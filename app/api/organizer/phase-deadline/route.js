import { ApiError, withApiRoute } from "@/lib/api-route";
import { setPhaseDeadline } from "@/lib/phase-control";
import { isValidPhase, parseJsonBody } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ req, db }) => {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    if (!isValidPhase(body.phase)) throw new ApiError("Invalid phase", 400);

    const result = await setPhaseDeadline(db, body.phase, body.submission_deadline);
    if (result.error) throw new ApiError(result.error, result.status);
    return { phase: result.phase };
  },
  { role: "admin", limit: 20 }
);

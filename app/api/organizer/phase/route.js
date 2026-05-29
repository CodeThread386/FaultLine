import { ApiError, withApiRoute } from "@/lib/api-route";
import { applyPhaseAction } from "@/lib/phase-control";
import { isValidPhase, parseJsonBody, PHASE_ACTIONS } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const POST = withApiRoute(
  async ({ req, session, db }) => {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    const { phase, action } = body;
    if (!isValidPhase(phase)) throw new ApiError("Invalid phase name", 400);
    if (!PHASE_ACTIONS.has(action)) {
      throw new ApiError("Invalid action. Use start or stop.", 400);
    }

    const result = await applyPhaseAction(db, {
      phaseName: phase,
      action,
      organizerId: session.user.id
    });

    if (result.error) throw new ApiError(result.error, result.status);
    return { phase: result.phase, action };
  },
  { role: "organizer", limit: 30 }
);

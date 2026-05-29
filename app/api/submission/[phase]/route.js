import { ApiError, withApiRoute } from "@/lib/api-route";
import { getPhaseByName } from "@/lib/phase-control";
import { requireRegisteredTeam } from "@/lib/participant-data";
import { submitTeamPhase } from "@/lib/submissions";
import { isValidPhase, parseJsonBody } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ context, session, db }) => {
    const phaseName = context.params.phase;
    if (!isValidPhase(phaseName)) throw new ApiError("Invalid phase", 400);

    const teamCtx = await requireRegisteredTeam(session.user.id);
    if (teamCtx.error) throw new ApiError(teamCtx.error, teamCtx.status);

    const phase = await getPhaseByName(db, phaseName);
    if (!phase) throw new ApiError("Invalid phase", 404);

    const { data: submission } = await db
      .from("submissions")
      .select("*")
      .eq("team_id", teamCtx.teamId)
      .eq("phase_id", phase.id)
      .maybeSingle();

    return {
      submission,
      phase: {
        name: phase.name,
        status: phase.status,
        submission_deadline: phase.submission_deadline
      }
    };
  },
  { role: "participant" }
);

export const POST = withApiRoute(
  async ({ req, context, session, db }) => {
    const phaseName = context.params.phase;
    if (!isValidPhase(phaseName)) throw new ApiError("Invalid phase", 400);

    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      throw new ApiError("Invalid request body", 400);
    }

    const result = await submitTeamPhase(db, session.user.id, phaseName, body);
    if (result.error) throw new ApiError(result.error, result.status);
    return {};
  },
  { role: "participant", limit: 40 }
);

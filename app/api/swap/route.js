import { ApiError, withApiRoute } from "@/lib/api-route";
import { requireRegisteredTeam } from "@/lib/participant-data";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ session, db }) => {
    const teamCtx = await requireRegisteredTeam(session.user.id);
    if (teamCtx.error) throw new ApiError(teamCtx.error, teamCtx.status);

    const { data: swap } = await db
      .from("swaps")
      .select("*")
      .eq("receiving_team_id", teamCtx.teamId)
      .order("id")
      .limit(1)
      .maybeSingle();

    if (!swap || !swap.unlocked) {
      return { unlocked: false };
    }

    const { data: phase2 } = await db.from("phases").select("id").eq("name", "phase_2").maybeSingle();

    let submissionQuery = db
      .from("submissions")
      .select("repo_url, description")
      .eq("team_id", swap.assigned_team_id);

    if (phase2?.id) submissionQuery = submissionQuery.eq("phase_id", phase2.id);

    const { data: submission } = await submissionQuery.maybeSingle();

    return {
      unlocked: true,
      repo_url: submission?.repo_url || null,
      description: submission?.description || null
    };
  },
  { role: "participant" }
);

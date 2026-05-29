import { canSubmitToPhase, getPhaseByName } from "@/lib/phase-control";
import { requireRegisteredTeam } from "@/lib/participant-data";
import { isValidGithubUrl, isValidPhase, sanitizeText } from "@/lib/validate";

export async function submitTeamPhase(db, userId, phaseName, { repo_url: rawUrl, description: rawDesc }) {
  if (!isValidPhase(phaseName)) {
    return { error: "Invalid phase", status: 400 };
  }

  const repo_url = sanitizeText(rawUrl, 500);
  const description = sanitizeText(rawDesc, 2000);
  if (!isValidGithubUrl(repo_url)) {
    return { error: "Invalid GitHub URL format", status: 400 };
  }

  const teamCtx = await requireRegisteredTeam(userId);
  if (teamCtx.error) return { error: teamCtx.error, status: teamCtx.status };

  const phase = await getPhaseByName(db, phaseName);
  if (!phase) return { error: "Invalid phase", status: 404 };

  const { data: existing } = await db
    .from("submissions")
    .select("*")
    .eq("team_id", teamCtx.teamId)
    .eq("phase_id", phase.id)
    .maybeSingle();

  const gate = canSubmitToPhase(phase, existing);
  if (!gate.ok) return { error: gate.reason, status: 403 };

  const { error } = await db.from("submissions").upsert(
    {
      team_id: teamCtx.teamId,
      phase_id: phase.id,
      repo_url,
      description: description || null,
      submitted_at: new Date().toISOString(),
      locked: false
    },
    { onConflict: "team_id,phase_id" }
  );
  if (error) return { error: error.message, status: 400 };

  await db.from("activity_feed").insert({
    message: `A team submitted their ${phaseName} repo`,
    public: true
  });

  return {
    submission: { repo_url, description: description || null, submitted_at: new Date().toISOString() }
  };
}

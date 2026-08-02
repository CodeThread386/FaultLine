import { revalidatePath } from "next/cache";
import { ApiError, withApiRoute } from "@/lib/api-route";
import { DEMO_MODE } from "@/lib/demo";
import { ensureLeaderTeamMembership, getMembershipForUser } from "@/lib/participant-data";
import { isCanonicalTrackName } from "@/lib/tracks";
import { isValidUuid, parseJsonBody, sanitizeText } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(async ({ session }) => {
  const membership = await getMembershipForUser(session.user.id);
  return { team: membership?.teams || null };
});

export const POST = withApiRoute(
  async ({ req, session, db }) => {
    if (DEMO_MODE) {
      throw new ApiError("Teams are pre-assigned for the demo. Use your login number only.", 403);
    }

    throw new ApiError("Team assignments are pre-set for participants. Contact the organizers if you need a change.", 403);

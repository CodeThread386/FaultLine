import { withApiRoute } from "@/lib/api-route";
import { loadCanonicalTracks } from "@/lib/tracks";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const tracks = await loadCanonicalTracks(db);
    return { tracks };
  },
  { limit: 60 }
);

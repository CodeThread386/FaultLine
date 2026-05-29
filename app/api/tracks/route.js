import { withApiRoute } from "@/lib/api-route";
import { ensureCanonicalTracks, sortCanonicalTracks } from "@/lib/tracks";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const { data, error } = await db.from("tracks").select("*");
    if (error) throw new Error(error.message);

    let tracks = sortCanonicalTracks(data || []);
    if (tracks.length < 5) {
      tracks = await ensureCanonicalTracks(db);
    }
    return { tracks };
  },
  { limit: 60 }
);

import { withApiRoute } from "@/lib/api-route";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    const { data, error } = await db
      .from("audit_log")
      .select("id, action, payload, created_at, users(name, email)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      if (error.message?.includes("audit_log")) {
        return { entries: [], schema_missing: true };
      }
      throw new Error(error.message);
    }

    return { entries: data || [] };
  },
  { role: "organizer", limit: 60 }
);

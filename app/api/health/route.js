import { withApiRoute } from "@/lib/api-route";
import { APP_VERSION, assertRuntimeEnv, isUpstashConfigured } from "@/lib/env";
import { DEMO_MODE } from "@/lib/demo";

export const dynamic = "force-dynamic";

export const GET = withApiRoute(
  async ({ db }) => {
    let envCheck = { ok: true };
    try {
      assertRuntimeEnv();
    } catch (e) {
      envCheck = { ok: false, error: e.message };
    }

    const { error } = await db.from("phases").select("id").limit(1);
    const dbOk = !error;

    const body = {
      ok: dbOk && envCheck.ok,
      version: APP_VERSION,
      demo_mode: DEMO_MODE,
      upstash: isUpstashConfigured(),
      database: dbOk ? "connected" : "error",
      env: envCheck
    };

    const res = Response.json(body, { status: body.ok ? 200 : 503 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  },
  { auth: false, limit: 240 }
);

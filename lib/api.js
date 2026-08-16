import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase";
import { isAdminRole, normalizeRoles } from "@/lib/roles";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

export async function getSessionOrError(role) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized", status: 401 };

  const isAdmin = isAdminRole(session.user.role);
  if (role === "admin" || role === "organizer") {
    if (!isAdmin) return { error: "Forbidden", status: 403 };
    return { session };
  }

  if (role) {
    const roles = normalizeRoles(session.user);
    if (!roles.includes(role) && !isAdmin) return { error: "Forbidden", status: 403 };
  }
  return { session };
}

export function jsonError(message, status = 400, code = "error") {
  return Response.json({ error: message, code }, { status });
}

export function jsonOk(data = {}, status = 200) {
  return Response.json({ ok: true, ...data }, { status });
}

export function supabase() {
  return getSupabaseServerClient();
}

export function withSecurityHeaders(response) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (!response.headers.has("Cache-Control")) {
    response.headers.set("Cache-Control", "no-store");
  }
  return response;
}

export async function guardRequest(req, { role, limit = 120 } = {}) {
  const key = `${getClientKey(req)}:${req.nextUrl?.pathname || "api"}`;
  const rl = await rateLimit(key, { limit });
  if (!rl.ok) {
    return {
      blocked: true,
      response: withSecurityHeaders(
        jsonError("Too many requests. Please slow down.", 429)
      )
    };
  }

  if (role) {
    const auth = await getSessionOrError(role);
    if (auth.error) {
      return { blocked: true, response: withSecurityHeaders(jsonError(auth.error, auth.status)) };
    }
    return { blocked: false, auth, session: auth.session };
  }

  const auth = await getSessionOrError();
  if (auth.error) {
    return { blocked: true, response: withSecurityHeaders(jsonError(auth.error, auth.status)) };
  }
  return { blocked: false, auth, session: auth.session };
}

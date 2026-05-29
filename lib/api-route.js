import { guardRequest, jsonError, jsonOk, supabase, withSecurityHeaders } from "@/lib/api";

/** Throw from route handlers for controlled HTTP errors */
export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Standard API route wrapper: rate limit, auth, errors, security headers.
 */
export function withApiRoute(handler, { role, limit = 120, auth = true } = {}) {
  return async function route(req, context) {
    try {
      let session = null;
      if (auth) {
        const guard = await guardRequest(req, { role, limit });
        if (guard.blocked) return guard.response;
        session = guard.session;
      }

      const result = await handler({
        req,
        context,
        session,
        db: supabase()
      });

      if (result instanceof Response) {
        return withSecurityHeaders(result);
      }
      return withSecurityHeaders(jsonOk(result ?? {}));
    } catch (err) {
      if (err instanceof ApiError) {
        return withSecurityHeaders(jsonError(err.message, err.status));
      }
      console.error("[api]", req.nextUrl?.pathname, err);
      return withSecurityHeaders(jsonError("Internal server error", 500));
    }
  };
}

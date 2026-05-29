import { guardRequest, jsonError, jsonOk, supabase, withSecurityHeaders } from "@/lib/api";
import { logError } from "@/lib/logger";

/** Throw from route handlers for controlled HTTP errors */
export class ApiError extends Error {
  constructor(message, status = 400, code = "bad_request") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
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
        return withSecurityHeaders(jsonError(err.message, err.status, err.code));
      }
      logError("api.route", err, { path: req.nextUrl?.pathname });
      return withSecurityHeaders(jsonError("Internal server error", 500));
    }
  };
}

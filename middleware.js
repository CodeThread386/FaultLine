import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { canAccessPath, getDashboardForRoles, normalizeRolesFromToken } from "@/lib/roles";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

function redirectToDashboard(req, roles) {
  const path = getDashboardForRoles(roles);
  if (path === "/login") {
    return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
  }
  return NextResponse.redirect(new URL(path, req.url));
}

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/auth")) {
    const isLoginAttempt =
      req.method === "POST" &&
      (pathname.includes("/callback/") || pathname.endsWith("/signin"));
    if (isLoginAttempt) {
      const authLimit = process.env.NODE_ENV === "development" ? 120 : 20;
      const rl = await rateLimit(`auth:${getClientKey(req)}`, { limit: authLimit, windowMs: 60_000 });
      if (!rl.ok) {
        return NextResponse.json({ error: "Too many login attempts. Try again shortly." }, { status: 429 });
      }
    }
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const roles = normalizeRolesFromToken(token);
  const hasRole = (role) => roles.includes(role);

  if (pathname === "/login" && token) {
    if (roles.length > 1) {
      return NextResponse.redirect(new URL("/choose-role", req.url));
    }
    return redirectToDashboard(req, roles);
  }

  if (pathname === "/post-login" && token && roles.length > 1) {
    return NextResponse.redirect(new URL("/choose-role", req.url));
  }

  if (pathname.startsWith("/dashboard") && !hasRole("participant")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    return redirectToDashboard(req, roles);
  }

  if (pathname === "/judge" && hasRole("judge")) {
    return NextResponse.redirect(new URL("/judge/phase-1", req.url));
  }

  if (pathname.startsWith("/judge") && !hasRole("judge")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    return redirectToDashboard(req, roles);
  }

  if (pathname.startsWith("/organizer") && !hasRole("organizer")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    return redirectToDashboard(req, roles);
  }

  if (pathname === "/choose-role" && token && roles.length <= 1) {
    return redirectToDashboard(req, roles);
  }

  if (token && !canAccessPath(pathname, roles)) {
    return redirectToDashboard(req, roles);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/dashboard/:path*",
    "/judge/:path*",
    "/organizer/:path*",
    "/login",
    "/choose-role",
    "/post-login"
  ]
};

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessPath, getDashboardForRoles } from "@/lib/roles";

function getRoles(token) {
  return token?.roles || (token?.role ? [token.role] : []);
}

function redirectToDashboard(req, roles) {
  const path = getDashboardForRoles(roles);
  if (path === "/login") return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
  return NextResponse.redirect(new URL(path, req.url));
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const roles = getRoles(token);
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

    if (!canAccessPath(pathname, roles) && token) {
      return redirectToDashboard(req, roles);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (
          path === "/login" ||
          path === "/" ||
          path.startsWith("/live") ||
          path === "/post-login"
        ) {
          return true;
        }
        if (
          path.startsWith("/dashboard") ||
          path.startsWith("/judge") ||
          path.startsWith("/organizer") ||
          path === "/choose-role"
        ) {
          return !!token;
        }
        return true;
      }
    }
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/judge/:path*",
    "/organizer/:path*",
    "/login",
    "/choose-role",
    "/post-login"
  ]
};

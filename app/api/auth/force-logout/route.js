import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

function isAuthCookie(name) {
  return (
    name.startsWith("next-auth") ||
    name.startsWith("__Secure-next-auth") ||
    name.startsWith("__Host-next-auth")
  );
}

function clearAuthCookies(req, cookieStore) {
  const loginUrl = new URL("/login?loggedOut=1", req.url);
  const res = NextResponse.redirect(loginUrl);

  for (const cookie of cookieStore.getAll()) {
    if (isAuthCookie(cookie.name)) {
      cookieStore.delete(cookie.name);
      res.cookies.set(cookie.name, "", { path: "/", maxAge: 0 });
    }
  }

  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

/** POST only — requires an active session (prevents logout CSRF via GET). */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = cookies();
  return clearAuthCookies(req, cookieStore);
}

/** Legacy GET redirects to login without clearing cookies. */
export async function GET() {
  return NextResponse.redirect(new URL("/login?loggedOut=1", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}

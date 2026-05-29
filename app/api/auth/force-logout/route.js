import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function isAuthCookie(name) {
  return (
    name.startsWith("next-auth") ||
    name.startsWith("__Secure-next-auth") ||
    name.startsWith("__Host-next-auth")
  );
}

export async function GET(req) {
  const cookieStore = cookies();
  for (const cookie of cookieStore.getAll()) {
    if (isAuthCookie(cookie.name)) {
      cookieStore.delete(cookie.name);
    }
  }

  const loginUrl = new URL("/login?loggedOut=1", req.url);
  const res = NextResponse.redirect(loginUrl);

  for (const cookie of cookieStore.getAll()) {
    if (isAuthCookie(cookie.name)) {
      res.cookies.set(cookie.name, "", { path: "/", maxAge: 0 });
    }
  }

  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

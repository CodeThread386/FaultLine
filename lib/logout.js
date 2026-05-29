"use client";

import { signOut } from "next-auth/react";

function clearClientStorage() {
  try {
    sessionStorage.clear();
    localStorage.removeItem("nextauth.message");
  } catch {
    // ignore storage errors in restricted contexts
  }
}

async function getCsrfToken() {
  try {
    const res = await fetch("/api/auth/csrf", { credentials: "same-origin", cache: "no-store" });
    const data = await res.json();
    return data?.csrfToken || "";
  } catch {
    return "";
  }
}

export async function logoutCompletely() {
  clearClientStorage();

  const csrfToken = await getCsrfToken();

  try {
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken, callbackUrl: "/login?loggedOut=1" })
    });
  } catch {
    // continue with fallback cleanup
  }

  try {
    await signOut({ redirect: false });
  } catch {
    // continue with fallback cleanup
  }

  clearClientStorage();

  // Server clears auth cookies, then redirects to login (client nav avoids stale RSC cache)
  window.location.href = "/api/auth/force-logout";
}

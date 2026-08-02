"use client";

import { signOut } from "next-auth/react";

const SESSION_KEYS = ["nextauth.message"];

function clearClientStorage() {
  try {
    for (const key of SESSION_KEYS) {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    }
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
      body: new URLSearchParams({ csrfToken, callbackUrl: "/" })
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

  try {
    await fetch("/api/auth/force-logout", { method: "POST", credentials: "same-origin" });
  } catch {
    /* continue */
  }
  window.location.href = "/";
}

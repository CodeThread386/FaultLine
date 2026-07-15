"use client";

import { useState } from "react";
import { logoutCompletely } from "@/lib/logout";

export default function LogoutButton({ className = "" }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    await logoutCompletely();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        className ||
        "rounded-sm border border-fl-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-caption text-fl-muted transition hover:border-fl-muted hover:bg-fl-bg3 hover:text-fl-text disabled:opacity-60"
      }
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

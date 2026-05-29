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
        "rounded border border-slate-700 px-3 py-1.5 text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
      }
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

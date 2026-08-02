"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

function getDisplayName(user) {
  if (typeof user?.name === "string" && user.name.trim()) {
    return user.name.trim();
  }

  if (typeof user?.email === "string" && user.email.trim()) {
    const localPart = user.email.split("@")[0] || user.email;
    return localPart
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return "User";
}

export default function HeaderAuth({ user, isMobile = false }) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-colors duration-200 group-hover:text-black"
      >
        Login
      </Link>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${isMobile ? "justify-center w-full flex-col sm:flex-row" : "justify-end"}`}>
      <span
        className={`${isMobile ? "block" : "hidden sm:inline"} max-w-[180px] truncate font-mono text-[11px] text-fl-muted`}
        title={user.email}
      >
        {getDisplayName(user)}
      </span>

      <LogoutButton />
    </div>
  );
}
"use client";

import Link from "next/link";
import { normalizeRoles, ROLE_DASHBOARDS } from "@/lib/roles";
import LogoutButton from "@/components/LogoutButton";

const ROLE_LABELS = {
  organizer: "Organizer",
  judge: "Judge",
  participant: "Participant"
};

export default function HeaderAuth({ user }) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="font-mono text-[11px] uppercase tracking-caption text-fl-text transition hover:text-fl-accent"
      >
        Login
      </Link>
    );
  }

  const roles = normalizeRoles(user);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
      <span
        className="hidden max-w-[180px] truncate font-mono text-[11px] text-fl-muted sm:inline"
        title={user.email}
      >
        {user.loginNumber != null ? `#${user.loginNumber}` : user.email}
      </span>
      {roles.length > 1 ? (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Link
              key={role}
              href={ROLE_DASHBOARDS[role]}
              className="rounded-sm border border-fl-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-caption text-fl-text transition hover:border-fl-muted hover:bg-fl-bg3"
            >
              {ROLE_LABELS[role] || role}
            </Link>
          ))}
        </div>
      ) : (
        roles.length > 0 && (
          <span className="rounded-sm border border-fl-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-caption text-fl-muted">
            {roles.join(", ")}
          </span>
        )
      )}
      <LogoutButton />
    </div>
  );
}

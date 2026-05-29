"use client";

import Link from "next/link";
import { ROLE_DASHBOARDS } from "@/lib/roles";
import LogoutButton from "@/components/LogoutButton";

const ROLE_LABELS = {
  organizer: "Organizer",
  judge: "Judge",
  participant: "Participant"
};

export default function HeaderAuth({ user }) {
  if (!user) {
    return <Link href="/login">Login</Link>;
  }

  const roles = user.roles?.length ? user.roles : user.role ? [user.role] : [];

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
      <span className="hidden font-mono max-w-[180px] truncate sm:inline" title={user.email}>
        {user.loginNumber != null ? `#${user.loginNumber}` : user.email}
      </span>
      {roles.length > 1 ? (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Link
              key={role}
              href={ROLE_DASHBOARDS[role]}
              className="rounded bg-slate-800 px-2 py-0.5 text-xs text-cyan-300 hover:bg-slate-700"
            >
              {ROLE_LABELS[role] || role}
            </Link>
          ))}
        </div>
      ) : (
        roles.length > 0 && (
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
            {roles.join(", ")}
          </span>
        )
      )}
      <LogoutButton />
    </div>
  );
}

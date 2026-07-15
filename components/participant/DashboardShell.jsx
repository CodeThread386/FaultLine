"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useEventSync } from "@/components/providers/EventSyncProvider";
import { DEMO_MODE } from "@/lib/demo";
import { getTrackMeta } from "@/lib/tracks-meta";

const NAV = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/dashboard/phase-1", label: "Phase 1", icon: "phase1" },
  { href: "/dashboard/phase-2", label: "Phase 2", icon: "phase2" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "bell" },
  { href: "/dashboard/live", label: "Live Schedule", icon: "live" }
];

function NavIcon({ type }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  if (type === "home")
    return (
      <svg {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    );
  if (type === "phase1")
    return (
      <svg {...props}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  if (type === "phase2")
    return (
      <svg {...props}>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    );
  if (type === "live")
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  return (
    <svg {...props}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export default function DashboardShell({ children, team, user }) {
  const pathname = usePathname();
  const { unreadCount } = useEventSync();
  const track = team?.tracks;
  const meta = getTrackMeta(track?.name || "");

  return (
    <div className="fl-page-bg flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-fl-border bg-fl-bg/80 px-6 backdrop-blur-xl">
        <Link href="/dashboard" className="fl-wordmark">
          <span className="fl-wordmark-accent">Fault</span>
          <span className="text-fl-muted">Line</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-fl-muted sm:inline">
            {DEMO_MODE
              ? `#${user?.loginNumber ?? "—"}`
              : user?.name || user?.email || "Participant"}
          </span>
          <LogoutButton className="rounded-md border border-fl-border px-3 py-1.5 text-sm text-fl-text hover:bg-fl-bg3" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[220px] shrink-0 border-r border-fl-border bg-fl-bg2/90 p-4 backdrop-blur-sm">
          {team ? (
            <div className="mb-6 fl-glass rounded-sm p-4">
              <div className="text-sm font-bold">{team.name}</div>
              <div className="mt-1 font-mono text-[11px] text-fl-accent">
                {meta.icon} {track?.name || "Track"}
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-dashed border-fl-border p-4 text-xs text-fl-muted">
              Not registered yet
            </div>
          )}

          <nav className="flex flex-col gap-0.5">
            <div className="fl-label mb-2 px-3">Navigation</div>
            {NAV.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const showBadge = item.icon === "bell" && unreadCount > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-semibold transition ${
                    active ? "bg-fl-bg3 text-fl-text" : "text-fl-muted hover:bg-fl-bg3 hover:text-fl-text"
                  }`}
                >
                  <NavIcon type={item.icon} />
                  {item.label}
                  {showBadge && (
                    <span className="ml-auto rounded-full bg-fl-text px-1.5 font-mono text-[10px] text-fl-bg">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {!DEMO_MODE && !team?.registered && (
              <Link
                href="/dashboard/register"
                className={`mt-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-semibold text-fl-accent transition hover:bg-fl-bg3 ${
                  pathname === "/dashboard/register" ? "bg-fl-bg3" : ""
                }`}
              >
                Register Team
              </Link>
            )}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

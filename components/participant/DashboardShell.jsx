"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useEventSync } from "@/components/providers/EventSyncProvider";
import { DEMO_MODE } from "@/lib/demo";
import { getTrackMeta } from "@/lib/tracks-meta";
import styles from "./DashboardShell.module.css";

const NAV = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/dashboard/phase-1", label: "Phase 1", icon: "phase1" },
  { href: "/dashboard/phase-2", label: "Phase 2", icon: "phase2" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "bell" },
  { href: "/dashboard/live", label: "Live Schedule", icon: "live" }
];

function NavIcon({ type }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2
  };

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

function BracketFrame() {
  return (
    <>
      <span className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r border-t border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b border-l border-[#F5F5F0]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b border-r border-[#F5F5F0]" />
    </>
  );
}

export default function DashboardShell({ children, team, user }) {
  const pathname = usePathname();
  const { unreadCount } = useEventSync();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const track = team?.tracks;
  const meta = getTrackMeta(track?.name || "");

  return (
    <div className={`${styles.shell} relative flex min-h-screen flex-col bg-[#0A0A0A] text-[#F5F5F0]`}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(245,245,240,0.18) 1px, transparent 1px),
            repeating-radial-gradient(
              circle at center,
              transparent 0px,
              transparent 120px,
              rgba(245,245,240,0.05) 121px,
              transparent 122px
            )
          `,
          backgroundSize: "32px 32px, 100% 100%"
        }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#0A0A0A]/90 px-3 sm:px-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="flex items-center justify-center p-1.5 text-[#F5F5F0] hover:text-[#00E0FF] md:hidden"
            aria-label="Toggle Navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileNavOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link
            href="/dashboard"
            className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em] sm:tracking-[0.35em]"
          >
            <span className="text-[#FF2318]">FAULT</span>
            <span className="text-[#F5F5F0]">LINE</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-[#8A8A84] sm:inline">
            {DEMO_MODE
              ? `#${user?.loginNumber ?? "—"}`
              : user?.name || user?.email || "Participant"}
          </span>

          <LogoutButton className="border border-[#F5F5F0] px-2 py-1 sm:px-3 sm:py-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.22em] text-[#F5F5F0] shadow-[2px_2px_0_#FF2318] sm:shadow-[4px_4px_0_#FF2318] transition hover:border-[#00E0FF] hover:shadow-[3px_3px_0_#00E0FF]" />
        </div>
      </header>

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-[240px] border-r border-white/10 bg-[#0A0A0A] p-4 overflow-y-auto transition-transform duration-200 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {team ? (
          <div className="relative mb-6 px-4 py-4">
            <BracketFrame />

            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FF2318]">
              Assigned Team
            </div>

            <div className="mt-2 font-mono text-[13px] sm:text-[15px] md:text-[18px] font-black uppercase tracking-tight text-[#F5F5F0] whitespace-nowrap overflow-hidden text-ellipsis">
              {team.name}
            </div>

            <div className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5F5F0]">
              {meta.icon} {track?.name || "Track"}
            </div>
          </div>
        ) : (
          <div className="relative mb-6 px-4 py-4">
            <BracketFrame />

            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF2318]">
              Not Registered Yet
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-2">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[#8A8A84]">
            Navigation
          </div>

          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            const showBadge =
              item.icon === "bell" && unreadCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`group flex items-center gap-3 border px-3 py-3 font-mono text-[10px] uppercase tracking-[0.25em] transition ${
                  active
                    ? "border-[#FF2318] text-[#F5F5F0] shadow-[4px_4px_0_#FF2318]"
                    : "border-[#F5F5F0] text-[#8A8A84] hover:border-[#00E0FF] hover:text-[#F5F5F0] hover:shadow-[4px_4px_0_#00E0FF]"
                }`}
              >
                <NavIcon type={item.icon} />
                {item.label}

                {showBadge && (
                  <span className="ml-auto border border-[#FF2318] px-1.5 py-0.5 font-mono text-[10px] text-[#FF2318]">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          {!DEMO_MODE && !team?.registered && (
            <Link
              href="/dashboard/register"
              onClick={() => setMobileNavOpen(false)}
              className={`mt-4 border px-3 py-3 font-mono text-[10px] uppercase tracking-[0.25em] transition ${
                pathname === "/dashboard/register"
                  ? "border-[#FF2318] text-[#F5F5F0] shadow-[4px_4px_0_#FF2318]"
                  : "border-[#F5F5F0] text-[#F5F5F0] hover:border-[#00E0FF] hover:shadow-[4px_4px_0_#00E0FF]"
              }`}
            >
              Register Team
            </Link>
          )}
        </nav>
      </aside>

      <div className="relative mt-14 flex min-h-0 flex-1">
        <main className="ml-0 md:ml-[240px] min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}


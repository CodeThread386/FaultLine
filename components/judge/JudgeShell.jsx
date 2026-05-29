"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const PHASES = [
  { href: "/judge/phase-1", label: "Phase 1" },
  { href: "/judge/phase-2", label: "Phase 2" }
];

export default function JudgeShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-fl-bg">
      <div className="mx-auto w-full max-w-md px-4 py-4 sm:px-6 sm:py-5">
        <div className="mb-4 flex w-full items-center justify-between">
          <span className="text-lg font-extrabold text-fl-red">
            FAULT<span className="text-fl-text">LINE</span>
            <span className="ml-2 font-mono text-[10px] font-normal text-fl-muted">JUDGE</span>
          </span>
          <LogoutButton className="shrink-0 rounded-md border border-fl-border px-2.5 py-1 text-xs hover:bg-fl-bg3" />
        </div>

        <nav className="mb-5 flex w-full gap-2">
          {PHASES.map((p) => {
            const active = pathname.startsWith(p.href);
            return (
              <Link
                key={p.href}
                href={p.href}
                className={`flex-1 rounded-lg py-2.5 text-center text-sm font-bold transition ${
                  active ? "bg-fl-red text-white" : "bg-fl-bg2 text-fl-muted hover:text-fl-text"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  );
}

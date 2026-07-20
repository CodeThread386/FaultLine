"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuth from "@/components/HeaderAuth";

export default function SiteChrome({ children, user }) {
  const pathname = usePathname();

  const isPortal =
    pathname.startsWith("/dashboard") || pathname.startsWith("/organizer");

  if (isPortal) {
    return <>{children}</>;
  }

  const isLanding = pathname === "/";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#F5F5F0]">
      {/* persistent chaos-protocol background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(245,245,240,0.08) 1px, transparent 1px),
            repeating-radial-gradient(
              circle at center,
              transparent 0px,
              transparent 120px,
              rgba(245,245,240,0.025) 121px,
              transparent 122px
            )
          `,
          backgroundSize: "32px 32px, 100% 100%"
        }}
      />

      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-6 md:px-10">
          <Link
            href="/"
            className="font-mono text-[12px] uppercase tracking-[0.35em]"
          >
            <span className="text-[#FF2318]">FAULT</span>
            <span className="text-[#F5F5F0]">LINE</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/live"
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8A8A84] transition hover:text-[#00E0FF]"
            >
              Live
            </Link>

            <HeaderAuth user={user} />
          </nav>
        </div>
      </header>

      <main
        className={`relative z-10 ${
          isLanding
            ? "w-full"
            : "mx-auto max-w-lg px-4 pb-12 pt-20 md:px-8"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
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
    <div className="fl-page-bg min-h-screen">
      <header className="fixed left-0 right-0 top-0 z-[100] flex h-14 items-center justify-between border-b border-fl-border bg-fl-bg/80 px-6 backdrop-blur-xl md:px-10">
        <Link href="/" className="fl-wordmark">
          <span className="fl-wordmark-accent">Fault</span>
          <span className="text-fl-muted">Line</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-fl-muted">
          <Link href="/live" className="font-mono text-[11px] uppercase tracking-caption transition hover:text-fl-text">
            Live
          </Link>
          <HeaderAuth user={user} />
        </nav>
      </header>
      <main className={isLanding ? "w-full" : "mx-auto max-w-lg px-4 pb-12 pt-20 md:px-8"}>
        {children}
      </main>
    </div>
  );
}

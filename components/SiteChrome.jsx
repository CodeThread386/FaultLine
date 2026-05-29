"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuth from "@/components/HeaderAuth";

export default function SiteChrome({ children, user }) {
  const pathname = usePathname();
  const isPortal =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/organizer") ||
    pathname.startsWith("/judge");

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100] flex h-14 items-center justify-between border-b border-fl-border bg-fl-bg/95 px-8 backdrop-blur-md">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-fl-red">
          FAULT<span className="text-fl-text">LINE</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-fl-muted">
          <Link href="/live" className="hover:text-fl-text">
            Live
          </Link>
          <HeaderAuth user={user} />
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-6 pt-20">{children}</main>
    </>
  );
}

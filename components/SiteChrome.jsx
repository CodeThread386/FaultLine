"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import HeaderAuth from "@/components/HeaderAuth";

export default function SiteChrome({ children, user }) {
  const pathname = usePathname();
  const isPortal =
    pathname.startsWith("/dashboard") || pathname.startsWith("/organizer");

  const isLanding = pathname === "/";

  const [isVisible, setIsVisible] = useState(!isLanding);
  const [isHovered, setIsHovered] = useState(false);
  const activityTimeoutRef = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (!isLanding) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);

    const handleActivity = () => {
      // Show header while scrolling or moving mouse
      setIsVisible(true);

      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      // Hide header after inactivity (1s timeout)
      activityTimeoutRef.current = setTimeout(() => {
        if (!isHoveredRef.current) {
          setIsVisible(false);
        }
      }, 1000);
    };

    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("mousemove", handleActivity, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [isLanding]);

  if (isPortal) {
    return <>{children}</>;
  }

  const showHeader = !isLanding || isVisible || isHovered;

  return (
    <div className="fl-page-bg min-h-screen">
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-6 py-5 md:px-10 transition-all duration-300 ease-in-out ${
          showHeader
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* IEEE VIT Logo Button */}
        <Link
          href="/"
          className="flex items-center justify-center border-2 border-white/80 bg-black/95 px-4 py-3 backdrop-blur-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-200 hover:border-red-500 hover:shadow-[4px_4px_0px_0px_#ef4444] hover:-translate-y-0.5"
        >
          <Image
            src="/ieeevit.png"
            alt="IEEE VIT"
            width={90}
            height={32}
            className="h-7 md:h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Individual Rectangular Navigation Buttons */}
        <nav className="flex items-center gap-4">
          {/* FaultLine Symbol/Wordmark Button */}
          <Link
            href="/"
            className="flex items-center border-2 border-white/80 bg-black/95 px-5 py-2.5 md:px-6 md:py-3 backdrop-blur-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-200 hover:border-red-500 hover:shadow-[4px_4px_0px_0px_#ef4444] hover:-translate-y-0.5"
          >
            <div className="fl-wordmark text-base md:text-lg font-bold tracking-widest">
              <span className="text-red-500">Fault</span>
              <span className="text-white">Line</span>
            </div>
          </Link>

          {/* Live Schedule Button */}
          <Link
            href="/live"
            className="flex items-center border-2 border-white/80 bg-black/95 px-5 py-2.5 md:px-6 md:py-3 font-mono text-xs md:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-200 hover:border-red-500 hover:shadow-[4px_4px_0px_0px_#ef4444] hover:-translate-y-0.5"
          >
            Live Schedule
          </Link>

          {/* Auth/User Button */}
          <div className="flex items-center border-2 border-white/80 bg-black/95 px-5 py-2.5 md:px-6 md:py-3 backdrop-blur-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-200 hover:border-red-500 hover:shadow-[4px_4px_0px_0px_#ef4444] hover:-translate-y-0.5">
            <HeaderAuth user={user} />
          </div>
        </nav>
      </header>

      <main
        className={
          isLanding ? "w-full" : "mx-auto max-w-lg px-4 pb-12 pt-20 md:px-8"
        }
      >
        {children}
      </main>
    </div>
  );
}

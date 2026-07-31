"use client";
import NavigationButtons from "./NavigationButtons";

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

    const trigger = document.getElementById("hide-navbar-trigger");

    const isAboveTrigger = () => {
      if (!trigger) return true;

      const triggerTop =
        trigger.getBoundingClientRect().top + window.scrollY;

      return window.scrollY < triggerTop;
    };

    const hideAfterDelay = () => {
      clearTimeout(activityTimeoutRef.current);

      activityTimeoutRef.current = setTimeout(() => {
        if (!isHoveredRef.current && isAboveTrigger()) {
          setIsVisible(false);
        }
      }, 1000);
    };

    const handleMouseMove = () => {
      if (!isAboveTrigger()) return;

      setIsVisible(true);
      hideAfterDelay();
    };

    const handleScroll = () => {
      if (!isAboveTrigger()) {
        setIsVisible(false);
      }
    };

    // Initial state
    if (isAboveTrigger()) {
      setIsVisible(true);
      hideAfterDelay();
    } else {
      setIsVisible(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(activityTimeoutRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLanding]);

  if (isPortal) {
    return <>{children}</>;
  }

  const showHeader = !isLanding || isVisible;

  return (
    <div className="fl-page-bg min-h-screen">
      <header
        onMouseEnter={() => {
          setIsHovered(true);
          clearTimeout(activityTimeoutRef.current);
        }}
        onMouseLeave={() => {
          setIsHovered(false);

          if (window.scrollY >= (
            document.getElementById("hide-navbar-trigger")?.getBoundingClientRect().top +
            window.scrollY || Infinity
          )) {
            return;
          }

          activityTimeoutRef.current = setTimeout(() => {
            if (!isHoveredRef.current) {
              setIsVisible(false);
            }
          }, 1000);
        }}
        className="fixed left-0 right-0 top-0 z-[100] px-3 py-3 sm:px-6 sm:py-4 md:px-10 md:py-5 pointer-events-none"
      >
        <NavigationButtons
          user={user}
          showHeader={showHeader}
        />
      </header>

      <main
        className={
          isLanding ? "w-full" : "mx-auto max-w-5xl px-4 pt-24 pb-12 sm:px-6 md:px-8 md:pt-32"
        }
      >
        {children}
      </main>
    </div>
  );
}
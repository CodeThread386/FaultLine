"use client";
import NavigationButtons from "./NavigationButtons";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SiteChrome({ children, user }) {
  const pathname = usePathname();
  const isPortal =
    pathname.startsWith("/dashboard") || pathname.startsWith("/organizer");

  const isLanding = pathname === "/";

  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const lastScrollY = useRef(0);
  const isHoveredRef = useRef(false);
  const isMouseNearTopRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Reset navbar visibility on page/route change
  useEffect(() => {
    setIsVisible(true);
    if (typeof window !== "undefined") {
      lastScrollY.current = window.scrollY;
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      lastScrollY.current = window.scrollY;
    }

    const handleScroll = () => {
      // Do not hide navbar if user is hovering header or mouse is near top of screen
      if (isHoveredRef.current || isMouseNearTopRef.current) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      // Always show navbar near the top of the page
      if (currentScrollY <= 10) {
        setIsVisible(true);
        lastScrollY.current = Math.max(0, currentScrollY);
        return;
      }

      const delta = currentScrollY - lastScrollY.current;

      // Threshold of 5px to avoid jitter on micro-scrolls
      if (Math.abs(delta) > 5) {
        if (delta > 0) {
          // Scrolling down: navbar disappears up
          setIsVisible(false);
        } else {
          // Scrolling up: navbar comes back down
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    const handleMouseMove = (e) => {
      // Reveal navbar when cursor is moved near top edge of the screen (top 150px)
      const isNearTop = e.clientY <= 150;
      isMouseNearTopRef.current = isNearTop;

      if (isNearTop) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <div className="fl-page-bg min-h-screen">
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed left-0 right-0 top-0 z-[100] px-3 py-3 sm:px-6 sm:py-4 md:px-10 md:py-5 pointer-events-none"
      >
        <NavigationButtons
          user={user}
          showHeader={isVisible}
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
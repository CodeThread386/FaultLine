"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuth from "./HeaderAuth";

export default function NavigationButtons({ user, showHeader }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on page navigation or header hide
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, showHeader]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const buttonBaseClass =
    "group flex items-center justify-center border-2 sm:border-4 md:border-[5px] border-white bg-black transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-2 sm:hover:translate-y-2";

  const redButtonClass = `${buttonBaseClass} px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-4 shadow-[4px_4px_0_0_white] sm:shadow-[6px_6px_0_0_white] md:shadow-[8px_8px_0_0_white] hover:bg-[#FF2318] hover:border-[#FF2318] hover:text-black`;

  const cyanButtonClass = `${buttonBaseClass} px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-4 shadow-[4px_4px_0_0_white] sm:shadow-[6px_6px_0_0_white] md:shadow-[8px_8px_0_0_white] hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black`;

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        showHeader
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* IEEE VIT Logo (Visible on all screen sizes) */}
        <a
          href="https://www.ieeevit.org/"
          target="_blank"
          rel="noopener noreferrer"
          className={`${redButtonClass} -rotate-1`}
          aria-label="IEEE VIT Website"
        >
          <Image
            src="/ieeevit.png"
            alt="IEEE VIT"
            width={90}
            height={32}
            className="h-5 sm:h-7 md:h-8 w-auto object-contain"
            priority
          />
        </a>

        {/* Desktop Navigation (MD screens and wider) */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-6">
          {/* FaultLine Brand Link */}
          <Link href="/" className={`${redButtonClass} -rotate-1`}>
            <div className="fl-wordmark text-base lg:text-lg font-bold tracking-widest transition-colors duration-200">
              <span className="text-white group-hover:text-black">Fault</span>
              <span className="text-white group-hover:text-black">Line</span>
            </div>
          </Link>

          {/* Live Schedule Link */}
          <Link
            href="/live"
            className={`${cyanButtonClass} rotate-1 font-mono text-xs lg:text-sm font-bold uppercase tracking-widest text-white hover:text-black`}
          >
            LIVE SCHEDULE
          </Link>

          {/* Login / Auth */}
          {!user ? (
            <Link
              href="/login"
              className={`${cyanButtonClass} -rotate-1 font-mono text-xs lg:text-sm font-bold uppercase tracking-widest text-white hover:text-black`}
            >
              LOGIN
            </Link>
          ) : (
            <div className={`${cyanButtonClass} -rotate-1`}>
              <HeaderAuth user={user} />
            </div>
          )}
        </nav>

        {/* Mobile Action Row (< MD screens) */}
        <div className="flex md:hidden items-center gap-2">
          {/* FaultLine Brand Badge */}
          <Link href="/" className={`${redButtonClass} -rotate-1`}>
            <div className="fl-wordmark text-xs sm:text-sm font-bold tracking-widest transition-colors duration-200">
              <span className="text-white group-hover:text-black">Fault</span>
              <span className="text-white group-hover:text-black">Line</span>
            </div>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`${buttonBaseClass} px-3 py-2 shadow-[4px_4px_0_0_white] text-xs font-mono font-bold uppercase tracking-widest text-white hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black`}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? "CLOSE ✕" : "MENU ☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-3 p-4 bg-black border-4 border-white shadow-[8px_8px_0_0_white] z-50 flex flex-col gap-3 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between w-full border-2 border-white bg-black px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest text-white hover:bg-[#FF2318] hover:border-[#FF2318] hover:text-black transition-all"
          >
            <span>HOME</span>
            <span className="text-xs">→</span>
          </Link>

          <Link
            href="/live"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between w-full border-2 border-white bg-black px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest text-white hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black transition-all"
          >
            <span>LIVE SCHEDULE</span>
            <span className="text-xs">→</span>
          </Link>

          {!user ? (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between w-full border-2 border-white bg-black px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest text-white hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black transition-all"
            >
              <span>LOGIN</span>
              <span className="text-xs">→</span>
            </Link>
          ) : (
            <div className="w-full border-2 border-white bg-black p-3 text-center">
              <HeaderAuth user={user} isMobile={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
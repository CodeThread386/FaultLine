'use client';

import { useState, useEffect } from 'react';
import GlitchText from '@/components/ui/glitch-text';

const NAV_LINKS = [
  { href: '#concept',  label: 'About' },
  { href: '#process',  label: 'How It Works' },
  { href: '#format',   label: 'Format' },
  { href: '#register', label: 'Register' },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="site-header"
      className={`site-header${scrolled ? ' scrolled' : ''}`}
      role="banner"
    >
      {/* ── Wordmark ── */}
      <a href="#hero-main" className="header-wordmark" data-interactive="true">
        <GlitchText>FAULTLINE</GlitchText>
      </a>

      {/* ── Nav ── */}
      <nav aria-label="Main navigation">
        <ul className="header-nav">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} data-interactive="true">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── CTA ── */}
      <a
        href="#register"
        className="header-cta"
        data-interactive="true"
        id="header-register-cta"
      >
        Register
      </a>
    </header>
  );
}

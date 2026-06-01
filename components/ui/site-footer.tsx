'use client';

import GlitchText from '@/components/ui/glitch-text';

const NAV_LINKS = [
  { href: '#concept',  label: 'About' },
  { href: '#process',  label: 'How It Works' },
  { href: '#format',   label: 'Format' },
  { href: '#register', label: 'Register' },
  { href: '#',         label: 'Contact' },
];

const COMMUNITY_LINKS = [
  { href: '#', label: 'GitHub' },
  { href: '#', label: 'Discord' },
  { href: '#', label: 'Twitter / X' },
  { href: '#', label: 'LinkedIn' },
];

export default function SiteFooter() {
  return (
    <footer id="site-footer" className="site-footer" role="contentinfo">
      {/* ── Main columns ── */}
      <div className="footer-inner">
        {/* Col 1 — brand */}
        <div>
          <p className="footer-wordmark">
            <GlitchText>FAULTLINE</GlitchText>
          </p>
          <p className="footer-tagline">
            Built badly. Fixed brilliantly.
          </p>
        </div>

        {/* Col 2 — nav */}
        <div>
          <p className="footer-col-label">Navigation</p>
          <ul className="footer-links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} data-interactive="true">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — community */}
        <div>
          <p className="footer-col-label">Community</p>
          <ul className="footer-links">
            {COMMUNITY_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} data-interactive="true">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <span>&copy; 2025 FaultLine</span>
        <span>Build badly. Fix brilliantly.</span>
      </div>
    </footer>
  );
}

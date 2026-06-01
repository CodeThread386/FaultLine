'use client';
import React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import WarpDriveShader, { WarpDriveShaderHandle } from '../components/ui/warp-drive-shader';
import CursorLensHero from '../components/ui/cursor-lens-hero';
import CustomCursor from '../components/ui/custom-cursor';
import GlitchSliceController from '../components/ui/glitch-slice-controller';
import SiteHeader from '../components/ui/site-header';
import SiteFooter from '../components/ui/site-footer';
import SectionConcept from '../components/sections/section-concept';
import SectionProcess from '../components/sections/section-process';
import SectionWhy from '../components/sections/section-why';
import SectionFormat from '../components/sections/section-format';
import SectionRegister from '../components/sections/section-register';

// ─── Warp Entry Screen ────────────────────────────────────────────────────────

function WarpEntryScreen({ onEntered }: { onEntered: () => void }) {
  const shaderRef       = useRef<WarpDriveShaderHandle>(null);
  const isTransitioning = useRef(false);

  // Lock scroll while in entry state
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      // cleanup only if we navigate away without completing warp
      document.body.style.overflow = '';
    };
  }, []);

  const handleClick = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    shaderRef.current?.triggerWarp(() => {
      // Flash is fully white — hand off to parent which will unmount us
      onEntered();
    });
  }, [onEntered]);

  return (
    <div
      id="warp-entry"
      className="warp-entry-screen"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Click anywhere to enter"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <WarpDriveShader ref={shaderRef} />

      {/* Overlay text */}
      <div className="overlay-content">
        <h1 className="title">Fault Line</h1>
        <p className="click-hint">Click anywhere to enter</p>
      </div>
    </div>
  );
}

// ─── Main Website ─────────────────────────────────────────────────────────────

function MainWebsite() {
  // Restore scroll as soon as the website mounts
  useEffect(() => {
    document.body.style.overflow = '';
    // scroll to top so the hero is the first thing visible
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <>
      {/* Global fx — cursor + glitch slice controller */}
      <CustomCursor />
      <GlitchSliceController />

      {/* Fixed header */}
      <SiteHeader />

      <div className="main-website">
        {/* ── Hero ──────────────────────────────────────────── */}
        <CursorLensHero />

        {/* ── Section 1: Concept ────────────────────────────── */}
        <SectionConcept />

        {/* ── Section 2: Process ────────────────────────────── */}
        <SectionProcess />

        {/* ── Section 3: Why ────────────────────────────────── */}
        <SectionWhy />

        {/* ── Section 4: Format ─────────────────────────────── */}
        <SectionFormat />

        {/* ── Section 5: Register ───────────────────────────── */}
        <SectionRegister />

        {/* ── Footer ────────────────────────────────────────── */}
        <SiteFooter />
      </div>
    </>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function DemoOne() {
  const [hasEntered, setHasEntered] = useState(false);

  return hasEntered
    ? <MainWebsite />
    : <WarpEntryScreen onEntered={() => setHasEntered(true)} />;
}

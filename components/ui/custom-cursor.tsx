'use client';

import { useEffect, useRef } from 'react';

/**
 * CustomCursor — renders two fixed-position elements:
 *   1. cursor-dot  — 6px, --accent-red, follows mouse exactly
 *   2. cursor-ring — 32px hollow circle, follows with lerp lag (factor 0.12)
 *
 * Behavior:
 *   - Hover over button/a/[data-interactive] → ring expands (48px), dot hides
 *   - Hover over [data-text-area]            → ring shrinks (16px), electric blue
 *   - Random glitch offset every 6–10s       → ring jolts 4–8px for 80ms
 *
 * Uses requestAnimationFrame for smooth tracking.
 * All intervals/RAF loops are cleaned up on unmount.
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let rafId: number;
    let glitchTimeoutId: ReturnType<typeof setTimeout>;

    // ── Track raw mouse position ──────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // ── Hover state detection via delegation ──────────────────
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;

      if (target.closest('button, a, [data-interactive]')) {
        ring.classList.add('is-hovering');
        ring.classList.remove('is-text');
        dot.style.opacity = '0';
      } else if (target.closest('[data-text-area]')) {
        ring.classList.add('is-text');
        ring.classList.remove('is-hovering');
        dot.style.opacity = '1';
      } else {
        ring.classList.remove('is-hovering', 'is-text');
        dot.style.opacity = '1';
      }
    };

    // ── RAF loop — lerp ring toward mouse ─────────────────────
    const LERP = 0.12;
    const tick = () => {
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;

      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;

      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;

      rafId = requestAnimationFrame(tick);
    };

    // ── Random glitch offset ──────────────────────────────────
    const scheduleGlitch = () => {
      const delay = 6_000 + Math.random() * 4_000; // 6–10 s
      glitchTimeoutId = setTimeout(() => {
        if (!ring) return;
        const offset = 4 + Math.random() * 4; // 4–8 px
        ring.style.transform = `translate(-50%, -50%) translateX(${offset}px)`;
        setTimeout(() => {
          if (ring) ring.style.transform = 'translate(-50%, -50%)';
        }, 80);
        scheduleGlitch();
      }, delay);
    };

    // ── Mount ─────────────────────────────────────────────────
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    rafId = requestAnimationFrame(tick);
    scheduleGlitch();

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafId);
      clearTimeout(glitchTimeoutId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

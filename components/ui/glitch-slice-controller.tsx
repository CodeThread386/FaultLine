'use client';

import { useEffect } from 'react';

/**
 * GlitchSliceController — mounts globally and periodically applies a
 * .glitch-slice class to a random visible section for 120ms, then removes it.
 * This creates the "horizontal band shift" glitch effect described in the spec.
 *
 * Frequency: randomly every 12–18 seconds.
 * Cleanup: interval cleared on unmount to prevent memory leaks.
 */
export default function GlitchSliceController() {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = 12_000 + Math.random() * 6_000; // 12–18 s
      timeoutId = setTimeout(() => {
        triggerSlice();
        scheduleNext();
      }, delay);
    };

    const triggerSlice = () => {
      // Target the inner content wrapper of a random section
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-glitch-target]')
      );
      if (!sections.length) return;

      const target = sections[Math.floor(Math.random() * sections.length)];

      target.classList.add('glitch-slice');
      setTimeout(() => {
        target.classList.remove('glitch-slice');
      }, 120);
    };

    // First trigger after a short initial delay
    timeoutId = setTimeout(() => {
      triggerSlice();
      scheduleNext();
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Renders nothing — pure side-effect component
  return null;
}

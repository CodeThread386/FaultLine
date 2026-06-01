'use client';

import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';

const STAGGER = 0.035;

/**
 * TextRoll — pixel-perfect rolling text with chromatic aberration.
 *
 * ── Clipping strategy ────────────────────────────────────────────────────────
 *
 *  PROBLEM: overflow:hidden clips both axes. The '?' at the end of a long
 *  nowrap line gets cut off horizontally, while vertical clipping is needed
 *  to hide the second row.
 *
 *  FIX: Replace overflow:hidden with clip-path: inset(0 -500px)
 *    inset(top right bottom left)
 *    → 0 top/bottom  = clip exactly at the container's own edges (vertical)
 *    → -500px left/right = extend clip 500px beyond element (no horizontal clip)
 *
 * ── Descender bleed-through fix ──────────────────────────────────────────────
 *
 *  PROBLEM: Space Mono glyphs like 'g','y','p' have descenders that extend
 *  ~0.2em below the span's bounding box (1em with lineHeight:1). After the
 *  first-row exits at y:"-100%" = -1em, the bounding box top is at -1em but
 *  the descender bottom lands at (-1em + 1.2em) = 0.2em = INSIDE the clip.
 *
 *  FIX: Exit first row at y:"-200%" = -2em
 *    Descender lands at (-2em + 1.2em) = -0.8em = safely above clip ✓
 *
 * ── Second row initial positioning ───────────────────────────────────────────
 *
 *  Second row chars start at y:"120%" = 1.2em below their natural position
 *  (which is 0 within the absolute div at top:0). Container height ≈ 1em.
 *  1.2em > 1em clip boundary → fully hidden ✓
 *  On hover, animate to y:0 → visible ✓
 *
 * ── Separate controls ─────────────────────────────────────────────────────────
 *
 *  First and second rows need different initial/hovered variant values,
 *  so they each get their own useAnimation() instance.
 */

const TextRoll: React.FC<{
  children: string;
  className?: string;
  /** Stagger radiates from center outward when true */
  center?: boolean;
}> = ({ children, className, center = false }) => {
  // Separate controls — rows have different animation values
  const exitControls  = useAnimation(); // first row:  idle(y:0) → exit(y:'-200%')
  const enterControls = useAnimation(); // second row: idle(y:'120%') → enter(y:0)
  const redControls   = useAnimation();
  const blueControls  = useAnimation();

  const chars = children.split('');

  const getDelay = (i: number) =>
    center
      ? STAGGER * Math.abs(i - (chars.length - 1) / 2)
      : STAGGER * i;

  const charStyle: React.CSSProperties = { display: 'inline-block' };

  const onHoverStart = () => {
    // Chromatic aberration flash
    redControls.start({
      x: [0, -4, -2, 0],
      opacity: [0, 0.68, 0.4, 0],
      transition: { duration: 0.19, times: [0, 0.3, 0.65, 1], ease: 'easeOut' },
    });
    blueControls.start({
      x: [0, 4, 2, 0],
      opacity: [0, 0.68, 0.4, 0],
      transition: { duration: 0.19, times: [0, 0.3, 0.65, 1], ease: 'easeOut' },
    });
    // Roll
    exitControls.start('exit');
    enterControls.start('enter');
  };

  const onHoverEnd = () => {
    exitControls.start('idle');
    enterControls.start('idle');
  };

  // ── Aberration layer base style ──────────────────────────────────────────
  const aberrationBase: React.CSSProperties = {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    pointerEvents: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    zIndex: 3,
  };

  return (
    <motion.span
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className={cn('relative block', className)}
      style={{
        lineHeight: 1,
        whiteSpace: 'nowrap',
        /**
         * Vertical-only clip:
         *   inset(0 -500px) = top:0, right:-500px, bottom:0, left:-500px
         *   → clips at container's own top/bottom edges
         *   → does NOT clip 500px beyond left/right (no '?' cutoff)
         */
        clipPath: 'inset(0 -500px)',
      }}
    >
      {/* ── Red aberration channel ── */}
      <motion.div
        aria-hidden="true"
        animate={redControls}
        initial={{ x: 0, opacity: 0 }}
        style={{ ...aberrationBase, color: 'var(--accent-red)' }}
      >
        {chars.map((l, i) => (
          <span key={i} style={charStyle}>{l === ' ' ? '\u00A0' : l}</span>
        ))}
      </motion.div>

      {/* ── Blue aberration channel ── */}
      <motion.div
        aria-hidden="true"
        animate={blueControls}
        initial={{ x: 0, opacity: 0 }}
        style={{ ...aberrationBase, color: 'var(--accent-electric)' }}
      >
        {chars.map((l, i) => (
          <span key={i} style={charStyle}>{l === ' ' ? '\u00A0' : l}</span>
        ))}
      </motion.div>

      {/* ── First row — visible, exits upward on hover ──
          y: '-200%' = -2em ensures even descenders (which extend ~0.2em
          below the 1em bounding box) are pushed above the clip boundary:
            descender_bottom = -2em + 1.2em = -0.8em → above 0 ✓          ── */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {chars.map((l, i) => (
          <motion.span
            key={i}
            animate={exitControls}
            initial="idle"
            variants={{
              idle: { y: 0 },
              exit: { y: '-200%' },
            }}
            transition={{ ease: 'easeInOut', delay: getDelay(i) }}
            style={charStyle}
          >
            {l === ' ' ? '\u00A0' : l}
          </motion.span>
        ))}
      </div>

      {/* ── Second row — starts below clip, enters from below on hover ──
          Initial y:'120%' of char height (≈1.2em) > container height (≈1em)
          → safely outside the clip-path boundary → invisible at rest ✓
          On hover: y → 0 (char's natural position = within visible area) ✓
          Descender of 'g' at rest (y:0): bounding box 0–1em, descender at
          1.2em → clipped by inset(0) bottom ✓                              ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          whiteSpace: 'nowrap',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        {chars.map((l, i) => (
          <motion.span
            key={i}
            animate={enterControls}
            initial="idle"
            variants={{
              idle:  { y: '120%' },
              enter: { y: 0 },
            }}
            transition={{ ease: 'easeInOut', delay: getDelay(i) }}
            style={charStyle}
          >
            {l === ' ' ? '\u00A0' : l}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
};

export { TextRoll };

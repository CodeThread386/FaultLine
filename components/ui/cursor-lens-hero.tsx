'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTime,
  useTransform,
} from 'framer-motion';

// ─── Default Configuration ────────────────────────────────────────────────────
const DEFAULTS = {
  baseImage:       '/base_img.jpg',
  revealImage:     '/hover_img.jpg',
  objectFit:       'cover' as const,
  backgroundColor: '#0a0a0f',
  blobOutlineColor:'#4a4e69',
  parallaxStrength: 4,
  showBackground:  true,
  bgBlobCount:     15,
  bgBlobSize:      80,
  bgBlobComplexity:60,
  bgBlobSpeed:     1,
  blobStrokeWidth: 1,
  blobSize:        120,
  shapeComplexity: 0.8,
  roughness:       0,
  speed:           250,
  viscosity:       1,
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CursorLensHero() {
  const {
    baseImage,
    revealImage,
    objectFit,
    backgroundColor,
    blobOutlineColor,
    parallaxStrength,
    showBackground,
    bgBlobCount,
    bgBlobSize,
    bgBlobComplexity,
    bgBlobSpeed,
    blobStrokeWidth,
    blobSize,
    shapeComplexity,
    roughness,
    speed,
    viscosity,
  } = DEFAULTS;

  const [isHovering, setIsHovering] = React.useState(false);

  // Reference to the container for coordinate math
  const containerRef = React.useRef<HTMLDivElement>(null);

  // ── 1. Background blobs ──────────────────────────────────────────────────
  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  const backgroundBlobs = React.useMemo(() => {
    return [...Array(bgBlobCount)].map(() => ({
      x: [
        random(-20, 110) + '%',
        random(-20, 110) + '%',
        random(-20, 110) + '%',
      ],
      y: [
        random(-20, 110) + '%',
        random(-20, 110) + '%',
        random(-20, 110) + '%',
      ],
      sizeFactor: random(0.5, 1.5),
      duration: random(25, 50) / bgBlobSpeed,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgBlobCount, bgBlobSpeed]);

  const bgFilterId   = React.useId();
  const cursorFilterId = React.useId();
  const maskId       = React.useId();

  // ── 2. Mouse & parallax physics ─────────────────────────────────────────
  const mouseX      = useMotionValue(0);
  const mouseY      = useMotionValue(0);
  const mouseXRatio = useMotionValue(0);
  const mouseYRatio = useMotionValue(0);

  const smoothOptions = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mouseXRatio, smoothOptions);
  const smoothY = useSpring(mouseYRatio, smoothOptions);

  const baseX = useTransform(smoothX, [-1, 1], [parallaxStrength,  -parallaxStrength]);
  const baseY = useTransform(smoothY, [-1, 1], [parallaxStrength,  -parallaxStrength]);
  const revX  = useTransform(smoothX, [-1, 1], [parallaxStrength * 2.5, -parallaxStrength * 2.5]);
  const revY  = useTransform(smoothY, [-1, 1], [parallaxStrength * 2.5, -parallaxStrength * 2.5]);

  // ── 3. Global mouse / touch tracking ────────────────────────────────────
  React.useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;

      const rect    = containerRef.current.getBoundingClientRect();
      const clientX = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
      const clientY = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;

      const isInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      setIsHovering(isInside);

      if (isInside) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        mouseX.set(x);
        mouseY.set(y);
        mouseXRatio.set((x / rect.width)  * 2 - 1);
        mouseYRatio.set((y / rect.height) * 2 - 1);
      } else {
        mouseXRatio.set(0);
        mouseYRatio.set(0);
      }
    };

    window.addEventListener('mousemove',  handleGlobalMove as EventListener);
    window.addEventListener('touchstart', handleGlobalMove as EventListener, { passive: true });
    window.addEventListener('touchmove',  handleGlobalMove as EventListener, { passive: true });

    return () => {
      window.removeEventListener('mousemove',  handleGlobalMove as EventListener);
      window.removeEventListener('touchstart', handleGlobalMove as EventListener);
      window.removeEventListener('touchmove',  handleGlobalMove as EventListener);
    };
  }, [mouseX, mouseY, mouseXRatio, mouseYRatio]);

  // ── 4. Fluid cursor physics ──────────────────────────────────────────────
  const time = useTime();

  // Helper: each wake node gets progressively laggier springs
  const makeWake = (index: number) => {
    const stiffness = speed  * (1 - index * 0.15);
    const damping   = 20    + viscosity * index * 5;
    const mass      = 0.1   + index * 0.1;
    return {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      x: useSpring(mouseX, { stiffness, damping, mass }),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      y: useSpring(mouseY, { stiffness, damping, mass }),
    };
  };

  const head  = makeWake(0);
  const body1 = makeWake(1);
  const body2 = makeWake(2);
  const tail  = makeWake(4);

  const cr = blobSize * shapeComplexity * 0.6;
  const sat1X = useTransform(time, (t) => head.x.get() + Math.sin(t * 0.002) * cr);
  const sat1Y = useTransform(time, (t) => head.y.get() + Math.cos(t * 0.002) * cr);
  const sat2X = useTransform(time, (t) => head.x.get() + Math.cos(t * 0.004) * (cr * 0.8));
  const sat2Y = useTransform(time, (t) => head.y.get() + Math.sin(t * 0.004) * (cr * 0.8));

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      id="hero-main"
      className="cursor-lens-hero"
      ref={containerRef}
      style={{ backgroundColor }}
      aria-label="Hero section"
    >
      {/* ── Background blobs ── */}
      {showBackground && (
        <>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <filter id={bgFilterId}>
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={bgBlobComplexity} xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0, overflow: 'visible' }}>
            <g filter={`url(#${bgFilterId})`}>
              {backgroundBlobs.map((blob, i) => (
                <motion.circle
                  key={i}
                  initial={{ cx: blob.x[0], cy: blob.y[0] }}
                  animate={{ cx: blob.x, cy: blob.y }}
                  transition={{ duration: blob.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                  r={blob.sizeFactor * bgBlobSize}
                  fill="none"
                  stroke={blobOutlineColor}
                  strokeWidth={blobStrokeWidth}
                  strokeOpacity={0.5}
                />
              ))}
            </g>
          </svg>
        </>
      )}

      {/* ── Cursor goo filter ── */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={cursorFilterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={roughness} xChannelSelector="R" yChannelSelector="G" result="distorted" />
            <feGaussianBlur in="distorted" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ── SVG mask definition ── */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', opacity: 0 }}>
        <defs>
          <mask id={maskId}>
            <g filter={`url(#${cursorFilterId})`}>
              <motion.g animate={{ opacity: isHovering ? 1 : 0 }} transition={{ duration: 0.3 }}>
                <motion.circle cx={sat1X}  cy={sat1Y}  r={blobSize * 0.6} fill="white" />
                <motion.circle cx={sat2X}  cy={sat2Y}  r={blobSize * 0.5} fill="white" />
                <motion.circle cx={head.x} cy={head.y} r={blobSize * 0.7} fill="white" />
                <motion.circle cx={body1.x} cy={body1.y} r={blobSize * 0.6} fill="white" />
                <motion.circle cx={body2.x} cy={body2.y} r={blobSize * 0.5} fill="white" />
                <motion.circle cx={tail.x}  cy={tail.y}  r={blobSize * 0.3} fill="white" />
              </motion.g>
            </g>
          </mask>
        </defs>
      </svg>

      {/* ── Base image layer ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage:    `url(${baseImage})`,
            backgroundSize:     objectFit,
            backgroundPosition: 'center',
            backgroundRepeat:   'no-repeat',
            willChange:         'transform',
            x: baseX,
            y: baseY,
            scale: 1.1,
          }}
        />
      </div>

      {/* ── Reveal image layer (masked by cursor blob) ── */}
      <motion.div
        style={{
          position:       'absolute',
          inset:          0,
          zIndex:         20,
          pointerEvents:  'none',
          mask:           `url(#${maskId})`,
          WebkitMask:     `url(#${maskId})`,
        }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage:    `url(${revealImage})`,
            backgroundSize:     objectFit,
            backgroundPosition: 'center',
            backgroundRepeat:   'no-repeat',
            willChange:         'transform',
            x: revX,
            y: revY,
            scale: 1.1,
          }}
        />
      </motion.div>

      {/* ── Hero text overlay ── */}
      <div className="clh-overlay" style={{ position: 'relative', zIndex: 30 }}>
        <motion.div
          className="clh-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <p className="clh-eyebrow">The Engineering Hackathon</p>
          <h1 className="clh-title">Fault Line</h1>
          <p className="clh-sub">
            Break it to build it.<br />Two phases. Zero mercy.
          </p>
          <motion.a
            href="#how-it-works"
            className="clh-cta"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Learn More
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="clh-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="clh-scroll-line" />
          <span>Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

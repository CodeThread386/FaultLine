'use client';

import { motion } from 'framer-motion';
import { TextRoll } from '@/components/ui/text-roll';

const CHROMATIC_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 48,
    filter:
      'drop-shadow(-2px 0 0 rgba(255,45,45,0.6)) drop-shadow(2px 0 0 rgba(45,155,255,0.6))',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter:
      'drop-shadow(0px 0 0 rgba(255,45,45,0)) drop-shadow(0px 0 0 rgba(45,155,255,0))',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Geological fault-crack SVG path — jagged, not smooth.
 * Drawn via stroke-dashoffset animation on scroll entry.
 */
function FaultCrackSVG() {
  return (
    <svg
      className="register-crack-svg"
      viewBox="0 0 1400 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d="M0,300 L120,310 L180,280 L240,320 L310,295 L380,315 L430,285
           L490,325 L560,290 L620,330 L680,275 L740,320 L800,285 L860,315
           L920,280 L980,325 L1040,290 L1100,310 L1160,285 L1220,315 L1280,300 L1400,300"
        stroke="var(--accent-red)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
      />
      {/* Secondary micro-crack above */}
      <motion.path
        d="M200,240 L260,252 L310,235 L370,255 L420,238 L480,258 L530,240
           L590,254 L640,236 L700,250"
        stroke="var(--accent-red)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.6 }}
      />
      {/* Tertiary micro-crack below */}
      <motion.path
        d="M700,360 L760,372 L810,355 L870,370 L920,352 L980,368 L1040,350
           L1100,365 L1160,350 L1220,362"
        stroke="var(--accent-orange)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.3"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.9 }}
      />
    </svg>
  );
}

export default function SectionRegister() {
  return (
    <section
      id="register"
      className="register-section"
      aria-labelledby="register-heading"
    >
      {/* Fault crack behind content */}
      <FaultCrackSVG />

      <div className="register-inner">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={CHROMATIC_VARIANTS}
        >
          <p className="section-label">[ 05 — JOIN ]</p>
          <h2 id="register-heading" className="register-headline">
            <TextRoll center className="concept-headline-line">Are You Brave</TextRoll>
            <TextRoll center className="concept-headline-line">Enough to Build Bad?</TextRoll>
          </h2>
          <p className="register-body" data-text-area>
            Join the engineers who embrace chaos, survive inheritance, and prove
            they can fix anything under pressure.
          </p>

          <div className="register-buttons">
            <a
              href="#"
              id="register-primary-cta"
              className="btn-primary"
              data-interactive="true"
            >
              Register Your Team
            </a>
            <a
              href="#"
              id="register-secondary-cta"
              className="btn-secondary"
              data-interactive="true"
            >
              View Past Projects
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

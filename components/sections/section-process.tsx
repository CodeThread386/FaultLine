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

const PHASES = [
  {
    num:    '01',
    label:  'PHASE 01 — BREAK IT',
    title:  'Break It',
    accent: 'red',
    body:
      'Build the most catastrophically engineered software you can. Embrace spaghetti architecture. Celebrate naming disasters. Ship chaos.',
  },
  {
    num:    '02',
    label:  'PHASE 02 — SWAP IT',
    title:  'Swap It',
    accent: 'orange',
    body:
      'Hand your beautiful disaster to another team. Receive theirs. The nightmare is now your inheritance.',
  },
  {
    num:    '03',
    label:  'PHASE 03 — FIX IT',
    title:  'Fix It',
    accent: 'blue',
    body:
      'Refactor, rescue, and redeem. Transform inherited chaos into clean, maintainable, production-worthy code under time pressure.',
  },
];

const ACCENT_CLASS: Record<string, string> = {
  red:    'process-card--red',
  orange: 'process-card--orange',
  blue:   'process-card--blue',
};

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function SectionProcess() {
  return (
    <section
      id="process"
      className="fl-section fl-section--secondary"
      aria-labelledby="process-heading"
    >
      <div className="fl-inner">
        {/* Label + headline */}
        <motion.div
          className="fl-section-top"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={CHROMATIC_VARIANTS}
        >
          <p className="section-label">[ 02 — PROCESS ]</p>
          <h2 id="process-heading" className="concept-headline">
            <TextRoll center className="concept-headline-line">Three Phases.</TextRoll>
            <TextRoll center className="concept-headline-line">Zero Mercy.</TextRoll>
          </h2>
        </motion.div>

        {/* Cards + arrows — flat array to avoid fragment key issues */}
        <div className="process-cards">
          {PHASES.flatMap((phase, i) => {
            const card = (
              <motion.div
                key={phase.num}
                className={`process-card ${ACCENT_CLASS[phase.accent]}`}
                data-glitch-target={phase.accent === 'red' ? 'true' : undefined}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                data-interactive="true"
              >
                <span className="process-bg-number" aria-hidden="true">
                  {phase.num}
                </span>
                <p className="process-phase-label">{phase.label}</p>
                <h3 className="process-card-title">{phase.title}</h3>
                <p className="process-card-body">{phase.body}</p>
              </motion.div>
            );

            if (i < PHASES.length - 1) {
              return [
                card,
                <div key={`arrow-${i}`} className="process-arrow" aria-hidden="true">
                  <ChevronRight />
                </div>,
              ];
            }
            return [card];
          })}
        </div>
      </div>
    </section>
  );
}

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

const STAT_CARDS = [
  { value: '48 HRS',    label: 'Total event duration' },
  { value: '2 PHASES',  label: 'Build Chaos — then Fix Chaos' },
  { value: 'INFINITE',  label: 'Bugs intentionally shipped' },
];

export default function SectionConcept() {
  return (
    <section
      id="concept"
      className="fl-section fl-section--primary"
      aria-labelledby="concept-heading"
    >
      <div className="fl-inner">
        {/* Label */}
        <motion.div
          className="fl-section-top"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={CHROMATIC_VARIANTS}
        >
          <p className="section-label">[ 01 — CONCEPT ]</p>

          {/* Two-column grid */}
          <div className="concept-grid">
            {/* Left — text */}
            <div data-text-area>
              <h2 id="concept-heading" className="concept-headline">
                <TextRoll center className="concept-headline-line">Build Broken.</TextRoll>
                <TextRoll center className="concept-headline-line">Fix Brilliant.</TextRoll>
              </h2>
              <p className="concept-body">
                FaultLine is the hackathon that rewards engineering chaos as
                much as engineering excellence. Two phases. Two completely
                different mindsets. One unforgettable competition.
              </p>
            </div>

            {/* Right — stat cards */}
            <div className="stat-cards">
              {STAT_CARDS.map((card, i) => (
                <motion.div
                  key={card.value}
                  className="stat-card"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  data-interactive="true"
                >
                  <p className="stat-value">[ {card.value} ]</p>
                  <p className="stat-label">{card.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Fault crack divider */}
        <div className="fault-crack-line" aria-hidden="true" />
      </div>
    </section>
  );
}

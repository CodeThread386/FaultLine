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

const FEATURES = [
  {
    num: '01',
    title: 'Real-World Debugging',
    body: 'Production code is never yours. Learn to read, understand, and fix what someone else intentionally broke.',
  },
  {
    num: '02',
    title: 'Dual-Skill Testing',
    body: 'Creativity in destruction. Discipline in restoration. Two completely opposite engineering modes, one event.',
  },
  {
    num: '03',
    title: 'Intentional Chaos',
    body: 'The only hackathon that rewards bad variable names, circular dependencies, and god objects — for exactly six hours.',
  },
  {
    num: '04',
    title: 'Team Dynamics',
    body: 'Six hours building together, then six hours figuring out what the previous team was thinking.',
  },
  {
    num: '05',
    title: 'Employer Signal',
    body: 'Inheriting and fixing broken systems is the most valued — and rarest — skill in professional engineering.',
  },
  {
    num: '06',
    title: 'Judged on Both',
    body: 'Scoring covers chaos creativity and refactor quality equally. You cannot win by being good at only one.',
  },
];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SectionWhy() {
  return (
    <section
      id="why"
      className="fl-section fl-section--primary"
      aria-labelledby="why-heading"
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
          <p className="section-label">[ 03 — WHY ]</p>
          <h2 id="why-heading" className="concept-headline">
            <TextRoll center className="concept-headline-line">Skills You</TextRoll>
            <TextRoll center className="concept-headline-line">Can&apos;t Fake.</TextRoll>
          </h2>
        </motion.div>

        {/* 3×2 grid */}
        <div className="why-grid">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.num}
              className="why-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={CARD_VARIANTS}
              data-interactive="true"
            >
              <p className="why-card-number">{feat.num}</p>
              <h3 className="why-card-title">{feat.title}</h3>
              <p className="why-card-body">{feat.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

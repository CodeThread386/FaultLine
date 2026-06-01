'use client';

import { useEffect, useRef } from 'react';
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

const RULES = [
  'Teams of 3–4 participants.',
  'Phase 1: 6 hours to build intentionally bad software.',
  'Judges score chaos originality — not just mess, but creative mess.',
  'Projects are swapped anonymously between teams.',
  'Phase 2: 6 hours to refactor the inherited codebase.',
  'Final scoring: chaos creativity 40% — refactor quality 60%.',
  'No AI-assisted refactoring. No outside help. Pure engineering.',
];

// ── Terminal Code Lines ────────────────────────────────────────────────────────

function TerminalBlock() {
  const linesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleFlicker = () => {
      const delay = 12_000 + Math.random() * 6_000;
      timeoutId = setTimeout(() => {
        const idx = Math.floor(Math.random() * linesRef.current.length);
        const el  = linesRef.current[idx];
        if (el) {
          el.classList.add('glitch-line');
          setTimeout(() => el.classList.remove('glitch-line'), 200);
        }
        scheduleFlicker();
      }, delay);
    };

    scheduleFlicker();
    return () => clearTimeout(timeoutId);
  }, []);

  // prettier-ignore
  const lines: React.ReactNode[] = [
    <><span className="tc-cm">{'// chaos_engine.js — do not touch — it works somehow'}</span></>,
    <></>,
    <><span className="tc-kw">function </span><span className="tc-fn">doTheThing</span><span className="tc-op">()</span><span className="tc-op"> {'{'}</span></>,
    <><span className="tc-cm">{'  // from SO, not sure why this works'}</span></>,
    <><span className="tc-kw">  const </span><span className="tc-var">x2 </span><span className="tc-op">= </span><span className="tc-num">42069</span><span className="tc-op"> * </span><span className="tc-num">0</span><span className="tc-op"> || </span><span className="tc-lit">&apos;undefined&apos;</span><span className="tc-op">;</span></>,
    <><span className="tc-kw">  let </span><span className="tc-var">tempFinal </span><span className="tc-op">=</span> <span className="tc-num">0</span><span className="tc-op">;</span></>,
    <><span className="tc-kw">  var </span><span className="tc-var">realFinalV3 </span><span className="tc-op">= </span><span className="tc-fn">parseInt</span><span className="tc-op">(</span><span className="tc-str">&apos;9&apos;</span><span className="tc-op">, </span><span className="tc-num">16</span><span className="tc-op">)</span><span className="tc-op">;</span></>,
    <></>,
    <><span className="tc-kw">  const </span><span className="tc-var">result </span><span className="tc-op">=</span></>,
    <><span className="tc-var">    x2 </span><span className="tc-op">=== </span><span className="tc-lit">&apos;undefined&apos;</span></>,
    <><span className="tc-op">      ? </span><span className="tc-var">tempFinal </span><span className="tc-op">&gt; </span><span className="tc-num">0</span></>,
    <><span className="tc-op">        ? </span><span className="tc-var">realFinalV3 </span><span className="tc-op">* </span><span className="tc-num">2</span></>,
    <><span className="tc-op">        : </span><span className="tc-var">tempFinal </span><span className="tc-op">% </span><span className="tc-num">7 </span><span className="tc-op">=== </span><span className="tc-num">0</span></>,
    <><span className="tc-op">          ? </span><span className="tc-num">99</span></>,
    <><span className="tc-op">          : </span><span className="tc-fn">Math</span><span className="tc-op">.</span><span className="tc-fn">floor</span><span className="tc-op">(</span><span className="tc-fn">Math</span><span className="tc-op">.</span><span className="tc-fn">random</span><span className="tc-op">() * </span><span className="tc-num">100</span><span className="tc-op">)</span></>,
    <><span className="tc-op">      : </span><span className="tc-num">0</span><span className="tc-op">;</span></>,
    <></>,
    <><span className="tc-cm">{'  // absolutely necessary, do not remove'}</span></>,
    <><span className="tc-fn">  setTimeout</span><span className="tc-op">(() =&gt; {'{'}</span></>,
    <><span className="tc-var">    tempFinal </span><span className="tc-op">= </span><span className="tc-var">result</span><span className="tc-op">;</span></>,
    <><span className="tc-fn">    console</span><span className="tc-op">.</span><span className="tc-fn">log</span><span className="tc-op">(</span><span className="tc-str">&apos;done maybe&apos;</span><span className="tc-op">);</span></>,
    <><span className="tc-op">  {'}'}, </span><span className="tc-num">0</span><span className="tc-op">);</span></>,
    <></>,
    <><span className="tc-cm">{'  // this condition has never been false in production'}</span></>,
    <><span className="tc-kw">  if </span><span className="tc-op">(</span><span className="tc-var">result </span><span className="tc-op">=== </span><span className="tc-var">result</span><span className="tc-op">) {'{'}</span></>,
    <><span className="tc-kw">    return </span><span className="tc-var">realFinalV3</span><span className="tc-op">;</span></>,
    <><span className="tc-op">  {'}'}</span></>,
    <><span className="tc-cm">{'  // fallback. nobody knows when this runs'}</span></>,
    <><span className="tc-kw">  return </span><span className="tc-var">x2</span><span className="tc-op">;</span></>,
    <><span className="tc-op">{'}'}</span></>,
  ];

  return (
    <div className="terminal-block" role="presentation" aria-hidden="true">
      {/* Top bar */}
      <div className="terminal-topbar">
        <span className="terminal-dot terminal-dot--red"   />
        <span className="terminal-dot terminal-dot--yellow"/>
        <span className="terminal-dot terminal-dot--green" />
        <span className="terminal-filename">chaos_engine.js</span>
      </div>

      {/* Code */}
      <div className="terminal-code">
        {lines.map((line, i) => (
          <span
            key={i}
            className="tc-line"
            ref={(el) => { linesRef.current[i] = el; }}
          >
            {line}
            {'\n'}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SectionFormat() {
  return (
    <section
      id="format"
      className="fl-section fl-section--secondary"
      aria-labelledby="format-heading"
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
          <p className="section-label">[ 04 — FORMAT ]</p>
          <h2 id="format-heading" className="concept-headline">
            <TextRoll center className="concept-headline-line">The Rules of</TextRoll>
            <TextRoll center className="concept-headline-line">Disorder.</TextRoll>
          </h2>
        </motion.div>

        <div className="format-grid">
          {/* Left — rules, vertically centered to match terminal height */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ol className="rules-list" style={{ width: '100%' }}>
              {RULES.map((rule, i) => (
                <li key={i} className="rule-item">
                  <span className="rule-number">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span className="rule-text" data-text-area>{rule}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Right — terminal */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <TerminalBlock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

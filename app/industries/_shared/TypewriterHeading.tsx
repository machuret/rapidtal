'use client';

/* ═══════════════════════════════════════════════════════════════════════════
 * Typewriter heading — word-reveal on scroll-into-view.
 *
 * Adapted from the shadcn/aceternity TypewriterEffectSmooth pattern, but
 * ported to our CSS-Module architecture (no Tailwind, no cn helper).
 *
 * The "typing" is a horizontal width reveal: the text sits behind an
 * overflow:hidden container whose width animates from 0 → fit-content. A
 * blinking cursor bar anchors the right edge during reveal and then stays
 * pulsing after. Visually identical to a per-char typewriter but one animated
 * property (width) — cheap and smooth.
 *
 * Plays once per page-load (viewport.once=true) — not every time the user
 * scrolls back into view, which would be annoying on a landing page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion';
import styles from './landing.module.css';

export interface TypewriterWord {
  text: string;
  /** Render this word in the brand orange (the CTA's highlighted phrase) */
  highlight?: boolean;
}

export default function TypewriterHeading({
  words,
  className,
  /** Total reveal duration in seconds. Default 1.8s. Long strings benefit from
   *  a slightly longer duration so the eye can follow the line. */
  duration = 1.8,
  /** Delay before reveal starts (allows the user to perceive the static
   *  starting point before motion begins). */
  delay = 0.4,
}: {
  words: TypewriterWord[];
  className?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <div className={className ? `${styles.typewriter} ${className}` : styles.typewriter}>
      <motion.div
        className={styles.typewriterReveal}
        initial={{ width: '0%' }}
        whileInView={{ width: 'fit-content' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration, ease: 'linear', delay }}
      >
        <div className={styles.typewriterInner}>
          {words.map((w, i) => (
            <span
              key={`${w.text}-${i}`}
              className={w.highlight ? styles.typewriterWordHL : styles.typewriterWord}
            >
              {w.text}
              {/* Trailing space — rendered as a normal char so width calc
                   includes inter-word gaps. */}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.span
        className={styles.typewriterCursor}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

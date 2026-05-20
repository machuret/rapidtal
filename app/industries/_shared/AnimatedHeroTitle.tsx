'use client';

/* ═══════════════════════════════════════════════════════════════════════════
 * Animated hero H1 with a rotating word.
 *
 * Adapted from the aceternity/animated-hero pattern, ported to CSS Modules.
 * Structure:
 *   "Your Commercial Real Estate Agency is"          ← static lead
 *   [overpaying | overstaffed | overwhelmed | …]     ← rotates every 2s
 *
 * The rotating word sits inside a relative container where all candidates
 * are absolutely positioned and stacked. Only the active one has y:0,
 * opacity:1; inactive ones slide up or down out of view. Spring physics
 * make the motion feel organic.
 *
 * Accessibility: the full rotation list is rendered in the DOM so screen
 * readers don't miss content. For users with prefers-reduced-motion we
 * skip the animation loop and freeze on the first word.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './landing.module.css';

export default function AnimatedHeroTitle({
  lead,
  rotatingWords,
  /** Milliseconds between rotations. 2000 matches the source pattern and
   *  reads comfortably — faster feels frantic, slower feels sluggish. */
  intervalMs = 2000,
}: {
  lead: string;
  rotatingWords: string[];
  intervalMs?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (rotatingWords.length <= 1) return;
    // Respect reduced-motion preference — freeze on first word
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % rotatingWords.length);
    }, intervalMs);
    return () => clearTimeout(t);
  }, [idx, rotatingWords.length, intervalMs]);

  // Visually-hidden canonical sentence for screen readers + crawlers.
  // e.g. "Your Commercial Real Estate Agency is overpaying, overstaffed,
  // overworked, overwhelmed or overspending." Joined with "or" before the
  // last word so it reads naturally.
  const srSentence = (() => {
    if (rotatingWords.length === 0) return lead;
    if (rotatingWords.length === 1) return `${lead} ${rotatingWords[0]}.`;
    const all = rotatingWords.slice(0, -1).join(', ');
    const last = rotatingWords[rotatingWords.length - 1];
    return `${lead} ${all} or ${last}.`;
  })();

  return (
    <h1 className={styles.heroTitle}>
      {/* SR-only line — gives assistive tech + crawlers the full meaning,
           without any motion. Visually hidden, but kept in the DOM. */}
      <span className={styles.srOnly}>{srSentence}</span>

      {/* The visual animated block is marked aria-hidden so SRs don't read
           every word transition. */}
      <span className={styles.heroTitleLead} aria-hidden="true">{lead}</span>
      <span className={styles.rotatingWrap} aria-hidden="true">
        {/* Non-breaking space reserves the line height while words slide */}
        &nbsp;
        {rotatingWords.map((word, i) => (
          <motion.span
            key={word}
            className={styles.rotatingWord}
            initial={{ opacity: 0, y: -120 }}
            transition={{ type: 'spring', stiffness: 50, damping: 12 }}
            animate={
              idx === i
                ? { y: 0, opacity: 1 }
                : { y: idx > i ? -160 : 160, opacity: 0 }
            }
          >
            {word}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

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

import { useEffect, useRef, useState } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `${styles.typewriter} ${className}` : styles.typewriter}
    >
      <div
        className={styles.typewriterReveal}
        style={{
          width: revealed ? 'fit-content' : '0%',
          transition: revealed ? `width ${duration}s linear ${delay}s` : 'none',
        }}
      >
        <div className={styles.typewriterInner}>
          {words.map((w, i) => (
            <span
              key={`${w.text}-${i}`}
              className={w.highlight ? styles.typewriterWordHL : styles.typewriterWord}
            >
              {w.text}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      </div>
      <span
        className={styles.typewriterCursor}
        style={{ animation: 'twCursorBlink 0.8s ease infinite alternate' }}
        aria-hidden="true"
      />
    </div>
  );
}

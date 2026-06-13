'use client';

import { useEffect, useState } from 'react';
import styles from './landing.module.css';

export default function AnimatedHeroTitle({
  lead,
  rotatingWords,
  intervalMs = 2000,
}: {
  lead: string;
  rotatingWords: string[];
  intervalMs?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (rotatingWords.length <= 1) return;
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

  const srSentence = (() => {
    if (rotatingWords.length === 0) return lead;
    if (rotatingWords.length === 1) return `${lead} ${rotatingWords[0]}.`;
    const all = rotatingWords.slice(0, -1).join(', ');
    const last = rotatingWords[rotatingWords.length - 1];
    return `${lead} ${all} or ${last}.`;
  })();

  return (
    <h1 className={styles.heroTitle}>
      <span className={styles.srOnly}>{srSentence}</span>
      <span className={styles.heroTitleLead} aria-hidden="true">{lead}</span>
      <span className={styles.rotatingWrap} aria-hidden="true">
        &nbsp;
        {rotatingWords.map((word, i) => {
          const isActive = idx === i;
          const translateY = isActive ? 0 : idx > i ? -160 : 160;
          return (
            <span
              key={word}
              className={styles.rotatingWord}
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateY(${translateY}px)`,
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {word}
            </span>
          );
        })}
      </span>
    </h1>
  );
}

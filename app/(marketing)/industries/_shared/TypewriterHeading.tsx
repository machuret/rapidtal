'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './landing.module.css';

export interface TypewriterWord {
  text: string;
  highlight?: boolean;
}

export default function TypewriterHeading({
  words,
  className,
  duration = 1.8,
  delay = 0.4,
}: {
  words: TypewriterWord[];
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className ? `${styles.typewriter} ${className}` : styles.typewriter}>
      <div
        className={styles.typewriterReveal}
        style={{
          width: visible ? 'fit-content' : '0%',
          transition: `width ${duration}s linear ${delay}s`,
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
      <span className={styles.typewriterCursor} aria-hidden="true" />
    </div>
  );
}

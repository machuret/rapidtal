'use client';

/* ═══════════════════════════════════════════════════════════════════════════
 * Tiny client island that smooth-scrolls to a target element by id.
 * Keeping this as a separate component so every other industry section can
 * stay a server component (zero hydration JS shipped for static content).
 * ═══════════════════════════════════════════════════════════════════════════ */

import styles from './landing.module.css';

export default function ScrollButton({
  target,
  className,
  children,
}: {
  target: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className ?? styles.btnPrimary}
      onClick={() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      {children}
    </button>
  );
}

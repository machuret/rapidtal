'use client';

/* ═══════════════════════════════════════════════════════════════════════════
 * Mobile-only sticky CTA bar that appears after the user scrolls past the
 * hero and stays docked at the bottom of the viewport. Hidden on desktop
 * (where the main CTA section is always in reach). Config-driven label +
 * target so each industry can control the messaging.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react';
import styles from './landing.module.css';

interface Props {
  label: string;
  /** Element id to smooth-scroll to when tapped. */
  target?: string;
}

export default function StickyMobileCta({ label, target = 'cta-sec' }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`${styles.stickyCta} ${visible ? styles.stickyCtaVisible : ''}`}
      aria-hidden={!visible}
    >
      <a
        href={`#${target}`}
        onClick={onClick}
        className={styles.stickyCtaBtn}
        tabIndex={visible ? 0 : -1}
      >
        {label} <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

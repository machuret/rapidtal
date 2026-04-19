'use client';

/* ═══════════════════════════════════════════════════════════════════════════
 * Top-of-page attention strip — the first thing a visitor sees.
 *
 * Sticky above Nav on all breakpoints. Dismissible; the dismissal is
 * persisted in localStorage, keyed per industry slug so closing it on one
 * page doesn't silence every landing page.
 *
 * On SSR we start hidden (to avoid a flash of the bar before hydration
 * reads localStorage), then reveal once we've confirmed it wasn't dismissed.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './landing.module.css';

interface Props {
  /** Short eyebrow, e.g. "LIMITED" or "FREE". Rendered as a pill. */
  badge?: string;
  /** Main announcement copy. Keep under ~80 chars for mobile legibility. */
  message: string;
  /** CTA link label. Tapping smooth-scrolls to `target`. */
  ctaLabel: string;
  /** Element id to smooth-scroll to. Defaults to the CTA section. */
  target?: string;
  /** Per-page dismissal key so each industry bar is closed independently. */
  storageKey: string;
}

export default function AttentionBar({
  badge,
  message,
  ctaLabel,
  target = 'cta-sec',
  storageKey,
}: Props) {
  // Start hidden on SSR so we don't flash the bar for users who've dismissed.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(storageKey);
      if (!dismissed) setVisible(true);
    } catch {
      // localStorage unavailable (privacy mode) — fail open and show the bar.
      setVisible(true);
    }
  }, [storageKey]);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(storageKey, '1');
    } catch {
      /* ignore */
    }
  };

  const onCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!visible) return null;

  return (
    <div className={styles.attnBar} role="region" aria-label="Announcement">
      <div className={styles.attnInner}>
        {badge && <span className={styles.attnBadge}>{badge}</span>}
        <span className={styles.attnMsg}>{message}</span>
        <a
          href={`#${target}`}
          onClick={onCtaClick}
          className={styles.attnCta}
        >
          {ctaLabel} <span aria-hidden="true">→</span>
        </a>
        <button
          type="button"
          onClick={dismiss}
          className={styles.attnClose}
          aria-label="Dismiss announcement"
        >
          <X size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

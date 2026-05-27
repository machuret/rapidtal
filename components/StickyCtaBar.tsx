'use client';

import { useState, useEffect } from 'react';

interface StickyCtaBarProps {
  badge?: string;
  sub?: string;
  btnLabel?: string;
  btnHref?: string;
}

export default function StickyCtaBar({
  badge = '18 days to your next hire',
  sub = 'Elite Filipino marketing & sales talent. One flat fee. You own them.',
  btnLabel = 'Take the Calculator →',
  btnHref = '/calculator',
}: StickyCtaBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight * 0.9;
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`sticky-cta-bar${visible ? ' sticky-cta-bar--visible' : ''}`}
      aria-hidden={!visible}
    >
      <div className="sticky-cta-inner">
        <div className="sticky-cta-text">
          <span className="sticky-cta-badge">{badge}</span>
          <span className="sticky-cta-sub">{sub}</span>
        </div>
        <a href={btnHref} className="sticky-cta-btn" tabIndex={visible ? 0 : -1}>
          {btnLabel}
        </a>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`sticky-cta-bar${visible ? ' sticky-cta-bar--visible' : ''}`} aria-hidden={!visible}>
      <div className="sticky-cta-inner">
        <div className="sticky-cta-text">
          <span className="sticky-cta-badge">18 days to your next hire</span>
          <span className="sticky-cta-sub">Elite Filipino marketing &amp; sales talent. One flat fee. You own them.</span>
        </div>
        <a href="/calculator" className="sticky-cta-btn" tabIndex={visible ? 0 : -1}>
          Take the Calculator →
        </a>
      </div>
    </div>
  );
}

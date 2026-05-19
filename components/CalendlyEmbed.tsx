'use client';

import { useEffect } from 'react';

export default function CalendlyEmbed() {
  useEffect(() => {
    // Load Calendly widget script if not already loaded
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section id="book-call" style={{
      background: '#0F0F0F',
      padding: '60px 24px 80px',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
        fontSize: 'clamp(32px, 5vw, 56px)',
        color: '#fff',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        Let us Help you find your <span style={{ color: '#FF7100' }}>Filipino Ninja</span>
      </h2>
      <p style={{
        fontSize: '16px',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '32px',
      }}>
        Book a free discovery call — no pitch, no pressure.
      </p>
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/machuret?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=ff7100"
        style={{ minWidth: '320px', height: '700px', maxWidth: '900px', margin: '0 auto' }}
      />
    </section>
  );
}

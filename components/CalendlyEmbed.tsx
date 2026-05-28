'use client';

import { useEffect } from 'react';

interface CalendlyEmbedProps {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
}

export default function CalendlyEmbed({
  title = 'Let us Help you find your',
  titleHighlight = 'Filipino Ninja',
  subtitle = 'Book a free discovery call — no pitch, no pressure.',
}: CalendlyEmbedProps) {
  useEffect(() => {
    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (!existing) {
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
        {title} <span style={{ color: '#FF7100' }}>{titleHighlight}</span>
      </h2>
      <p style={{
        fontSize: '16px',
        color: 'rgba(255,255,255,0.72)',
        marginBottom: '32px',
      }}>
        {subtitle}
      </p>
      {/* Standard Calendly inline widget — widget.js auto-detects this class */}
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/machuret/rapid-tal?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=ff7100"
        style={{ minWidth: '320px', height: '700px', maxWidth: '900px', margin: '0 auto' }}
      />
    </section>
  );
}

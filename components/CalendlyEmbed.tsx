'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = 'https://calendly.com/machuret/rapid-tal?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=ff7100';

    function initWidget() {
      if (window.Calendly && containerRef.current) {
        containerRef.current.innerHTML = '';
        window.Calendly.initInlineWidget({
          url,
          parentElement: containerRef.current,
        });
      }
    }

    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (existing) {
      initWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = initWidget;
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
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '32px',
      }}>
        {subtitle}
      </p>
      <div
        ref={containerRef}
        style={{ minWidth: '320px', height: '700px', maxWidth: '900px', margin: '0 auto' }}
      />
    </section>
  );
}

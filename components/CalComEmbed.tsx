import { CALCOM_EMBED_URL } from '@/lib/booking';

interface CalComEmbedProps {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
}

export default function CalComEmbed({
  title = 'Let us Help you find your',
  titleHighlight = 'Filipino Ninja',
  subtitle = 'Book a free discovery call — no pitch, no pressure.',
}: CalComEmbedProps) {
  return (
    <section
      id="book-call"
      style={{
        background: '#0F0F0F',
        padding: '60px 24px 80px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(32px, 5vw, 56px)',
          color: '#fff',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        {title} <span style={{ color: '#FF7100' }}>{titleHighlight}</span>
      </h2>
      <p
        style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.72)',
          marginBottom: '32px',
        }}
      >
        {subtitle}
      </p>
      <iframe
        src={CALCOM_EMBED_URL}
        title="Schedule a call"
        frameBorder="0"
        loading="lazy"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '900px',
          height: '700px',
          border: 'none',
          margin: '0 auto',
        }}
      />
    </section>
  );
}

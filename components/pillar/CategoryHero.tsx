'use client';

interface CategoryHeroProps {
  category: string;
  description: string;
  totalRoles: number;
  averageSavings: string;
}

export default function CategoryHero({ category, description, totalRoles, averageSavings }: CategoryHeroProps) {
  return (
    <section style={{
      padding: 'clamp(80px, 12vw, 140px) clamp(20px, 4vw, 60px) clamp(60px, 8vw, 100px)',
      background: 'var(--black)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <p style={{
          fontSize: 'clamp(12px, 1.5vw, 14px)',
          fontWeight: '600',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--orange)',
          marginBottom: '24px',
          fontFamily: 'var(--font-barlow)'
        }}>
          Cost Comparison Hub
        </p>

        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: '800',
          lineHeight: '0.95',
          marginBottom: 'clamp(24px, 3vw, 32px)',
          fontFamily: 'var(--font-barlow)',
          textTransform: 'uppercase',
          color: 'var(--white)',
          letterSpacing: '-0.02em'
        }}>
          {category.split(' ').map((word, i) => (
            <span key={i}>
              {word}
              {i === category.split(' ').length - 1 ? '' : <br />}
            </span>
          ))}
        </h1>

        <p style={{
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '800px',
          marginBottom: 'clamp(40px, 5vw, 60px)',
          fontFamily: 'var(--font-dm-sans)'
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', gap: 'clamp(30px, 4vw, 60px)', flexWrap: 'wrap' }}>
          {[
            { value: totalRoles, label: 'Roles' },
            { value: averageSavings, label: 'Avg Savings' },
            { value: 18, label: 'Days to Hire' },
            { value: '$3,990', label: 'One Fee' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '800',
                color: 'var(--orange)',
                fontFamily: 'var(--font-barlow)',
                lineHeight: '1'
              }}>
                {value}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px',
                fontFamily: 'var(--font-dm-sans)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600'
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(255, 107, 0, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
    </section>
  );
}

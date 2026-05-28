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
        <div
          style={{ animation: 'fadeInUp 0.8s ease both' }}
        >
          <p style={{
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            fontWeight: '600',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            marginBottom: '24px',
            fontFamily: 'var(--font-ui)'
          }}>
            Cost Comparison Hub
          </p>

          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: '800',
            lineHeight: '0.95',
            marginBottom: 'clamp(24px, 3vw, 32px)',
            fontFamily: 'var(--font-ui)',
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
            fontFamily: 'var(--ds-font)'
          }}>
            {description}
          </p>

          <div style={{
            display: 'flex',
            gap: 'clamp(30px, 4vw, 60px)',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '800',
                color: 'var(--orange)',
                fontFamily: 'var(--font-ui)',
                lineHeight: '1'
              }}>
                {totalRoles}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px',
                fontFamily: 'var(--ds-font)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600'
              }}>
                Roles
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '800',
                color: 'var(--orange)',
                fontFamily: 'var(--font-ui)',
                lineHeight: '1'
              }}>
                {averageSavings}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px',
                fontFamily: 'var(--ds-font)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600'
              }}>
                Avg Savings
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '800',
                color: 'var(--orange)',
                fontFamily: 'var(--font-ui)',
                lineHeight: '1'
              }}>
                18
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px',
                fontFamily: 'var(--ds-font)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600'
              }}>
                Days to Hire
              </div>
            </div>

            <div>
              <div style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '800',
                color: 'var(--orange)',
                fontFamily: 'var(--font-ui)',
                lineHeight: '1'
              }}>
                $3,990
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px',
                fontFamily: 'var(--ds-font)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600'
              }}>
                One Fee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background gradient */}
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

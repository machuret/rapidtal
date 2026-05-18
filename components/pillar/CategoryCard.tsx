'use client';

import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  slug: string;
  description: string;
  roles: number;
  savings: string;
}

export default function CategoryCard({ title, slug, description, roles, savings }: CategoryCardProps) {
  return (
    <div>
      <Link
        href={`/${slug}`}
        style={{
          display: 'block',
          padding: 'clamp(32px, 4vw, 48px)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          textDecoration: 'none',
          transition: 'all 0.4s ease',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'var(--orange)';
          e.currentTarget.style.transform = 'translateY(-8px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--orange)',
            fontFamily: 'var(--font-barlow)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            {roles} Roles
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.5 }}
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 style={{
          fontSize: 'clamp(24px, 3vw, 32px)',
          fontWeight: '800',
          lineHeight: '1.2',
          color: 'var(--white)',
          fontFamily: 'var(--font-barlow)',
          marginBottom: '16px',
          textTransform: 'uppercase'
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'var(--font-dm-sans)',
          marginBottom: '24px'
        }}>
          {description}
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: 'rgba(255, 107, 0, 0.1)',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          borderRadius: '6px'
        }}>
          <span style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--orange)',
            fontFamily: 'var(--font-barlow)',
            letterSpacing: '0.05em'
          }}>
            AVG SAVINGS: {savings}
          </span>
        </div>
      </Link>
    </div>
  );
}

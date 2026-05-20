'use client';

import Link from 'next/link';

interface BreadcrumbProps {
  category: string;
  categorySlug: string;
  roleTitle: string;
}

export default function Breadcrumb({ category, categorySlug, roleTitle }: BreadcrumbProps) {
  return (
    <nav style={{
      padding: '20px clamp(20px, 4vw, 60px)',
      background: 'var(--black)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '14px',
          fontFamily: 'var(--font-dm-sans)',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <li>
            <Link 
              href="/"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--orange)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              Home
            </Link>
          </li>
          <li style={{ color: 'rgba(255, 255, 255, 0.3)' }}>/</li>
          <li>
            <Link 
              href={`/${categorySlug}`}
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--orange)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              {category}
            </Link>
          </li>
          <li style={{ color: 'rgba(255, 255, 255, 0.3)' }}>/</li>
          <li style={{ color: 'var(--white)', fontWeight: '500' }}>
            {roleTitle}
          </li>
        </ol>
      </div>
    </nav>
  );
}

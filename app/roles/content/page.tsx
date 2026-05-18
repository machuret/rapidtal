'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import CursorTracker from '@/components/CursorTracker';
import { ROLES } from '@/data/roles';

const ComparisonNav = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonNav })), { ssr: true });
const ComparisonFooter = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonFooter })), { ssr: true });

const metadata = {
  title: 'Content & Creative Roles | Copywriters, Designers & Video Editors | Rapid Tal',
  description: 'Hire experienced content and creative professionals from the Philippines. Copywriters, designers, video editors, and content strategists. Save up to 80%.',
  openGraph: {
    title: 'Content & Creative Roles | Copywriters, Designers & Video Editors',
    description: 'Hire experienced content and creative professionals from the Philippines. Save up to 80% on costs.',
  }
};

const contentRoles = Object.values(ROLES).filter(role => 
  role.category === 'Content & Creative Specialists' ||
  role.category === 'Design & Video Specialists'
);

export default function ContentRolesPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <CursorTracker />
      <ComparisonNav />
      
      <section style={{ 
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 4vw, 60px) clamp(40px, 6vw, 60px)',
        background: 'var(--black)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ marginBottom: '24px' }}>
            <Link 
              href="/roles"
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              ← Back to All Roles
            </Link>
          </nav>

          <span style={{
            display: 'inline-block',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            marginBottom: 'clamp(16px, 2vw, 24px)',
            fontWeight: 500
          }}>
            — Content & Creative Specialists
          </span>
          
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)',
            lineHeight: 1.1,
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: 'clamp(24px, 3vw, 32px)',
            letterSpacing: '-0.02em'
          }}>
            CONTENT &<br />
            <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>CREATIVE</em><br />
            ROLES
          </h1>
          
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '700px'
          }}>
            Copywriters, content strategists, video editors, graphic designers, and UGC managers who create assets that convert. Every candidate has 3+ years experience with international clients.
          </p>
        </div>
      </section>

      <section style={{ 
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
        background: 'var(--black)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'clamp(20px, 2.5vw, 28px)'
          }}>
            {contentRoles.map((role) => {
              const auTotal = role.costs.auBaseSalary + role.costs.auSuper + role.costs.auLeave + 
                            role.costs.auSick + role.costs.auRecruitment + role.costs.tools + 
                            role.costs.auOffice + role.costs.auHR + role.costs.auWorkersComp;
              const phTotal = role.costs.phBaseSalary + role.costs.phRecruitment + role.costs.tools;
              const savingPercent = Math.round(((auTotal - phTotal) / auTotal) * 100);

              return (
                <Link
                  key={role.slug}
                  href={`/hire-${role.slug}`}
                  style={{
                    display: 'block',
                    padding: 'clamp(24px, 3vw, 32px)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'var(--orange)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <h2 style={{
                    fontSize: 'clamp(18px, 2vw, 22px)',
                    fontWeight: 700,
                    color: 'var(--white)',
                    marginBottom: '12px',
                    letterSpacing: '-0.01em'
                  }}>
                    {role.title}
                  </h2>

                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: 'clamp(24px, 2.8vw, 28px)',
                      fontWeight: 700,
                      color: 'var(--orange)'
                    }}>
                      AU${Math.round(phTotal).toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: 'clamp(13px, 1.4vw, 15px)',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      /month
                    </span>
                  </div>

                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 107, 0, 0.1)',
                    border: '1px solid rgba(255, 107, 0, 0.3)',
                    borderRadius: '4px',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--orange)',
                      fontWeight: 600
                    }}>
                      Save {savingPercent}% vs Australian hire
                    </span>
                  </div>

                  <span style={{
                    fontSize: '14px',
                    color: 'var(--orange)',
                    fontWeight: 600,
                    letterSpacing: '0.02em'
                  }}>
                    View Full Breakdown →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ 
        padding: 'clamp(60px, 8vw, 80px) clamp(20px, 4vw, 60px)',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: '20px',
            letterSpacing: '-0.01em'
          }}>
            Don't See Your Role?
          </h2>
          
          <p style={{
            fontSize: 'clamp(15px, 1.7vw, 18px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '28px'
          }}>
            We fill custom content and creative roles too. Book a call to discuss your specific needs.
          </p>

          <a 
            href="https://rapidtal.com/#contact"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'var(--orange)',
              color: 'var(--black)',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'transform 0.2s ease',
              letterSpacing: '0.02em'
            }}
          >
            Book a Call
          </a>
        </div>
      </section>

      <ComparisonFooter />
    </div>
  );
}

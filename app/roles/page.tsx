'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import CursorTracker from '@/components/CursorTracker';

const ComparisonNav = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonNav })), { ssr: true });
const ComparisonFooter = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonFooter })), { ssr: true });

const metadata = {
  title: 'Roles We Fill | Marketing, Sales, Content & Operations | Rapid Tal',
  description: 'Hire experienced marketing, sales, content, and operations specialists directly from the Philippines. Save up to 80% on costs while building your revenue team.',
  openGraph: {
    title: 'Roles We Fill | Marketing, Sales, Content & Operations',
    description: 'Hire experienced marketing, sales, content, and operations specialists directly from the Philippines.',
  }
};

const CATEGORIES = [
  {
    id: 'marketing',
    title: 'Marketing',
    slug: 'marketing',
    description: 'Paid ads, SEO, email marketing, social media, and growth specialists who drive pipeline.',
    roles: [
      'Paid Ads Specialist',
      'SEO Strategist', 
      'Email Marketing Manager',
      'Social Media Manager',
      'CRM Manager',
      'Performance Marketer'
    ]
  },
  {
    id: 'sales',
    title: 'Sales',
    slug: 'sales',
    description: 'SDRs, account executives, closers, and lead generation specialists who convert.',
    roles: [
      'Sales Development Rep (SDR)',
      'Account Executive',
      'Sales Closer',
      'Lead Generation Specialist',
      'Outbound Sales Rep',
      'Client Success Manager'
    ]
  },
  {
    id: 'content',
    title: 'Content & Creative',
    slug: 'content',
    description: 'Copywriters, designers, video editors, and content strategists who create assets that sell.',
    roles: [
      'Copywriter',
      'Content Strategist',
      'Video Editor',
      'Graphic Designer',
      'UGC / Influencer Manager',
      'Blog & SEO Writer'
    ]
  },
  {
    id: 'ops',
    title: 'Revenue Ops',
    slug: 'ops',
    description: 'Marketing ops, CRM admins, data analysts, and automation specialists who scale systems.',
    roles: [
      'Marketing Ops Manager',
      'HubSpot / Salesforce Admin',
      'Data Analyst',
      'Funnel Builder',
      'Automation Specialist',
      'Reporting & BI Specialist'
    ]
  }
];

export default function RolesPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <CursorTracker />
      <ComparisonNav />
      
      <section style={{ 
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 4vw, 60px) clamp(60px, 8vw, 100px)',
        background: 'var(--black)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            marginBottom: 'clamp(16px, 2vw, 24px)',
            fontWeight: 500
          }}>
            — Roles We Fill
          </span>
          
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)',
            lineHeight: 1.1,
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: 'clamp(24px, 3vw, 32px)',
            letterSpacing: '-0.02em'
          }}>
            BUILT FOR<br />
            <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>REVENUE</em><br />
            TEAMS.
          </h1>
          
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '700px',
            marginBottom: 'clamp(32px, 4vw, 48px)'
          }}>
            We specialise in the roles that directly impact your pipeline. Every candidate has international client exposure and a minimum 3 years experience. Browse by category or explore individual roles below.
          </p>

          <Link 
            href="/how-we-hire"
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
            How We Hire →
          </Link>
        </div>
      </section>

      <section style={{ 
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
        background: 'var(--black)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(24px, 3vw, 32px)'
          }}>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/roles/${category.slug}`}
                style={{
                  display: 'block',
                  padding: 'clamp(32px, 4vw, 40px)',
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
                  fontSize: 'clamp(24px, 2.5vw, 28px)',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em'
                }}>
                  {category.title}
                </h2>
                
                <p style={{
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '20px'
                }}>
                  {category.description}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  {category.roles.slice(0, 3).map((role, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.5)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {role}
                    </span>
                  ))}
                  {category.roles.length > 3 && (
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      color: 'var(--orange)'
                    }}>
                      +{category.roles.length - 3} more
                    </span>
                  )}
                </div>

                <span style={{
                  fontSize: '14px',
                  color: 'var(--orange)',
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }}>
                  View All {category.title} Roles →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ComparisonFooter />
    </div>
  );
}

import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryCard } from '@/components/pillar';
import CursorTracker from '@/components/CursorTracker';

export const metadata: Metadata = {
  title: 'Hire Marketing & Sales Talent Direct from Philippines | Rapid Tal',
  description: 'Compare the real cost of hiring marketing, sales and operations staff in Australia vs the Philippines. 51 role comparisons. Save up to 82%. One fee. 18 days.',
  openGraph: {
    title: 'Hire Marketing & Sales Talent Direct from Philippines',
    description: 'Compare the real cost of hiring marketing, sales and operations staff in Australia vs the Philippines. 51 role comparisons. Save up to 82%.',
  }
};

const categories = [
  {
    title: 'SEO Specialists',
    slug: 'seo-specialists',
    description: 'WordPress SEO, Shopify SEO, Technical SEO, Link Building, and more',
    roles: 11,
    savings: '74%',
    color: '#FF6B00'
  },
  {
    title: 'Paid Advertising Specialists',
    slug: 'paid-advertising-specialists',
    description: 'Google Ads, Facebook Ads, TikTok Ads, PPC Management, and more',
    roles: 10,
    savings: '76%',
    color: '#FF6B00'
  },
  {
    title: 'Sales Specialists',
    slug: 'sales-specialists',
    description: 'SDR, BDM, Account Executive, Cold Calling, and more',
    roles: 10,
    savings: '76%',
    color: '#FF6B00'
  },
  {
    title: 'Marketing & Creative Specialists',
    slug: 'marketing-creative-specialists',
    description: 'Copywriter, Video Editor, Graphic Designer, Social Media, and more',
    roles: 10,
    savings: '77%',
    color: '#FF6B00'
  },
  {
    title: 'Operations & Admin Specialists',
    slug: 'operations-admin-specialists',
    description: 'Executive Assistant, Virtual Assistant, Project Manager, and more',
    roles: 10,
    savings: '74%',
    color: '#FF6B00'
  }
];

export default function HireMarketingSalesPhilippinesPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <CursorTracker />
      <ComparisonNav />
      
      {/* Hero Section */}
      <section style={{
        padding: 'clamp(100px, 15vw, 160px) clamp(20px, 4vw, 60px) clamp(80px, 10vw, 120px)',
        background: 'var(--black)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div>
            <p style={{
              fontSize: 'clamp(12px, 1.5vw, 14px)',
              fontWeight: '600',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--orange)',
              marginBottom: '24px',
              fontFamily: 'var(--font-barlow)'
            }}>
              Complete Cost Comparison Hub
            </p>

            <h1 style={{
              fontSize: 'clamp(56px, 10vw, 120px)',
              fontWeight: '800',
              lineHeight: '0.9',
              marginBottom: 'clamp(32px, 4vw, 48px)',
              fontFamily: 'var(--font-barlow)',
              textTransform: 'uppercase',
              color: 'var(--white)',
              letterSpacing: '-0.02em'
            }}>
              HIRE MARKETING<br />
              & SALES TALENT<br />
              <span style={{ color: 'var(--orange)' }}>FROM PHILIPPINES</span>
            </h1>

            <p style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              lineHeight: '1.5',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '900px',
              marginBottom: 'clamp(50px, 6vw, 80px)',
              fontFamily: 'var(--font-dm-sans)'
            }}>
              Compare the real cost of hiring marketing, sales and operations staff in Australia versus hiring directly from the Philippines. <strong style={{ color: 'var(--white)' }}>51 role comparisons. Save up to 82%.</strong>
            </p>

            <div style={{
              display: 'flex',
              gap: 'clamp(40px, 5vw, 80px)',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{
                  fontSize: 'clamp(48px, 7vw, 80px)',
                  fontWeight: '800',
                  color: 'var(--orange)',
                  fontFamily: 'var(--font-barlow)',
                  lineHeight: '1'
                }}>
                  51
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '12px',
                  fontFamily: 'var(--font-dm-sans)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600'
                }}>
                  Role Comparisons
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 'clamp(48px, 7vw, 80px)',
                  fontWeight: '800',
                  color: 'var(--orange)',
                  fontFamily: 'var(--font-barlow)',
                  lineHeight: '1'
                }}>
                  18
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '12px',
                  fontFamily: 'var(--font-dm-sans)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600'
                }}>
                  Days to Hire
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 'clamp(48px, 7vw, 80px)',
                  fontWeight: '800',
                  color: 'var(--orange)',
                  fontFamily: 'var(--font-barlow)',
                  lineHeight: '1'
                }}>
                  82%
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '12px',
                  fontFamily: 'var(--font-dm-sans)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600'
                }}>
                  Max Savings
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 'clamp(48px, 7vw, 80px)',
                  fontWeight: '800',
                  color: 'var(--orange)',
                  fontFamily: 'var(--font-barlow)',
                  lineHeight: '1'
                }}>
                  $3,990
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '12px',
                  fontFamily: 'var(--font-dm-sans)',
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

        <div style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 107, 0, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />
      </section>

      {/* Categories Grid */}
      <section style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 4vw, 60px)',
        background: 'var(--black)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: 'clamp(48px, 6vw, 80px)',
              fontFamily: 'var(--font-barlow)',
              textTransform: 'uppercase',
              color: 'var(--white)',
              textAlign: 'center'
            }}>
              EXPLORE BY <span style={{ color: 'var(--orange)' }}>CATEGORY</span>
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(24px, 3vw, 32px)'
            }}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.slug}
                  title={category.title}
                  slug={category.slug}
                  description={category.description}
                  roles={category.roles}
                  savings={category.savings}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatedCTA variant="primary" />

      {/* What is Direct Hire Section */}
      <section style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 4vw, 60px)',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: 'clamp(32px, 4vw, 48px)',
            fontFamily: 'var(--font-barlow)',
            textTransform: 'uppercase',
            color: 'var(--white)'
          }}>
            WHAT IS <span style={{ color: 'var(--orange)' }}>DIRECT HIRE?</span>
          </h2>

          <div style={{
            fontSize: '18px',
            lineHeight: '1.8',
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: 'var(--font-dm-sans)'
          }}>
            <p style={{ marginBottom: '24px' }}>
              Direct hire means you employ the talent directly on your payroll. No middleman. No markup. No ongoing fees. You pay them directly, they work for you exclusively, and you build a real team.
            </p>
            <p style={{ marginBottom: '24px' }}>
              We handle recruitment, vetting, and onboarding for a one-time fee of <strong style={{ color: 'var(--orange)' }}>AU$3,990</strong>. After that, you pay your team member's salary directly and they're yours forever.
            </p>
            <p>
              This is the opposite of outsourcing agencies that charge 2-3x markups forever. With direct hire, you save 70-82% compared to local hiring and build a loyal, dedicated team that grows with your business.
            </p>
          </div>
        </div>
      </section>

      <AnimatedCTA variant="secondary" />

      <ComparisonFooter />
    </div>
  );
}

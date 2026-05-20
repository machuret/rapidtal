import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';

export const metadata: Metadata = {
  title: 'Hire SEO Specialists from Philippines | Save up to 77% | Rapid Tal',
  description: 'Compare the real cost of hiring SEO specialists in Australia vs the Philippines. 11 role comparisons including WordPress SEO, Shopify SEO, Technical SEO, and more. Save up to 77%.',
  openGraph: {
    title: 'Hire SEO Specialists from Philippines | Save up to 77%',
    description: 'Compare the real cost of hiring SEO specialists in Australia vs the Philippines. 11 role comparisons. Save up to 77%.',
  }
};

export default function SEOSpecialistsPage() {
  // Get all SEO roles
  const seoRoles = Object.values(ROLES)
    .filter(role => role.category === 'SEO Specialists')
    .map(role => ({
      title: role.title,
      slug: role.slug,
      saving: role.stats.saving
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <CursorTracker />
      <ComparisonNav />
      
      <CategoryHero 
        category="SEO Specialists"
        description="Compare the real cost of hiring SEO specialists in Australia versus hiring directly from the Philippines. From WordPress SEO to Technical SEO, see the exact numbers behind every role."
        totalRoles={11}
        averageSavings="74%"
      />

      <RoleGrid roles={seoRoles} />

      <AnimatedCTA variant="primary" />

      <section style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: 'clamp(24px, 3vw, 32px)',
            fontFamily: 'var(--font-barlow)',
            textTransform: 'uppercase',
            color: 'var(--white)'
          }}>
            WHY HIRE SEO <span style={{ color: 'var(--orange)' }}>FROM THE PHILIPPINES?</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(30px, 4vw, 40px)',
            marginTop: 'clamp(40px, 5vw, 60px)'
          }}>
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--orange)',
                marginBottom: '12px',
                fontFamily: 'var(--font-barlow)'
              }}>
                Technical Excellence
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Filipino SEO specialists are highly trained in technical SEO, content optimization, and link building. They understand Australian search behavior and Google's latest algorithm updates.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--orange)',
                marginBottom: '12px',
                fontFamily: 'var(--font-barlow)'
              }}>
                Cost Efficiency
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Save 70-77% compared to hiring locally in Australia. Get the same quality work for a fraction of the cost, with no compromise on results or communication.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--orange)',
                marginBottom: '12px',
                fontFamily: 'var(--font-barlow)'
              }}>
                Time Zone Advantage
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Only 2-3 hours behind Australian time zones. Your SEO team can work during your business hours or provide overnight optimization and reporting.
              </p>
            </div>

            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--orange)',
                marginBottom: '12px',
                fontFamily: 'var(--font-barlow)'
              }}>
                Platform Expertise
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Deep expertise in WordPress, Shopify, WooCommerce, and all major CMS platforms. They know the tools, plugins, and best practices for each platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AnimatedCTA variant="secondary" />

      <ComparisonFooter />
    </div>
  );
}

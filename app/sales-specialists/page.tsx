import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';

export const metadata: Metadata = {
  title: 'Hire Sales Specialists from Philippines | Save up to 82% | Rapid Tal',
  description: 'Compare the real cost of hiring sales specialists in Australia vs the Philippines. 10 role comparisons including SDR, BDM, Account Executive, and more. Save up to 82%.',
  openGraph: {
    title: 'Hire Sales Specialists from Philippines | Save up to 82%',
    description: 'Compare the real cost of hiring sales specialists in Australia vs the Philippines. 10 role comparisons. Save up to 82%.',
  }
};

export default function SalesSpecialistsPage() {
  const salesRoles = Object.values(ROLES)
    .filter(role => role.category === 'Sales Specialists')
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
        category="Sales Specialists"
        description="Compare the real cost of hiring sales specialists in Australia versus hiring directly from the Philippines. From SDRs to Account Executives, see the exact numbers behind every role."
        totalRoles={10}
        averageSavings="76%"
      />

      <RoleGrid roles={salesRoles} />

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
            WHY HIRE SALES <span style={{ color: 'var(--orange)' }}>FROM THE PHILIPPINES?</span>
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
                Natural Relationship Builders
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Filipino sales professionals excel at building genuine relationships with prospects. They're naturally warm, patient, and persistent without being pushy.
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
                Excellent Communication
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Clear English communication with neutral accents. They understand Australian business culture and can build rapport with local prospects easily.
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
                Process-Driven
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                They follow sales processes meticulously, track every interaction in your CRM, and maintain consistent activity levels that drive predictable pipeline growth.
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
                Incredible Value
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Save 70-82% compared to hiring locally. Build a full sales team for the cost of one local SDR and scale your pipeline without scaling your costs.
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

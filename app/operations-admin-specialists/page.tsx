import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';

export const metadata: Metadata = {
  title: 'Hire Operations & Admin Specialists from Philippines | Save up to 81% | Rapid Tal',
  description: 'Compare the real cost of hiring operations and admin specialists in Australia vs the Philippines. 10 role comparisons including Executive Assistant, Virtual Assistant, Project Manager, and more. Save up to 81%.',
  openGraph: {
    title: 'Hire Operations & Admin Specialists from Philippines | Save up to 81%',
    description: 'Compare the real cost of hiring operations and admin specialists in Australia vs the Philippines. 10 role comparisons. Save up to 81%.',
  }
};

export default function OperationsAdminSpecialistsPage() {
  const operationsRoles = Object.values(ROLES)
    .filter(role => role.category === 'Operations & Admin Specialists')
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
        category="Operations & Admin Specialists"
        description="Compare the real cost of hiring operations and admin specialists in Australia versus hiring directly from the Philippines. From Executive Assistants to Operations Managers, see the exact numbers behind every role."
        totalRoles={10}
        averageSavings="74%"
      />

      <RoleGrid roles={operationsRoles} />

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
            WHY HIRE OPERATIONS <span style={{ color: 'var(--orange)' }}>FROM THE PHILIPPINES?</span>
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
                Reliability & Consistency
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Filipino operations professionals are known for their reliability, attention to detail, and consistent work quality. They show up, follow processes, and get things done.
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
                Process-Oriented
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                They excel at following and improving operational processes. From CRM management to data entry to customer support, they maintain high standards and accuracy.
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
                Service Excellence
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                The Philippines is the global benchmark for customer service and support. Filipino professionals are naturally service-oriented, patient, and empathetic.
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
                Exceptional Value
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Save 68-81% compared to hiring locally. Build an entire operations team for the cost of one local hire and scale your business without scaling your overhead.
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

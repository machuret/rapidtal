import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';
import s from '../specialists.module.css';

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
    <>
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

      <section className={s.whySection}>
        <div className={s.container}>
          <h2 className={s.sectionHeading}>
            WHY HIRE OPERATIONS <span className={s.accentSpan}>FROM THE PHILIPPINES?</span>
          </h2>

          <div className={s.grid}>
            <div>
              <h3 className={s.featureTitle}>
                Reliability & Consistency
              </h3>
              <p className={s.featureText}>
                Filipino operations professionals are known for their reliability, attention to detail, and consistent work quality. They show up, follow processes, and get things done.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Process-Oriented
              </h3>
              <p className={s.featureText}>
                They excel at following and improving operational processes. From CRM management to data entry to customer support, they maintain high standards and accuracy.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Service Excellence
              </h3>
              <p className={s.featureText}>
                The Philippines is the global benchmark for customer service and support. Filipino professionals are naturally service-oriented, patient, and empathetic.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Exceptional Value
              </h3>
              <p className={s.featureText}>
                Save 68-81% compared to hiring locally. Build an entire operations team for the cost of one local hire and scale your business without scaling your overhead.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AnimatedCTA variant="secondary" />

      <ComparisonFooter />
    </>
  );
}

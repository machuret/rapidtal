import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';
import s from '../specialists.module.css';

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
    <>
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

      <section className={s.whySection}>
        <div className={s.container}>
          <h2 className={s.sectionHeading}>
            WHY HIRE SALES <span className={s.accentSpan}>FROM THE PHILIPPINES?</span>
          </h2>

          <div className={s.grid}>
            <div>
              <h3 className={s.featureTitle}>
                Natural Relationship Builders
              </h3>
              <p className={s.featureText}>
                Filipino sales professionals excel at building genuine relationships with prospects. They&apos;re naturally warm, patient, and persistent without being pushy.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Excellent Communication
              </h3>
              <p className={s.featureText}>
                Clear English communication with neutral accents. They understand Australian business culture and can build rapport with local prospects easily.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Process-Driven
              </h3>
              <p className={s.featureText}>
                They follow sales processes meticulously, track every interaction in your CRM, and maintain consistent activity levels that drive predictable pipeline growth.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Incredible Value
              </h3>
              <p className={s.featureText}>
                Save 70-82% compared to hiring locally. Build a full sales team for the cost of one local SDR and scale your pipeline without scaling your costs.
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

import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';
import s from '../specialists.module.css';

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
    <>
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

      <section className={s.whySection}>
        <div className={s.container}>
          <h2 className={s.sectionHeading}>
            WHY HIRE SEO <span className={s.accentSpan}>FROM THE PHILIPPINES?</span>
          </h2>

          <div className={s.grid}>
            <div>
              <h3 className={s.featureTitle}>
                Technical Excellence
              </h3>
              <p className={s.featureText}>
                Filipino SEO specialists are highly trained in technical SEO, content optimization, and link building. They understand Australian search behavior and Google&apos;s latest algorithm updates.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Cost Efficiency
              </h3>
              <p className={s.featureText}>
                Save 70-77% compared to hiring locally in Australia. Get the same quality work for a fraction of the cost, with no compromise on results or communication.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Time Zone Advantage
              </h3>
              <p className={s.featureText}>
                Only 2-3 hours behind Australian time zones. Your SEO team can work during your business hours or provide overnight optimization and reporting.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Platform Expertise
              </h3>
              <p className={s.featureText}>
                Deep expertise in WordPress, Shopify, WooCommerce, and all major CMS platforms. They know the tools, plugins, and best practices for each platform.
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

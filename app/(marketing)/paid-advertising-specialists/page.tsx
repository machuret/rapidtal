import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';
import s from '../specialists.module.css';

export const metadata: Metadata = {
  title: 'Hire Paid Advertising Specialists from Philippines | Save up to 80% | Rapid Tal',
  description: 'Compare the real cost of hiring paid advertising specialists in Australia vs the Philippines. 10 role comparisons including Google Ads, Facebook Ads, TikTok Ads, and more. Save up to 80%.',
  openGraph: {
    title: 'Hire Paid Advertising Specialists from Philippines | Save up to 80%',
    description: 'Compare the real cost of hiring paid advertising specialists in Australia vs the Philippines. 10 role comparisons. Save up to 80%.',
  }
};

export default function PaidAdvertisingSpecialistsPage() {
  const paidAdsRoles = Object.values(ROLES)
    .filter(role => role.category === 'Paid Advertising Specialists')
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
        category="Paid Advertising Specialists"
        description="Compare the real cost of hiring paid advertising specialists in Australia versus hiring directly from the Philippines. From Google Ads to TikTok Ads, see the exact numbers behind every role."
        totalRoles={10}
        averageSavings="76%"
      />

      <RoleGrid roles={paidAdsRoles} />

      <AnimatedCTA variant="primary" />

      <section className={s.whySection}>
        <div className={s.container}>
          <h2 className={s.sectionHeading}>
            WHY HIRE PAID ADS <span className={s.accentSpan}>FROM THE PHILIPPINES?</span>
          </h2>

          <div className={s.grid}>
            <div>
              <h3 className={s.featureTitle}>
                Platform Mastery
              </h3>
              <p className={s.featureText}>
                Filipino paid ads specialists are certified experts in Google Ads, Facebook Ads Manager, TikTok Ads, and all major advertising platforms. They stay current with platform updates and best practices.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                ROI-Focused
              </h3>
              <p className={s.featureText}>
                They understand that every ad dollar counts. Filipino specialists are trained to optimize for conversions, lower CPAs, and maximize ROAS across all campaigns.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Massive Savings
              </h3>
              <p className={s.featureText}>
                Save 70-80% compared to hiring locally in Australia. Redirect those savings into your ad budget and scale campaigns faster with the same quality management.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Creative + Data
              </h3>
              <p className={s.featureText}>
                The perfect blend of creative thinking and data-driven optimization. They test ad creatives, analyze performance, and continuously improve campaign results.
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

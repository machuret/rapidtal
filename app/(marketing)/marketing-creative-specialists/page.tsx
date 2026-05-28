import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';
import s from '../specialists.module.css';

export const metadata: Metadata = {
  title: 'Hire Marketing & Creative Specialists from Philippines | Save up to 81% | Rapid Tal',
  description: 'Compare the real cost of hiring marketing and creative specialists in Australia vs the Philippines. 10 role comparisons including Copywriter, Video Editor, Graphic Designer, and more. Save up to 81%.',
  openGraph: {
    title: 'Hire Marketing & Creative Specialists from Philippines | Save up to 81%',
    description: 'Compare the real cost of hiring marketing and creative specialists in Australia vs the Philippines. 10 role comparisons. Save up to 81%.',
  }
};

export default function MarketingCreativeSpecialistsPage() {
  const marketingRoles = Object.values(ROLES)
    .filter(role => role.category === 'Marketing & Creative Specialists')
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
        category="Marketing & Creative Specialists"
        description="Compare the real cost of hiring marketing and creative specialists in Australia versus hiring directly from the Philippines. From Copywriters to Video Editors, see the exact numbers behind every role."
        totalRoles={10}
        averageSavings="77%"
      />

      <RoleGrid roles={marketingRoles} />

      <AnimatedCTA variant="primary" />

      <section className={s.whySection}>
        <div className={s.container}>
          <h2 className={s.sectionHeading}>
            WHY HIRE CREATIVE <span className={s.accentSpan}>FROM THE PHILIPPINES?</span>
          </h2>

          <div className={s.grid}>
            <div>
              <h3 className={s.featureTitle}>
                World-Class Creative Talent
              </h3>
              <p className={s.featureText}>
                Filipino creatives are globally recognized for their design skills, video editing expertise, and copywriting abilities. They deliver agency-quality work at a fraction of the cost.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Fast Turnaround
              </h3>
              <p className={s.featureText}>
                With minimal time zone difference, your creative team can deliver work overnight or collaborate in real-time during your business hours. Quick revisions, fast execution.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Platform Expertise
              </h3>
              <p className={s.featureText}>
                Deep knowledge of Adobe Creative Suite, Canva, Figma, Premiere Pro, and all major creative tools. They stay current with design trends and platform updates.
              </p>
            </div>

            <div>
              <h3 className={s.featureTitle}>
                Unbeatable Economics
              </h3>
              <p className={s.featureText}>
                Save 75-81% compared to hiring locally or using agencies. Get unlimited revisions and consistent creative output for less than 10 hours of local freelancer time per month.
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

import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';

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
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
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
            WHY HIRE CREATIVE <span style={{ color: 'var(--orange)' }}>FROM THE PHILIPPINES?</span>
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
                World-Class Creative Talent
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Filipino creatives are globally recognized for their design skills, video editing expertise, and copywriting abilities. They deliver agency-quality work at a fraction of the cost.
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
                Fast Turnaround
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                With minimal time zone difference, your creative team can deliver work overnight or collaborate in real-time during your business hours. Quick revisions, fast execution.
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
                Deep knowledge of Adobe Creative Suite, Canva, Figma, Premiere Pro, and all major creative tools. They stay current with design trends and platform updates.
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
                Unbeatable Economics
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Save 75-81% compared to hiring locally or using agencies. Get unlimited revisions and consistent creative output for less than 10 hours of local freelancer time per month.
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

import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryHero, RoleGrid } from '@/components/pillar';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';

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
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
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
            WHY HIRE PAID ADS <span style={{ color: 'var(--orange)' }}>FROM THE PHILIPPINES?</span>
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
                Platform Mastery
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Filipino paid ads specialists are certified experts in Google Ads, Facebook Ads Manager, TikTok Ads, and all major advertising platforms. They stay current with platform updates and best practices.
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
                ROI-Focused
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                They understand that every ad dollar counts. Filipino specialists are trained to optimize for conversions, lower CPAs, and maximize ROAS across all campaigns.
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
                Massive Savings
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                Save 70-80% compared to hiring locally in Australia. Redirect those savings into your ad budget and scale campaigns faster with the same quality management.
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
                Creative + Data
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-dm-sans)'
              }}>
                The perfect blend of creative thinking and data-driven optimization. They test ad creatives, analyze performance, and continuously improve campaign results.
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

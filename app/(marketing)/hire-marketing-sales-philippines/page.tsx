import type { Metadata } from 'next';
import { ComparisonNav, ComparisonFooter, AnimatedCTA } from '@/components/comparison';
import { CategoryCard } from '@/components/pillar';
import CursorTracker from '@/components/CursorTracker';
import FormattedPrice from '@/components/FormattedPrice';
import s from './page.module.css';

export const metadata: Metadata = {
  title: 'Hire Marketing & Sales Talent Direct from Philippines | Rapid Tal',
  description: 'Compare the real cost of hiring marketing, sales and operations staff in Australia vs the Philippines. 51 role comparisons. Save up to 82%. One fee. 18 days.',
  openGraph: {
    title: 'Hire Marketing & Sales Talent Direct from Philippines',
    description: 'Compare the real cost of hiring marketing, sales and operations staff in Australia vs the Philippines. 51 role comparisons. Save up to 82%.',
  }
};

const categories = [
  {
    title: 'SEO Specialists',
    slug: 'seo-specialists',
    description: 'WordPress SEO, Shopify SEO, Technical SEO, Link Building, and more',
    roles: 11,
    savings: '74%',
    color: '#FF6B00'
  },
  {
    title: 'Paid Advertising Specialists',
    slug: 'paid-advertising-specialists',
    description: 'Google Ads, Facebook Ads, TikTok Ads, PPC Management, and more',
    roles: 10,
    savings: '76%',
    color: '#FF6B00'
  },
  {
    title: 'Sales Specialists',
    slug: 'sales-specialists',
    description: 'SDR, BDM, Account Executive, Cold Calling, and more',
    roles: 10,
    savings: '76%',
    color: '#FF6B00'
  },
  {
    title: 'Marketing & Creative Specialists',
    slug: 'marketing-creative-specialists',
    description: 'Copywriter, Video Editor, Graphic Designer, Social Media, and more',
    roles: 10,
    savings: '77%',
    color: '#FF6B00'
  },
  {
    title: 'Operations & Admin Specialists',
    slug: 'operations-admin-specialists',
    description: 'Executive Assistant, Virtual Assistant, Project Manager, and more',
    roles: 10,
    savings: '74%',
    color: '#FF6B00'
  }
];

export default function HireMarketingSalesPhilippinesPage() {
  return (
    <>
      <CursorTracker />
      <ComparisonNav />

      {/* Hero Section */}
      <section className={s.heroSection}>
        <div className={s.heroInner}>
          <div>
            <p className={s.heroEyebrow}>
              Complete Cost Comparison Hub
            </p>

            <h1 className={s.heroTitle}>
              HIRE MARKETING<br />
              &amp; SALES TALENT<br />
              <span className={s.heroTitleAccent}>FROM PHILIPPINES</span>
            </h1>

            <p className={s.heroSubtitle}>
              Compare the real cost of hiring marketing, sales and operations staff in Australia versus hiring directly from the Philippines. <strong className={s.heroSubtitleStrong}>51 role comparisons. Save up to 82%.</strong>
            </p>

            <div className={s.heroStats}>
              <div>
                <div className={s.statNumber}>51</div>
                <div className={s.statLabel}>Role Comparisons</div>
              </div>

              <div>
                <div className={s.statNumber}>18</div>
                <div className={s.statLabel}>Days to Hire</div>
              </div>

              <div>
                <div className={s.statNumber}>82%</div>
                <div className={s.statLabel}>Max Savings</div>
              </div>

              <div>
                <div className={s.statNumber}>$3,990</div>
                <div className={s.statLabel}>One Fee</div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.heroGlow} />
      </section>

      {/* Categories Grid */}
      <section className={s.categoriesSection}>
        <div className={s.categoriesInner}>
          <div>
            <h2 className={s.categoriesTitle}>
              EXPLORE BY <span className={s.categoriesTitleAccent}>CATEGORY</span>
            </h2>

            <div className={s.categoriesGrid}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.slug}
                  title={category.title}
                  slug={category.slug}
                  description={category.description}
                  roles={category.roles}
                  savings={category.savings}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatedCTA variant="primary" />

      {/* What is Direct Hire Section */}
      <section className={s.directHireSection}>
        <div className={s.directHireInner}>
          <h2 className={s.directHireTitle}>
            WHAT IS <span className={s.directHireTitleAccent}>DIRECT HIRE?</span>
          </h2>

          <div className={s.directHireBody}>
            <p className={s.directHireParagraph}>
              Direct hire means you employ the talent directly on your payroll. No middleman. No markup. No ongoing fees. You pay them directly, they work for you exclusively, and you build a real team.
            </p>
            <p className={s.directHireParagraph}>
              We handle recruitment, vetting, and onboarding for a one-time fee of <strong className={s.directHireAccent}><FormattedPrice amount={3990} /></strong>. After that, you pay your team member&apos;s salary directly and they&apos;re yours forever.
            </p>
            <p className={s.directHireParagraphLast}>
              This is the opposite of outsourcing agencies that charge 2-3x markups forever. With direct hire, you save 70-82% compared to local hiring and build a loyal, dedicated team that grows with your business.
            </p>
          </div>
        </div>
      </section>

      <AnimatedCTA variant="secondary" />

      <ComparisonFooter />
    </>
  );
}

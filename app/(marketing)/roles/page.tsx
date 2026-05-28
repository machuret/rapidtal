'use client';

import s from './roles.module.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CursorTracker from '@/components/CursorTracker';

const ComparisonNav = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonNav })), { ssr: true });
const ComparisonFooter = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonFooter })), { ssr: true });


const CATEGORIES = [
  {
    id: 'marketing',
    title: 'Marketing',
    slug: 'marketing',
    description: 'Paid ads, SEO, email marketing, social media, and growth specialists who drive pipeline.',
    roles: [
      'Paid Ads Specialist',
      'SEO Strategist',
      'Email Marketing Manager',
      'Social Media Manager',
      'CRM Manager',
      'Performance Marketer'
    ]
  },
  {
    id: 'sales',
    title: 'Sales',
    slug: 'sales',
    description: 'SDRs, account executives, closers, and lead generation specialists who convert.',
    roles: [
      'Sales Development Rep (SDR)',
      'Account Executive',
      'Sales Closer',
      'Lead Generation Specialist',
      'Outbound Sales Rep',
      'Client Success Manager'
    ]
  },
  {
    id: 'content',
    title: 'Content & Creative',
    slug: 'content',
    description: 'Copywriters, designers, video editors, and content strategists who create assets that sell.',
    roles: [
      'Copywriter',
      'Content Strategist',
      'Video Editor',
      'Graphic Designer',
      'UGC / Influencer Manager',
      'Blog & SEO Writer'
    ]
  },
  {
    id: 'ops',
    title: 'Revenue Ops',
    slug: 'ops',
    description: 'Marketing ops, CRM admins, data analysts, and automation specialists who scale systems.',
    roles: [
      'Marketing Ops Manager',
      'HubSpot / Salesforce Admin',
      'Data Analyst',
      'Funnel Builder',
      'Automation Specialist',
      'Reporting & BI Specialist'
    ]
  }
];

export default function RolesPage() {
  return (
    <>
      <CursorTracker />
      <ComparisonNav />

      <section className={s.heroSectionIndex}>
        <div className={s.container}>
          <span className={s.categoryLabel}>
            — Roles We Fill
          </span>

          <h1 className={s.heroHeading}>
            BUILT FOR<br />
            <em className={s.accentWord}>REVENUE</em><br />
            TEAMS.
          </h1>

          <p className={s.heroDescWithMargin}>
            We specialise in the roles that directly impact your pipeline. Every candidate has international client exposure and a minimum 3 years experience. Browse by category or explore individual roles below.
          </p>

          <Link href="/how-we-hire" className={s.ctaBtn}>
            How We Hire →
          </Link>
        </div>
      </section>

      <section className={s.gridSection}>
        <div className={s.container}>
          <div className={s.categoryGrid}>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/roles/${category.slug}`}
                className={s.categoryCard}
              >
                <h2 className={s.categoryTitle}>
                  {category.title}
                </h2>

                <p className={s.categoryDesc}>
                  {category.description}
                </p>

                <div className={s.roleTags}>
                  {category.roles.slice(0, 3).map((role, idx) => (
                    <span key={idx} className={s.roleTag}>
                      {role}
                    </span>
                  ))}
                  {category.roles.length > 3 && (
                    <span className={s.moreRoles}>
                      +{category.roles.length - 3} more
                    </span>
                  )}
                </div>

                <span className={s.cardCta}>
                  View All {category.title} Roles →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ComparisonFooter />
    </>
  );
}

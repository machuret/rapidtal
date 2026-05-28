'use client';

import s from '../roles.module.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CursorTracker from '@/components/CursorTracker';
import { ROLES } from '@/data/roles';

const ComparisonNav = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonNav })), { ssr: true });
const ComparisonFooter = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonFooter })), { ssr: true });


const contentRoles = Object.values(ROLES).filter(role =>
  role.category === 'Content & Creative Specialists' ||
  role.category === 'Design & Video Specialists'
);

export default function ContentRolesPage() {
  return (
    <>
      <CursorTracker />
      <ComparisonNav />

      <section className={s.heroSection}>
        <div className={s.container}>
          <nav className={s.breadcrumb}>
            <Link
              href="/roles"
              className={s.breadcrumbLink}
            >
              ← Back to All Roles
            </Link>
          </nav>

          <span className={s.categoryLabel}>
            — Content & Creative Specialists
          </span>

          <h1 className={s.heroHeading}>
            CONTENT &<br />
            <em className={s.accentWord}>CREATIVE</em><br />
            ROLES
          </h1>

          <p className={s.heroDesc}>
            Copywriters, content strategists, video editors, graphic designers, and UGC managers who create assets that convert. Every candidate has 3+ years experience with international clients.
          </p>
        </div>
      </section>

      <section className={s.gridSection}>
        <div className={s.container}>
          <div className={s.grid}>
            {contentRoles.map((role) => {
              const auTotal = role.costs.auBaseSalary + role.costs.auSuper + role.costs.auLeave +
                            role.costs.auSick + role.costs.auRecruitment + role.costs.tools +
                            role.costs.auOffice + role.costs.auHR + role.costs.auWorkersComp;
              const phTotal = role.costs.phBaseSalary + role.costs.phRecruitment + role.costs.tools;
              const savingPercent = Math.round(((auTotal - phTotal) / auTotal) * 100);

              return (
                <Link
                  key={role.slug}
                  href={`/hire-${role.slug}`}
                  className={s.roleCard}
                >
                  <h2 className={s.cardTitle}>
                    {role.title}
                  </h2>

                  <div className={s.priceRow}>
                    <span className={s.price}>
                      AU${Math.round(phTotal).toLocaleString()}
                    </span>
                    <span className={s.priceUnit}>
                      /month
                    </span>
                  </div>

                  <div className={s.savingsBadge}>
                    <span className={s.savingsText}>
                      Save {savingPercent}% vs Australian hire
                    </span>
                  </div>

                  <span className={s.cardCta}>
                    View Full Breakdown →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={s.ctaSection}>
        <div className={s.ctaContainer}>
          <h2 className={s.ctaHeading}>
            Don&apos;t See Your Role?
          </h2>

          <p className={s.ctaText}>
            We fill custom content and creative roles too. Book a call to discuss your specific needs.
          </p>

          <a
            href="https://rapidtal.com/#contact"
            className={s.ctaBtn}
          >
            Book a Call
          </a>
        </div>
      </section>

      <ComparisonFooter />
    </>
  );
}

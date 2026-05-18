import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ComparisonNav,
  Breadcrumb,
  ComparisonHero,
  RoleDescription,
  ComparisonTable,
  SavingsBanner,
  SkillsGrid,
  TruthSection,
  CTASection,
  ComparisonFooter
} from '@/components/comparison';
import { ROLES } from '@/data/roles';

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(ROLES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const role = ROLES[params.slug];
  if (!role) return { title: 'Not Found' };

  return {
    title: `${role.title}: Hire Direct from Philippines & Save ${role.stats.saving} | Rapid Tal`,
    description: role.metaDescription,
    openGraph: {
      title: `${role.title}: Australia vs Philippines Cost Comparison`,
      description: role.metaDescription,
    }
  };
}

export default function CostComparisonPage({ params }: { params: { slug: string } }) {
  const role = ROLES[params.slug];
  
  if (!role) {
    notFound();
  }

  const auTotal = role.costs.auBaseSalary + role.costs.auSuper + role.costs.auLeave + 
                  role.costs.auSick + role.costs.auRecruitment + role.costs.tools + 
                  role.costs.auOffice + role.costs.auHR + role.costs.auWorkersComp;
  
  const phTotal = role.costs.phBaseSalary + role.costs.phRecruitment + role.costs.tools;
  
  const monthlySaving = auTotal - phTotal;
  const annualSaving = monthlySaving * 12;
  const savingPercent = Math.round((monthlySaving / auTotal) * 100);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <ComparisonNav />
      <Breadcrumb 
        category={role.category}
        categorySlug={role.categorySlug}
        roleTitle={role.title}
      />
      <ComparisonHero 
        roleTag={role.roleTag}
        headline={role.headline}
        heroSub={role.heroSub}
        heroGhost={role.heroGhost}
        stats={role.stats}
      />
      <RoleDescription 
        roleTitle={role.title}
        roleDescription={role.roleDescription}
      />
      <section style={{ padding: '80px 60px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '20px', height: '2px', background: 'var(--orange)', display: 'block' }}></span>
          The Real Numbers
        </div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.95, marginBottom: '48px' }}>
          WHAT IT <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>ACTUALLY COSTS</em><br />MONTH BY MONTH.
        </h2>
        <ComparisonTable costs={role.costs} />
      </section>
      <SavingsBanner 
        annualSaving={annualSaving}
        savingPercent={savingPercent}
        auTotal={auTotal}
        phTotal={phTotal}
      />
      <SkillsGrid 
        roleTitle={role.title}
        skills={role.skills}
      />
      <TruthSection testimonial={role.testimonial} />
      <CTASection roleTitle={role.title} />
      <ComparisonFooter />
    </div>
  );
}

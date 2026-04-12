const fs = require('fs');
const path = require('path');

const roles = [
  { slug: 'sales-development-rep', component: 'HireSalesDevelopmentRepPage' },
  { slug: 'appointment-setter', component: 'HireAppointmentSetterPage' },
  { slug: 'cold-calling-specialist', component: 'HireColdCallingSpecialistPage' },
  { slug: 'account-executive', component: 'HireAccountExecutivePage' },
  { slug: 'account-manager', component: 'HireAccountManagerPage' },
  { slug: 'inside-sales-representative', component: 'HireInsideSalesRepresentativePage' },
  { slug: 'business-development-manager', component: 'HireBusinessDevelopmentManagerPage' },
  { slug: 'crm-manager', component: 'HireCRMManagerPage' },
  { slug: 'sales-operations-specialist', component: 'HireSalesOperationsSpecialistPage' },
  { slug: 'customer-success-manager', component: 'HireCustomerSuccessManagerPage' }
];

const pageTemplate = (roleSlug, componentName) => `import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import {
  ComparisonNav,
  ComparisonHero,
  TrustBar,
  UrgencyBanner
} from '@/components/comparison';
import { ROLES } from '@/data/roles';
import CursorTracker from '@/components/CursorTracker';

// Dynamic imports for below-the-fold components
const RoleDescription = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.RoleDescription })), { ssr: true });
const ComparisonTable = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonTable })), { ssr: true });
const SavingsBanner = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.SavingsBanner })), { ssr: true });
const SkillsGrid = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.SkillsGrid })), { ssr: true });
const TruthSection = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.TruthSection })), { ssr: true });
const CTASection = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.CTASection })), { ssr: true });
const ComparisonFooter = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonFooter })), { ssr: true });
const AnimatedCTA = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.AnimatedCTA })), { ssr: true });
const SectionHeader = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.SectionHeader })), { ssr: true });
const FAQSection = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.FAQSection })), { ssr: true });

const ROLE_SLUG = '${roleSlug}';

export async function generateMetadata(): Promise<Metadata> {
  const role = ROLES[ROLE_SLUG];
  if (!role) return { title: 'Not Found' };

  return {
    title: \`\${role.title}: Hire Direct from Philippines & Save \${role.stats.saving} | Rapid Tal\`,
    description: role.metaDescription,
    openGraph: {
      title: \`\${role.title}: Australia vs Philippines Cost Comparison\`,
      description: role.metaDescription,
    }
  };
}

export default function ${componentName}() {
  const role = ROLES[ROLE_SLUG];
  
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
      <CursorTracker />
      <ComparisonNav />
      <UrgencyBanner />
      <ComparisonHero 
        roleTag={role.roleTag}
        headline={role.headline}
        heroSub={role.heroSub}
        heroGhost={role.heroGhost}
        stats={role.stats}
      />
      <TrustBar />
      <AnimatedCTA variant="primary" />
      <RoleDescription 
        roleTitle={role.title}
        roleDescription={role.roleDescription}
      />
      <section style={{ padding: 'clamp(60px, 8vw, 80px) clamp(20px, 4vw, 60px)', background: 'var(--black)' }}>
        <SectionHeader 
          tag="The Real Numbers"
          title={<>WHAT IT <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>ACTUALLY COSTS</em><br />MONTH BY MONTH.</>}
        />
        <ComparisonTable costs={role.costs} />
      </section>
      <SavingsBanner 
        annualSaving={annualSaving}
        savingPercent={savingPercent}
        auTotal={auTotal}
        phTotal={phTotal}
      />
      <AnimatedCTA variant="secondary" />
      <SkillsGrid 
        roleTitle={role.title}
        skills={role.skills}
      />
      <AnimatedCTA variant="primary" />
      <TruthSection testimonial={role.testimonial} />
      <FAQSection />
      <CTASection roleTitle={role.title} />
      <ComparisonFooter />
    </div>
  );
}
`;

roles.forEach(({ slug, component }) => {
  const dirPath = path.join(__dirname, '../app', `hire-${slug}`);
  const filePath = path.join(dirPath, 'page.tsx');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Write the page file
  fs.writeFileSync(filePath, pageTemplate(slug, component), 'utf8');
  console.log(`✅ Created: hire-${slug}/page.tsx`);
});

console.log('\n🎉 All 10 sales page files created successfully!');

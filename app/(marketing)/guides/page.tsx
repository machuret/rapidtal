import type { Metadata } from 'next';
import Link from 'next/link';
import GuideShell from '@/components/guides/GuideShell';
import GuideCard from '@/components/guides/GuideCard';
import { GUIDES, GUIDE_CATEGORIES } from '@/data/guides';
import s from '@/components/guides/guides.module.css';

export const metadata: Metadata = {
  title: 'Hiring Guides for Australian Businesses | Rapid Tal',
  description: 'Plan a Philippines remote hire with practical cost guides, interview questions, skills assessments, onboarding checklists, and editable templates.',
  alternates: { canonical: '/guides' },
  openGraph: { title: 'Make your next hire a better-informed one', description: 'Practical hiring guides, assessments, and worksheets for Australian businesses.', url: '/guides', type: 'website' },
};
export default function GuidesPage() {
  return <GuideShell><main id="guide-main">
    <div className={s.hero}>
      <p className={s.eyebrow}>The hiring field guide · {GUIDES.length} practical resources</p>
      <h1 className={s.title}>Make your next hire a better-informed one.</h1>
      <p className={s.subtitle}>Work out the budget. Define the role. Ask better questions. Practical guides for Australian businesses building a remote team in the Philippines.</p>
    </div>
    <nav aria-label="Guide categories" className={s.filters}>
      {GUIDE_CATEGORIES.map((category, i) => <a key={category} href={`#category-${i}`}>{category}</a>)}
    </nav>
    <aside className={s.toolBanner}>
      <div><h2>Start with a budget you can explain.</h2><p>Compare your own monthly costs and one-off fees. No email required.</p></div>
      <Link className={s.button} href="/tools/hiring-budget">Open the budget calculator →</Link>
    </aside>
    {GUIDE_CATEGORIES.map((category, i) => <section className={s.group} id={`category-${i}`} key={category}>
      <h2>{category}</h2>
      <div className={s.grid}>{GUIDES.filter(guide => guide.category === category).map(guide => <GuideCard key={guide.slug} guide={guide} />)}</div>
    </section>)}
  </main></GuideShell>;
}

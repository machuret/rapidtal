import type { Metadata } from 'next';
import Link from 'next/link';
import GuideShell from '@/components/guides/GuideShell';
import HiringBudget from '@/components/guides/HiringBudget';
import s from '@/components/guides/guides.module.css';

export const metadata: Metadata = {
  title: 'Hiring Budget Calculator in AUD | Rapid Tal',
  description: 'Compare first-year and recurring hiring costs using your own pay, tools, support, and setup figures. Free calculator with transparent assumptions.',
  alternates: { canonical: '/tools/hiring-budget' },
  openGraph: { title: 'Compare your hiring budget', description: 'A transparent AUD calculator using your own figures.', url: '/tools/hiring-budget', type: 'website' },
};
export default function HiringBudgetPage() {
  return <GuideShell><main id="guide-main">
    <header className={s.hero}><p className={s.eyebrow}>Free planning tool · AUD</p><h1 className={s.title}>Compare the budget. See every assumption.</h1><p className={s.subtitle}>Separate recurring costs from one-off spending. Use equivalent hours and responsibilities for a useful comparison.</p></header>
    <HiringBudget />
    <section className={s.group}><h2>What the calculation includes</h2><div className={s.section}>
      <p>First-year cost = 12 × monthly costs + one-off costs. Recurring annual cost = 12 × monthly costs. The difference is the alternative’s first-year cost minus the proposed hire’s first-year cost.</p>
      <p>These are planning estimates based only on what you enter, not salary benchmarks or a quote. Benefits, taxes, payroll fees, paid time away, management time, and other obligations are not added automatically. Include applicable amounts in your inputs and confirm unpriced items before deciding.</p>
      <p>A positive difference does not establish equivalent capacity or quality. Review scope, experience, oversight, and availability alongside cost. Read the <Link href="/guides/virtual-assistant-cost-australia">complete hiring cost guide</Link> for a worked example, or compare <Link href="/guides/direct-hire-vs-outsourcing">recruitment and managed outsourcing</Link>.</p>
    </div></section>
  </main></GuideShell>;
}

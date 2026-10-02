import type { Metadata } from 'next';
import GuideShell from '@/components/guides/GuideShell';
import s from '@/components/guides/guides.module.css';

export const metadata: Metadata = {
  title: 'How Our Hiring Guides Are Prepared | Rapid Tal',
  description: 'How to interpret Rapid Tal hiring guides, illustrative examples, sources, worksheets, review dates, and commercial information.',
  alternates: { canonical: '/guides/editorial-policy' },
};
export default function EditorialPolicy() {
  return <GuideShell><main id="guide-main"><header className={s.hero}><p className={s.eyebrow}>About this library</p><h1 className={s.title}>Practical guidance. Clear limits.</h1><p className={s.subtitle}>These resources help employers prepare and evaluate a hire. Here is how to read the examples and check the evidence.</p></header>
    <article className={s.article}>
      <section className={s.section}><h2>Editorial guidance and primary sources</h2><p>The library combines AI-assisted drafting with source checks and editorial review of the examples and structure. It is published under Rapid Tal’s name; no individual qualifications or first-hand placement results are implied. Factual references link to relevant official documentation where used. Suggested exercises, scorecards, and workflows are editorial recommendations, not validated selection instruments.</p></section>
      <section className={s.section}><h2>Examples are not market evidence</h2><p>Hypothetical costs, assessment data, and sample reporting scenarios are labelled. They do not represent a salary survey, customer result, or current Rapid Tal quote. The calculator uses only the figures you enter. Confirm fees, inclusions, availability, and replacement terms in your actual proposal.</p></section>
      <section className={s.section}><h2>Review dates and specialist advice</h2><p>A review date identifies when the guide was checked for this release. It is not a promise that linked software or rules will remain unchanged. Employment, tax, privacy, and regulated work depend on your arrangement and jurisdiction; use the linked resources and appropriate professional advice for those decisions.</p></section>
      <section className={s.section}><h2>Commercial context</h2><p>Rapid Tal offers recruitment services. Guides link to relevant hiring pages and invite readers to discuss their requirements. Comparison guides describe options to evaluate and do not assert that every service discussed is included in a Rapid Tal engagement.</p></section>
      <section className={s.section}><h2>Corrections and feedback</h2><p>If you find an error or an outdated reference, email <a href="mailto:hello@rapidtal.com?subject=Hiring%20guide%20correction">hello@rapidtal.com</a> with the page address, the relevant passage, and supporting information. Do not include private candidate or customer records.</p></section>
    </article>
  </main></GuideShell>;
}

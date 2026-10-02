import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GuideShell from '@/components/guides/GuideShell';
import GuideCard from '@/components/guides/GuideCard';
import { GUIDES, GUIDE_SOURCES, getGuide, guidePath, readingMinutes } from '@/data/guides';
import { ROLES } from '@/data/roles';
import { CALCOM_BOOKING_URL } from '@/lib/booking';
import s from '@/components/guides/guides.module.css';

export const dynamicParams = false;
export function generateStaticParams() { return GUIDES.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Rapid Tal`, description: guide.description,
    alternates: { canonical: guidePath(guide) },
    openGraph: { title: guide.title, description: guide.description, url: guidePath(guide), type: 'article', modifiedTime: guide.reviewedOn },
    twitter: { card: 'summary', title: guide.title, description: guide.description },
  };
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const url = `https://rapidtal.com${guidePath(guide)}`;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: guide.title, description: guide.description, mainEntityOfPage: url, url, inLanguage: 'en-AU', dateModified: guide.reviewedOn, author: { '@type': 'Organization', name: 'Rapid Tal', url: 'https://rapidtal.com' }, publisher: { '@type': 'Organization', name: 'Rapid Tal', url: 'https://rapidtal.com' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rapidtal.com' },
      { '@type': 'ListItem', position: 2, name: 'Hiring guides', item: 'https://rapidtal.com/guides' },
      { '@type': 'ListItem', position: 3, name: guide.title, item: url },
    ] },
  ];
  return <GuideShell><main id="guide-main">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <nav aria-label="Breadcrumb"><ol className={s.breadcrumb}><li><Link href="/">Home</Link></li><li aria-hidden="true">/</li><li><Link href="/guides">Hiring guides</Link></li><li aria-hidden="true">/</li><li aria-current="page">{guide.category}</li></ol></nav>
    <header className={s.hero}>
      <p className={s.eyebrow}>{guide.category}</p>
      <h1 className={s.title}>{guide.title}</h1>
      <p className={s.subtitle}>{guide.description}</p>
      <div className={s.meta}><span>By Rapid Tal</span><span>Reviewed <time dateTime={guide.reviewedOn}>2 October 2026</time></span><span>{readingMinutes(guide)} min read</span><Link href="/guides/editorial-policy">Editorial approach</Link></div>
    </header>
    <div className={s.articleLayout}>
      <article className={s.article}>
        <section className={s.answer}><h2>The practical answer</h2><p>{guide.answer}</p></section>
        {guide.sections.map(section => <section key={section.id} id={section.id} className={s.section}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          {section.items.length > 0 && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
          {section.table && <div className={s.tableWrap} role="region" aria-label={section.table.caption} tabIndex={0}><table>
            <caption>{section.table.caption}</caption>
            <thead><tr>{section.table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
            <tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
          </table></div>}
          {section.sourceIds.length > 0 && <div className={s.citations}>Reference: {section.sourceIds.map((id, i) => <span key={id}>{i > 0 && ' · '}<a href={GUIDE_SOURCES[id].url}>{GUIDE_SOURCES[id].title}</a></span>)}</div>}
        </section>)}
        {guide.slug === 'virtual-assistant-cost-australia' && <aside className={s.download}><h2>Use your own numbers</h2><p>The interactive calculator separates recurring and one-off costs. Enter quotes for your actual arrangement.</p><Link className={s.button} href="/tools/hiring-budget">Calculate your hiring budget →</Link></aside>}
        {guide.download && <aside id="worksheet" className={s.download}><h2>Put the guide to work</h2><p>Editable {guide.download.format} worksheet. Open it in any text editor. No signup required.</p><a className={s.button} href={guide.download.path} download>{guide.download.label} ↓</a></aside>}
        <section className={`${s.section} ${s.faq}`} id="questions"><h2>Common questions</h2>{guide.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
        {guide.sourceIds.length > 0 && <section id="references" className={s.section}><h2>Sources and further reading</h2><ul>{guide.sourceIds.map(id => <li key={id}><a href={GUIDE_SOURCES[id].url}>{GUIDE_SOURCES[id].title}</a></li>)}</ul><p>Sources support the referenced factual guidance. Exercises, suggested scorecards, and hypothetical examples are Rapid Tal editorial material, not independently validated benchmarks.</p></section>}
        <section className={s.download}><h2>Turn the brief into your next hire.</h2><p>Explore the relevant roles, then discuss scope, experience, availability, and current terms.</p><div className={s.roleLinks}>{guide.roleSlugs.map(slug => <Link key={slug} href={`/hire-${slug}`}>{ROLES[slug].title}</Link>)}</div><a className={s.button} href={CALCOM_BOOKING_URL}>Discuss your hiring brief ↗</a></section>
      </article>
      <aside className={s.sidebar}><nav aria-label="On this page"><h2>In this guide</h2><ol>{guide.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}{guide.download && <li><a href="#worksheet">Download the worksheet</a></li>}<li><a href="#questions">Common questions</a></li></ol></nav></aside>
    </div>
    <section className={s.related}><h2>Keep building your hiring plan.</h2><div className={s.grid}>{guide.relatedSlugs.map(slug => { const related = getGuide(slug); return related ? <GuideCard key={slug} guide={related} /> : null; })}</div></section>
  </main></GuideShell>;
}

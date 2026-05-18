import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import s from './page.module.css';

export const metadata: Metadata = {
  title: 'Case Studies — Rapid Tal',
  description: 'How three Australian businesses cut hiring costs by 60–75%, placed talent in under 18 days, and reinvested AU$359K+ in savings into growth.',
  alternates: { canonical: '/case-studies' },
  openGraph: {
    title: 'Case Studies — Rapid Tal',
    description: 'Real results. Real savings. Real growth. Three companies, AU$359,200 saved in year one.',
    url: 'https://rapidtal.com/case-studies',
  },
};

const caseStudies = [
  {
    num: '01',
    tag: 'Fintech · Paid Ads',
    title: 'FinTech Growth Co.',
    meta: 'Mid-stage fintech startup — AU$8M ARR',
    challenge: 'Marketing team stretched to breaking point. Needed a Paid Ads Specialist urgently — traditional recruitment: AU$121,600/yr + AU$18K agency fee, 40-day timeline they couldn\'t afford.',
    solution: 'Three pre-vetted candidates in 48 hours. All with 4+ years of international fintech/B2B experience. Hired and onboarded by day 16.',
    results: [
      { key: 'Annual savings vs. local hire', val: 'AU$78,600' },
      { key: 'Placement fee (vs. AU$18K agency)', val: 'AU$3,990' },
      { key: 'Time to placement', val: '16 Days' },
    ],
    after: [
      '40% improvement in ad campaign ROI',
      '28% reduction in cost-per-acquisition',
      '23% quarter-over-quarter revenue growth',
    ],
    afterLabel: '6 Months Later',
    quoteStrong: '"It was a no-brainer."',
    quote: '"We saved AU$78k in year one and got the person we needed in half the time." — Founder, FinTech Growth Co.',
  },
  {
    num: '02',
    tag: 'B2B SaaS · Sales SDR',
    title: 'SaaS Scale Australia',
    meta: 'Bootstrapped B2B SaaS — AU$3.2M ARR',
    challenge: 'Revenue had plateaued. Needed two SDRs to build pipeline — two local hires would cost AU$270,000+ in year one including fees. Money they needed for product.',
    solution: 'Two experienced SDRs onboarded within 19 days. Outbound-trained with B2B SaaS backgrounds. Both hired for the cost of one local candidate.',
    results: [
      { key: 'Saved vs. hiring locally (Year 1)', val: 'AU$152,000' },
      { key: 'Placement fees (2 SDRs total)', val: 'AU$7,980' },
      { key: 'Combined annual salaries (2×)', val: 'AU$75,600' },
    ],
    after: [
      '340 qualified leads generated (vs. 220 projected)',
      'Pipeline grew AU$1.8M → AU$3.2M',
      '4.2× ROI on total hiring investment',
    ],
    afterLabel: 'Within 6 Months',
    quoteStrong: '"Integral to our team."',
    quote: '"We reinvested AU$152k in savings into product. Great English, professional, and they\'ve become core to our growth." — CEO, SaaS Scale Australia',
  },
  {
    num: '03',
    tag: 'E-Commerce · Content',
    title: 'E-Commerce Direct Ltd',
    meta: 'D2C e-commerce brand — AU$5.5M revenue',
    challenge: 'Growth stalling. Needed a Content Strategist and Email Manager — roles that previously took 6 months to fill. Combined local cost: AU$208,640+ in year one.',
    solution: 'Both roles filled by day 17 with e-commerce specialists. Onboarded 10 days later. Both productive by week 3 via Rapid Tal\'s onboarding bridge.',
    results: [
      { key: 'Year 1 cost reduction', val: 'AU$128,600' },
      { key: 'Time saved vs. 3-month recruitment', val: '2.5 Months' },
      { key: 'Total placement investment (2 hires)', val: 'AU$7,980' },
    ],
    after: [
      'Email open rates: 18% → 28% (+55%)',
      'Content output: 8 → 24 pieces/month',
      'Email-attributed revenue: AU$186,000',
      '15.2× ROI on hiring in 6 months',
    ],
    afterLabel: 'After 6 Months',
    quoteStrong: '"A complete game-changer."',
    quote: '"Both came in ready to contribute day one. Saving 2.5 months of recruitment time when we needed to grow was the real win." — Marketing Director, E-Commerce Direct Ltd',
  },
];

const whyItems = [
  { title: 'Direct-Hire', body: 'No ongoing fees. No middlemen. You own the relationship from day one.' },
  { title: 'Pre-Vetted', body: '300+ candidates sourced per role. Minimum 3 years international experience.' },
  { title: '18-Day Avg.', body: 'From first contact to hired. The Australian industry average is 40 days.' },
  { title: 'Guaranteed', body: '6-month replacement guarantee on every single placement. No excuses.' },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Nav />
      <ScrollReveal />

      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────── */}
        <section className={s.hero}>
          <div className={s.heroBg} />
          <div className={s.heroContent}>
            <span className="hero-eyebrow">Real Results. Real Savings. Real Growth.</span>
            <h1 className="hero-headline">
              Australian Businesses<br />
              <em>That Scaled</em><br />
              <span className="outline">With Rapid Tal.</span>
            </h1>
            <p className="hero-sub">
              How three companies cut hiring costs by <strong>60–75%</strong>, placed talent in under 18 days, and reinvested the savings into growth.
            </p>
            <div className="hero-trust">
              <span>→ AU$359K+ Saved</span>
              <span>+ 18-Day Avg. Placement</span>
              <span>+ 3 Industries</span>
              <span>+ 3 Hiring Roles</span>
              <span>+ AU$3,990 Flat Fee</span>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ────────────────────────────────────────── */}
        <div className={s.statsStrip}>
          {[
            { num: 'AU$359K+', label: 'Saved in Year One' },
            { num: '18', label: 'Days Avg. Placement' },
            { num: '3+', label: "Years Int'l Exp. Required" },
            { num: '6M', label: 'Replacement Guarantee' },
          ].map((stat) => (
            <div className="stat-item" key={stat.label}>
              <span className="stat-num">{stat.num}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── INTRO ──────────────────────────────────────────────── */}
        <div className={`${s.intro} reveal`}>
          <span className="section-label">Case Studies</span>
          <h2 className="section-heading">The Proof Is<br /><em>In the Numbers.</em></h2>
          <p style={{ color: 'var(--grey-light)', maxWidth: 640, fontSize: 18, lineHeight: 1.75, marginTop: 8 }}>
            With 85% of Australian businesses reporting skills shortages and local hires costing AU$110–120K+ annually in real terms, forward-thinking companies are finding a better way. These are three of them.
          </p>
        </div>

        {/* ── CASE STUDY CARDS ───────────────────────────────────── */}
        <div className={s.csGrid}>
          {caseStudies.map((cs) => (
            <div className={`${s.csCard} reveal`} key={cs.num}>
              <div className={s.csCardNum}>{cs.num}</div>
              <span className={s.csCardTag}>{cs.tag}</span>
              <div className={s.csCardTitle}>{cs.title}</div>
              <div className={s.csCardMeta}>{cs.meta}</div>

              <div className={s.csDividerLabel}>The Challenge</div>
              <p className={s.csCardBody}>{cs.challenge}</p>

              <div className={s.csDividerLabel}>The Solution</div>
              <p className={s.csCardBody}>{cs.solution}</p>

              <div className={s.csDividerLabel}>Results</div>
              <ul className={s.csResults}>
                {cs.results.map((r) => (
                  <li key={r.key}>
                    <span className={s.resKey}>{r.key}</span>
                    <span className={s.resVal}>{r.val}</span>
                  </li>
                ))}
              </ul>

              <div className={s.csDividerLabel}>{cs.afterLabel}</div>
              <ul className={s.csList}>
                {cs.after.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className={s.csQuote}>
                <strong>{cs.quoteStrong}</strong>
                {cs.quote}
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM LINE ────────────────────────────────────────── */}
        <section className={s.bottomLine}>
          <div className={s.bottomGlow} />
          <div className={s.bottomInner}>
            <span className="section-label">The Bottom Line</span>
            <h2 className="section-heading">Three Companies.<br /><em>One Result.</em></h2>
            <span className={s.bottomNum}>AU$359,200</span>
            <p className={s.bottomSub}>
              Combined savings in year one. Faster placements, stronger performance, and capital freed up to actually grow the business.
            </p>
            <div className={s.whyGrid}>
              {whyItems.map((item) => (
                <div className={s.whyItem} key={item.title}>
                  <div className={s.whyTitle}>{item.title}</div>
                  <p className={s.whyBody}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className={`${s.cta} reveal`}>
          <span className="section-label">Get Started</span>
          <h2 className="section-heading">See Your<br /><em>Exact Savings.</em></h2>
          <p className={s.ctaSub}>
            Get matched with pre-vetted candidates within 48 hours. No commitment, no agency fees.
          </p>
          <div className={s.ctaActions}>
            <a href="/calculator" className="btn-primary"><span>Take the Calculator →</span></a>
            <a href="/#contact" className="btn-ghost">Book a Call</a>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

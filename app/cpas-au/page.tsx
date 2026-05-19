import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import CalendlyEmbed from '@/components/CalendlyEmbed';
import s from './page.module.css';

export const metadata: Metadata = {
  title: "Your CPAs Are Doing $10-an-Hour Work — RapidTal",
  description: "How Australian accounting firms are hiring dedicated Filipino professionals — trained in marketing OR accounting — to solve the talent crisis, eliminate BPO markups, and shift from compliance factories to advisory-led practices. Powered by Claude AI.",
  alternates: { canonical: 'https://rapidtal.com/cpas-au' },
};

export default function CPAsAUPage() {
  return (
    <div className={s.wrapper}>
      <Nav />
      <ScrollReveal>
        <div className={s.cover}>
          <div className={s.coverBrand}>RapidTal</div>
          <h1>Your CPAs Are Doing <em className={s.highlight}>$10-an-Hour Work.</em> And It&apos;s Killing Your Firm.</h1>
          <p className={s.coverSubtitle}>How Australian accounting firms are hiring dedicated Filipino professionals — trained in marketing OR accounting — to solve the talent crisis, eliminate BPO markups, and shift from compliance factories to advisory-led practices. Powered by Claude AI.</p>
          <p className={s.coverSub2}>Two tracks. One placement fee. Choose the VA your firm needs most — or hire both.</p>
          <div className={s.coverTagline}>No contracts. No retainers. No middlemen.</div>
          <div className={s.coverByline}>By Gabriel Machuret — RapidTal.com</div>
          <div className={s.coverAud}>All prices in Australian Dollars (AUD)</div>
        </div>
      </ScrollReveal>

      <nav className={s.toc}>
        <div className={s.tocTitle}>What&apos;s Inside</div>
        <ol className={s.tocList}>
          <li><a href="#the-maths">The Maths That Should Keep Every Practice Owner Awake</a></li>
          <li><a href="#bpo-markup">What Your BPO Is Actually Charging You</a></li>
          <li><a href="#advisory-shift">The Compliance-to-Advisory Shift</a></li>
          <li><a href="#two-tracks">Two Tracks. One Solution.</a></li>
          <li><a href="#accounting-va">Track 1 — The Accounting VA</a></li>
          <li><a href="#marketing-va">Track 2 — The Marketing VA</a></li>
          <li><a href="#cost-comparison">The Full Cost Comparison</a></li>
          <li><a href="#tax-season">Tax Season: How Your VA Changes the Equation</a></li>
          <li><a href="#two-futures">Two Futures: Your Firm in 12 Months</a></li>
          <li><a href="#get-started">How to Get Started</a></li>
        </ol>
      </nav>

      <div className={s.content}>

        <section id="the-maths">
          <div className={s.sectionDivider}></div>
          <h2>The Maths That Should Keep Every Practice Owner Awake</h2>
          <p>Your senior accountant bills at $250 an hour. Right now, they&apos;re spending 15 hours a week on data entry, bank reconciliations, document chasing, BAS preparation, and filing. That&apos;s <strong>$3,750 a week</strong> in billable capacity burned on work that doesn&apos;t require their qualification. That&apos;s <strong>$195,000 a year. Per CPA.</strong></p>
          <p>If even half of those recovered hours convert to actual billable advisory work, you&apos;re looking at $97,500 in additional revenue per CPA per year. The cost of the VA who takes over that work? $15,600 a year. That&apos;s a <strong>return of 6:1 in year one.</strong> And it compounds every year after.</p>
          <p>That&apos;s not a marketing claim. That&apos;s arithmetic. And it&apos;s the reason over a thousand Australian accounting firms have already moved operational work offshore. The only question is whether you&apos;re going to keep paying a BPO $3,000–$5,000 a month for the privilege, or whether you&apos;re going to hire directly and keep the savings yourself.</p>
          <div className={s.callout}>$195,000 in lost billable hours. Per CPA. Per year. That&apos;s the cost of having qualified professionals do unqualified work. This guide shows you how to fix it for $1,300/month.</div>

          <h3>The Talent Crisis Isn&apos;t Coming. You&apos;re Living It.</h3>
          <p>Australian university accounting graduates have fallen from 4,356 in 2010 to just 2,278 in 2020 — a decline of nearly half. CPA Australia and Chartered Accountants ANZ have publicly called on the government for migration reform because the profession can&apos;t fill the gap domestically. <strong>The industry needs ~9,000 new professionals every year through 2026.</strong> It&apos;s not meeting it.</p>
          <p>A 2025 survey found organisations had, on average, five open accounting positions — a 150% increase from the prior year. Half took 60+ days to fill. Staff turnover in CPA firms averages 15%. Every departure costs $20,000–$40,000 in recruitment, onboarding, and lost productivity.</p>
          <p>Australia&apos;s accounting services industry is worth $35.2 billion in 2026, growing at 6.24% CAGR through 2034. Over 37,000 firms competing for a shrinking talent pool. The firms that solve the talent problem grow. The ones that don&apos;t burn out, lose clients, and watch their best people leave.</p>

          <h3>Sound Familiar?</h3>
          <ul className={s.checklist}>
            <li><strong>You&apos;ve had an open role for 3+ months.</strong> Candidates are either unqualified, demanding $80K+ plus super, or they accept and leave within 8 months.</li>
            <li><strong>Your CPAs spend 40–60% of their time on non-billable work</strong> — data entry, recs, BAS prep, document management. Work that doesn&apos;t need a CPA.</li>
            <li><strong>Tax season nearly broke the team last year.</strong> Everyone worked 60-hour weeks. Quality slipped. Clients waited. Your best staff updated their CVs by November.</li>
            <li><strong>Your marketing is non-existent.</strong> No blog, no social, no review strategy, no SEO. You rely on referrals and hope.</li>
            <li><strong>Clients want advisory, but you&apos;re stuck in compliance.</strong> Cash flow forecasting, scenario modelling, growth strategy — the high-margin work. But your team is too buried to deliver it.</li>
            <li><strong>You&apos;ve looked at BPOs.</strong> TOA Global, Beepo, D&amp;V. Monthly retainers of $1,800–$5,000 per person. You don&apos;t own the relationship. If you leave, you start from scratch.</li>
          </ul>
          <div className={s.callout}>If any of that sounds like your firm, keep reading. This guide shows you how to add a dedicated full-time team member — marketing VA or accounting VA — for $1,300–$1,800/month. Direct hire. You own the relationship. No monthly markup.</div>
        </section>

        <section id="bpo-markup">
          <div className={s.sectionDivider}></div>
          <h2>Let&apos;s Talk About What Your BPO Is Actually Charging You</h2>
          <p>This is the section the outsourcing companies don&apos;t want you to read.</p>
          <p>The average monthly salary for a qualified Filipino accountant with 3–5 years of experience is AUD $750–$1,500. For a senior with 5+ years and a Philippine CPA licence: AUD $1,500–$2,250. Those are actual wages.</p>
          <p>Now look at what BPOs charge you:</p>

          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th>Provider Type</th><th>Monthly Fee to You</th><th>Estimated Worker Salary</th><th>Markup</th></tr></thead>
              <tbody>
                <tr><td><strong>Large BPO (TOA Global, Beepo)</strong></td><td>$2,500–$5,000/mo per FTE</td><td>$750–$1,500/mo</td><td>67–233%</td></tr>
                <tr><td><strong>Mid-tier outsourcing firm</strong></td><td>$1,800–$3,500/mo per FTE</td><td>$600–$1,200/mo</td><td>67–192%</td></tr>
                <tr className={s.tableRowHighlight}><td>RapidTal (direct hire)</td><td>$1,300–$1,800/mo</td><td>$1,300–$1,800/mo (100% to worker)</td><td>0%</td></tr>
              </tbody>
            </table>
          </div>

          <p>The large BPOs charge $3,000–$5,000 for a worker who receives $750–$1,500. The difference — <strong>$1,500–$3,500 per month, every month, forever</strong> — goes to the BPO. That&apos;s $18,000–$42,000 per year in pure markup. Per worker.</p>

          <h3>What the Markup Actually Buys</h3>
          <div className={s.exposeBlock}>
            <div className={s.exposeTag}>Office Seat</div>
            <p>Your worker sits in a BPO office in Manila or Clark. Cost to BPO: <strong>$100–$200/month.</strong> You&apos;re paying $2,000+ markup for a $150 desk.</p>
          </div>
          <div className={s.exposeBlock}>
            <div className={s.exposeTag}>HR &amp; Payroll</div>
            <p>Government benefits and payroll processing. Cost to BPO: <strong>$200–$400/month.</strong> You&apos;re paying $2,000+ for $300 in admin.</p>
          </div>
          <div className={s.exposeBlock}>
            <div className={s.exposeTag}>&quot;Client Success Manager&quot;</div>
            <p>Someone who checks in periodically. Cost to BPO: <strong>$50–$100/month per client.</strong> You&apos;re paying thousands for an email every two weeks.</p>
          </div>
          <div className={s.exposeBlock}>
            <div className={s.exposeTag}>The Loyalty Problem</div>
            <p>In a BPO, the worker&apos;s employer is the BPO, not you. Their reviews, raises, career path — all managed by the BPO. You&apos;re renting a person. <strong>If you leave, they don&apos;t come with you.</strong></p>
          </div>

          <div className={s.callout}>Ask your BPO one question: &quot;If I leave tomorrow, does my worker come with me?&quot; The answer is no. You&apos;ve been paying a premium for a rental. RapidTal gives you a direct hire. You own the relationship from day one.</div>
        </section>

        <section id="advisory-shift">
          <div className={s.sectionDivider}></div>
          <h2>The Compliance-to-Advisory Shift: Why This Matters Right Now</h2>
          <p>CPA Australia&apos;s own publication INTHEBLACK calls it &quot;the clearest trend for 2026 and beyond&quot; — the fast-accelerating move from compliance toward advisory. Compliance isn&apos;t disappearing, but its value perception is eroding. Clients know automation and AI can handle it. They&apos;re less willing to pay top dollar.</p>
          <p>IBISWorld projects the industry reaching $35.2 billion in 2026, growth driven overwhelmingly by advisory: cash flow forecasting, scenario modelling, growth strategy, tax planning, succession planning. The firms stuck on compliance are experiencing margin pressure. The firms pulling ahead are repositioning compliance as the entry point and advisory as the profit centre.</p>

          <h3>The Cruel Irony</h3>
          <p>Your clients want advisory. They&apos;d pay premium fees. But your CPAs are too busy processing BAS returns, entering transactions, and reconciling bank accounts to deliver it.</p>
          <p>The solution isn&apos;t another $85,000 accountant who&apos;ll spend 50% of their time on the same admin. The solution is a $1,300/month VA who handles ALL compliance operations, freeing your qualified staff for what they&apos;re actually qualified for.</p>

          <div className={s.tableWrap}>
            <table className={`${s.table} ${s.orangeHeader}`}>
              <thead><tr><th>Work Type</th><th>Who Does It Now</th><th>Who Should Do It</th><th>Revenue Impact</th></tr></thead>
              <tbody>
                <tr><td><strong>Data entry, bank recs, document processing</strong></td><td>Your CPA ($250/hr)</td><td>Accounting VA ($8–$11/hr)</td><td>Frees $97,500/yr per CPA</td></tr>
                <tr><td><strong>BAS prep, payroll, AP/AR</strong></td><td>Your CPA ($250/hr)</td><td>Accounting VA ($8–$11/hr)</td><td>Protects compliance margin</td></tr>
                <tr><td><strong>Cash flow forecasting, tax planning, strategy</strong></td><td>Nobody (no capacity)</td><td>Your CPA (finally freed up)</td><td>New revenue at $300–$500/hr</td></tr>
                <tr><td><strong>Social media, SEO, reviews, lead gen</strong></td><td>Nobody (no time)</td><td>Marketing VA + Claude AI</td><td>Pipeline growth</td></tr>
                <tr><td><strong>Client nurture, email campaigns, GBP</strong></td><td>Nobody (no system)</td><td>Marketing VA + Claude AI</td><td>Retention, referrals</td></tr>
              </tbody>
            </table>
          </div>

          <div className={s.callout}>The firms that will dominate Australian accounting in the next 5 years separate execution from expertise. Qualified staff do the thinking. VAs do the processing. That&apos;s not theory — it&apos;s the operating model every high-growth firm is already building.</div>
        </section>

        <section id="two-tracks">
          <div className={s.sectionDivider}></div>
          <h2>Two Tracks. One Solution. Choose What Your Firm Needs Most.</h2>

          <div className={s.tableWrap}>
            <table className={`${s.table} ${s.orangeHeader}`}>
              <thead><tr><th></th><th>Marketing VA</th><th>Accounting VA</th></tr></thead>
              <tbody>
                <tr><td><strong>Primary Role</strong></td><td>Grow your client base and brand</td><td>Expand operational capacity</td></tr>
                <tr><td><strong>Key Tasks</strong></td><td>Social media, SEO, reviews, email, lead follow-up, competitor intel, events</td><td>Bookkeeping, bank recs, BAS prep, payroll, AP/AR, document management, month-end</td></tr>
                <tr><td><strong>AI Integration</strong></td><td>Claude writes all content. VA publishes, manages, monitors.</td><td>Claude drafts correspondence, report summaries, ATO responses. VA executes.</td></tr>
                <tr><td><strong>Qualifications</strong></td><td>Marketing/comms degree. Social media, CRM, content expertise.</td><td>Accountancy degree. Many hold Philippine CPA (20–30% pass rate). Xero, MYOB, QuickBooks trained.</td></tr>
                <tr><td><strong>Best For</strong></td><td>Firms with capacity but no pipeline. Referral-dependent. Invisible online.</td><td>Firms with clients but no capacity. CPAs doing admin. Tax season crunch.</td></tr>
                <tr><td><strong>Cost</strong></td><td>~AUD $1,300/month</td><td>~AUD $1,300–$1,800/month</td></tr>
              </tbody>
            </table>
          </div>

          <div className={s.callout}>Start with one. Add the other later. Many firms begin with an accounting VA for immediate capacity, then add a marketing VA once they can handle the new clients it generates.</div>
        </section>

        <section id="accounting-va">
          <div className={s.sectionDivider}></div>
          <div className={s.trackLabel}>Track 1 — Accounting VA</div>
          <h2>The Accounting VA: What They Do, How They Do It, What Changes</h2>
          <p>RapidTal&apos;s accounting VAs are university-qualified professionals with degrees in accountancy or finance. Many hold the Philippine CPA certification — the board exam has a pass rate of only 20–30%, one of the most demanding in Asia. The Philippines has been producing accounting graduates at an increasing rate since 2013, even as Australian numbers have halved. BSc Accountancy is one of the most popular degree programmes in the country.</p>

          <h3>Tools They Use</h3>
          <ul className={s.checklist}>
            <li><strong>Xero</strong> (including Xero Advisor certification)</li>
            <li><strong>MYOB</strong></li>
            <li><strong>QuickBooks</strong> (including ProAdvisor certification)</li>
            <li><strong>Dext</strong> — document capture and processing</li>
            <li><strong>ATO portals</strong> — BAS lodgement, PAYG, STP</li>
            <li><strong>Practice management</strong> — FYI, Karbon, XPM, Practice Ignition</li>
            <li><strong>Excel / Google Sheets</strong> at advanced level</li>
          </ul>

          <h3>Day-to-Day</h3>
          <ul className={s.checklist}>
            <li><strong>Transaction processing:</strong> bank feeds, receipts, invoices. Categorising and coding to your chart of accounts.</li>
            <li><strong>Bank reconciliations:</strong> monthly across all client accounts. Discrepancies flagged for your review.</li>
            <li><strong>BAS preparation:</strong> GST, PAYG withholding, PAYG instalments compiled. BAS ready for your review and lodgement.</li>
            <li><strong>Payroll:</strong> pay runs, STP reports, super reconciliation.</li>
            <li><strong>AP/AR:</strong> invoice processing, payment scheduling, debtor follow-up, ageing reports.</li>
            <li><strong>Document management:</strong> organising, filing, chasing clients for missing docs so your CPA doesn&apos;t send the same email for the fifth time.</li>
            <li><strong>Client onboarding:</strong> Xero/MYOB setup, bank feeds, engagement letters, practice management templates.</li>
            <li><strong>Month-end / year-end:</strong> working papers, trial balances, supporting schedules. Your CPA reviews a clean file, not a mess.</li>
            <li><strong>ATO correspondence:</strong> draft responses to queries, amendments, client authority forms.</li>
          </ul>

          <h3>What Changes After 90 Days</h3>
          <ul className={s.checklist}>
            <li><strong>Your CPAs are doing advisory work</strong> for the first time in years. Cash flow forecasting, tax planning, growth strategy.</li>
            <li><strong>Turnaround times halved.</strong> BAS in 2 days, not a week. Month-end by the 10th, not the 25th.</li>
            <li><strong>Staff morale improved.</strong> Qualified staff using their skills. Attrition risk drops.</li>
            <li><strong>New clients onboarded without hiring locally.</strong> 40 extra hours/week of capacity.</li>
            <li><strong>Tax season was survivable.</strong> Nobody worked 60 hours. Nobody quit.</li>
          </ul>
          <div className={s.callout}>Your accounting VA doesn&apos;t replace CPAs. They replace the non-CPA work your CPAs are currently doing. At $250/hr CPA vs $8–$11/hr VA, the ROI is immediate.</div>
        </section>

        <section id="marketing-va">
          <div className={s.sectionDivider}></div>
          <div className={s.trackLabel}>Track 2 — Marketing VA</div>
          <h2>The Marketing VA: The Growth Engine Your Firm Has Never Had</h2>
          <p>Most accounting firms don&apos;t market. At all. 37,000+ firms offering the same services, and the vast majority rely entirely on referrals, word of mouth, and inertia. That worked for 30 years. It doesn&apos;t work anymore.</p>
          <p>Buyers of accounting services now research providers online before making contact — comparing digital footprints, reviews, thought leadership, and social presence. <strong>If your firm is invisible online, you&apos;re not in the consideration set.</strong></p>

          <h3>The Economics</h3>
          <p>The average SME accounting client is worth <strong>$3,000–$8,000/year</strong> in recurring fees. Advisory clients: <strong>$10,000–$25,000+.</strong> Average retention: 5–7 years. A single new client is worth <strong>$15,000–$56,000</strong> in lifetime revenue. A single advisory client: <strong>$70,000–$175,000.</strong></p>
          <p>Your marketing VA costs $15,960/year. If the system generates <strong>3–5 new compliance clients per year — or a single advisory client</strong> — the VA has paid for itself multiple times over. Everything after that is pure profit.</p>
          <p>And the compounding effect: unlike paid ads, the content keeps working. A blog post from March still ranks in December. Reviews compound. Social presence builds. After 12 months, you have an asset — not an expense.</p>
          <div className={s.callout}>One new advisory client per year covers the cost of your marketing VA for 3+ years. The question isn&apos;t whether you can afford one. It&apos;s whether you can afford not to have one.</div>

          <h3>1. Google Business Profile — Your #1 Free Lead Source</h3>
          <p>When a business owner types &quot;accountant near me,&quot; they see the Map Pack — the three GBP listings at the top. If yours is stale, you&apos;re invisible.</p>
          <ul className={s.checklist}>
            <li><strong>2–3 Google Business posts per week:</strong> tax tips, deadline reminders, client wins (&quot;Helped a local cafe save $12,000 with the instant asset write-off&quot;).</li>
            <li><strong>Photo uploads weekly.</strong> Profiles with 100+ photos get 520% more calls.</li>
            <li><strong>Q&amp;A management:</strong> every question answered as a micro-sales pitch written by Claude.</li>
            <li><strong>Weekly performance tracking</strong> — views, calls, search queries.</li>
          </ul>
          <div className={s.timeCompare}>⏱ VA: ~1 hr/week &nbsp;|&nbsp; You: 2–3 hrs/week (if you did it at all)</div>

          <h3>2. Google Reviews — The Trust Signal That Wins Clients</h3>
          <p>Choosing an accountant is a trust decision. A firm with 80 reviews and a 4.8 rating beats one with 8 reviews and 5.0 — volume signals legitimacy.</p>
          <ul className={s.checklist}>
            <li><strong>Post-engagement review requests:</strong> after every tax return, BAS quarter, advisory engagement. &quot;Hi Sarah, now that your FY25 return is lodged, would you mind sharing your experience?&quot;</li>
            <li><strong>3-touch follow-up:</strong> Day 1, Day 3, Day 7. Converts 40% more.</li>
            <li><strong>Every review responded to within 24 hours.</strong> Negative reviews drafted and sent to you for approval.</li>
            <li><strong>Review velocity tracked vs. competitors.</strong></li>
          </ul>
          <p>After 12 months: 80–120 new reviews. A competitive moat that takes competitors a year to replicate.</p>
          <div className={s.timeCompare}>⏱ VA: ~45 min/week &nbsp;|&nbsp; You: 3+ hrs/week</div>

          <h3>3. Social Media — Becoming the Trusted Authority</h3>
          <p>Accountants don&apos;t think of themselves as social media people. That&apos;s precisely why the ones who show up stand out dramatically. Your VA posts 3–5 times per week:</p>
          <ul className={s.checklist}>
            <li><strong>Monday — Tax Tip:</strong> &quot;3 deductions tradies forget every year.&quot; Practical, specific, useful.</li>
            <li><strong>Tuesday — Client Spotlight:</strong> &quot;How we helped a Parramatta restaurant restructure and save $18,000.&quot; (Anonymised or with permission.)</li>
            <li><strong>Wednesday — ATO Deadline:</strong> &quot;BQ4 BAS due 28 Feb. Here&apos;s what to have ready.&quot; Creates urgency.</li>
            <li><strong>Thursday — Team Spotlight:</strong> &quot;Meet Sarah, 12 years of experience and a passion for helping small businesses.&quot; Humanises the firm.</li>
            <li><strong>Friday — Thought Leadership:</strong> &quot;Why your accountant should be talking cash flow, not just tax.&quot; Positions you as an advisor.</li>
          </ul>
          <p>After 3 months: engagement up 200–400%. After 6 months: inbound enquiries from social. After 12 months: genuine competitive advantage.</p>
          <div className={s.timeCompare}>⏱ VA: ~2 hrs/week &nbsp;|&nbsp; You: 5+ hrs/week</div>

          <h3>4. SEO Blog Content — Free Leads Forever</h3>
          <p>Every blog post is a net catching clients actively searching. 2–4 posts per month targeting real searches:</p>
          <ul className={s.checklist}>
            <li><strong>&quot;Best accountant in [your suburb]&quot;</strong> — suburb-specific page positioning you as the local expert.</li>
            <li><strong>&quot;Small business tax deductions 2026 Australia&quot;</strong> — comprehensive guide. Readers are pre-sold on your expertise.</li>
            <li><strong>&quot;BAS lodgement dates 2026&quot;</strong> — simple reference page. Hundreds of visits. Your name on every page.</li>
            <li><strong>&quot;How much does an accountant cost in [your city]?&quot;</strong> — answers the #1 question. You&apos;re first to mind.</li>
            <li><strong>Industry-specific:</strong> &quot;Tax tips for tradies,&quot; &quot;Accounting for medical professionals,&quot; &quot;NDIS provider financial management.&quot;</li>
          </ul>
          <p>After 12 months: 24–48 posts ranking on Google. Each a permanent lead source. Cost equivalent from an agency: $14,400–$24,000/year. Your VA does it as part of $15,960/year total.</p>
          <div className={s.callout}>A marketing agency charges $300–$500 per blog post. 4 posts/month = $14,400–$24,000/year. Your VA does all of it — plus all the other marketing functions — for $15,960/year total.</div>
          <div className={s.timeCompare}>⏱ VA: ~2 hrs/week &nbsp;|&nbsp; You: 5+ hrs/week</div>

          <h3>5. Email Marketing — The Silent Revenue Machine</h3>
          <p>Your client database is your most valuable marketing asset — and you&apos;re almost certainly neglecting it.</p>
          <ul className={s.checklist}>
            <li><strong>Monthly newsletter:</strong> tax law changes, ATO focus areas, deadline reminders, practical tips. Personalised by segment.</li>
            <li><strong>EOFY campaigns:</strong> 4–6 week sequence. &quot;5 things before EOFY.&quot; &quot;Book your tax planning session.&quot; Drives bookings.</li>
            <li><strong>Referral requests:</strong> timed to moments of high goodwill — after a refund, after a positive review.</li>
            <li><strong>New service announcements:</strong> launching advisory? CFO-as-a-service? Targeted to the right segment.</li>
            <li><strong>Re-engagement:</strong> clients silent for 12+ months. &quot;Here&apos;s what&apos;s changed in tax law that might affect you.&quot;</li>
            <li><strong>Prospect nurture:</strong> enquiries that didn&apos;t convert. 6-month drip of helpful content.</li>
          </ul>
          <p>Email ROI: $36 for every $1 spent. One reactivated client from a re-engagement campaign could be worth $20,000+ over 5 years.</p>
          <div className={s.timeCompare}>⏱ VA: ~1.5 hrs/week &nbsp;|&nbsp; You: 3–4 hrs/week</div>

          <h3>6. Lead Follow-Up — Where You&apos;re Losing Clients Right Now</h3>
          <p>Someone fills out your contact form at 8pm Tuesday. What happens? In most firms: nothing, until Thursday. By then, they&apos;ve booked with a competitor.</p>
          <ul className={s.checklist}>
            <li><strong>Within 5 minutes:</strong> every enquiry gets a personalised response. &quot;Hi David, thanks for reaching out. Would Thursday at 2pm work for a chat?&quot;</li>
            <li><strong>Within 30 minutes:</strong> hot leads get a phone call. VA qualifies and books directly into your calendar.</li>
            <li><strong>Over 7 days:</strong> non-responsive leads get a 3-touch follow-up. Helpful content, not pushy sales.</li>
          </ul>
          <p><strong>The maths:</strong> 20 enquiries/month at 20% conversion = 4 new clients. Improve response to under 15 min → 35–40% = 7–8 clients. <strong>3–4 extra clients/month. At $5K average annual fee = $15,000–$20,000/month in additional recurring revenue.</strong></p>
          <div className={s.callout}>Your marketing VA doesn&apos;t just create content. They close leads. Follow up within 5 minutes. Qualify prospects. Book appointments. Nurture until conversion. That&apos;s the difference between a marketing system and a marketing expense.</div>
          <div className={s.timeCompare}>⏱ VA: ~2.5 hrs/week &nbsp;|&nbsp; You: 5+ hrs/week</div>

          <h3>7. Competitor Intelligence</h3>
          <ul className={s.checklist}>
            <li><strong>Competitor Google rankings, reviews, ratings.</strong> Who&apos;s gaining? Who&apos;s slipping?</li>
            <li><strong>Social media activity and content strategy.</strong> What&apos;s working? What gaps can you exploit?</li>
            <li><strong>Pricing and service positioning.</strong> New firms entering your area.</li>
          </ul>
          <p>One-page briefing. Your inbox. Every Monday.</p>
          <div className={s.timeCompare}>⏱ VA: ~30 min/week &nbsp;|&nbsp; You: 2+ hrs/week</div>

          <h3>8. Client Retention Marketing</h3>
          <p>It costs 5–7x more to acquire a client than to retain one. Yet most firms spend zero on retention.</p>
          <ul className={s.checklist}>
            <li><strong>Quarterly satisfaction check-ins.</strong> Catches issues before they become departures.</li>
            <li><strong>Annual review reminders.</strong> Drives repeat advisory engagements.</li>
            <li><strong>Service upgrade suggestions.</strong> &quot;Your business has grown — considered our CFO advisory package?&quot;</li>
            <li><strong>Segmented educational content:</strong> tradies get tradie tips. Medical gets healthcare advice. Startups get cash flow guides.</li>
          </ul>
          <div className={s.timeCompare}>⏱ VA: ~1 hr/week &nbsp;|&nbsp; You: 2–3 hrs/week</div>

          <h3>9. Event &amp; Webinar Marketing</h3>
          <ul className={s.checklist}>
            <li>Event landing page creation and promotion.</li>
            <li>Email invitation campaigns. Social media promotion sequence.</li>
            <li>Registration management and confirmation emails.</li>
            <li><strong>Post-event follow-up:</strong> thank you, resources, feedback, booking prompts for non-clients.</li>
          </ul>
          <div className={s.timeCompare}>⏱ VA: ~1 hr/week (event weeks) &nbsp;|&nbsp; You: 3+ hrs/week</div>

          <h3>After 12 Months of Marketing VA Work</h3>
          <div className={s.statsGrid}>
            <div className={s.statCard}><div className={s.statNumber}>80–120</div><div className={s.statLabel}>New Google Reviews</div></div>
            <div className={s.statCard}><div className={s.statNumber}>24–48</div><div className={s.statLabel}>Blog Posts Ranking</div></div>
            <div className={s.statCard}><div className={s.statNumber}>150–200</div><div className={s.statLabel}>Social Media Posts</div></div>
            <div className={s.statCard}><div className={s.statNumber}>15–30+</div><div className={s.statLabel}>New Clients Acquired</div></div>
          </div>
          <p>At $5,000 average annual fee, 15–30 new clients = <strong>$75,000–$150,000 in new recurring revenue.</strong> From a $15,960/year VA investment.</p>
          <div className={s.callout}>Claude writes every piece of content. Your VA publishes, manages, follows up, reports. You approve the strategy once, and the machine runs. After 12 months, you have a marketing asset worth more than most firms build in a decade.</div>
        </section>

        <section id="cost-comparison">
          <div className={s.sectionDivider}></div>
          <h2>The Full Cost Comparison (AUD)</h2>

          <h3>Accounting VA vs. Every Alternative</h3>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th>Option</th><th>Annual Cost</th><th>What You Get</th></tr></thead>
              <tbody>
                <tr><td><strong>Junior accountant (local)</strong></td><td>$80K–$100K + super, leave</td><td>40–60% on non-billable admin. 15% turnover. 3–6 month recruitment.</td></tr>
                <tr><td><strong>BPO (TOA, Beepo)</strong></td><td>$30K–$60K/year</td><td>67–233% markup. BPO owns the relationship. Worker loyalty to BPO.</td></tr>
                <tr className={s.tableRowHighlight}><td>RapidTal Accounting VA</td><td>$15,600–$21,600/yr</td><td>Direct hire. CPA-qualified. Xero/MYOB/QB. YOU own it. One-time $4,500 fee.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Marketing VA vs. Every Alternative</h3>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th>Option</th><th>Annual Cost</th><th>What You Get</th></tr></thead>
              <tbody>
                <tr><td><strong>Marketing agency</strong></td><td>$36K–$72K/year</td><td>Templated content. Shared account manager. 12-month contract. Your data on their accounts.</td></tr>
                <tr><td><strong>Part-time marketing hire</strong></td><td>$42K–$66K/year</td><td>20 hrs/week. Social + some content. No AI. Plus super. Leaves in 6–12 months.</td></tr>
                <tr className={s.tableRowHighlight}><td>RapidTal Marketing VA + Claude</td><td>$15,960/year</td><td>Full-time. AI-powered. All 9 functions. You own everything. One-time $4,500 fee.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>The Savings</h3>
          <p><strong>Accounting VA vs. local:</strong> $80,000 − $15,600 = <strong style={{color:'#1B7340'}}>AUD $64,400 saved/year.</strong></p>
          <p><strong>Accounting VA vs. BPO:</strong> $42,000 − $15,600 = <strong style={{color:'#1B7340'}}>AUD $26,400 saved/year</strong> (and you own the relationship).</p>
          <p><strong>Marketing VA vs. agency:</strong> $54,000 − $15,960 = <strong style={{color:'#1B7340'}}>AUD $38,040 saved/year.</strong></p>
          <p><strong>Both VAs vs. local + agency:</strong> $134,000 − $31,560 = <strong style={{color:'#1B7340'}}>AUD $102,440 saved/year.</strong></p>
          <div className={s.callout}>Over 3 years with both VAs: AUD $298,820 saved. Add recovered billable hours ($97,500+ per CPA/year) and the maths becomes absurd. This isn&apos;t cost-cutting. It&apos;s the most profitable investment you&apos;ll make this year.</div>
        </section>

        <section id="tax-season">
          <div className={s.sectionDivider}></div>
          <h2>Tax Season: How Your VA Changes the Equation</h2>
          <p>June through October. The pressure cooker. Here&apos;s how it plays out with a VA in place:</p>

          <div className={s.season}><strong>May (pre-season):</strong> VA sends deadline reminders to your client base. Chases outstanding documents. Confirms appointments. Prepares templates. Your CPAs arrive fresh and ready.</div>
          <div className={s.season}><strong>June–July (EOFY crunch):</strong> Accounting VA handles the flood of data entry, recs, and BAS prep. CPAs focus on year-end adjustments and tax planning. Marketing VA shifts to EOFY campaigns: &quot;Book your tax appointment now.&quot;</div>
          <div className={s.season}><strong>Aug–Sept (returns season):</strong> VA processes supporting schedules, working papers, client correspondence. CPAs review and lodge. Turnaround stays consistent because the load is distributed.</div>
          <div className={s.season}><strong>October (wind-down):</strong> Extension lodgements, catch-up bookkeeping, quarterly review prep. CPAs transition to advisory mode.</div>
          <div className={s.season}><strong>Nov–April (off-season):</strong> VA doesn&apos;t disappear like a temp. Steady-state bookkeeping, client nurture, marketing, process improvement. When next tax season arrives: zero ramp-up.</div>

          <div className={s.callout}>The firms that survive tax season without burning out staff built capacity in advance. A $1,300/month VA gives you that capacity 12 months a year — for less than you&apos;d pay a temp for 10 weeks.</div>
        </section>

        <section id="two-futures">
          <div className={s.sectionDivider}></div>
          <h2>Two Futures: Your Firm in 12 Months</h2>

          <h3>Without a VA</h3>
          <ul className={s.checklist}>
            <li>CPAs still doing data entry at 9pm.</li>
            <li>Staff turnover hits again. Another 3–6 month recruitment cycle. Another $30K in costs.</li>
            <li>Tax season breaks the team again.</li>
            <li>Google presence stale. Competitors winning clients who search online.</li>
            <li>Advisory revenue stays at zero. No capacity to deliver it.</li>
            <li>Still paying the BPO $3,000+/month. Or worse — doing everything yourself.</li>
          </ul>

          <h3>With a VA (or Two)</h3>
          <ul className={s.checklist}>
            <li><strong>CPAs doing advisory.</strong> Cash flow forecasting, tax planning, growth strategy. $300–$500/hour work.</li>
            <li><strong>Turnaround times halved.</strong> BAS in 2 days. Month-end by the 10th.</li>
            <li><strong>Staff morale up. Attrition down.</strong> People using their skills.</li>
            <li><strong>80–120 Google reviews.</strong> Highest-reviewed firm in your suburb.</li>
            <li><strong>24–48 blog posts on Google.</strong> Free traffic. Free leads. Every month.</li>
            <li><strong>Database nurtured.</strong> Referrals up 30–50%. Dormant clients reactivated.</li>
            <li><strong>Tax season: hard but manageable.</strong> Nobody worked 60 hours. Nobody quit.</li>
            <li><strong>$64,000–$102,000 saved</strong> vs local alternatives. Plus tens of thousands in new advisory revenue on top.</li>
          </ul>
          <div className={`${s.callout} ${s.calloutGreen}`}>This isn&apos;t aspirational. It&apos;s what happens when you stop asking qualified professionals to do unqualified work, and start building systems that let the right people do the right tasks at the right cost.</div>
        </section>

        <section id="get-started">
          <div className={s.sectionDivider}></div>
          <h2>How to Get Started</h2>
          <p className={s.lead}>No proposals. No committees. No 6-month onboarding.</p>

          <div className={s.stepsGrid}>
            <div className={s.step}><div className={s.stepNum}>1</div><div><strong>Choose your track.</strong> Marketing VA, Accounting VA, or both. We&apos;ll help you assess which bottleneck to solve first.</div></div>
            <div className={s.step}><div className={s.stepNum}>2</div><div><strong>We find your VA.</strong> Accounting: degree-qualified, CPA-certified, Xero/MYOB/QB tested. Marketing: content, social, CRM tested. Both: English fluency and cultural fit assessed through our dual framework.</div></div>
            <div className={s.step}><div className={s.stepNum}>3</div><div><strong>We train them on Claude AI + your systems.</strong> Custom Skills built for your firm. Onboarded to your tools, workflows, and client requirements.</div></div>
            <div className={s.step}><div className={s.stepNum}>4</div><div><strong>You hire them directly.</strong> They work for YOU. Not a BPO. No middleman. You own the relationship.</div></div>
            <div className={s.step}><div className={s.stepNum}>5</div><div><strong>6-month guarantee.</strong> If your VA leaves within 6 months, we find and train a replacement at no extra cost.</div></div>
          </div>

          <div className={`${s.callout} ${s.calloutGreen}`}>Total investment: AUD $4,500 one-time placement fee per VA. Then $1,300–$1,800/month ongoing. No retainer. No contract. No hidden fees. No BPO markup. Compare that to your current arrangement and tell me which makes more sense.</div>
        </section>
      </div>

      <CalendlyEmbed />

      <div className={s.ctaSection}>
        <h2>Want to See If This Works for Your Firm?</h2>
        <p>Book a free 15-minute call with Gab. No pitch, no pressure.<br />Just a straight conversation about whether a marketing VA, accounting VA, or both makes sense for your practice.</p>
        <div className={s.ctaLinks}>
          <a href="https://calendly.com/machuret/rapid-tal">Book a Call</a><br />
          <a href="mailto:hello@rapidtal.com">hello@rapidtal.com</a>
        </div>
        <div className={s.ctaClosing}>No contracts. No retainers. No BPOs. No middlemen.</div>
        <div className={s.ctaClosingSub}>Just one VA (or two), Claude AI, and your accounting firm running the way it should.</div>
      </div>

      <Footer />
    </div>
  );
}

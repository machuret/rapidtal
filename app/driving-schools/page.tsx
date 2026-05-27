import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import CalendlyEmbed from '@/components/CalendlyEmbed';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import CountUpStat from '@/components/CountUpStat';
import EmailCaptureForm from '@/components/EmailCaptureForm';
import s from './page.module.css';
// Global marketing styles (palette, nav, footer, sticky bar)
import '@/app/css/base.css';
import '@/app/css/layout.css';
import '@/app/css/nav.css';
import '@/app/css/sections.css';
import '@/app/css/responsive.css';

export const metadata: Metadata = {
  title: 'Stop Paying Marketing Agencies to Rip Off Your Driving School — RapidTal',
  description: 'How one VA from the Philippines, powered by Claude AI, can replace your marketing agency, handle your customer follow-up, reviews, social media, and admin — for under $900 a month.',
  alternates: { canonical: '/driving-schools' },
};

export default function DrivingSchoolsPage() {
  return (
    <>
      {/* Skip to main content — keyboard / screen-reader accessibility */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Scroll progress bar — thin orange line at top of viewport */}
      <ScrollProgressBar />

      <Nav />
      <ScrollReveal />

      <div className={s.wrapper} id="main-content">

        {/* ── COVER ───────────────────────────────────────────────── */}
        <div className={s.cover}>
          <div className={s.coverBrand}>RapidTal</div>
          <h1>Stop Paying Marketing Agencies to Rip Off Your <span className={s.highlight}>Driving School.</span></h1>
          <p className={s.coverSubtitle}>How one VA (Virtual Assistant) from the Philippines, powered by Claude AI, can replace your marketing agency, handle your customer follow-up, reviews, social media, and admin — for under $900 USD a month.</p>
          <div className={s.coverTagline}>No contracts. No retainers. No middlemen.</div>

          {/* ── Above-the-fold CTA ── */}
          <div className={s.coverCtas}>
            <a href="#book-call" className={s.coverBtn}>
              Book a Free 15-Min Call →
            </a>
            <a href="#hardest-business" className={s.coverScrollHint}>
              ↓ See how it works
            </a>
          </div>

          <div className={s.coverByline}>By Gabriel Machuret — RapidTal.com</div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <div className={s.pageBody}>

            <div className={s.content}>

              {/* ── SECTION: Running a Driving School ───────────────── */}
              <section id="hardest-business" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>Running a Driving School Is One of the Hardest Small Businesses There Is</h2>
                <p>You got into this business because you love driving, you&apos;re good at teaching, and you wanted to build something of your own. Nobody told you that you&apos;d spend more time answering emails, chasing no-shows, posting on Facebook, and arguing with marketing companies than you would behind the wheel with a student.</p>
                <p>But that&apos;s the reality. Running a driving school in 2026 means you&apos;re not just an instructor — you&apos;re a marketer, a customer service rep, an admin assistant, a social media manager, a bookkeeper, and a receptionist. All at once. Usually after 8pm when you&apos;ve finished your last lesson.</p>

                <h3>Sound Familiar?</h3>
                <ul className={s.checklist}>
                  <li><strong>You finish teaching at 6pm,</strong> then spend two hours answering enquiries, replying to messages, and updating your schedule.</li>
                  <li><strong>A parent left you a bad Google review</strong> three weeks ago and you still haven&apos;t had time to respond to it.</li>
                  <li><strong>Your Facebook page hasn&apos;t been updated</strong> in two months because you just don&apos;t have the time (or the ideas).</li>
                  <li><strong>Someone enquired about lessons last Tuesday</strong> and you forgot to call them back. They&apos;ve already booked with your competitor.</li>
                  <li><strong>You&apos;re paying a marketing company $3,000 USD a month</strong> but you honestly have no idea what they&apos;re actually doing for you.</li>
                  <li><strong>You had three no-shows this week</strong> because nobody sent reminder texts.</li>
                  <li><strong>Your website hasn&apos;t been updated since 2022</strong> and you know it&apos;s hurting you but you don&apos;t know where to start.</li>
                  <li><strong>You&apos;re exhausted.</strong> You didn&apos;t start a driving school to become a full-time administrator.</li>
                </ul>
                <div className={s.callout}>If you nodded at even two or three of those — keep reading. This guide is going to show you a way to fix all of it for less than $900 USD a month.</div>
              </section>

              {/* ── SECTION: Three Problems ─────────────────────────── */}
              <section id="three-problems" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>The Three Problems That Keep Driving Schools Stuck</h2>

                <h3>Problem 1: You&apos;re Losing Students You Don&apos;t Even Know About</h3>
                <p>Here&apos;s a stat that should make you sit up straight: <strong>78% of customers go with the first business that responds to their enquiry.</strong> Not the best business. Not the cheapest business. The first one that picks up the phone or texts back.</p>
                <p>The average driving school takes 24 to 48 hours to respond to a new lead. Some never respond at all. That parent who filled out your website form on Tuesday night? By Wednesday morning, they&apos;ve already heard back from two of your competitors and booked with one of them.</p>
                <p>You didn&apos;t lose that student because your school is worse. You lost them because you were busy teaching someone else to parallel park when the enquiry came in. And by the time you got around to checking your messages, it was too late.</p>
                <div className={s.callout}>Every hour you delay responding to an enquiry, your chance of converting that student drops by 50%. After 24 hours, it&apos;s practically zero.</div>

                <h3>Problem 2: Your Online Presence Is Working Against You</h3>
                <p>When someone searches &quot;driving school near me&quot; on Google, what shows up? Your Google Business listing. And if that listing has outdated hours, no recent photos, and the last review is from 8 months ago with no reply — that person scrolls right past you.</p>
                <p>It&apos;s the same with social media. Parents check your Facebook and Instagram before they call you. If the last post is from November 2024, they assume you&apos;re either out of business or don&apos;t care. Neither impression gets you students.</p>
                <p>And your website? If it looks like it was built in 2015 and has no blog content, Google pushes you down the search results. Your competitors who are posting regularly and have fresh content are showing up above you. Every. Single. Day.</p>
                <p>You know all of this. The problem isn&apos;t awareness — it&apos;s time. You simply don&apos;t have the hours in the day to write blog posts, create social media content, reply to reviews, and keep your Google listing active while also running a driving school.</p>

                <h3>Problem 3: You&apos;re Running a 2026 Business with 2016 Tools</h3>
                <p>Here&apos;s a stat that should stop you in your tracks: <strong>82% of small businesses in the US are now using AI tools in their daily operations.</strong> Not tech startups. Not Silicon Valley companies. Regular small businesses — plumbers, dentists, real estate agents, restaurants. They&apos;re using AI to write their marketing content, follow up with leads, manage their online presence, and handle customer service.</p>
                <p>The driving school industry? Still stuck in 2016. Most owners are still manually replying to enquiries, hand-writing social media posts (if they post at all), and paying $3,000–$5,000 USD a month to marketing agencies for work that an AI-powered VA can do better, faster, and for a fraction of the cost.</p>
                <p>The businesses that adopt AI now will dominate their local markets within 12 months. The ones that wait will spend years trying to catch up. This isn&apos;t a prediction — it&apos;s already happening in every other industry. Driving schools are just late to the party.</p>
                <div className={s.callout}>67% of small and medium businesses now use AI for marketing. 93% of those plan to increase their AI investment this year. The question isn&apos;t whether AI will transform driving school marketing — it&apos;s whether YOU&apos;ll be the one using it, or whether your competitors will.</div>
                <p>And if you&apos;re currently paying a marketing agency — ask yourself this: are they using AI to produce your content? Because if they are, they&apos;re using a $20/month tool and charging you $3,000+ USD for the output. And if they&apos;re not using AI, they&apos;re slower, more expensive, and producing less than someone who is. Either way, you&apos;re overpaying.</p>
              </section>

              {/* ── SECTION: AI Is Right Now ────────────────────────── */}
              <section id="ai-right-now" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>AI Is Not the Future. It&apos;s Right Now. And It Changes Everything.</h2>
                <p className={s.lead}>Let&apos;s get specific about what AI actually means for a driving school — because this is the part where most owners go from sceptical to excited.</p>

                <h3>What AI Can Do for Your Driving School Today</h3>
                <p>AI — specifically, tools like Claude by Anthropic — can now produce professional-grade marketing content that&apos;s indistinguishable from what a $5,000 USD/month agency produces. In some cases, it&apos;s better, because it&apos;s faster, more consistent, and can be customised to your exact specifications.</p>
                <ul className={s.checklist}>
                  <li><strong>Write a full week of social media posts</strong> in 10 minutes — customised with YOUR school name, YOUR instructors&apos; names, YOUR suburb, YOUR current offers.</li>
                  <li><strong>Produce a 1,000-word SEO blog post</strong> targeting &quot;driving lessons in [your suburb]&quot; in under 15 minutes. A content writer charges $150–$300 USD for this and takes 3–4 hours.</li>
                  <li><strong>Reply to every Google review</strong> with a personalised, thoughtful response in seconds.</li>
                  <li><strong>Draft SMS and email follow-up sequences</strong> for every new lead — personalised with the student&apos;s name, the course they asked about, and your current availability.</li>
                  <li><strong>Analyse your competitors&apos; reviews, pricing, and ads</strong> and produce a weekly intelligence briefing you can read in 5 minutes.</li>
                  <li><strong>Build email campaign sequences</strong> for seasonal promotions, referral programs, and re-engagement.</li>
                  <li><strong>Generate customer support templates</strong> for every FAQ, booking confirmation, and complaint scenario.</li>
                  <li><strong>Create landing pages and ad copy</strong> for Facebook and Google campaigns.</li>
                </ul>

                <h3>But AI Alone Isn&apos;t Enough</h3>
                <p>Here&apos;s the critical part most people miss: AI is a tool, not a person. It produces the content. But someone still needs to publish it, monitor the responses, make the phone calls, update the systems, and manage the day-to-day. AI doesn&apos;t log into your Facebook account and press &quot;post.&quot; It doesn&apos;t call a student who missed their lesson. It doesn&apos;t chase an unpaid invoice.</p>
                <p><strong>That&apos;s where the VA comes in.</strong></p>

                <h3>What&apos;s a VA?</h3>
                <p>A VA — Virtual Assistant — is a remote professional who works full-time for your business, usually from the Philippines. The Philippines has one of the largest English-speaking, university-educated workforces in the world, and remote work is a massive industry there. Major banks, hospitals, tech companies, and thousands of US businesses already employ Filipino VAs for customer service, marketing, admin, and operations.</p>
                <p>This isn&apos;t cheap labour. This is a skilled, English-fluent professional who costs less because of where they live, not because of how good they are. A full-time Filipino VA costs around $800 USD a month — roughly $5 USD an hour. For reference, a part-time marketing intern in the US costs $15–$20 USD an hour, produces a fraction of the output, and leaves after a semester.</p>

                <h3>VA + Claude AI = The Most Powerful Combination for a Driving School</h3>
                <p>Now combine the two. One trained VA, working full-time exclusively for your driving school, equipped with Claude AI and a set of custom-built workflows specific to your business.</p>
                <p>Claude handles the thinking — the writing, the strategy, the analysis. Your VA handles the doing — the publishing, the calling, the monitoring, the managing. Together, they produce the output of a 3–5 person marketing team. For $820 USD a month total ($800 USD VA salary + $20 USD Claude subscription).</p>
                <div className={s.callout}>This isn&apos;t a theoretical model. It&apos;s running right now for driving schools. One VA + Claude produces more content, faster follow-ups, better reviews, and higher search rankings than agencies charging 4–6x as much.</div>
              </section>

              {/* ── SECTION: Claude Skills ──────────────────────────── */}
              <section id="secret-weapon" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>The Secret Weapon: Claude Projects and Skills</h2>
                <p>Here&apos;s what separates a VA using Claude from a VA using any generic AI tool, and it&apos;s the reason this model works as well as it does.</p>
                <p>Claude has a feature called <strong>Projects</strong> — a permanent workspace where all your driving school&apos;s information lives. Your school name, your suburb, your instructors and their specialties, your course packages, your pricing, your competitors, your brand voice. Every single time your VA opens the project, Claude already knows everything about your business. There&apos;s no re-explaining. No starting from scratch. It&apos;s like an employee with perfect memory.</p>
                <p>On top of that, Claude has <strong>Skills</strong> — pre-built instruction sets that tell the AI exactly how to perform a specific task, your way, every time. Think of them as playbooks. Each Skill produces consistent, high-quality output that&apos;s specific to YOUR school.</p>
                <p>We pre-build about 10 of these Skills for every driving school client:</p>

                <div className={s.tableWrap}>
                  <table className={`${s.table} ${s.orangeHeader}`} aria-label="Claude AI Skills for driving schools">
                    <caption className="sr-only">The 10 Claude AI Skills built for driving school VAs</caption>
                    <thead><tr><th scope="col">Skill</th><th scope="col">What It Produces</th><th scope="col">VA Time</th></tr></thead>
                    <tbody>
                      <tr><td><strong>Weekly Social Pack</strong></td><td>5 branded posts with captions, hashtags, image briefs for Facebook + Instagram</td><td>15 min to review and schedule</td></tr>
                      <tr><td><strong>Review Responder</strong></td><td>Personalised replies to every Google and Facebook review</td><td>5 min per batch</td></tr>
                      <tr><td><strong>SEO Blog Writer</strong></td><td>1,000+ word blog targeting &quot;driving lessons in [suburb]&quot;</td><td>20 min to review and publish</td></tr>
                      <tr><td><strong>Lead Follow-Up Drafter</strong></td><td>SMS + email sequences for new enquiries</td><td>10 min to load into CRM</td></tr>
                      <tr><td><strong>Competitor Intel</strong></td><td>Weekly analysis of competitor reviews, pricing, ads, and offers</td><td>Automatic — VA sends to you</td></tr>
                      <tr><td><strong>Email Campaign Builder</strong></td><td>Full promo, re-engagement, and referral email sequences</td><td>15 min to schedule</td></tr>
                      <tr><td><strong>Review Request Generator</strong></td><td>Post-lesson SMS/email asking students for Google reviews</td><td>10 min per week</td></tr>
                      <tr><td><strong>Customer Support Scripts</strong></td><td>FAQ responses, booking confirmations, enquiry templates</td><td>Set up once, reuse forever</td></tr>
                      <tr><td><strong>Phone Call Briefing</strong></td><td>Pre-call notes for student follow-up calls</td><td>5 min before calls</td></tr>
                      <tr><td><strong>GBP Weekly Updater</strong></td><td>Google Business posts, photo descriptions, Q&A answers</td><td>15 min per week</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className={s.callout}>Each Skill produces the same high-quality, school-specific output every time. Your VA doesn&apos;t need a marketing degree. They run the Skill, review the output, publish it. Claude does the creative work. Your VA does the execution.</div>

                <h3>Why This Changes the Game</h3>
                <p>Before AI, you needed a social media manager who understood strategy, a content writer who understood SEO, a customer service rep who understood your brand, and an admin who understood your scheduling. Four different skill sets. Four different salaries — or one expensive agency pretending to cover all four.</p>
                <p>With Claude Skills, the AI handles the expertise. Your VA handles the execution. It&apos;s the perfect division of labour — and it costs a fraction of any alternative.</p>
                <p>And here&apos;s what agencies will never tell you: many of them are already using Claude or similar AI tools behind the scenes. They&apos;re paying $20 a month for the tool and charging you $3,000–$5,000 USD for the output. The only difference between what they do and what your VA does is a massive markup and a contract you can&apos;t get out of.</p>
              </section>

              {/* ── SECTION: Deep Dive Tasks ────────────────────────── */}
              <section id="va-handles" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>Everything Your VA Handles (and Why Each One Matters)</h2>
                <p className={s.lead}>Every single function below is handled by your one VA, every week, for under $900 USD a month total.</p>

                <h3>1. Your Google Business Listing</h3>
                <p>When someone in your area types &quot;driving school near me&quot; into Google, the first thing they see isn&apos;t your website — it&apos;s your Google Business listing. Google rewards listings that are ACTIVE. If your listing is stale, Google pushes you down — and your competitors who ARE active get shown instead.</p>
                <ul className={s.checklist}>
                  <li><strong>Posts 1–2 updates to your listing</strong> with current offers, student success stories, and driving tips with local keywords.</li>
                  <li><strong>Uploads fresh photos</strong> — your cars, classroom, instructors. Listings with 100+ photos get 520% more calls.</li>
                  <li><strong>Answers every question</strong> in the Q&amp;A section.</li>
                  <li><strong>Keeps your hours and services updated.</strong></li>
                  <li><strong>Tracks performance</strong> — views, calls, direction requests — and reports to you weekly.</li>
                </ul>
                <div className={s.timeCompare}>⏱ VA time: ~1 hour/week &nbsp;|&nbsp; Your time: 2–3 hours/week</div>

                <h3>2. Getting More Google Reviews and Responding to All of Them</h3>
                <p>Parents are trusting you with their teenagers. They read EVERY review before they call. They look at how recent the reviews are, how many there are, and whether the owner actually replies.</p>
                <ul className={s.checklist}>
                  <li><strong>Sends a personalised review request</strong> to every student after their lesson — using their name, instructor&apos;s name, and date.</li>
                  <li><strong>Follows up</strong> at 3 days and 7 days.</li>
                  <li><strong>Responds to every single review</strong> — good or bad — within 24 hours with personalised, thoughtful replies.</li>
                  <li><strong>Handles negative reviews carefully</strong> — drafts a response and sends it to you for approval first.</li>
                  <li><strong>Tracks your review velocity</strong> vs. competitors.</li>
                </ul>
                <div className={s.callout}>A driving school with 200 reviews and a 4.7 rating beats a school with 30 reviews and a 4.9 rating. Google favours volume and recency.</div>
                <div className={s.timeCompare}>⏱ VA time: ~45 min/week &nbsp;|&nbsp; Your time: 3+ hours/week</div>

                <h3>3. Social Media That Actually Looks Like YOUR School</h3>
                <p>A marketing company uses the same template for every client. Your VA creates content about YOUR school, every single week. Real stories, real people, real locations.</p>
                <ul className={s.checklist}>
                  <li><strong>3–5 original posts/week</strong> across Facebook and Instagram.</li>
                  <li><strong>Content themes:</strong> &quot;Meet Our Instructor Monday,&quot; &quot;Student Success Saturday,&quot; &quot;Road Test Tips Wednesday.&quot;</li>
                  <li><strong>Local content</strong> mentioning your suburb, landmarks, and tricky intersections.</li>
                  <li><strong>Seasonal and promotional content.</strong></li>
                  <li><strong>Every comment and DM gets a reply</strong> within hours.</li>
                  <li><strong>Story and reel concepts</strong> for short-form video.</li>
                </ul>
                <p>After 3 months of consistent posting, most clients see post reach increase by 200–400%.</p>
                <div className={s.timeCompare}>⏱ VA time: ~1.5 hours/week &nbsp;|&nbsp; Your time: 4–5 hours/week</div>

                <h3>4. Getting Found on Google (Without Paying for Ads)</h3>
                <p>SEO — Search Engine Optimisation — means making your website show up when people search for driving schools. The more quality content you have, the more searches you rank for.</p>
                <ul className={s.checklist}>
                  <li><strong>1–2 blog posts per month</strong> targeting real local searches.</li>
                  <li><strong>Location pages</strong> for every suburb you serve — each unique.</li>
                  <li><strong>FAQ pages</strong> answering questions people ask before they book.</li>
                  <li><strong>Technical optimisation</strong> — page titles, meta descriptions, internal linking.</li>
                </ul>
                <div className={s.callout}>A blog post you publish today can bring you students for YEARS. After 12 months, most clients see 50–100% more people finding them through Google — for free.</div>
                <div className={s.timeCompare}>⏱ VA time: ~1.5 hours/week &nbsp;|&nbsp; Your time: 4–5 hours/week</div>

                <h3>5. Following Up With Every Single Enquiry (Immediately)</h3>
                <p>This is where you&apos;re probably losing the most students without knowing it.</p>
                <ul className={s.checklist}>
                  <li><strong>Within 5 minutes:</strong> personalised SMS and email to every new enquiry.</li>
                  <li><strong>Within 30 minutes:</strong> phone call to hot leads. Book the first lesson on the spot.</li>
                  <li><strong>Over the next 7 days:</strong> follow-up sequence — helpful email, text with limited offer, testimonial follow-up.</li>
                  <li><strong>Cold leads re-engaged monthly.</strong></li>
                </ul>
                <p>If you get 50 enquiries/month and convert 20% (10 students), improving response time to under 5 min typically pushes conversion to 35–40% (17–20 students). <strong>That&apos;s 7–10 extra students every month — at zero additional ad cost.</strong></p>
                <div className={s.timeCompare}>⏱ VA time: ~2 hours/week &nbsp;|&nbsp; Your time: 5+ hours/week</div>

                <h3>6. Texts, Emails, and Phone Calls That Keep Students Showing Up</h3>
                <p>No-shows and last-minute cancellations are the silent killer of driving school profits.</p>
                <h4>Texts:</h4>
                <ul className={s.checklist}>
                  <li><strong>Lesson reminders 24 hours before</strong> — reduces no-shows by 40–60%.</li>
                  <li><strong>Road test prep reminders.</strong></li>
                  <li><strong>Re-booking prompts, birthday messages, referral requests.</strong></li>
                </ul>
                <h4>Emails:</h4>
                <ul className={s.checklist}>
                  <li><strong>Welcome sequences, post-lesson follow-ups, completion congratulations.</strong></li>
                  <li><strong>Monthly newsletters and re-engagement campaigns.</strong></li>
                </ul>
                <h4>Phone calls:</h4>
                <ul className={s.checklist}>
                  <li><strong>Every new lead that doesn&apos;t respond</strong> to text/email within 2 hours.</li>
                  <li><strong>Missed lesson check-ins, post-road-test calls, lapsed student outreach.</strong></li>
                </ul>
                <div className={s.callout}>Text messages have a 98% open rate vs. 20% for email. Your VA uses both channels strategically.</div>
                <div className={s.timeCompare}>⏱ VA time: ~1.5 hours/week &nbsp;|&nbsp; Your time: 3–4 hours/week</div>

                <h3>7. Email Marketing Campaigns That Fill Slow Months</h3>
                <ul className={s.checklist}>
                  <li><strong>&quot;Summer Intensive&quot;</strong> — get your licence before school starts.</li>
                  <li><strong>&quot;New Year, New Licence&quot;</strong> — January special.</li>
                  <li><strong>Referral, re-activation, gift certificate, and back-to-school campaigns.</strong></li>
                </ul>
                <div className={s.timeCompare}>⏱ VA time: ~1 hour/week &nbsp;|&nbsp; Your time: 2–3 hours/week</div>

                <h3>8. Knowing Exactly What Your Competitors Are Doing</h3>
                <ul className={s.checklist}>
                  <li><strong>Competitor pricing and packages.</strong></li>
                  <li><strong>Their new reviews</strong> — what students praise and complain about.</li>
                  <li><strong>Social media and ad activity.</strong></li>
                  <li><strong>New competitors in your area.</strong></li>
                </ul>
                <p>Compiled into a one-page briefing delivered to your inbox every Monday morning.</p>
                <div className={s.timeCompare}>⏱ VA time: ~30 min/week &nbsp;|&nbsp; Your time: 2+ hours/week</div>

                <h3>9. Customer Support That Never Lets an Enquiry Slip</h3>
                <ul className={s.checklist}>
                  <li><strong>Website forms</strong> — responded to within 5 minutes.</li>
                  <li><strong>Facebook and Instagram DMs</strong> — answered promptly.</li>
                  <li><strong>Phone call overflow</strong> — handles calls you can&apos;t take during lessons.</li>
                  <li><strong>Booking confirmations, FAQ responses, complaint handling.</strong></li>
                </ul>
                <div className={s.timeCompare}>⏱ VA time: ~2 hours/week &nbsp;|&nbsp; Your time: 4+ hours/week</div>

                <h3>10. The Admin Work You&apos;re Doing at 10pm</h3>
                <ul className={s.checklist}>
                  <li><strong>Instructor schedule coordination.</strong></li>
                  <li><strong>Student booking management.</strong></li>
                  <li><strong>Document preparation — progress reports, certificates.</strong></li>
                  <li><strong>CRM updates and data entry.</strong></li>
                  <li><strong>Invoice follow-up and payment reminders.</strong></li>
                  <li><strong>Your personal calendar.</strong></li>
                </ul>
                <div className={s.timeCompare}>⏱ VA time: ~1.5 hours/week &nbsp;|&nbsp; Your time: 3+ hours/week</div>
              </section>

              {/* ── SECTION: Time Cost ──────────────────────────────── */}
              <section id="time-cost" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>The Time Cost: What This Is Really Worth to You</h2>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <caption className="sr-only">Time and cost comparison between doing tasks yourself vs. using a VA</caption>
                    <thead><tr><th scope="col">Task</th><th scope="col">Your Time</th><th scope="col">Your Cost*</th><th scope="col">VA + AI Time</th><th scope="col">VA Cost</th></tr></thead>
                    <tbody>
                      <tr><td><strong>Google Business</strong></td><td>2.5 hrs/wk</td><td>$125–$190</td><td>1 hr/wk</td><td>$5</td></tr>
                      <tr><td><strong>Reviews</strong></td><td>3 hrs/wk</td><td>$150–$225</td><td>45 min/wk</td><td>$4</td></tr>
                      <tr><td><strong>Social media</strong></td><td>4.5 hrs/wk</td><td>$225–$340</td><td>1.5 hrs/wk</td><td>$8</td></tr>
                      <tr><td><strong>SEO / blog content</strong></td><td>4.5 hrs/wk</td><td>$225–$340</td><td>1.5 hrs/wk</td><td>$8</td></tr>
                      <tr><td><strong>Lead follow-up</strong></td><td>5 hrs/wk</td><td>$250–$375</td><td>2 hrs/wk</td><td>$10</td></tr>
                      <tr><td><strong>SMS / email / phone</strong></td><td>3.5 hrs/wk</td><td>$175–$265</td><td>1.5 hrs/wk</td><td>$8</td></tr>
                      <tr><td><strong>Email campaigns</strong></td><td>2.5 hrs/wk</td><td>$125–$190</td><td>1 hr/wk</td><td>$5</td></tr>
                      <tr><td><strong>Competitor intel</strong></td><td>2 hrs/wk</td><td>$100–$150</td><td>30 min/wk</td><td>$3</td></tr>
                      <tr><td><strong>Customer support</strong></td><td>4 hrs/wk</td><td>$200–$300</td><td>2 hrs/wk</td><td>$10</td></tr>
                      <tr><td><strong>Admin / scheduling</strong></td><td>3 hrs/wk</td><td>$150–$225</td><td>1.5 hrs/wk</td><td>$8</td></tr>
                      <tr className={s.tableRowHighlight}><td><strong>TOTAL</strong></td><td><strong>34.5 hrs/wk</strong></td><td><strong>$1,725–$2,600/wk</strong></td><td><strong>13.25 hrs/wk</strong></td><td><strong>$69/wk</strong></td></tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '.85rem', color: '#999', fontStyle: 'italic' }}>*Your time valued at $50–$75/hr — a conservative estimate of what you COULD be earning if you were teaching, training, or growing the business.</p>
                <div className={s.callout}>You&apos;re either spending 34 hours a week doing this yourself (and burning out), or you&apos;re NOT doing it (and losing students). Either way, your VA solves it — for $200 a week.</div>
              </section>

              {/* ── SECTION: Grand Prix Case Study ──────────────────── */}
              <section id="case-study" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>How This Worked for Grand Prix Driving School in New York</h2>
                <p>Grand Prix Driving School is a family-run school on the Upper East Side of Manhattan. They&apos;ve been teaching New Yorkers to drive since 1991 — over 30 years in the business. Their instructors (Dorian, Perry, Augusto, Juan, and the rest of the team) are some of the highest-rated in the city.</p>
                <p>But like most driving schools, Grand Prix had a problem: <strong>amazing instruction, mediocre marketing.</strong></p>

                <h3>Before We Stepped In</h3>
                <p>The school was running on reputation and word of mouth — which had served them well for decades. But new competitors were popping up with slick websites and active social media. Parents were finding other schools on Google first.</p>
                <ul className={s.checklist}>
                  <li><strong>Google Business listing was stale.</strong> Old photos, infrequent posts, unanswered reviews.</li>
                  <li><strong>Social media was inconsistent.</strong> No content showcasing instructors or student wins.</li>
                  <li><strong>Lead response was slow.</strong> Online enquiries waited 24–48 hours.</li>
                  <li><strong>No content strategy.</strong> No blog, no location pages.</li>
                  <li><strong>Considering a $4,000 USD/month agency</strong> — knew they needed help, but the cost felt steep.</li>
                </ul>

                <h3>What We Did Instead</h3>
                <p>We placed one full-time VA with Grand Prix — a direct hire trained on AI-powered workflows specific to their school. Within two weeks, the VA had:</p>
                <ul className={s.checklist}>
                  <li><strong>Set up a Claude Project</strong> with Grand Prix&apos;s brand voice, instructor bios, course packages, and the Upper East Side neighbourhood.</li>
                  <li><strong>Built all 10 Skills</strong> — social media, reviews, blog content, lead follow-up, and more.</li>
                  <li><strong>Responded to every unanswered Google review</strong> — some going back months.</li>
                  <li><strong>Published the first week of social media content</strong> featuring real instructors and real locations.</li>
                  <li><strong>Set up a lead follow-up system</strong> — every new enquiry responded to within 5 minutes.</li>
                </ul>

                <h3>What Happened Over 12 Months</h3>
                {/* Count-up animated stats */}
                <div className={s.statsGrid}>
                  <CountUpStat value="+60" label="Additional Students Enrolled" className={s.statCard} numberClassName={s.statNumber} labelClassName={s.statLabel} />
                  <CountUpStat value="5" label="Minute Lead Response Time<br/>(Was 24–48 Hours)" className={s.statCard} numberClassName={s.statNumber} labelClassName={s.statLabel} />
                  <CountUpStat value="140%" label="More Google Reviews" className={s.statCard} numberClassName={s.statNumber} labelClassName={s.statLabel} />
                  <CountUpStat value="85%" label="Increase in Organic Search Traffic" className={s.statCard} numberClassName={s.statNumber} labelClassName={s.statLabel} />
                  <CountUpStat value="210%" label="Increase in Social Media Engagement" className={s.statCard} numberClassName={s.statNumber} labelClassName={s.statLabel} />
                  <CountUpStat value="3" label="× Instagram Following Growth" className={s.statCard} numberClassName={s.statNumber} labelClassName={s.statLabel} />
                </div>

                <h3>The Story Behind the Numbers</h3>
                <p>The 60 extra students didn&apos;t come from one magic trick. They came from doing 10 things consistently that Grand Prix had never had the time to do before.</p>
                <p>The lead follow-up alone probably accounted for 20–25 of those students — people who would have booked with a competitor simply because they responded first. Now Grand Prix was the first to respond. Every time.</p>
                <p>The review generation added 140% more Google reviews — and every one got a reply. When parents compared Grand Prix to competitors, the volume and quality of reviews made the decision easy.</p>
                <p>The blog content and location pages started ranking on Google for &quot;driving lessons Upper East Side&quot; and &quot;road test prep NYC.&quot; These pages now bring in free traffic every single day.</p>
                <p>The social media consistency turned their Facebook page into an active community. Posts featuring instructors by name — &quot;Here&apos;s Dorian&apos;s top 5 tips for parallel parking&quot; — consistently got the highest engagement.</p>
                <div className={`${s.callout} ${s.calloutGreen}`}>The most important result? Grand Prix now owns everything. Every account, every login, every piece of data. If they ever stopped working with us, they&apos;d keep their Google Ads, their analytics, their social media — all of it.</div>
              </section>

              {/* ── SECTION: Cost Comparison ──────────────────────────── */}
              <section id="cost-comparison" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>The Full Cost Comparison</h2>
                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <caption className="sr-only">Cost comparison: marketing agency vs. local hire vs. outsourcing vs. RapidTal VA</caption>
                    <thead><tr><th scope="col">Option</th><th scope="col">Monthly Cost</th><th scope="col">What You Actually Get</th></tr></thead>
                    <tbody>
                      <tr><td><strong>Marketing agency</strong></td><td>$3,000–$5,000 USD/mo</td><td>Generic content, shared account managers, your data on their accounts, locked-in contracts.</td></tr>
                      <tr><td><strong>Local marketing hire</strong></td><td>$5,000–$6,000 USD/mo</td><td>One person who can do some of it, but not all 10 functions. Plus benefits, tax, office space.</td></tr>
                      <tr><td><strong>Outsourcing company</strong></td><td>$2,000–$3,000 USD/mo</td><td>Monthly fee forever, split loyalty, zero transparency.</td></tr>
                      <tr className={s.tableRowHighlight}><td><strong>RapidTal: 1 VA + Claude AI</strong></td><td><strong>$800 USD/mo + $20 USD Claude</strong></td><td>Full-time, direct hire. All 10 functions. AI-powered. You own everything. No ongoing fees to us.</td></tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '.85rem', color: '#999', fontStyle: 'italic' }}>*VA salary ~$800 USD/month paid directly by you. Claude Pro $20 USD/month. One-time RapidTal placement fee of $2,800 USD.</p>

                <h3>Annual Savings Breakdown</h3>
                <p>Let&apos;s walk through this clearly, because the numbers are staggering when you see them laid out.</p>
                <h4>What you&apos;re paying now (or what you&apos;d pay an agency):</h4>
                <p>A mid-range marketing agency charges $4,000 USD/month. That&apos;s <strong>$48,000 USD a year.</strong> For generic content, no transparency, a 12-month contract, and all your data on their accounts.</p>
                <h4>What you&apos;d pay with RapidTal:</h4>
                <ul className={s.checklist}>
                  <li><strong>One-time placement fee:</strong> $2,800 USD. Covers recruiting, vetting, testing, and AI training.</li>
                  <li><strong>VA salary:</strong> $800 USD/month, paid directly by you.</li>
                  <li><strong>Claude Pro subscription:</strong> $20 USD/month.</li>
                  <li><strong>Total monthly ongoing:</strong> $820 USD/month = <strong>$9,840 USD per year.</strong></li>
                </ul>
                <h4>The savings:</h4>
                <p><strong>Year 1:</strong> $48,000 − ($9,840 + $2,800) = <strong>$35,360 USD saved.</strong></p>
                <p><strong>Year 2+:</strong> $48,000 − $9,840 = <strong>$38,160 USD saved every year.</strong></p>
                <div className={s.callout}>Over 3 years, you save $111,680 USD compared to a mid-range agency. And you get MORE work done, not less. And you OWN every account, every login, every piece of data.</div>
                <h4>What could you do with that money?</h4>
                <ul className={s.checklist}>
                  <li><strong>Buy a new training vehicle.</strong></li>
                  <li><strong>Hire another instructor</strong> — more instructors = more students = more revenue.</li>
                  <li><strong>Renovate your classroom or office.</strong></li>
                  <li><strong>Run paid ads on top of organic marketing.</strong></li>
                  <li><strong>Or just keep it as profit.</strong> You earned it.</li>
                </ul>
              </section>

              {/* ── SECTION: How to Get Started ───────────────────────── */}
              <section id="get-started" className="reveal">
                <div className={s.sectionDivider}></div>
                <h2>How to Get Started</h2>
                <p className={s.lead}>No long proposals. No committees. No 6-month onboarding. Here&apos;s what happens:</p>

                <ol className={s.stepList} aria-label="How to get started">
                  <li className={s.step}><div className={s.stepNum} aria-hidden="true">1</div><div className={s.stepContent}><strong>We find your VA.</strong> Skilled, English-fluent, tested on communication and marketing. We also assess YOUR business to make sure you&apos;re ready to onboard successfully.</div></li>
                  <li className={s.step}><div className={s.stepNum} aria-hidden="true">2</div><div className={s.stepContent}><strong>We train them on Claude AI.</strong> Your VA learns every Skill and Project we build for driving schools — ready to work from day one.</div></li>
                  <li className={s.step}><div className={s.stepNum} aria-hidden="true">3</div><div className={s.stepContent}><strong>We build your custom Claude Project.</strong> Loaded with your school name, suburb, instructors, courses, competitors — everything. Every piece of content is about YOUR school.</div></li>
                  <li className={s.step}><div className={s.stepNum} aria-hidden="true">4</div><div className={s.stepContent}><strong>You hire them directly.</strong> They work for YOU. Not us. Not an outsourcing company. No middleman takes a cut every month.</div></li>
                  <li className={s.step}><div className={s.stepNum} aria-hidden="true">5</div><div className={s.stepContent}><strong>6-month guarantee.</strong> If your VA leaves within 6 months, we find and train a replacement at no extra cost.</div></li>
                </ol>

                <div className={`${s.callout} ${s.calloutGreen}`}>Total investment: $2,800 USD one-time placement fee. Then approximately $820 USD/month ongoing (VA salary + Claude subscription). No retainer. No contract. No hidden fees. That&apos;s it.</div>
              </section>

            </div>{/* end .content */}
        </div>{/* end .pageBody */}

        {/* ── CTA ───────────────────────────────────────────────── */}
        <div className={s.ctaSection}>
          <h2>Want to See If This Works for Your School?</h2>
          <p>No pitch, no pressure. Book a 15-minute call using the calendar below — or drop your email and we&apos;ll reach out directly.</p>
          <div className={s.ctaLinks}>
            <a href="#book-call">Book a Call →</a><br />
            <a href="mailto:hello@rapidtal.com">hello@rapidtal.com</a>
          </div>
          <div className={s.ctaClosing}>No contracts. No retainers. No agencies. No middlemen.</div>
          <div className={s.ctaClosingSub}>Just one VA, Claude AI, and your driving school running like a machine.</div>
        </div>

      </div>{/* end .wrapper */}

      {/* ── EMAIL CAPTURE + CALENDLY (merged dark section) ───────── */}
      <div className={s.emailCaptureSection} id="book-call">
        <div className={s.emailCaptureInner}>
          <div className={s.emailCaptureTitle}>Not ready to book? Leave your email.</div>
          <p className={s.emailCaptureSub}>We&apos;ll send you a tailored breakdown for your driving school — no obligation, no spam.</p>
          <EmailCaptureForm />
          <p className={s.emailOrDivider}>— or book directly below —</p>
        </div>
      </div>

      <CalendlyEmbed
        title="Book a Free 15-Minute Call —"
        titleHighlight="No Pitch, No Pressure."
        subtitle="Tell us about your driving school. We'll tell you honestly if this model is the right fit."
      />

      <Footer />
    </>
  );
}

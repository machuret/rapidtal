import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import CursorTracker from '@/components/CursorTracker';
import './vet-usa.css';

const CalendlyEmbed = dynamic(() => import('@/components/CalendlyEmbed'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });

export const metadata: Metadata = {
  title: 'What Could Your Vet Practice Do with an Extra $50,000 a Year? — RapidTal',
  description: 'How independent veterinary practices are hiring dedicated Filipino VAs — powered by Claude AI — to handle social media, TikTok, Google reviews, client follow-up, admin, and front-desk overflow. For under $900/month.',
  openGraph: {
    title: 'What Could Your Vet Practice Do with an Extra $50,000 a Year? — RapidTal',
    description: 'One VA + Claude AI. Marketing, content creation, client follow-up, and admin. $820–$920/month.',
  },
};

export default function VetUsaPage() {
  return (
    <div className="vet-usa-page">
      <CursorTracker />
      <Nav />
      <main id="main-content">
        <div className="cover">
          <div className="cover-brand">RapidTal</div>
          <h1>
            What Could Your Vet Practice Do with an Extra{' '}
            <em>$50,000 a Year</em> and 40 Extra Hours a Week?
          </h1>
          <p className="sub">
            How independent veterinary practices are hiring dedicated Filipino VAs
            — powered by Claude AI — to handle social media, TikTok and Reels,
            Google reviews, client follow-up, admin, and front-desk overflow. For
            under $900/month.
          </p>
          <p className="sub2">
            Marketing. Content creation. Client communication. Admin. All handled.
            So you can focus on what you actually love — practicing veterinary
            medicine.
          </p>
          <div className="tagline">No contracts. No retainers. No middlemen.</div>
          <div className="by">By Gabriel Machuret — RapidTal.com</div>
          <div className="note">All prices in US Dollars (USD)</div>
        </div>

        <div className="vet-content">
          {/* SECTION 1: THE OPPORTUNITY */}
          <section>
            <div className="vet-div"></div>
            <h2>You Became a Vet to Help Animals. Not to Post on Instagram at 11pm.</h2>
            <p>You spent 8 years in school. You took on six figures in student debt. You survived clinics, boards, and your first emergency surgery at 2am. You did all of that because you love animals and you&apos;re damn good at taking care of them.</p>
            <p>Nobody told you that running a veterinary practice in 2026 would mean spending half your week on social media you don&apos;t have time for, Google reviews you haven&apos;t responded to, marketing agencies that charge $3,000/month for stock photos of golden retrievers, missed calls from potential clients, lapsed patient follow-ups that never get done, and admin that keeps you at the clinic until 7pm even though your last appointment was at 4.</p>
            <p>Americans spend over <strong>$150 billion</strong> a year on their pets. Demand for veterinary care has never been higher. The opportunity is enormous. But you can&apos;t capture it if you&apos;re buried in non-clinical work.</p>
            <p>What if you could hand ALL of that off — the social media, the TikToks, the Google reviews, the client follow-ups, the email campaigns, the scheduling overflow, the admin — to one dedicated, full-time person for under $900 a month? So you can go back to doing what you actually became a vet to do.</p>
            <div className="vet-co">One VA + Claude AI. Marketing, content creation, client follow-up, and admin. $820–$920/month. No contract. No agency. No middleman. Just a dedicated team member who handles everything that isn&apos;t medicine.</div>

            <h3>The Investment: $2,800 Once. Then $870/Month.</h3>
            <ul className="vet-ck">
              <li><strong>One-time placement fee:</strong> $2,800. Covers recruiting, vetting, testing, and AI training.</li>
              <li><strong>Ongoing:</strong> $800–$900 VA salary + $20 Claude AI = $820–$920/month.</li>
            </ul>
            <p>That investment generates:</p>
            <ul className="vet-ck">
              <li><strong>$24,000–$48,000/year saved</strong> compared to a vet marketing agency.</li>
              <li><strong>$28,000–$38,000/year saved</strong> compared to a part-time US receptionist.</li>
              <li><strong>$30,000–$45,000/year recovered</strong> in lapsed client reactivation.</li>
              <li><strong>$19,500/year recovered</strong> from reduced no-shows.</li>
              <li><strong>$39,000–$104,000/year recovered per DVM</strong> in clinical revenue by freeing 2 hrs/day.</li>
              <li><strong>$50,000–$100,000+/year generated</strong> in new client revenue.</li>
            </ul>
            <p><strong>Total: $100,000–$200,000+ per year</strong> in savings and new revenue. From $870/month.</p>

            <h3>The Reality for Most Independent Practices</h3>
            <ul className="vet-ck">
              <li><strong>Front desk handling too much.</strong> Missed calls = missed clients.</li>
              <li><strong>DVMs spend 30–40% of their day on non-clinical work.</strong> 2–3 billable hours lost daily.</li>
              <li><strong>Marketing is non-existent or overpriced.</strong> Last Instagram post was months ago.</li>
              <li><strong>Google reviews are stale.</strong> Unanswered negatives visible to every pet owner.</li>
              <li><strong>Client follow-up doesn&apos;t happen consistently.</strong> Everyone knows they should. Nobody has time.</li>
            </ul>
            <div className="vet-co">Every one of those problems has the same root cause: not enough hands. Your VA is the extra pair of hands. For less than $6/hour.</div>
          </section>

          {/* SECTION 2: AGENCY COMPARISON */}
          <section>
            <div className="vet-div"></div>
            <h2>What You&apos;re Paying a Marketing Agency vs. What a VA Delivers</h2>
            <p>Let&apos;s compare apples to apples.</p>

            <div className="vet-expose">
              <p><strong>Social media:</strong> 3–4 posts/week using stock photos. Junior coordinator manages 15–25 clinics. 1–2 hours/week on YOUR account. You pay $2,500/month for 6 hours. That&apos;s $400+/hour.</p>
            </div>
            <div className="vet-expose">
              <p><strong>SEO:</strong> One blog post/month — generic &ldquo;5 Tips for Keeping Your Dog Healthy&rdquo; that 50 other clinics on the same agency also have. Doesn&apos;t rank.</p>
            </div>
            <div className="vet-expose">
              <p><strong>Reviews:</strong> Automated request emails (you could set up in 20 minutes). Generic response to negatives. No personalisation. No velocity tracking.</p>
            </div>
            <div className="vet-expose">
              <p><strong>What they DON&apos;T do:</strong> Answer phones. Follow up with missed calls. Send appointment reminders. Call lapsed clients. Manage your PMS. Handle admin. Any of the operational work that actually retains clients.</p>
            </div>

            <h3>Side by Side: Agency vs. VA</h3>
            <div className="vet-tw">
              <table>
                <thead><tr><th>Function</th><th>Agency ($2K–$4K/mo)</th><th>VA + Claude AI ($870/mo)</th></tr></thead>
                <tbody>
                  <tr><td><strong>Social media</strong></td><td>3–4/week (templated)</td><td>5–7/week (custom, your pets)</td></tr>
                  <tr><td><strong>TikTok / Reels</strong></td><td>Usually not included</td><td>2–3/week (VA edits your clips)</td></tr>
                  <tr><td><strong>Blog / SEO</strong></td><td>1 post/month (generic)</td><td>2–4/month (local, specific)</td></tr>
                  <tr><td><strong>Google reviews</strong></td><td>Automated tool</td><td>Personalised + every review replied</td></tr>
                  <tr><td><strong>Google Business</strong></td><td>Rarely updated</td><td>2–3 posts/week + photos + Q&amp;A</td></tr>
                  <tr><td><strong>Email campaigns</strong></td><td>Monthly template</td><td>Newsletters + seasonal + reactivation</td></tr>
                  <tr><td><strong>Client follow-up</strong></td><td>Not included</td><td>Post-visit check-ins, missed calls, labs</td></tr>
                  <tr><td><strong>Appointment reminders</strong></td><td>Not included</td><td>48hr + 24hr text/email</td></tr>
                  <tr><td><strong>Admin / front desk</strong></td><td>Not included</td><td>Scheduling, records, insurance, referrals</td></tr>
                  <tr><td><strong>DVM interviews</strong></td><td>Not included</td><td>Monthly Ask the Vet + media pitching</td></tr>
                  <tr><td><strong>Competitor intel</strong></td><td>Not included</td><td>Weekly Monday briefing</td></tr>
                  <tr className="vet-hi"><td><strong>Hours/week on you</strong></td><td><strong>1–2 hours</strong></td><td><strong>40 hours</strong></td></tr>
                </tbody>
              </table>
            </div>

            <h3>The Corporate Advantage — And How to Beat It</h3>
            <p>Corporate practices (Mars/VCA, NVA, Pathway) have in-house marketing teams, centralised CRMs, automated follow-up, and dedicated client experience managers. That&apos;s why they show up first on Google.</p>
            <p>You can&apos;t outspend them. But you can <strong>out-system them.</strong> One VA replicates 80% of their corporate marketing machine. For less than a part-time receptionist.</p>
          </section>

          {/* SECTION 3: THE VA */}
          <section>
            <div className="vet-div"></div>
            <h2>One VA. Claude AI. Everything Changes.</h2>
            <p>A full-time Filipino VA costs $800–$900/month — about $5–$6/hour for a college-educated, English-fluent professional. We build a custom Claude AI Project loaded with your practice name, DVMs, services, neighborhood, competitors, and brand voice. Every output is specific to YOUR practice.</p>
            <p>Claude handles the thinking. Your VA handles the doing. Together: the output of a 3–4 person team. For $870/month.</p>

            <h3>Social Media &amp; Content Creation — The Game-Changer</h3>
            <p>Pet content is one of the highest-performing categories on every platform. <strong>TikTok pet content averages 4.2% engagement</strong> — higher than nearly any industry. Your practice is sitting on a goldmine and you&apos;re not using it.</p>

            <h4>Facebook &amp; Instagram — 5–7 Posts Per Week</h4>
            <ul className="vet-ck">
              <li><strong>Monday — &ldquo;Meet the Team&rdquo;:</strong> &ldquo;Meet Dr. Martinez! 6 years with us, special love for senior dogs, three rescue cats at home.&rdquo; Photo with a patient.</li>
              <li><strong>Tuesday — Pet Health Tip:</strong> &ldquo;3 signs your dog might have a dental problem.&rdquo; Educational, shareable.</li>
              <li><strong>Wednesday — Patient of the Week:</strong> &ldquo;Meet Bella! Annual wellness check — best girl.&rdquo; Client pet photo. Highest engagement posts.</li>
              <li><strong>Thursday — Behind the Scenes:</strong> Team prepping for surgery, stocking pharmacy, celebrating a birthday.</li>
              <li><strong>Friday — Seasonal/Promo:</strong> &ldquo;Flea season is here! Book prevention this week — 10% off Simparica Trio.&rdquo;</li>
              <li><strong>Weekend — Fun/Light:</strong> &ldquo;Caption this!&rdquo; or a puppy&apos;s first visit video. Boosts engagement.</li>
            </ul>

            <h4>TikTok &amp; Instagram Reels — 2–3 Videos Per Week</h4>
            <p>Independent practices have a <strong>MASSIVE advantage</strong> over corporate clinics here. Corporate chains can&apos;t do authentic, personality-driven content. You can.</p>
            <p><strong>The workflow:</strong> You record 15–60 second clips on your phone. Your VA handles everything else — editing, captions, text overlays, trending audio, hashtags, posting.</p>
            <ul className="vet-ck">
              <li><strong>&ldquo;Day in the life&rdquo;</strong> — morning routine, appointments, team moments.</li>
              <li><strong>&ldquo;Vet answers your questions&rdquo;</strong> — Dr. Martinez answers the top comment each week. 30 seconds.</li>
              <li><strong>&ldquo;Before and after&rdquo;</strong> — dental cleanings, skin conditions, weight loss. Pet owners love results.</li>
              <li><strong>&ldquo;Things we wish pet owners knew&rdquo;</strong> — &ldquo;Your dog doesn&apos;t hate the vet — they&apos;re nervous. Here&apos;s how to help.&rdquo;</li>
              <li><strong>Puppy/kitten first visits</strong> — adorable content that markets itself. Tag the owner → they share.</li>
              <li><strong>Team celebrations</strong> — &ldquo;Dr. Williams just celebrated 10 years!&rdquo; Community-building.</li>
              <li><strong>Seasonal</strong> — Halloween costumes, Christmas safety, summer heatstroke. Planned months ahead.</li>
            </ul>
            <div className="vet-co">TikTok pet content: 4.2% engagement. Veterinary email open rates: 38.4% — nearly double cross-industry average. Pet owners WANT to hear from you. Your VA makes sure you show up.</div>

            <h4>DVM Interview Content &amp; Thought Leadership</h4>
            <ul className="vet-ck">
              <li><strong>Monthly &ldquo;Ask the Vet&rdquo; video:</strong> VA collects top questions. Claude writes 5-question script. DVM records 10 minutes. VA edits into 5 short clips + 1 long-form. One session = a week of expert content.</li>
              <li><strong>Podcast-style audiograms:</strong> 3–5 min DVM recording → VA adds captions, creates audiogram, publishes.</li>
              <li><strong>Written Q&amp;A:</strong> Claude drafts, DVM reviews, VA publishes. Ranks on Google.</li>
              <li><strong>Media outreach:</strong> VA pitches DVMs to local TV, community podcasts, pet influencers. Free reach.</li>
              <li><strong>Local business collabs:</strong> Cross-promotion with pet stores, groomers, trainers. Builds community.</li>
            </ul>

            <h4>Google Reviews &amp; Reputation</h4>
            <ul className="vet-ck">
              <li><strong>Post-visit review requests:</strong> &ldquo;Hi Sarah, thanks for bringing Max today! If you had a great experience, we&apos;d love a quick Google review.&rdquo;</li>
              <li><strong>3-touch follow-up:</strong> Day 1, 3, 7. Converts 40% more.</li>
              <li><strong>Every review replied within 24 hours.</strong> Negatives drafted → you approve first.</li>
            </ul>

            <h4>SEO Blog Content</h4>
            <ul className="vet-ck">
              <li><strong>2–4 posts/month:</strong> &ldquo;vet near me [city],&rdquo; &ldquo;dog vaccinations [area],&rdquo; &ldquo;cost to spay a dog in [city].&rdquo;</li>
              <li><strong>Seasonal:</strong> &ldquo;5 holiday foods toxic to dogs,&rdquo; &ldquo;heartworm prevention guide [state].&rdquo;</li>
              <li>After 12 months: 24–48 posts = permanent organic lead source.</li>
            </ul>

            <h4>Email &amp; SMS Campaigns</h4>
            <ul className="vet-ck">
              <li><strong>Monthly newsletter:</strong> seasonal tips, team updates, personalised with pet names.</li>
              <li><strong>Vaccination reminders:</strong> &ldquo;Bella is due for her annual wellness exam!&rdquo;</li>
              <li><strong>Reactivation:</strong> &ldquo;We miss Bella! It&apos;s been a while.&rdquo; Recovers 10–15% of lapsed clients.</li>
              <li><strong>Seasonal campaigns:</strong> flea/tick, dental month, holiday safety — full sequences.</li>
            </ul>

            <h4>Google Business Profile</h4>
            <ul className="vet-ck">
              <li><strong>2–3 posts/week</strong> + weekly photo uploads. Profiles with 100+ photos get 520% more calls.</li>
              <li>Every Q&amp;A answered as a mini sales pitch. Performance tracked weekly.</li>
            </ul>

            <h3>Sample Monthly Content Calendar</h3>
            <div className="vet-tw">
              <table className="vet-oh">
                <thead><tr><th>Week</th><th>FB/Instagram</th><th>TikTok/Reels</th><th>Blog</th><th>Email</th><th>GBP</th></tr></thead>
                <tbody>
                  <tr><td>Wk 1</td><td>Meet DVM, Health Tip, Patient of Week, BTS, Promo</td><td>&ldquo;Day in the Life&rdquo; + &ldquo;3 Signs Dental Disease&rdquo;</td><td>&ldquo;Best Vet in [City]&rdquo;</td><td>Newsletter + vaxx reminders</td><td>2 posts + photos</td></tr>
                  <tr><td>Wk 2</td><td>Tech Spotlight, Myth Buster, Pet Feature, Team Lunch, Caption Contest</td><td>&ldquo;Vet Answers Questions&rdquo; + Puppy First Visit</td><td>—</td><td>Reactivation sequence</td><td>2 posts + reviews</td></tr>
                  <tr><td>Wk 3</td><td>Puppy Checklist, Safety Tip, B&amp;A Dental, BTS Surgery, Seasonal</td><td>&ldquo;Things We Wish Owners Knew&rdquo; + B&amp;A Reel</td><td>&ldquo;5 Toxic Foods&rdquo;</td><td>Referral request</td><td>2 posts + Q&amp;A</td></tr>
                  <tr><td>Wk 4</td><td>Ask the Vet Promo, Testimonial, Milestone, Partner Feature, Fun</td><td>Ask the Vet (5 clips) + Costume Contest</td><td>&ldquo;Cost to Spay in [City]&rdquo;</td><td>New service</td><td>2 posts + update</td></tr>
                </tbody>
              </table>
            </div>
            <p><strong>20–28 social posts, 8–12 TikToks/Reels, 2–3 blogs, 4 email campaigns, 8+ GBP updates.</strong> Every month. $870/month.</p>

            <h3>Client Follow-Up &amp; Communication</h3>
            <ul className="vet-ck">
              <li><strong>Missed call callbacks</strong> within 15 minutes. VA checks voicemail, logs reason, resolves or schedules callback.</li>
              <li><strong>Appointment reminders</strong> at 48hr and 24hr. Reduces no-shows by 40–60%.</li>
              <li><strong>Post-visit follow-ups:</strong> &ldquo;Hi Sarah, how is Max doing after his dental cleaning?&rdquo; Turns clients into advocates.</li>
              <li><strong>Lab result notifications</strong> drafted for DVM review. &ldquo;Bella&apos;s bloodwork is back — everything looks great!&rdquo;</li>
              <li><strong>Prescription refills</strong> processed — requests handled, DVM approves, client notified.</li>
              <li><strong>New client onboarding:</strong> welcome emails, patient forms, first-visit prep, 7-day follow-up.</li>
            </ul>

            <h3>Admin &amp; Front-Desk Overflow</h3>
            <ul className="vet-ck">
              <li>Medical record management. Insurance and payment coordination.</li>
              <li>Inventory tracking and routine supply orders.</li>
              <li>Scheduling support — website, email, social media appointment requests.</li>
              <li>Specialist referral coordination. Staff scheduling assistance.</li>
            </ul>
            <div className="vet-co">One VA. 40 hours/week. Marketing + follow-up + admin. $870/month. Less than a single day&apos;s locum fee ($800–$1,500/day). Except this person works for you every day and gets better every month.</div>
          </section>

          {/* SECTION 4: CLAUDE SKILLS */}
          <section>
            <div className="vet-div"></div>
            <h2>Claude Skills: The AI Playbooks That Make It Work</h2>
            <p>We build 15 custom Claude Skills for every veterinary practice:</p>
            <div className="vet-tw">
              <table className="vet-oh">
                <thead><tr><th>Skill</th><th>What It Produces</th><th>VA Time</th></tr></thead>
                <tbody>
                  <tr><td><strong>Weekly Social Pack</strong></td><td>5–7 branded posts. Pet features, team spotlights, health tips, seasonal.</td><td>15 min</td></tr>
                  <tr><td><strong>TikTok &amp; Reels Producer</strong></td><td>2–3 videos/week. Captions, overlays, trending audio, hashtags.</td><td>30 min</td></tr>
                  <tr><td><strong>DVM Interview Script</strong></td><td>5-question Q&amp;A for monthly &ldquo;Ask the Vet.&rdquo; VA edits into 5 clips + 1 long.</td><td>10 min</td></tr>
                  <tr><td><strong>Review Responder</strong></td><td>Personalised replies to every Google and Facebook review.</td><td>5 min</td></tr>
                  <tr><td><strong>Review Request Generator</strong></td><td>Post-visit SMS/email review requests. 3-touch follow-up.</td><td>10 min/wk</td></tr>
                  <tr><td><strong>SEO Blog Writer</strong></td><td>1,000+ word local search posts. &ldquo;Vet near me [city].&rdquo;</td><td>20 min</td></tr>
                  <tr><td><strong>Email &amp; SMS Builder</strong></td><td>Newsletters, wellness campaigns, vaccination reminders, reactivation.</td><td>15 min</td></tr>
                  <tr><td><strong>Client Follow-Up</strong></td><td>Post-visit check-ins, missed appointments, post-surgery follow-ups.</td><td>10 min</td></tr>
                  <tr><td><strong>Lab Result Communicator</strong></td><td>Clear, compassionate lab notifications for DVM review.</td><td>5 min</td></tr>
                  <tr><td><strong>GBP Updater</strong></td><td>Google Business posts, photos, Q&amp;A, service updates.</td><td>15 min/wk</td></tr>
                  <tr><td><strong>Competitor Intel</strong></td><td>Weekly review counts, rankings, social activity analysis.</td><td>Auto</td></tr>
                  <tr><td><strong>Reactivation Campaign</strong></td><td>Personalised lapsed client outreach. &ldquo;We miss Bella!&rdquo;</td><td>15 min</td></tr>
                  <tr><td><strong>New Client Welcome</strong></td><td>Welcome email, patient forms, first-visit prep, 7-day follow-up.</td><td>10 min</td></tr>
                  <tr><td><strong>Seasonal Wellness</strong></td><td>Flea/tick, heartworm, dental month — full email + social + video.</td><td>20 min</td></tr>
                  <tr><td><strong>Media Pitcher</strong></td><td>Pitch emails to local TV, podcasts, pet influencers, community partners.</td><td>15 min</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 5: ECONOMICS */}
          <section>
            <div className="vet-div"></div>
            <h2>The Economics</h2>
            <p>Average US vet client: <strong>$500–$800/year</strong> recurring. Stays 5–8 years. Single new client lifetime value: <strong>$2,500–$6,400.</strong></p>
            <div className="vet-tw">
              <table>
                <thead><tr><th>Option</th><th>Monthly Cost</th><th>What You Get</th></tr></thead>
                <tbody>
                  <tr><td><strong>Vet marketing agency</strong></td><td>$1,500–$4,000/mo</td><td>6–8 hrs/month junior work. No follow-up. No admin. 12-mo contract.</td></tr>
                  <tr><td><strong>Part-time receptionist (US)</strong></td><td>$2,400–$3,200/mo</td><td>20 hrs/week. Phones only. No marketing. Plus payroll tax.</td></tr>
                  <tr><td><strong>Locum vet (1 day/week)</strong></td><td>$3,200–$6,000/mo</td><td>Clinical only. No marketing. No admin. No continuity.</td></tr>
                  <tr className="vet-hi"><td>RapidTal VA + Claude AI</td><td>$820–$920/mo</td><td>Full-time (40 hrs). Marketing + follow-up + admin. You own everything.</td></tr>
                </tbody>
              </table>
            </div>
            <p><strong>Annual savings vs. agency + receptionist:</strong> <span style={{ color: '#1A7A42', fontWeight: 700 }}>$59,160/year.</span></p>

            <h3>DVM Hours Recovered</h3>
            <div className="vet-tw">
              <table>
                <thead><tr><th>Task</th><th>Before VA</th><th>After VA</th></tr></thead>
                <tbody>
                  <tr><td>Client callbacks</td><td>45 min/day</td><td>0 min (VA)</td></tr>
                  <tr><td>Lab result comms</td><td>30 min/day</td><td>5 min (review draft)</td></tr>
                  <tr><td>Prescription refills</td><td>20 min/day</td><td>5 min (approve)</td></tr>
                  <tr><td>Post-visit follow-ups</td><td>20 min/day</td><td>0 min (VA)</td></tr>
                  <tr><td>Missed call returns</td><td>15 min/day</td><td>0 min (VA)</td></tr>
                  <tr className="vet-hi"><td><strong>Total non-clinical</strong></td><td><strong>2 hrs 55 min/day</strong></td><td><strong>55 min/day</strong></td></tr>
                </tbody>
              </table>
            </div>
            <div className="vet-co">2 hours recovered per DVM per day = 10 hrs/week = 5–10 more appointments = $39,000–$104,000/year in recovered clinical revenue. Per DVM.</div>

            <h3>The Compound Effect: 3 Extra New Clients/Month</h3>
            <div className="vet-tw">
              <table>
                <thead><tr><th>Month</th><th>New Clients</th><th>Cumulative</th><th>Annual Revenue Added</th></tr></thead>
                <tbody>
                  <tr><td>Month 1</td><td>+3</td><td>3</td><td>$1,800/yr</td></tr>
                  <tr><td>Month 6</td><td>+3</td><td>18</td><td>$10,800/yr</td></tr>
                  <tr><td>Month 12</td><td>+3</td><td>36</td><td>$21,600/yr</td></tr>
                  <tr className="vet-hi"><td>Month 36</td><td>+3</td><td>108</td><td>$64,800/yr</td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '.82rem', color: '#999', fontStyle: 'italic' }}>*$600 avg annual value. Excludes referrals, upsells, and reactivated clients. Real numbers typically 2–3x.</p>
          </section>

          {/* SECTION 6: CLIENT EXPERIENCE */}
          <section>
            <div className="vet-div"></div>
            <h2>The Client Experience: Before and After</h2>

            <h3>Before</h3>
            <ul className="vet-ck">
              <li>Phone rings 70 times/day. 15–20 go to voicemail. Each missed call = potential lost client.</li>
              <li>Mrs. Johnson&apos;s dog had a dental cleaning yesterday. Nobody calls to check in. No review requested.</li>
              <li>New client form submitted at 7pm. Nobody responds until 10am tomorrow. They&apos;ve already booked elsewhere.</li>
              <li>Dr. Martinez spends 45 minutes after close on callbacks, notes, and refills. Every day. For three years.</li>
            </ul>

            <h3>After</h3>
            <ul className="vet-ck">
              <li>Receptionist handles in-person. <strong>VA handles overflow remotely.</strong> Every missed call returned within 15 minutes.</li>
              <li>Mrs. Johnson gets a text at 2pm: <strong>&ldquo;How is Buddy doing after his dental cleaning? Dr. Martinez wanted to check in.&rdquo;</strong> She&apos;s delighted. Leaves a 5-star review that evening.</li>
              <li>7pm form submission gets a response at <strong>7:03pm:</strong> &ldquo;We&apos;d love to welcome you and Luna. Tuesday at 10am with Dr. Martinez?&rdquo; Booked immediately.</li>
              <li>Dr. Martinez leaves at 5:30pm. VA has drafted follow-ups, sent refill notifications, logged callbacks. <strong>She walks her own dog.</strong></li>
            </ul>
            <div className="vet-co vet-green">The difference between a practice that retains clients and one that slowly loses them isn&apos;t better medicine. It&apos;s better follow-through. Your VA is the follow-through machine your practice has never had.</div>
          </section>

          {/* SECTION 7: TWO FUTURES */}
          <section>
            <div className="vet-div"></div>
            <h2>Two Futures: Your Practice in 12 Months</h2>

            <h3>Without a VA</h3>
            <ul className="vet-ck">
              <li>10–15 missed calls/week at $600 lifetime value = <strong>$6,000–$9,000 walking out the door weekly.</strong></li>
              <li>DVMs: 2–3 hrs/day non-clinical. <strong>$39,000–$104,000/year lost per DVM.</strong></li>
              <li>Agency: $2,000–$4,000/month for templates. <strong>$24,000–$48,000/year for 6 hours of work.</strong></li>
              <li>500+ lapsed clients dormant. <strong>$30,000–$45,000 in recoverable revenue collecting dust.</strong></li>
              <li>No social presence. Corporate practices posting 5x/week. You&apos;re invisible.</li>
              <li>Staff burnout compounding. Next resignation: when, not if. Replacement: $5,000–$15,000.</li>
              <li><strong>Total cost of doing nothing: $100,000–$250,000+/year.</strong></li>
            </ul>

            <h3>With a VA</h3>
            <div className="vet-stats">
              <div className="vet-stat"><div className="vet-stat-n">80–120</div><div className="vet-stat-l">New Google Reviews</div></div>
              <div className="vet-stat"><div className="vet-stat-n">250+</div><div className="vet-stat-l">Social Posts Published</div></div>
              <div className="vet-stat"><div className="vet-stat-n">100+</div><div className="vet-stat-l">TikToks &amp; Reels</div></div>
              <div className="vet-stat"><div className="vet-stat-n">36+</div><div className="vet-stat-l">New Clients Acquired</div></div>
            </div>
            <ul className="vet-ck">
              <li>Every call answered or returned within 15 minutes.</li>
              <li>Every patient gets a post-visit follow-up. Reviews converting.</li>
              <li>24–48 blog posts ranking on Google. Free leads every month.</li>
              <li>50–75 lapsed clients reactivated. $30,000–$45,000 recovered.</li>
              <li>No-shows reduced 40–60%. $19,500/year recovered.</li>
              <li>DVMs recovering 2 hrs/day. $39,000–$104,000 in clinical revenue per DVM.</li>
              <li>Staff morale up. Everyone doing what they were hired to do.</li>
              <li><strong>Total: $100,000–$200,000+ in savings and new revenue. ROI: 10:1 to 20:1.</strong></li>
            </ul>
            <div className="vet-co vet-green">Independent practices don&apos;t need corporate budgets. They need smarter systems. One VA + Claude AI gives you the follow-up, marketing, and admin that corporates spend millions building. For less than a day&apos;s locum fee per month.</div>
          </section>

          {/* SECTION 8: HOW TO GET STARTED */}
          <section>
            <div className="vet-div"></div>
            <h2>How to Get Started</h2>

            <h3>The First 30 Days</h3>
            <div className="vet-timeline"><strong>Week 1 — Setup:</strong> VA gets access to your PMS, social accounts, GBP, email. Learns your team, services, brand. We build your Claude Project.</div>
            <div className="vet-timeline"><strong>Week 2 — Quick Wins:</strong> Every unanswered review responded to. First social posts published. Review request campaign sent. Missed call process begins. DVM notices they&apos;re leaving earlier.</div>
            <div className="vet-timeline"><strong>Week 3 — Full Machine:</strong> Content calendar running. TikTok production started. Blog published. Email campaigns scheduled. Reminders automated. Reactivation launched.</div>
            <div className="vet-timeline"><strong>Week 4 — Full Capacity:</strong> All 15 Claude Skills running independently. Weekly reporting in place. Your practice has a marketing machine it&apos;s never had.</div>

            <h3>Data Security &amp; Privacy</h3>
            <ul className="vet-ck">
              <li>VA accesses systems through your existing security — VPN, remote desktop, or cloud PMS. No local data.</li>
              <li>Role-based permissions. Comprehensive NDA. Background check.</li>
              <li>Marketing content reviewed before publishing until you&apos;re comfortable (most owners stop after 2–3 weeks).</li>
            </ul>

            <h3>Five Steps</h3>
            <div className="vet-step"><div className="vet-step-n">1</div><div className="vet-step-c"><strong>We find your VA.</strong> English-fluent, college-educated, tested on communication, empathy, marketing, and admin accuracy.</div></div>
            <div className="vet-step"><div className="vet-step-n">2</div><div className="vet-step-c"><strong>We train them on Claude AI + your systems.</strong> IDEXX, eVetPractice, Cornerstone, Shepherd, Digitail — whatever you use.</div></div>
            <div className="vet-step"><div className="vet-step-n">3</div><div className="vet-step-c"><strong>We build your custom Claude Project.</strong> Your DVMs, services, neighborhood, competitors, brand voice — all loaded.</div></div>
            <div className="vet-step"><div className="vet-step-n">4</div><div className="vet-step-c"><strong>You hire them directly.</strong> They work for YOU. No agency. No middleman.</div></div>
            <div className="vet-step"><div className="vet-step-n">5</div><div className="vet-step-c"><strong>6-month guarantee.</strong> VA leaves within 6 months? Replacement trained at no extra cost.</div></div>

            <div className="vet-co vet-green">Total: $2,800 one-time placement fee. Then $820–$920/month ongoing. No retainer. No contract. No hidden fees. Less than a single day of locum coverage — except this person works for you every day, all year.</div>
          </section>
        </div>

        <CalendlyEmbed />
      </main>
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Car Dealership landing-page config.
 *
 * Every string visible on /industries/car-dealerships is defined here.
 * To create another industry page, copy this file, rename the slug, and
 * rewrite the copy. The page.tsx stays identical.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { IndustryConfig } from '../_shared/types';

const industry = 'Car Dealership';

export const config: IndustryConfig = {
  slug: 'car-dealerships',
  industryName: industry,

  attentionBar: {
    contactName: 'Gabriel',
    contactPhone: '0428 208 022',
    badge: 'Free',
    message: 'Book a 1-on-1 coaching call',
    ctaLabel: 'Book now',
  },

  meta: {
    title: `Offshore Marketing for ${industry}s — RapidTAL`,
    description:
      `Replace your entire ${industry} marketing team with one Offshore Marketing Ninja plus an AI tool stack. Save $150K–$280K/yr. 14-day setup. No super, no leave, no lock-in.`,
    alternates: { canonical: '/industries/car-dealerships' },
    openGraph: {
      title: `Offshore Marketing for ${industry}s — RapidTAL`,
      description:
        `One Offshore Marketing Ninja + AI tools = the output of three local marketing hires. Purpose-built for Australian ${industry}s.`,
      url: 'https://rapidtal.com/industries/car-dealerships',
      type: 'website',
      images: [
        {
          // Drop the 1200x630 social card file at public/og-car-dealerships.png
          url: 'https://rapidtal.com/og-car-dealerships.png',
          width: 1200,
          height: 630,
          alt: `RapidTAL — Offshore Marketing for ${industry}s`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Offshore Marketing for ${industry}s — RapidTAL`,
      description:
        `Replace 3 local marketing hires with 1 Offshore Marketing Ninja + AI tools. Save $150K–$280K/yr.`,
      images: ['https://rapidtal.com/og-car-dealerships.png'],
    },
  },

  hero: {
    watermark: 'RapidTAL · Built for Australian Business',
    eyebrow: `For ${industry} Principals & General Managers`,
    titleLead: `Your ${industry} is`,
    rotatingWords: [
      'overpaying',
      'overstaffed',
      'overworked',
      'overwhelmed',
      'overspending',
    ],
    subhead:
      `Every local marketing hire is quietly costing your dealership $150,000–$280,000 a year once you stack super, leave, WorkCover, recruitment fees and HR overhead — before they have uploaded a single stock photo. There is a smarter model, and the numbers will shock you.`,
    stats: [
      { num: '3×',      label: 'more output than 3 local marketing staff' },
      { num: '$220K',   label: 'average saving for a mid-size dealership' },
      { num: '14 days', label: 'from zero to a fully operational Ninja' },
    ],
    ctaLabel: "Calculate my dealership's saving",
    ctaScrollTarget: 'calc-sec',
    microCopy: '60 seconds. No sign-up needed.',
  },

  pain: {
    tag: 'The real problem',
    heading: `Sound familiar? This is what ${industry} principals tell us every week.`,
    subhead:
      `You are running a ${industry}. You need new and used stock advertised across carsales, Drive and AutoGate, a strong Google presence, and social content that fills the showroom on weekends. But building that marketing team locally is quietly destroying your margin.`,
    cards: [
      {
        title: 'You hire a marketing coordinator — and they leave in 14 months',
        body:  'Recruitment fees eat $12,000–$18,000. Onboarding takes 3 months. Then they leave for the OEM or a bigger group. You are back to square one — and your stock went un-photographed while you were hiring again.',
        badge: 'Average dealership marketing tenure: 14 months',
      },
      {
        title: 'Your "social media person" is doing 6 jobs badly',
        body:  'One local hire cannot run Meta ads for new & used, do SEO, write VDP copy, manage service-customer EDMs AND produce weekly Reels for the showroom. They are spread thin — and your stock turn shows it.',
        badge: 'Generalists produce generalist results',
      },
      {
        title: 'Super, leave and compliance are eating your margin',
        body:  `An $80,000 salary costs your ${industry} $115,000+ once you add 11.5% super, 4 weeks annual leave, 10 days sick leave, WorkCover and payroll tax. That is 43% on top — mandatory, every year, on already-thin new-car margins.`,
        badge: 'True cost: 40–45% above the advertised salary',
      },
      {
        title: 'Your dealer principal is managing HR instead of moving metal',
        body:  'Performance reviews. Contracts. Leave requests. Disputes. Every marketing employee adds hours of management overhead to your week — time that should be spent on OEM calls, floor coverage and gross targets.',
        badge: '5–10 hrs/week of your time, gone',
      },
    ],
  },

  truth: {
    tag: 'The RapidTAL solution',
    headingLine1: '1 Offshore Marketing Ninja + AI tools =',
    headingLine2Before: `your entire ${industry}`,
    headingLine2Highlight: 'marketing department',
    subhead:
      'This is not about cheap labour. It is about pairing a highly trained, English-fluent marketing specialist with AI tools that multiply their output 3–4×. One Offshore Marketing Ninja. Specialist-grade results. Zero employer obligations.',
    equation: {
      left:   { label: 'Offshore Marketing Ninja', value: '$22–28K/yr' },
      middle: { label: 'AI tool stack',            value: '$5–8K/yr' },
      right:  { label: 'Output equal to',          value: '3 local staff' },
    },
    note:
      "The Philippines is the world's 3rd largest English-speaking country. Filipino marketing professionals hold university degrees, are trained in Australian business culture, and consistently rank among the top remote workers globally. Paired with the right AI tools, their output is extraordinary.",
  },

  roles: {
    tag: 'Role-by-role breakdown',
    heading: `The four ${industry} marketing roles you are overpaying for right now`,
    subhead:
      `These are the exact roles ${industry}s hire locally most often — and what each one truly costs versus what an Offshore Marketing Ninja delivers with AI tools at a fraction of the price.`,
    cards: [
      {
        icon: 'trending-up',
        name: 'Meta & Google Ads Manager',
        subtitle: 'Paid digital — new-car campaigns, used-stock boost ads, service & parts promos',
        costRange: '$115,000–$145,000',
        tasks: [
          'Create and optimise Meta campaigns for new & used vehicle stock',
          'Run Google Vehicle Listing Ads and Performance Max for dealers',
          'Target in-market auto intenders by postcode and model interest',
          'Design ad creatives for demo units, run-out offers and stock clearance',
          'Retarget VDP viewers who did not submit an enquiry',
          'Report on cost-per-lead, test-drive bookings and qualified enquiries weekly',
        ],
        tools: ['Meta Ads Manager', 'Google Ads', 'Claude AI (ad copy)', 'Canva AI (creatives)', 'Google Analytics 4', 'Looker Studio'],
        saving: 'Save $85,000–$115,000/yr',
      },
      {
        icon: 'search',
        name: 'SEO & Content Specialist',
        subtitle: 'Google rankings, used-stock VDP optimisation, model review content',
        costRange: '$105,000–$135,000',
        tasks: [
          'Rank your dealership for "[make] [model] [suburb]" searches',
          'Write and optimise used-vehicle VDP descriptions at scale',
          'Publish model comparison and buyer-guide blog content',
          'Build Google Business Profile authority for every rooftop',
          'Fix technical SEO issues suppressing your stock pages',
          'Track keyword rankings and organic VDP-to-lead attribution',
        ],
        tools: ['Surfer SEO', 'Claude AI (articles)', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console'],
        saving: 'Save $75,000–$105,000/yr',
      },
      {
        icon: 'smartphone',
        name: 'Social Media Manager',
        subtitle: 'Instagram, Facebook, TikTok — daily stock content and showroom engagement',
        costRange: '$95,000–$120,000',
        tasks: [
          'Daily posts across Instagram, Facebook and TikTok',
          'Sales consultant personal branding — positions them as model experts',
          'Stock walkarounds, delivery-day posts and customer spotlights',
          'Reels and TikToks for new stock arrivals and run-out offers',
          'Community engagement and direct message enquiry management',
          'Monthly follower growth, reach and enquiry attribution reporting',
        ],
        tools: ['Buffer / Later', 'Canva AI', 'Claude AI (captions)', 'Metricool', 'CapCut AI', 'Repurpose.io'],
        saving: 'Save $65,000–$90,000/yr',
      },
      {
        icon: 'pen-line',
        name: 'Content & Email Marketing Coordinator',
        subtitle: 'EDMs, VDP copy, newsletters, service-customer database management',
        costRange: '$90,000–$115,000',
        tasks: [
          'Write compelling new & used vehicle detail-page descriptions',
          'Monthly EDMs to your sales and service customer database',
          'Service-reminder and re-purchase nurture sequences',
          'Run-out and end-of-month offer email campaigns',
          'Sales consultant bios, award submissions and press releases',
          'DMS / CRM content and customer database segmentation',
        ],
        tools: ['Claude AI', 'ActiveCampaign', 'Jasper AI', 'Grammarly', 'HubSpot / Podium', 'Zapier'],
        saving: 'Save $60,000–$85,000/yr',
      },
    ],
  },

  how: {
    tag: 'How RapidTAL works',
    heading: 'From decision to delivery in 14 days',
    subhead:
      `We do not just find you an Offshore Marketing Ninja. We match you with a pre-vetted ${industry} marketing specialist, embed them into your systems, and give you the full AI blueprint on day one.`,
    steps: [
      {
        title: 'Discovery call — we map your marketing gaps in 30 minutes',
        body:  `We look at your current setup: what platforms you are running, what is working, what is leaking leads, and which roles are costing your ${industry} the most with the least return. We build a custom saving model for your dealership on the call.`,
        note:  'Output: a personalised cost comparison report for your specific rooftop',
      },
      {
        title: 'We match you with a pre-vetted Offshore Marketing Ninja',
        body:  `From our bench of trained, degree-qualified Filipino marketing professionals — each tested on automotive retail terminology, Australian business culture, platform proficiency and AI tool competency — we match you within 5 business days.`,
        note:  'Every Ninja is tested: ad platforms, SEO tools, copywriting, automotive retail knowledge and AI proficiency',
      },
      {
        title: 'You receive the complete AI blueprint and standard operating procedure library',
        body:  `The exact tool stack, prompt libraries, workflow SOPs, content calendars and onboarding checklist — built specifically for ${industry}s. Your Offshore Marketing Ninja is producing results from week one, not month three.`,
        note:  'Includes: stock ad templates, VDP SEO playbook, social content calendar, service-EDM sequences',
      },
      {
        title: 'KPIs locked in from day one — performance tracked weekly',
        body:  'Every engagement starts with agreed, measurable KPIs — leads generated, test drives booked, ad cost-per-enquiry, organic rankings, email open rates. You see real numbers on a live dashboard, not a monthly status email.',
        note:  'No results? No renewal. That is the RapidTAL guarantee.',
      },
    ],
  },

  calculator: {
    tag: 'Your savings calculator',
    heading: `What is your ${industry} actually spending?`,
    subhead:
      'Drag the sliders to match your team. Every figure includes super, leave, WorkCover, recruitment and equipment — the true cost of a local hire, not just the salary on the job ad.',
    sliders: {
      roles: {
        min: 1, max: 5, step: 1, default: 3,
        label: 'Marketing roles to replace with an Offshore Marketing Ninja',
        description: `Most ${industry}s replace 2–4 roles in the first engagement`,
      },
      salary: {
        min: 65000, max: 140000, step: 5000, default: 85000,
        label: 'Average local salary per marketing role',
        description: `${industry} marketing salaries typically range $70K–$120K in major metros`,
      },
      va: {
        min: 18000, max: 40000, step: 1000, default: 26000,
        label: 'Offshore Marketing Ninja annual salary (AUD)',
        description: 'Senior specialist Ninjas range $22K–$35K depending on experience and specialisation',
      },
      tools: {
        min: 300, max: 2000, step: 100, default: 600,
        label: 'AI tools monthly budget',
        description: 'Full AI stack (Claude, Canva AI, Surfer, Buffer, etc.) typically runs $400–$900/mo',
      },
    },
    resultLabels: {
      localCost:    'Local team true annual cost',
      offshoreCost: 'Offshore Marketing Ninja full annual cost',
      saving:       'Your annual saving',
    },
    breakdownHeading: 'Local team — full true cost breakdown',
    totalLabel: 'Your net annual saving with RapidTAL',
    disclaimer:
      'Estimates are based on publicly available Australian employment cost data. Actual figures vary by role, state and business structure. We will model your exact numbers on the discovery call.',
  },

  proof: {
    tag: 'Why this works — the data',
    heading: 'Built on real numbers, not guesswork',
    subhead:
      `Every claim on this page is grounded in Australian employment law, independent research and what we see from ${industry}s every week.`,
    items: [
      {
        tag: 'AU',
        title: 'The superannuation burden is growing',
        body: 'Super rose to 11.5% in July 2024 and hits 12% in July 2025 under legislated increases. On a $90K salary that is $10,800 — mandatory, non-negotiable, every single year for every employee.',
        big:  '12% by 2025',
      },
      {
        tag: 'AI',
        title: 'AI multiplies output 3–4 times',
        body: `McKinsey research found AI tools increase knowledge worker productivity by 2.5–4× across writing, research, analysis and creative work — precisely what ${industry} marketing requires daily.`,
        big:  '3–4× output',
      },
      {
        tag: 'PH',
        title: 'Philippines — a deep talent pool',
        body: "The Philippines is the world's 3rd largest English-speaking country. Over 500,000 university graduates enter the workforce annually. Filipino professionals are consistently rated among the top remote workers globally.",
        big:  '500K+ grads/yr',
      },
      {
        tag: 'AUTO',
        title: 'Cost-per-lead is climbing faster than margin',
        body: `Average new-car gross has compressed below 3% while digital cost-per-lead on Meta and Google has doubled in the last 4 years. ${industry}s that do not fix their marketing efficiency will be squeezed out.`,
        big:  'CPL up ~2× in 4 yrs',
      },
    ],
  },

  faq: {
    tag: 'Frequently asked',
    heading: `Everything Australian ${industry} principals ask us`,
    subhead:
      'The objections we hear most often — and the honest, specific answers we give every time. No spin, no marketing fluff.',
    items: [
      {
        question: 'How do we handle the timezone difference?',
        answer:
          'Your Offshore Marketing Ninja works Australian business hours — typically 8am–4pm AEST, which is 6am–2pm Manila time. This is standard for Filipino remote professionals and there is zero lag on daily operations, standups or urgent requests. The Philippines is only 2–3 hours behind AEST, making it the closest offshore market to Australia.',
      },
      {
        question: 'What happens if the Ninja leaves or underperforms?',
        answer:
          'We guarantee performance against the KPIs agreed at kickoff. If your Ninja is not hitting them, we replace them within 14 days at no extra cost. If they leave voluntarily, same replacement window. You are never stuck — and unlike a local hire, there is no recruitment fee, no exit interview, no HR paperwork.',
      },
      {
        question: 'How is my data protected? What about DMS, CRM and customer databases?',
        answer:
          'Every Ninja signs a comprehensive NDA and IP-assignment agreement before onboarding. Access is granted via your password manager (1Password / LastPass) with role-based permissions — never via shared credentials. We can also enforce VPN-only access, IP allowlisting, and two-factor authentication on every tool including your DMS. Your customer data stays in your systems.',
      },
      {
        question: 'Do I have to manage the Ninja myself? I am already time-poor.',
        answer:
          'No. We provide weekly performance reports, a dedicated account manager for escalations, and the full AI Marketing Blueprint so workflows run themselves. Most dealer principals spend under 30 minutes a week reviewing output. You approve strategy; the Ninja executes.',
      },
      {
        question: 'What if my industry is specialised — will they understand automotive retail?',
        answer:
          `Every Ninja is pre-vetted on ${industry} terminology, carsales / Drive / AutoGate workflows, OEM compliance language, and the Australian franchise dealer model before they are matched with you. We also onboard them on your specific brands, model lineup and local market. They are not generalists trying to learn — they are trained specialists.`,
      },
      {
        question: 'How is English proficiency? Can they write VDP copy that sounds Australian?',
        answer:
          "The Philippines is the world's third-largest English-speaking country and English is an official language from kindergarten. Every Ninja is C1-level or higher (CEFR certified) and we specifically test for Australian tone — no Americanisms, no awkward phrasing. VDP copy and ad creative is reviewed before go-live until we know the voice is locked in.",
      },
      {
        question: 'What does the AI Marketing Blueprint actually include?',
        answer:
          'Full tool stack (Claude, Surfer SEO, Canva AI, Meta Ads Manager, Google Ads, Buffer, ActiveCampaign and 10+ more), prompt libraries for every role, standard operating procedures for stock campaigns / EDMs / social content / SEO, KPI dashboards, and the onboarding checklist we use with every Ninja. Whether or not you engage us, the blueprint is yours to keep.',
      },
      {
        question: 'Is there a contract? Can I cancel?',
        answer:
          'No lock-in. Monthly rolling agreement, 14-day notice either side. We earn your business every month — that is the discipline that keeps our Ninjas performing.',
      },
      {
        question: 'How fast can we start?',
        answer:
          'From the 20-minute discovery call to a fully operational Ninja is 14 days on average. 5 days for matching, 5 days for system access and onboarding, 4 days for first-campaign ramp-up. No 3-month hiring cycle, no notice periods.',
      },
      {
        question: 'What if we already have a local marketing coordinator?',
        answer:
          'Many of our clients start by adding a Ninja alongside their existing team to take over execution-heavy work (Meta & Google ads, SEO, content production) while the local coordinator focuses on OEM co-op strategy and internal sales-team relationships. The Ninja is not a replacement threat — they are a force multiplier.',
      },
    ],
  },

  cta: {
    tag: 'Get the AI Marketing Blueprint — free',
    headingLine1: 'Get the complete AI Marketing Blueprint',
    headingLine2Before: `+ matched with your`,
    headingLine2Highlight: 'Offshore Marketing Ninja',
    subhead:
      `Download the same AI tool stack, prompt libraries and SOPs we use to make one Offshore Marketing Ninja replace three local ${industry} marketing hires — and get matched with a pre-vetted Ninja for your dealership.`,
    microCopy: 'Free. No lock-in. The blueprint is yours to keep either way.',
    listHeading: 'What you get when you book',
    bullets: [
      'The complete AI Marketing Blueprint — every tool, prompt and SOP we use',
      `Full AI tool stack mapped to each ${industry} marketing role with monthly costs`,
      'Role-specific prompt libraries for Meta & Google ads, SEO, social and email',
      'KPI frameworks pre-built for new & used stock, service retention and EDMs',
      'A shortlist of matched, pre-vetted Offshore Marketing Ninjas ready in 14 days',
    ],
    // Shared across industries — all submissions land in the same pipeline.
    embedFormId: 'yhi2G6XWNF2CshO37PVD',
    embedFormName: 'Calendar Car Dealership',
    embedMinHeight: 737,
    stickyMobileLabel: 'Get the Free Blueprint',
    trustItems: [
      'No lock-in contracts',
      `Pre-vetted, ${industry} trained`,
      'KPI-accountable from day one',
      'Blueprint is yours to keep',
    ],
  },
};

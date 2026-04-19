/* ═══════════════════════════════════════════════════════════════════════════
 * Commercial Real Estate Agency landing-page config.
 *
 * Every string visible on /industries/commercial-real-estate is defined here.
 * To create another industry page, copy this file, rename the slug, and
 * rewrite the copy. The page.tsx stays identical.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { IndustryConfig } from '../_shared/types';

const industry = 'Commercial Real Estate Agency';

export const config: IndustryConfig = {
  slug: 'commercial-real-estate',
  industryName: industry,

  meta: {
    title: `Offshore Marketing for ${industry}s — RapidTAL`,
    description:
      `Replace your entire ${industry} marketing team with one Offshore Marketing Ninja plus an AI tool stack. Save $150K–$280K/yr. 14-day setup. No super, no leave, no lock-in.`,
    alternates: { canonical: '/industries/commercial-real-estate' },
    openGraph: {
      title: `Offshore Marketing for ${industry}s — RapidTAL`,
      description:
        `One Offshore Marketing Ninja + AI tools = the output of three local marketing hires. Purpose-built for Australian ${industry}s.`,
      url: 'https://rapidtal.com/industries/commercial-real-estate',
      type: 'website',
    },
  },

  hero: {
    watermark: 'RapidTAL · Built for Australian Business',
    eyebrow: `For ${industry} Principals & Directors`,
    titleBefore: `Your ${industry} is overpaying for marketing by`,
    titleHighlight: '$150,000–$280,000',
    titleAfter: 'a year',
    subhead:
      'Every local marketing hire comes loaded with super, leave, WorkCover, recruitment fees and HR overhead — before they have written a single listing description. There is a smarter model, and the numbers will shock you.',
    stats: [
      { num: '3×',      label: 'more output than 3 local marketing staff' },
      { num: '$220K',   label: 'average saving for a mid-size agency' },
      { num: '14 days', label: 'from zero to a fully operational Ninja' },
    ],
    ctaLabel: "Calculate my agency's saving",
    ctaScrollTarget: 'calc-sec',
    microCopy: '60 seconds. No sign-up needed.',
  },

  pain: {
    tag: 'The real problem',
    heading: `Sound familiar? This is what ${industry} principals tell us every week.`,
    subhead:
      `You are running a ${industry}. You need consistent listing exposure, a strong Google presence, and social content that positions your agents as the local experts. But building that marketing team locally is quietly destroying your margin.`,
    cards: [
      {
        title: 'You hire a marketing coordinator — and they leave in 18 months',
        body:  'Recruitment fees eat $12,000–$18,000. Onboarding takes 3 months. Then they leave for a bigger agency. You are back to square one — and your listings went dark while you were hiring again.',
        badge: 'Average marketing staff tenure: 18 months',
      },
      {
        title: 'Your "social media person" is doing 6 jobs badly',
        body:  'One local hire cannot run Facebook ads, do SEO, write listing copy, manage your database emails AND create LinkedIn content for 8 agents. They are spread thin — and your campaigns show it.',
        badge: 'Generalists produce generalist results',
      },
      {
        title: 'Super, leave and compliance are eating your margin',
        body:  `An $80,000 salary costs your ${industry} $115,000+ once you add 11.5% super, 4 weeks annual leave, 10 days sick leave, WorkCover and payroll tax. That is 43% on top — mandatory, every year.`,
        badge: 'True cost: 40–45% above the advertised salary',
      },
      {
        title: 'Your principal is managing HR instead of winning mandates',
        body:  'Performance reviews. Contracts. Leave requests. Disputes. Every marketing employee adds hours of management overhead to your week — time that should be spent with vendors, landlords and investors.',
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
        icon: '📈',
        name: 'Facebook & Instagram Ads Manager',
        subtitle: 'Paid social — listing campaigns, investor lead generation, brand awareness',
        costRange: '$115,000–$145,000',
        tasks: [
          'Create and optimise Meta campaigns for commercial listings',
          'Target business owners, investors and tenants by postcode',
          'Design ad creatives for industrial, office and retail stock',
          'Retarget website visitors who viewed your listings',
          'Report on cost-per-lead and qualified enquiries weekly',
          'Manage monthly ad spend across all agents and campaigns',
        ],
        tools: ['Meta Ads Manager', 'Claude AI (ad copy)', 'Canva AI (creatives)', 'AdEspresso', 'Google Analytics 4', 'Looker Studio'],
        saving: 'Save $85,000–$115,000/yr',
      },
      {
        icon: '🔍',
        name: 'SEO & Content Specialist',
        subtitle: 'Google rankings, suburb pages, market reports, blog content',
        costRange: '$105,000–$135,000',
        tasks: [
          'Rank your agency for "commercial property [suburb]" searches',
          'Write and optimise suburb market update pages monthly',
          'Publish landlord and investor-focused blog content',
          'Build Google Business profile authority for your office',
          'Fix technical SEO issues suppressing your listing pages',
          'Track keyword rankings and organic lead attribution',
        ],
        tools: ['Surfer SEO', 'Claude AI (articles)', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console'],
        saving: 'Save $75,000–$105,000/yr',
      },
      {
        icon: '📱',
        name: 'Social Media Manager',
        subtitle: 'LinkedIn, Instagram, Facebook — daily content and community management',
        costRange: '$95,000–$120,000',
        tasks: [
          'Daily posts across LinkedIn, Instagram and Facebook',
          'Agent personal branding — positions them as local experts',
          'Listing graphics, sold and leased announcements',
          'LinkedIn thought leadership for principal and directors',
          'Community engagement and direct message management',
          'Monthly follower growth and reach reporting',
        ],
        tools: ['Buffer / Later', 'Canva AI', 'Claude AI (captions)', 'Metricool', 'Notion AI', 'Repurpose.io'],
        saving: 'Save $65,000–$90,000/yr',
      },
      {
        icon: '✍️',
        name: 'Content & Email Marketing Coordinator',
        subtitle: 'EDMs, listing copy, newsletters, investor database management',
        costRange: '$90,000–$115,000',
        tasks: [
          'Write compelling commercial and industrial listing descriptions',
          'Monthly EDMs to your landlord and investor database',
          'Quarterly precinct market reports for key suburbs',
          'Email nurture sequences for new enquiry follow-up',
          'Agent bios, award submissions and press releases',
          'CRM content and database segmentation management',
        ],
        tools: ['Claude AI', 'ActiveCampaign', 'Jasper AI', 'Grammarly', 'HubSpot CRM', 'Zapier'],
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
        body:  `We look at your current setup: what platforms you are running, what is working, what is leaking leads, and which roles are costing your ${industry} the most with the least return. We build a custom saving model for your agency on the call.`,
        note:  'Output: a personalised cost comparison report for your specific office',
      },
      {
        title: 'We match you with a pre-vetted Offshore Marketing Ninja',
        body:  `From our bench of trained, degree-qualified Filipino marketing professionals — each tested on ${industry} terminology, Australian business culture, platform proficiency and AI tool competency — we match you within 5 business days.`,
        note:  'Every Ninja is tested: ad platforms, SEO tools, copywriting, real estate knowledge and AI proficiency',
      },
      {
        title: 'You receive the complete AI blueprint and standard operating procedure library',
        body:  `The exact tool stack, prompt libraries, workflow SOPs, content calendars and onboarding checklist — built specifically for ${industry}s. Your Offshore Marketing Ninja is producing results from week one, not month three.`,
        note:  'Includes: listing ad templates, SEO playbook, social content calendar, EDM sequences',
      },
      {
        title: 'KPIs locked in from day one — performance tracked weekly',
        body:  'Every engagement starts with agreed, measurable KPIs — leads generated, listings promoted, ad cost-per-enquiry, organic rankings, email open rates. You see real numbers on a live dashboard, not a monthly status email.',
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
        tag: 'CRE',
        title: 'The real estate marketing gap is real',
        body: `Most Australian ${industry}s spend under 3% of gross commission income on marketing — yet principals cite not enough quality leads as their number one growth barrier. The problem is execution capacity, not budget.`,
        big:  '3% of GCI spent',
      },
    ],
  },

  cta: {
    tag: 'Get the AI Marketing Blueprint — free',
    headingLine1: 'Get the complete AI Marketing Blueprint',
    headingLine2Before: `+ matched with your`,
    headingLine2Highlight: 'Offshore Marketing Ninja',
    subhead:
      `Download the same AI tool stack, prompt libraries and SOPs we use to make one Offshore Marketing Ninja replace three local ${industry} marketing hires — and get matched with a pre-vetted Ninja for your office.`,
    microCopy: 'Free. No lock-in. The blueprint is yours to keep either way.',
    listHeading: 'What you get when you book',
    bullets: [
      'The complete AI Marketing Blueprint — every tool, prompt and SOP we use',
      `Full AI tool stack mapped to each ${industry} marketing role with monthly costs`,
      'Role-specific prompt libraries for ads, SEO, social and email',
      'KPI frameworks pre-built for Facebook ads, SEO, social media and EDMs',
      'A shortlist of matched, pre-vetted Offshore Marketing Ninjas ready in 14 days',
    ],
    embedFormId: 'yhi2G6XWNF2CshO37PVD',
    embedFormName: 'Calendar Real Estate',
    embedMinHeight: 737,
    trustItems: [
      'No lock-in contracts',
      `Pre-vetted, ${industry} trained`,
      'KPI-accountable from day one',
      'Blueprint is yours to keep',
    ],
  },
};

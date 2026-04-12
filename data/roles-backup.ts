// Role data for cost comparison pages
export interface RoleData {
  slug: string;
  title: string;
  metaDescription: string;
  heroGhost: string;
  roleTag: string;
  headline: string;
  heroSub: string;
  stats: {
    saving: string;
    savedPerYear: string;
    daysToHire: string;
    fee: string;
  };
  roleDescription: {
    intro: string[];
    tasks: string[];
    tools: string[];
    bottomLine: string;
  };
  costs: {
    auBaseSalary: number;
    phBaseSalary: number;
    auSuper: number;
    auLeave: number;
    auSick: number;
    auRecruitment: number;
    phRecruitment: number;
    tools: number;
    auOffice: number;
    auHR: number;
    auWorkersComp: number;
  };
  skills: string[];
  testimonial: {
    text: string;
    attribution: string;
  };
}

export const ROLES: Record<string, RoleData> = {
  'wordpress-seo-specialist': {
    slug: 'wordpress-seo-specialist',
    title: 'WordPress SEO Specialist',
    metaDescription: 'How much does a WordPress SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings. One fee. 18 days.',
    heroGhost: 'WP',
    roleTag: 'Cost Comparison — WordPress Marketing Roles',
    headline: 'WORDPRESS SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a WordPress SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$58K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A WordPress SEO Specialist is not a general SEO person who happens to have WordPress access. They are someone who understands the platform from the inside out — the way WordPress generates URLs, handles canonical tags, interacts with Google\'s crawler, and either helps or hurts your rankings depending on how it\'s configured.',
        'Most business owners are running WordPress sites with fundamental SEO issues baked in from day one — duplicate content from category pages, bloated page speed from unoptimised themes, missing schema markup, broken internal linking structures, and Yoast or RankMath sitting there with a green dot that means absolutely nothing. A WordPress SEO Specialist finds all of it and fixes it.',
        'Their day typically starts in Google Search Console and GA4 — checking impressions, click-through rates, and any crawl issues that appeared overnight. From there they move into the WordPress backend itself, working through technical fixes that a general SEO wouldn\'t know how to action without a developer.',
        'On the content side, they\'re doing keyword research specific to your niche, writing optimised content briefs, editing and publishing directly inside WordPress, building out topic cluster architecture across your category and tag structure, and internally linking pages in a way that passes authority where it counts.',
        'Off-page, they manage your backlink profile — identifying toxic links, pursuing legitimate link acquisition through digital PR and outreach, and monitoring competitor link gaps with tools like Ahrefs. For local businesses, they also own your Google Business Profile optimisation and local citation consistency.',
        'Every month they deliver a report that connects their work to actual outcomes — organic traffic growth, keyword ranking movements, leads generated through organic search, and a clear priority list for the month ahead. No fluff. No vanity metrics. Just the work and the results.'
      ],
      tasks: [
        'WordPress technical audit — crawl, speed, indexing',
        'Yoast / RankMath configuration and optimisation',
        'Core Web Vitals and page speed improvements',
        'Keyword research and content publishing in WP',
        'Internal linking and category/tag architecture',
        'Schema markup via WP plugins or code',
        'Duplicate content and canonical tag fixes',
        'Backlink prospecting and outreach',
        'Plugin conflict and crawl budget management',
        'Monthly reporting tied to traffic and leads'
      ],
      tools: ['Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console', 'GA4', 'Surfer SEO', 'Sitebulb', 'WordPress', 'Looker Studio', 'Notion'],
      bottomLine: 'A great WordPress SEO Specialist doesn\'t just maintain your rankings — they build a long-term organic asset. Every page they optimise, every link they earn, every piece of content they publish inside your WordPress site compounds over time. Unlike paid ads, it doesn\'t stop working when you stop paying.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1700,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'WordPress Technical SEO',
      'Yoast & RankMath Setup',
      'Core Web Vitals Optimisation',
      'Keyword Research & Strategy',
      'On-Page Content Optimisation',
      'WooCommerce SEO',
      'Backlink Building & Outreach',
      'Google Search Console & GA4',
      'Ahrefs / SEMrush / Moz',
      'Schema & Structured Data',
      'Plugin Conflict Resolution',
      'Local SEO & Google Business',
      'Duplicate Content & Canonicals',
      'XML Sitemap Management',
      'Screaming Frog / Sitebulb',
      'Monthly SEO Reporting',
      'Topic Cluster Architecture',
      'Crawl Budget Management'
    ],
    testimonial: {
      text: 'The WordPress SEO specialist we hired through Rapid Tal outperformed our previous local agency within 60 days. Same budget. Three times the output. She\'s been with us 14 months.',
      attribution: '— Australian e-commerce founder, Melbourne'
    }
  }
};

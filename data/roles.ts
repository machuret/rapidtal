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
  category: string;
  categorySlug: string;
  relatedRoles: string[];
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
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["shopify-seo-specialist","technical-seo-specialist","woocommerce-seo-specialist"]
  }
,

  'shopify-seo-specialist': {
    slug: 'shopify-seo-specialist',
    title: 'Shopify SEO Specialist',
    metaDescription: 'How much does a Shopify SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 71% average savings for e-commerce stores.',
    heroGhost: 'SH',
    roleTag: 'Cost Comparison — E-commerce SEO Roles',
    headline: 'SHOPIFY SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Shopify SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '71%',
      savedPerYear: '$57K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Shopify SEO Specialist is not a general SEO person who happens to know Shopify exists. They understand the platform\'s architecture from the ground up — how Shopify generates product URLs, handles collections, manages duplicate content across variants, and either amplifies or destroys your organic visibility depending on how it\'s configured.',
        'Most Shopify store owners are running sites with fundamental SEO problems baked into the theme — bloated JavaScript that delays page rendering, missing alt text on product images, collection pages that cannibalise each other, broken breadcrumb schema, and apps that inject code that tanks Core Web Vitals. A Shopify SEO Specialist finds all of it and fixes it.',
        'Their day starts in Google Search Console and GA4 — checking product page impressions, collection page click-through rates, and any crawl errors that appeared overnight. From there they move into the Shopify admin, working through technical fixes that require Liquid code edits, theme adjustments, or app replacements.',
        'On the content side, they\'re optimising product descriptions with target keywords, writing SEO-driven blog content that supports commercial pages, building out collection page copy that ranks, and structuring your site architecture so category pages pass authority to your best-selling products.',
        'Off-page, they manage your backlink profile — pursuing links from industry blogs, digital PR for product launches, and monitoring competitor link gaps. For local Shopify stores, they also handle Google Business Profile optimisation and local citation management.',
        'Every month they deliver a report that connects their work to revenue — organic traffic growth by product category, keyword ranking improvements, conversion rate by landing page, and a clear roadmap for the next 30 days. No fluff. Just the work and the sales it drives.'
      ],
      tasks: [
        'Shopify technical SEO audit — crawl, speed, indexing',
        'Product page optimisation and schema markup',
        'Collection page SEO and internal linking',
        'Core Web Vitals and page speed improvements',
        'Liquid code edits for SEO enhancements',
        'Keyword research for products and collections',
        'Blog content strategy and publishing',
        'App audit and performance optimisation',
        'Backlink prospecting and outreach',
        'Monthly reporting tied to traffic and revenue'
      ],
      tools: ['Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console', 'GA4', 'Shopify', 'PageSpeed Insights', 'Looker Studio', 'Notion', 'Judge.me'],
      bottomLine: 'A great Shopify SEO Specialist doesn\'t just drive traffic — they drive profitable traffic. Every product page they optimise, every collection they structure, every piece of content they publish compounds over time. Unlike paid ads, it doesn\'t stop working when you stop paying.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Shopify Technical SEO',
      'Product Page Optimisation',
      'Collection Page Strategy',
      'Core Web Vitals Optimisation',
      'Liquid Code Editing',
      'Keyword Research & Strategy',
      'E-commerce Content Writing',
      'Shopify App SEO Audit',
      'Backlink Building & Outreach',
      'Google Search Console & GA4',
      'Ahrefs / SEMrush',
      'Schema & Structured Data',
      'Shopify Theme Optimisation',
      'Conversion Rate Optimisation',
      'Screaming Frog / Sitebulb',
      'Monthly SEO Reporting',
      'Site Architecture Planning',
      'Duplicate Content Management'
    ],
    testimonial: {
      text: 'Our Shopify SEO specialist from Rapid Tal increased our organic revenue by 180% in 6 months. She knows the platform inside out and works faster than our previous agency ever did.',
      attribution: '— Australian e-commerce founder, Sydney'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["wordpress-seo-specialist","ecommerce-seo-specialist","woocommerce-seo-specialist"]
  },

  'link-building-specialist': {
    slug: 'link-building-specialist',
    title: 'Link Building Specialist',
    metaDescription: 'How much does a Link Building Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for off-page SEO.',
    heroGhost: 'LB',
    roleTag: 'Cost Comparison — Off-Page SEO Roles',
    headline: 'LINK BUILDING\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Link Building Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$59K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Link Building Specialist is not someone who buys links from Fiverr or spams blog comment sections. They are a strategic outreach professional who earns high-quality backlinks from authoritative websites through relationship building, content placement, and digital PR — the kind of links that actually move your rankings.',
        'Most businesses are either ignoring link building entirely or doing it in a way that wastes money and risks penalties. A Link Building Specialist builds a sustainable backlink profile that compounds over time and protects your site from algorithm updates.',
        'Their day starts with prospecting — identifying relevant websites in your industry that have strong domain authority, active audiences, and editorial standards. They analyse competitor backlink profiles to find link gaps, reverse-engineer successful campaigns, and build target lists of sites worth pursuing.',
        'From there they move into outreach — crafting personalised emails that offer genuine value, pitching guest post ideas that editors actually want, negotiating placements, and following up without being annoying. They track every conversation, every placement, and every link earned in a CRM or spreadsheet.',
        'On the content side, they either write the guest posts themselves or brief your content team with exactly what\'s needed. They ensure every piece includes natural anchor text, contextual relevance, and a link that passes authority to the right page on your site.',
        'Every month they deliver a report that shows exactly what they built — new backlinks acquired, referring domains added, domain authority growth, and the ranking impact of their work. No fluff. Just links that move the needle.'
      ],
      tasks: [
        'Backlink prospecting and competitor analysis',
        'Outreach email copywriting and follow-up',
        'Guest post pitching and placement',
        'Digital PR and journalist outreach',
        'Broken link building and reclamation',
        'Resource page link acquisition',
        'HARO and journalist query responses',
        'Link quality audit and disavow management',
        'Anchor text strategy and diversification',
        'Monthly link building reporting'
      ],
      tools: ['Ahrefs', 'SEMrush', 'Moz', 'Hunter.io', 'Pitchbox', 'BuzzStream', 'Google Sheets', 'HARO', 'Respona', 'Looker Studio'],
      bottomLine: 'A great Link Building Specialist doesn\'t just get you links — they get you the right links. Every authoritative backlink they earn increases your site\'s trust, improves your rankings, and drives referral traffic that converts. Unlike paid ads, these links keep working forever.'
    },
    costs: {
      auBaseSalary: 6000,
      phBaseSalary: 1600,
      auSuper: 690,
      auLeave: 519,
      auSick: 277,
      auRecruitment: 1083,
      phRecruitment: 333,
      tools: 300,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 90
    },
    skills: [
      'Backlink Prospecting',
      'Outreach Email Copywriting',
      'Guest Post Pitching',
      'Digital PR Strategy',
      'Competitor Link Analysis',
      'Broken Link Building',
      'Resource Page Outreach',
      'HARO & Journalist Outreach',
      'Link Quality Audit',
      'Anchor Text Strategy',
      'Relationship Management',
      'Ahrefs / SEMrush / Moz',
      'CRM & Outreach Tools',
      'Content Briefing',
      'Disavow File Management',
      'Monthly Link Reporting',
      'Domain Authority Analysis',
      'Link Reclamation'
    ],
    testimonial: {
      text: 'Our link building specialist from Rapid Tal secured 47 high-quality backlinks in 90 days — more than our previous agency delivered in a year. Our rankings jumped across the board.',
      attribution: '— Australian SaaS founder, Brisbane'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["technical-seo-specialist","on-page-seo-specialist","seo-content-writer"]
  },

  'technical-seo-specialist': {
    slug: 'technical-seo-specialist',
    title: 'Technical SEO Specialist',
    metaDescription: 'How much does a Technical SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 70% average savings for enterprise-level SEO.',
    heroGhost: 'TS',
    roleTag: 'Cost Comparison — Technical SEO Roles',
    headline: 'TECHNICAL SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Technical SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '70%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Technical SEO Specialist is not someone who runs a site audit and hands you a list of broken links. They are a deeply technical professional who understands how search engines crawl, render, and index websites — and how to architect a site so Google can find, understand, and rank every page that matters.',
        'Most websites are bleeding organic traffic due to technical issues that never get fixed — crawl budget waste, JavaScript rendering problems, duplicate content at scale, broken canonicals, orphaned pages, and Core Web Vitals failures. A Technical SEO Specialist finds all of it and fixes it at the root.',
        'Their day starts in Google Search Console and log file analysis — identifying crawl errors, indexing issues, and pages that Google is visiting but not ranking. From there they move into tools like Screaming Frog, Sitebulb, and Ahrefs to map site architecture, identify technical debt, and prioritise fixes.',
        'On the implementation side, they work directly with developers to fix canonical tags, implement structured data, optimise page speed, manage redirects, and ensure the site is crawlable and indexable. They don\'t just identify problems — they write the tickets, review the code, and verify the fixes.',
        'For large sites, they manage crawl budget by blocking low-value pages, optimising internal linking to push authority where it counts, and ensuring faceted navigation doesn\'t create infinite crawl traps. For international sites, they implement hreflang correctly so the right content ranks in the right country.',
        'Every month they deliver a report that shows the impact of their work — indexation improvements, Core Web Vitals scores, crawl efficiency gains, and the ranking lift from technical fixes. No fluff. Just the infrastructure that makes SEO possible.'
      ],
      tasks: [
        'Technical SEO audit — crawl, render, index',
        'Core Web Vitals optimisation (LCP, CLS, FID)',
        'JavaScript rendering and SEO fixes',
        'Structured data implementation (schema)',
        'Canonical tag and duplicate content fixes',
        'XML sitemap and robots.txt optimisation',
        'Log file analysis and crawl budget management',
        'Redirect strategy and implementation',
        'Hreflang setup for international sites',
        'Monthly technical SEO reporting'
      ],
      tools: ['Screaming Frog', 'Sitebulb', 'Ahrefs', 'Google Search Console', 'PageSpeed Insights', 'GTmetrix', 'Cloudflare', 'Log File Analyser', 'Looker Studio', 'GitHub'],
      bottomLine: 'A great Technical SEO Specialist doesn\'t just fix your site — they build the foundation that makes all other SEO work possible. Every technical improvement they make unlocks more traffic, better rankings, and higher conversion rates. It\'s the difference between a site that ranks and a site that doesn\'t.'
    },
    costs: {
      auBaseSalary: 7000,
      phBaseSalary: 2000,
      auSuper: 805,
      auLeave: 606,
      auSick: 323,
      auRecruitment: 1250,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 105
    },
    skills: [
      'Technical SEO Auditing',
      'Core Web Vitals Optimisation',
      'JavaScript SEO',
      'Structured Data (Schema)',
      'Canonical Tag Management',
      'XML Sitemap Optimisation',
      'Robots.txt Configuration',
      'Log File Analysis',
      'Crawl Budget Management',
      'Redirect Strategy',
      'Hreflang Implementation',
      'Page Speed Optimisation',
      'Screaming Frog / Sitebulb',
      'Google Search Console',
      'Ahrefs / SEMrush',
      'Developer Collaboration',
      'Site Architecture Planning',
      'Indexation Management'
    ],
    testimonial: {
      text: 'Our technical SEO specialist from Rapid Tal fixed indexation issues that had plagued us for 2 years. Within 90 days, we had 40% more pages ranking and traffic was up 65%. Worth every dollar.',
      attribution: '— Australian enterprise marketing director, Melbourne'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["wordpress-seo-specialist","link-building-specialist","on-page-seo-specialist"]
  }
,

  'local-seo-specialist': {
    slug: 'local-seo-specialist',
    title: 'Local SEO Specialist',
    metaDescription: 'How much does a Local SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for multi-location businesses.',
    heroGhost: 'LS',
    roleTag: 'Cost Comparison — Local SEO Roles',
    headline: 'LOCAL SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Local SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$58K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Local SEO Specialist is not someone who claims your Google Business Profile and calls it a day. They are a strategic operator who understands how local search works — how Google ranks businesses in the local pack, how citations impact visibility, and how to dominate local search results for high-intent queries.',
        'Most local businesses are invisible in Google Maps and local search because they\'re doing the basics wrong — inconsistent NAP data across directories, unclaimed citations, no review strategy, poor Google Business Profile optimisation, and zero local content. A Local SEO Specialist fixes all of it.',
        'Their day starts in Google Business Profile and Google Search Console — checking local search impressions, map views, direction requests, and any new reviews that need responses. From there they move into citation management, ensuring your business information is consistent across 50+ directories.',
        'On the content side, they\'re creating location-specific landing pages, optimising service area pages, writing locally-focused blog content, and building out FAQ schema that targets "near me" searches. Every piece of content is designed to rank for local intent.',
        'Off-page, they manage your review acquisition strategy — setting up automated review requests, responding to every review (positive and negative), and using reviews as social proof across your website. They also build local backlinks from chambers of commerce, local news sites, and industry directories.',
        'Every month they deliver a report that shows local visibility growth — local pack rankings, Google Business Profile insights, citation consistency, review velocity, and leads generated from local search. No fluff. Just local dominance.'
      ],
      tasks: [
        'Google Business Profile optimisation',
        'Citation building and NAP consistency',
        'Local keyword research and strategy',
        'Location-specific landing page creation',
        'Review acquisition and response management',
        'Local backlink building',
        'Local schema markup implementation',
        'Google Maps optimisation',
        'Multi-location SEO management',
        'Monthly local SEO reporting'
      ],
      tools: ['BrightLocal', 'Moz Local', 'Whitespark', 'Google Business Profile', 'Google Search Console', 'GA4', 'Ahrefs', 'Semrush', 'Looker Studio', 'Podium'],
      bottomLine: 'A great Local SEO Specialist doesn\'t just get you found — they get you found by people ready to buy. Every local ranking they improve, every review they earn, every citation they build drives more foot traffic, phone calls, and local sales. It\'s the highest-ROI marketing channel for local businesses.'
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
      'Google Business Profile Optimisation',
      'Citation Building & Management',
      'NAP Consistency Auditing',
      'Local Keyword Research',
      'Location Landing Pages',
      'Review Management Strategy',
      'Local Backlink Building',
      'Local Schema Markup',
      'Google Maps Optimisation',
      'Multi-Location SEO',
      'BrightLocal / Moz Local',
      'Local Pack Ranking',
      'Service Area Page Optimisation',
      'Local Content Strategy',
      'Directory Management',
      'Reputation Management',
      'Local Competitor Analysis',
      'Monthly Local Reporting'
    ],
    testimonial: {
      text: 'Our local SEO specialist from Rapid Tal got us ranking in the top 3 of the local pack for 12 high-value keywords in 4 months. Phone calls tripled. Best hire we\'ve made.',
      attribution: '— Australian trades business owner, Perth'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["wordpress-seo-specialist","seo-content-writer","on-page-seo-specialist"]
  },

  'ecommerce-seo-specialist': {
    slug: 'ecommerce-seo-specialist',
    title: 'E-commerce SEO Specialist',
    metaDescription: 'How much does an E-commerce SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 71% average savings for online stores.',
    heroGhost: 'EC',
    roleTag: 'Cost Comparison — E-commerce SEO Roles',
    headline: 'E-COMMERCE SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an E-commerce SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '71%',
      savedPerYear: '$57K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An E-commerce SEO Specialist is not a general SEO person who happens to work on a store. They understand the unique challenges of ranking product pages, category pages, and collection pages at scale — how to handle faceted navigation, manage duplicate content across variants, and structure a site so your best-selling products rank first.',
        'Most e-commerce stores are losing sales to competitors because their SEO is broken — thin product descriptions, missing schema markup, poor internal linking, slow page speed, and category pages that don\'t rank. An E-commerce SEO Specialist fixes all of it and drives profitable organic traffic.',
        'Their day starts in Google Search Console and GA4 — checking product page impressions, category page click-through rates, and any crawl issues that appeared overnight. From there they move into the platform (Shopify, WooCommerce, Magento) to optimise product pages, collections, and site architecture.',
        'On the content side, they\'re writing SEO-optimised product descriptions, building out category page copy that ranks, creating buying guides and comparison content, and structuring your site so every product has a clear path from the homepage. They also implement product schema so your listings show up with rich snippets in search.',
        'Off-page, they manage your backlink profile — pursuing links from industry blogs, digital PR for product launches, and monitoring competitor link gaps. They also optimise for conversion by ensuring every landing page is designed to turn traffic into sales.',
        'Every month they deliver a report that connects their work to revenue — organic traffic by product category, keyword rankings, conversion rate by landing page, and total organic revenue. No fluff. Just the work and the sales it drives.'
      ],
      tasks: [
        'Product page SEO optimisation',
        'Category and collection page strategy',
        'Faceted navigation and duplicate content management',
        'Product schema markup implementation',
        'E-commerce keyword research',
        'Buying guide and comparison content creation',
        'Internal linking and site architecture',
        'Core Web Vitals and page speed optimisation',
        'Backlink building for e-commerce',
        'Monthly reporting tied to revenue'
      ],
      tools: ['Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console', 'GA4', 'Shopify/WooCommerce', 'PageSpeed Insights', 'Looker Studio', 'Hotjar', 'Notion'],
      bottomLine: 'A great E-commerce SEO Specialist doesn\'t just drive traffic — they drive sales. Every product page they optimise, every category they structure, every piece of content they publish compounds over time. Unlike paid ads, it doesn\'t stop working when you stop paying.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Product Page Optimisation',
      'Category Page SEO',
      'Faceted Navigation Management',
      'Product Schema Markup',
      'E-commerce Keyword Research',
      'Buying Guide Content',
      'Site Architecture Planning',
      'Core Web Vitals Optimisation',
      'Shopify & WooCommerce SEO',
      'Internal Linking Strategy',
      'Duplicate Content Management',
      'Conversion Rate Optimisation',
      'Backlink Building',
      'Google Search Console & GA4',
      'Ahrefs / SEMrush',
      'Monthly Revenue Reporting',
      'Competitor Analysis',
      'Technical E-commerce SEO'
    ],
    testimonial: {
      text: 'Our e-commerce SEO specialist from Rapid Tal increased our organic revenue by 210% in 8 months. She understands online stores inside out and delivers results every single month.',
      attribution: '— Australian online retailer, Brisbane'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["shopify-seo-specialist","woocommerce-seo-specialist","seo-content-writer"]
  },

  'seo-content-writer': {
    slug: 'seo-content-writer',
    title: 'SEO Content Writer',
    metaDescription: 'How much does an SEO Content Writer cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for content production.',
    heroGhost: 'CW',
    roleTag: 'Cost Comparison — SEO Content Roles',
    headline: 'SEO CONTENT\nWRITER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an SEO Content Writer in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An SEO Content Writer is not someone who stuffs keywords into generic blog posts. They are a strategic writer who understands search intent, keyword targeting, and how to create content that ranks on page one and converts readers into customers.',
        'Most businesses are publishing content that gets zero traffic because it\'s not optimised for search — no keyword research, poor structure, weak headlines, missing internal links, and no clear conversion path. An SEO Content Writer creates content that ranks, drives traffic, and generates leads.',
        'Their day starts with keyword research — identifying high-value topics with search volume, low competition, and clear commercial intent. From there they analyse the top-ranking pages to understand what Google wants, then create content that\'s better, more comprehensive, and more useful.',
        'On the writing side, they craft compelling headlines, structure content with proper H2/H3 hierarchy, naturally integrate target keywords, add internal links to relevant pages, and include clear CTAs that drive conversions. Every piece is optimised for both search engines and human readers.',
        'They also handle content publishing — uploading to WordPress or your CMS, adding meta titles and descriptions, optimising images with alt text, and ensuring every technical SEO element is in place. They don\'t just write — they publish ready-to-rank content.',
        'Every month they deliver a report that shows content performance — traffic by article, keyword rankings, conversion rate, and a content calendar for the next 30 days. No fluff. Just content that drives measurable results.'
      ],
      tasks: [
        'SEO keyword research and topic ideation',
        'Long-form blog post and article writing',
        'Product and service page copywriting',
        'Meta title and description optimisation',
        'Content structure and H2/H3 hierarchy',
        'Internal linking strategy',
        'Image optimisation and alt text',
        'Content publishing in WordPress/CMS',
        'Competitor content analysis',
        'Monthly content performance reporting'
      ],
      tools: ['Ahrefs', 'SEMrush', 'Surfer SEO', 'Clearscope', 'Grammarly', 'Hemingway', 'WordPress', 'Google Docs', 'Notion', 'Looker Studio'],
      bottomLine: 'A great SEO Content Writer doesn\'t just fill your blog — they build an organic traffic engine. Every piece of content they publish ranks, drives traffic, and generates leads. Unlike paid ads, this content keeps working for years.'
    },
    costs: {
      auBaseSalary: 5750,
      phBaseSalary: 1500,
      auSuper: 661,
      auLeave: 498,
      auSick: 265,
      auRecruitment: 1042,
      phRecruitment: 333,
      tools: 300,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 86
    },
    skills: [
      'SEO Keyword Research',
      'Long-Form Content Writing',
      'Search Intent Analysis',
      'On-Page SEO Optimisation',
      'Meta Title & Description Writing',
      'Content Structure & Hierarchy',
      'Internal Linking Strategy',
      'WordPress Content Publishing',
      'Copywriting for Conversions',
      'Competitor Content Analysis',
      'Ahrefs / SEMrush',
      'Surfer SEO / Clearscope',
      'Image Optimisation',
      'Content Calendar Planning',
      'Proofreading & Editing',
      'CTA Optimisation',
      'Topic Cluster Strategy',
      'Monthly Content Reporting'
    ],
    testimonial: {
      text: 'Our SEO content writer from Rapid Tal publishes 12 high-quality articles per month that actually rank. Traffic is up 140% and we\'re generating 30+ leads per month from organic search.',
      attribution: '— Australian B2B founder, Sydney'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["on-page-seo-specialist","local-seo-specialist","wordpress-seo-specialist"]
  }
,

  'on-page-seo-specialist': {
    slug: 'on-page-seo-specialist',
    title: 'On-Page SEO Specialist',
    metaDescription: 'How much does an On-Page SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for SEO execution.',
    heroGhost: 'OP',
    roleTag: 'Cost Comparison — On-Page SEO Roles',
    headline: 'ON-PAGE SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an On-Page SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$59K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An On-Page SEO Specialist is not someone who changes a few meta descriptions and calls it done. They are a systematic operator who optimises every element on every page that impacts rankings — title tags, headings, content structure, internal links, keyword placement, and user experience signals.',
        'Most websites are underperforming in search because their on-page SEO is broken — generic title tags, missing H1s, poor keyword targeting, weak internal linking, and content that doesn\'t match search intent. An On-Page SEO Specialist fixes all of it, page by page.',
        'Their day starts with keyword mapping — assigning target keywords to every page on your site, ensuring no keyword cannibalisation, and building a clear hierarchy of primary and secondary keywords. From there they move into optimisation — rewriting title tags, meta descriptions, and H1s to match search intent and drive clicks.',
        'On the content side, they optimise existing pages by improving keyword density, adding semantic keywords, restructuring content with proper heading hierarchy, and ensuring every page has a clear conversion path. They also identify content gaps and brief new pages to fill them.',
        'For internal linking, they build a strategic link structure that passes authority from high-authority pages to your most important commercial pages. They also optimise images with descriptive alt text, compress files for faster loading, and ensure every page is mobile-friendly.',
        'Every month they deliver a report that shows on-page improvements — pages optimised, keyword rankings, click-through rate improvements, and traffic growth. No fluff. Just systematic execution that drives results.'
      ],
      tasks: [
        'Keyword mapping and assignment',
        'Title tag and meta description optimisation',
        'H1 and heading structure optimisation',
        'Content optimisation for target keywords',
        'Internal linking strategy and implementation',
        'Image optimisation and alt text',
        'URL structure and slug optimisation',
        'Content gap analysis',
        'User experience and engagement optimisation',
        'Monthly on-page SEO reporting'
      ],
      tools: ['Ahrefs', 'SEMrush', 'Surfer SEO', 'Screaming Frog', 'Google Search Console', 'GA4', 'Clearscope', 'WordPress', 'Looker Studio', 'Notion'],
      bottomLine: 'A great On-Page SEO Specialist doesn\'t just optimise pages — they systematically improve every element that impacts rankings. Every page they touch ranks better, drives more traffic, and converts at a higher rate. It\'s the foundation of every successful SEO campaign.'
    },
    costs: {
      auBaseSalary: 6000,
      phBaseSalary: 1600,
      auSuper: 690,
      auLeave: 519,
      auSick: 277,
      auRecruitment: 1083,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 90
    },
    skills: [
      'Keyword Mapping & Assignment',
      'Title Tag Optimisation',
      'Meta Description Writing',
      'Heading Structure (H1-H6)',
      'Content Optimisation',
      'Keyword Density Analysis',
      'Internal Linking Strategy',
      'Image Optimisation & Alt Text',
      'URL Structure Optimisation',
      'Content Gap Analysis',
      'Search Intent Matching',
      'Ahrefs / SEMrush',
      'Surfer SEO / Clearscope',
      'Screaming Frog',
      'Google Search Console & GA4',
      'CTR Optimisation',
      'User Experience Optimisation',
      'Monthly On-Page Reporting'
    ],
    testimonial: {
      text: 'Our on-page SEO specialist from Rapid Tal optimised 200+ pages in 6 months. Rankings improved across the board and organic traffic doubled. She\'s methodical, fast, and knows exactly what works.',
      attribution: '— Australian SaaS founder, Melbourne'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["technical-seo-specialist","seo-content-writer","link-building-specialist"]
  },

  'youtube-seo-specialist': {
    slug: 'youtube-seo-specialist',
    title: 'YouTube SEO Specialist',
    metaDescription: 'How much does a YouTube SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for video SEO.',
    heroGhost: 'YT',
    roleTag: 'Cost Comparison — Video SEO Roles',
    headline: 'YOUTUBE SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a YouTube SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$58K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A YouTube SEO Specialist is not someone who adds a few keywords to your video titles. They understand how YouTube\'s algorithm works — how videos get recommended, how search rankings are determined, and how to optimise every element of your channel to maximise views, watch time, and subscriber growth.',
        'Most YouTube channels are getting a fraction of the views they should because their SEO is broken — poor keyword targeting, weak thumbnails, generic titles, missing descriptions, no playlist strategy, and zero understanding of how the algorithm works. A YouTube SEO Specialist fixes all of it.',
        'Their day starts with keyword research — identifying high-volume, low-competition keywords that your target audience is searching for. From there they analyse top-performing videos in your niche to understand what titles, thumbnails, and content formats are working.',
        'On the optimisation side, they write click-worthy titles that include target keywords, craft compelling descriptions with timestamps and links, add relevant tags, create custom thumbnails that drive clicks, and structure your channel with playlists that increase watch time.',
        'They also optimise video transcripts for SEO, add closed captions, implement end screens and cards to drive more views, and analyse YouTube Analytics to understand what\'s working and what\'s not. Every video is optimised to rank in both YouTube search and Google search.',
        'Every month they deliver a report that shows channel growth — views, watch time, subscriber growth, top-performing videos, and a content strategy for the next 30 days. No fluff. Just systematic optimisation that grows your channel.'
      ],
      tasks: [
        'YouTube keyword research and strategy',
        'Video title and description optimisation',
        'Custom thumbnail design and A/B testing',
        'Tag optimisation and categorisation',
        'Playlist creation and optimisation',
        'Video transcript and closed caption optimisation',
        'End screen and card implementation',
        'Channel architecture and organisation',
        'YouTube Analytics analysis',
        'Monthly channel growth reporting'
      ],
      tools: ['TubeBuddy', 'VidIQ', 'YouTube Studio', 'Canva', 'Ahrefs', 'Google Trends', 'YouTube Analytics', 'Notion', 'Looker Studio', 'Rev.com'],
      bottomLine: 'A great YouTube SEO Specialist doesn\'t just optimise videos — they build a channel that grows on autopilot. Every video they optimise gets more views, every playlist they create increases watch time, and every thumbnail they design drives more clicks. It\'s the difference between a channel that stagnates and one that scales.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1700,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 300,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'YouTube Keyword Research',
      'Video Title Optimisation',
      'Description & Tag Optimisation',
      'Thumbnail Design & Testing',
      'Playlist Strategy',
      'Video Transcript Optimisation',
      'Closed Caption Management',
      'End Screen & Card Setup',
      'Channel Architecture',
      'YouTube Analytics',
      'TubeBuddy / VidIQ',
      'Content Strategy Planning',
      'Competitor Channel Analysis',
      'Watch Time Optimisation',
      'CTR Improvement',
      'Subscriber Growth Strategy',
      'Video SEO for Google',
      'Monthly Growth Reporting'
    ],
    testimonial: {
      text: 'Our YouTube SEO specialist from Rapid Tal grew our channel from 5K to 50K subscribers in 10 months. Every video she optimises gets 3x more views. She understands the algorithm better than anyone.',
      attribution: '— Australian content creator, Brisbane'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["seo-content-writer","seo-analyst","on-page-seo-specialist"]
  },

  'seo-analyst': {
    slug: 'seo-analyst',
    title: 'SEO Analyst',
    metaDescription: 'How much does an SEO Analyst cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for data-driven SEO.',
    heroGhost: 'SA',
    roleTag: 'Cost Comparison — SEO Analytics Roles',
    headline: 'SEO ANALYST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an SEO Analyst in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An SEO Analyst is not someone who sends you a monthly traffic report with pretty graphs. They are a data-driven professional who turns raw SEO data into actionable insights — identifying what\'s working, what\'s not, and exactly what to do next to drive more traffic and revenue.',
        'Most businesses are flying blind with their SEO because they\'re not tracking the right metrics, not analysing competitor movements, and not connecting SEO work to business outcomes. An SEO Analyst brings clarity, accountability, and a clear roadmap forward.',
        'Their day starts in Google Analytics 4 and Google Search Console — analysing traffic trends, identifying ranking changes, spotting technical issues, and understanding which pages are driving conversions. From there they move into rank tracking tools to monitor keyword movements and competitor performance.',
        'On the analysis side, they build custom dashboards in Looker Studio that show exactly what matters — organic traffic by channel, conversion rate by landing page, keyword rankings over time, and ROI from SEO efforts. Every metric is tied to business outcomes.',
        'They also conduct deep-dive competitor analysis — identifying content gaps, backlink opportunities, and keyword targets that your competitors are ranking for but you\'re not. Every analysis comes with a clear action plan for your SEO team.',
        'Every month they deliver a report that tells the story of your SEO performance — what improved, what declined, why it happened, and what to do next. No fluff. Just data-driven insights that drive better decisions.'
      ],
      tasks: [
        'Google Analytics 4 and Search Console analysis',
        'Keyword ranking tracking and reporting',
        'Competitor SEO analysis',
        'Traffic trend analysis and forecasting',
        'Conversion rate analysis by landing page',
        'Custom dashboard creation in Looker Studio',
        'SEO ROI tracking and reporting',
        'Technical SEO issue identification',
        'Content gap analysis',
        'Monthly executive SEO reporting'
      ],
      tools: ['Google Analytics 4', 'Google Search Console', 'Ahrefs', 'SEMrush', 'Looker Studio', 'Excel/Google Sheets', 'Screaming Frog', 'Sitebulb', 'Notion', 'Slack'],
      bottomLine: 'A great SEO Analyst doesn\'t just report numbers — they turn data into strategy. Every insight they deliver helps you make better decisions, prioritise the right work, and drive measurable business outcomes. It\'s the difference between guessing and knowing what works.'
    },
    costs: {
      auBaseSalary: 5750,
      phBaseSalary: 1500,
      auSuper: 661,
      auLeave: 498,
      auSick: 265,
      auRecruitment: 1042,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 86
    },
    skills: [
      'Google Analytics 4 (GA4)',
      'Google Search Console',
      'Keyword Rank Tracking',
      'Competitor SEO Analysis',
      'Traffic Trend Analysis',
      'Conversion Rate Analysis',
      'Looker Studio Dashboards',
      'Excel / Google Sheets',
      'SEO ROI Tracking',
      'Ahrefs / SEMrush',
      'Data Visualisation',
      'Technical SEO Auditing',
      'Content Gap Analysis',
      'Forecasting & Projections',
      'Executive Reporting',
      'Screaming Frog / Sitebulb',
      'A/B Test Analysis',
      'Performance Benchmarking'
    ],
    testimonial: {
      text: 'Our SEO analyst from Rapid Tal built dashboards that finally show us what\'s working. We can now make data-driven decisions instead of guessing. Traffic is up 85% and we know exactly why.',
      attribution: '— Australian marketing director, Sydney'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["technical-seo-specialist","on-page-seo-specialist","link-building-specialist"]
  },

  'woocommerce-seo-specialist': {
    slug: 'woocommerce-seo-specialist',
    title: 'WooCommerce SEO Specialist',
    metaDescription: 'How much does a WooCommerce SEO Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 71% average savings for WordPress e-commerce.',
    heroGhost: 'WC',
    roleTag: 'Cost Comparison — E-commerce SEO Roles',
    headline: 'WOOCOMMERCE SEO\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a WooCommerce SEO Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '71%',
      savedPerYear: '$57K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A WooCommerce SEO Specialist is not a general WordPress SEO person who happens to know WooCommerce exists. They understand the unique challenges of ranking a WordPress-based online store — how WooCommerce generates product URLs, handles variants, manages duplicate content, and either helps or destroys your organic visibility.',
        'Most WooCommerce stores are bleeding sales to competitors because their SEO is broken — thin product descriptions, missing schema markup, poor category page optimisation, slow page speed from bloated plugins, and duplicate content across product variations. A WooCommerce SEO Specialist fixes all of it.',
        'Their day starts in Google Search Console and GA4 — checking product page impressions, category page click-through rates, and any crawl issues that appeared overnight. From there they move into the WordPress backend, optimising product pages, categories, and WooCommerce-specific SEO settings.',
        'On the content side, they\'re writing SEO-optimised product descriptions, building out category page copy that ranks, creating buying guides and comparison content, and structuring your store so every product has a clear path from the homepage. They also implement WooCommerce product schema so your listings show up with rich snippets.',
        'Off-page, they manage your backlink profile — pursuing links from industry blogs, digital PR for product launches, and monitoring competitor link gaps. They also optimise for conversion by ensuring every landing page is designed to turn traffic into sales.',
        'Every month they deliver a report that connects their work to revenue — organic traffic by product category, keyword rankings, conversion rate by landing page, and total organic revenue. No fluff. Just the work and the sales it drives.'
      ],
      tasks: [
        'WooCommerce technical SEO audit',
        'Product page optimisation and schema',
        'Category and tag page SEO strategy',
        'Yoast WooCommerce SEO configuration',
        'Core Web Vitals and page speed optimisation',
        'Product variation and duplicate content management',
        'Internal linking and site architecture',
        'WooCommerce plugin SEO audit',
        'Backlink building for e-commerce',
        'Monthly reporting tied to revenue'
      ],
      tools: ['Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console', 'GA4', 'WooCommerce', 'Yoast SEO', 'PageSpeed Insights', 'Looker Studio', 'Notion'],
      bottomLine: 'A great WooCommerce SEO Specialist doesn\'t just drive traffic — they drive profitable sales. Every product page they optimise, every category they structure, every piece of content they publish compounds over time. Unlike paid ads, it doesn\'t stop working when you stop paying.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'WooCommerce Technical SEO',
      'Product Page Optimisation',
      'Category Page Strategy',
      'Yoast WooCommerce SEO',
      'Core Web Vitals Optimisation',
      'Product Schema Markup',
      'Duplicate Content Management',
      'WordPress & WooCommerce',
      'Internal Linking Strategy',
      'Plugin SEO Audit',
      'Backlink Building',
      'Google Search Console & GA4',
      'Ahrefs / SEMrush',
      'E-commerce Keyword Research',
      'Conversion Rate Optimisation',
      'Monthly Revenue Reporting',
      'Site Architecture Planning',
      'Page Speed Optimisation'
    ],
    testimonial: {
      text: 'Our WooCommerce SEO specialist from Rapid Tal increased our organic revenue by 195% in 7 months. She knows WordPress and WooCommerce inside out and delivers results every month.',
      attribution: '— Australian online store owner, Perth'
    },
    category: 'SEO Specialists',
    categorySlug: 'seo-specialists',
    relatedRoles: ["wordpress-seo-specialist","shopify-seo-specialist","ecommerce-seo-specialist"]
  }
,

  'google-ads-specialist': {
    slug: 'google-ads-specialist',
    title: 'Google Ads Specialist',
    metaDescription: 'How much does a Google Ads Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for paid search campaigns.',
    heroGhost: 'GA',
    roleTag: 'Cost Comparison — Paid Advertising Roles',
    headline: 'GOOGLE ADS\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Google Ads Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$59K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Google Ads Specialist is not someone who sets up a campaign and lets it run on autopilot. They are a data-driven performance marketer who builds, optimizes, and scales profitable Google Ads campaigns across Search, Display, Shopping, and YouTube — turning ad spend into measurable revenue.',
        'Most businesses are wasting thousands on Google Ads because their campaigns are poorly structured — broad match keywords bleeding budget, no negative keyword lists, generic ad copy, broken conversion tracking, and zero understanding of Quality Score. A Google Ads Specialist fixes all of it and makes every dollar work harder.',
        'Their day starts in Google Ads and Google Analytics — checking campaign performance, identifying budget waste, analyzing search term reports, and adjusting bids based on what\'s actually converting. From there they move into optimization — writing new ad copy, testing landing pages, refining audience targeting, and scaling what works.',
        'On the strategy side, they\'re building campaign structures that separate brand from non-brand, high-intent from research queries, and product categories from each other. They implement conversion tracking properly, set up remarketing audiences, and ensure attribution is accurate so you know exactly what\'s driving sales.',
        'They also manage budgets ruthlessly — pausing underperforming campaigns, shifting spend to winners, testing new ad formats, and ensuring your cost per acquisition stays profitable. Every decision is backed by data, not guesswork.',
        'Every month they deliver a report that shows exactly where your money went and what it generated — impressions, clicks, conversions, cost per conversion, ROAS, and a clear plan for the next 30 days. No fluff. Just performance that drives revenue.'
      ],
      tasks: [
        'Google Ads campaign setup and structure',
        'Keyword research and match type strategy',
        'Ad copywriting and A/B testing',
        'Bid management and budget optimization',
        'Conversion tracking and attribution setup',
        'Search term report analysis and negative keywords',
        'Quality Score optimization',
        'Remarketing campaign management',
        'Landing page optimization recommendations',
        'Monthly performance reporting and ROAS analysis'
      ],
      tools: ['Google Ads', 'Google Analytics 4', 'Google Tag Manager', 'Google Merchant Center', 'SEMrush', 'SpyFu', 'Optmyzr', 'Looker Studio', 'Excel/Google Sheets', 'Slack'],
      bottomLine: 'A great Google Ads Specialist doesn\'t just spend your budget — they multiply it. Every campaign they optimize, every keyword they refine, every ad they test drives more conversions at a lower cost. Unlike SEO, results are immediate and measurable.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Google Ads Campaign Management',
      'Search Campaign Optimization',
      'Display Campaign Strategy',
      'Shopping Campaign Setup',
      'Keyword Research & Strategy',
      'Ad Copywriting & Testing',
      'Bid Strategy & Budget Management',
      'Conversion Tracking Setup',
      'Quality Score Optimization',
      'Remarketing & Retargeting',
      'Google Analytics 4',
      'Google Tag Manager',
      'Landing Page Optimization',
      'A/B Testing & Experimentation',
      'ROAS & CPA Analysis',
      'Negative Keyword Management',
      'Audience Segmentation',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our Google Ads specialist from Rapid Tal cut our cost per acquisition by 58% in 90 days while doubling our conversion volume. She knows the platform inside out and delivers results every week.',
      attribution: '— Australian e-commerce founder, Sydney'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["ppc-manager","google-shopping-specialist","retargeting-specialist"]
  },

  'facebook-ads-specialist': {
    slug: 'facebook-ads-specialist',
    title: 'Facebook Ads Specialist',
    metaDescription: 'How much does a Facebook Ads Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for Meta advertising.',
    heroGhost: 'FB',
    roleTag: 'Cost Comparison — Paid Social Roles',
    headline: 'FACEBOOK ADS\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Facebook Ads Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Facebook Ads Specialist is not someone who boosts posts and hopes for the best. They are a performance marketer who builds profitable Meta advertising campaigns across Facebook and Instagram — mastering audience targeting, creative testing, and conversion optimization to drive measurable business results.',
        'Most businesses are burning money on Facebook Ads because their campaigns are set up wrong — broad audiences that don\'t convert, poor creative that doesn\'t stop the scroll, broken pixel tracking, and zero understanding of the Meta algorithm. A Facebook Ads Specialist fixes all of it and turns ad spend into revenue.',
        'Their day starts in Meta Ads Manager — analyzing campaign performance, checking creative fatigue, reviewing audience insights, and adjusting budgets based on what\'s actually converting. From there they move into creative testing — briefing new ad concepts, writing compelling copy, and launching A/B tests to find winning combinations.',
        'On the strategy side, they\'re building full-funnel campaigns — cold traffic awareness ads, warm traffic consideration campaigns, and hot retargeting sequences that close the sale. They implement the Meta Pixel properly, set up custom audiences, and ensure conversion tracking is accurate so you know exactly what\'s working.',
        'They also manage creative ruthlessly — pausing underperforming ads, scaling winners, testing new formats (video, carousel, stories), and ensuring your cost per result stays profitable. Every decision is backed by data from Meta\'s reporting tools.',
        'Every month they deliver a report that shows exactly where your budget went and what it generated — reach, engagement, link clicks, conversions, cost per conversion, ROAS, and a clear creative roadmap for the next 30 days. No fluff. Just performance.'
      ],
      tasks: [
        'Meta Ads Manager campaign setup and structure',
        'Audience research and custom audience creation',
        'Ad creative strategy and copywriting',
        'A/B testing and creative optimization',
        'Meta Pixel implementation and tracking',
        'Campaign budget optimization (CBO)',
        'Retargeting and lookalike audience setup',
        'Creative fatigue monitoring',
        'Landing page optimization recommendations',
        'Monthly performance reporting and ROAS analysis'
      ],
      tools: ['Meta Ads Manager', 'Meta Business Suite', 'Meta Pixel', 'Canva', 'Adobe Creative Suite', 'Google Analytics 4', 'Looker Studio', 'Triple Whale', 'Slack', 'Notion'],
      bottomLine: 'A great Facebook Ads Specialist doesn\'t just run ads — they build profitable acquisition engines. Every audience they test, every creative they launch, every campaign they optimize drives more customers at a lower cost. Results are immediate and scalable.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
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
      'Meta Ads Manager Expertise',
      'Facebook & Instagram Advertising',
      'Audience Targeting & Segmentation',
      'Custom Audience Creation',
      'Lookalike Audience Strategy',
      'Ad Creative Strategy',
      'Ad Copywriting & Testing',
      'Meta Pixel Setup & Tracking',
      'Campaign Budget Optimization',
      'Retargeting Campaign Management',
      'Creative Fatigue Analysis',
      'A/B Testing & Experimentation',
      'Conversion Optimization',
      'ROAS & CPA Analysis',
      'Landing Page Optimization',
      'Video Ad Production',
      'Carousel & Stories Ads',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our Facebook Ads specialist from Rapid Tal scaled our monthly revenue from $40K to $180K in 6 months. Her creative testing process is systematic and her ROAS is consistently above 4x.',
      attribution: '— Australian DTC brand owner, Melbourne'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["paid-social-specialist","tiktok-ads-specialist","retargeting-specialist"]
  },

  'tiktok-ads-specialist': {
    slug: 'tiktok-ads-specialist',
    title: 'TikTok Ads Specialist',
    metaDescription: 'How much does a TikTok Ads Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for TikTok advertising.',
    heroGhost: 'TT',
    roleTag: 'Cost Comparison — Paid Social Roles',
    headline: 'TIKTOK ADS\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a TikTok Ads Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A TikTok Ads Specialist is not someone who reposts Instagram content and calls it a TikTok strategy. They understand the unique creative language of TikTok — how the algorithm works, what makes content go viral, and how to turn organic-style ads into profitable customer acquisition at scale.',
        'Most businesses fail on TikTok because they\'re running ads that look like ads — polished brand videos that get scrolled past in 0.3 seconds. A TikTok Ads Specialist creates native-looking content that stops the scroll, hooks attention in the first second, and drives conversions without feeling like advertising.',
        'Their day starts in TikTok Ads Manager — analyzing campaign performance, reviewing creative metrics (watch time, engagement rate, click-through rate), and identifying which ad formats and hooks are working. From there they move into creative strategy — scripting new ad concepts, briefing creators, and launching rapid-fire creative tests.',
        'On the execution side, they\'re building full-funnel campaigns — top-of-funnel awareness ads to build brand recognition, mid-funnel consideration campaigns, and bottom-funnel conversion ads with strong CTAs. They implement the TikTok Pixel, set up custom audiences, and ensure tracking is accurate.',
        'They also manage creative velocity — TikTok ads burn out faster than any other platform, so they\'re constantly testing new hooks, new formats, and new angles. They know that on TikTok, creative is 80% of performance and targeting is 20%.',
        'Every month they deliver a report that shows creative performance, audience insights, conversion data, cost per acquisition, ROAS, and a pipeline of new creative concepts to test. No fluff. Just what\'s working and what\'s next.'
      ],
      tasks: [
        'TikTok Ads Manager campaign setup',
        'Native-style ad creative strategy',
        'Hook scripting and creative briefing',
        'Spark Ads and creator partnerships',
        'TikTok Pixel implementation and tracking',
        'Audience targeting and custom audiences',
        'Creative testing and iteration',
        'Campaign budget optimization',
        'Retargeting campaign management',
        'Monthly performance reporting and creative analysis'
      ],
      tools: ['TikTok Ads Manager', 'TikTok Creative Center', 'TikTok Pixel', 'CapCut', 'Canva', 'Google Analytics 4', 'Looker Studio', 'Notion', 'Slack', 'Triple Whale'],
      bottomLine: 'A great TikTok Ads Specialist doesn\'t just run ads — they crack the creative code. Every hook they test, every format they try, every campaign they launch drives more customers at a lower cost than traditional platforms. TikTok is the fastest-growing acquisition channel in 2026.'
    },
    costs: {
      auBaseSalary: 6000,
      phBaseSalary: 1600,
      auSuper: 690,
      auLeave: 519,
      auSick: 277,
      auRecruitment: 1083,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 90
    },
    skills: [
      'TikTok Ads Manager Expertise',
      'Native Content Strategy',
      'Hook Scripting & Creative',
      'Spark Ads Management',
      'TikTok Pixel Setup & Tracking',
      'Audience Targeting',
      'Creative Testing & Iteration',
      'Campaign Budget Optimization',
      'Retargeting Campaigns',
      'Creator Partnership Management',
      'Video Editing (CapCut)',
      'Trend Analysis',
      'A/B Testing',
      'ROAS & CPA Analysis',
      'Landing Page Optimization',
      'UGC Content Strategy',
      'Viral Content Analysis',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our TikTok Ads specialist from Rapid Tal helped us crack the platform in 4 months. We went from zero to $80K/month in TikTok revenue with a 3.8x ROAS. She understands the creative game better than anyone.',
      attribution: '— Australian beauty brand founder, Brisbane'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["facebook-ads-specialist","paid-social-specialist","youtube-ads-specialist"]
  }
,

  'google-shopping-specialist': {
    slug: 'google-shopping-specialist',
    title: 'Google Shopping Specialist',
    metaDescription: 'How much does a Google Shopping Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 71% average savings for e-commerce product ads.',
    heroGhost: 'GS',
    roleTag: 'Cost Comparison — E-commerce Advertising Roles',
    headline: 'GOOGLE SHOPPING\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Google Shopping Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '71%',
      savedPerYear: '$58K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Google Shopping Specialist is not a general Google Ads person who happens to run Shopping campaigns. They are a product feed expert who understands Google Merchant Center, product data optimization, and how to structure Shopping campaigns that drive profitable e-commerce sales at scale.',
        'Most online stores are leaving money on the table with Google Shopping because their product feeds are broken — missing GTINs, poor product titles, incorrect categorization, disapproved products, and zero feed optimization. A Google Shopping Specialist fixes all of it and turns your product catalog into a revenue engine.',
        'Their day starts in Google Merchant Center and Google Ads — checking feed health, resolving product disapprovals, analyzing Shopping campaign performance, and identifying which products are profitable vs which are bleeding budget. From there they move into feed optimization — rewriting product titles, improving descriptions, and structuring data for maximum visibility.',
        'On the campaign side, they\'re building sophisticated Shopping structures — separating high-margin products from low-margin, brand searches from generic, and bestsellers from new products. They implement Smart Shopping or Performance Max campaigns when appropriate, but always with proper segmentation and control.',
        'They also manage product-level bidding — increasing bids on high-converting products, pausing underperformers, testing new product launches, and ensuring your Shopping ROAS stays profitable. Every product in your catalog is optimized for maximum return.',
        'Every month they deliver a report that shows product-level performance — impressions, clicks, conversions, cost per conversion, ROAS by product category, and a clear optimization roadmap. No fluff. Just products that sell.'
      ],
      tasks: [
        'Google Merchant Center setup and management',
        'Product feed optimization and troubleshooting',
        'Product title and description optimization',
        'GTIN and product categorization',
        'Shopping campaign structure and setup',
        'Product-level bid management',
        'Smart Shopping / Performance Max optimization',
        'Product disapproval resolution',
        'Negative keyword management for Shopping',
        'Monthly product performance reporting'
      ],
      tools: ['Google Merchant Center', 'Google Ads', 'Google Analytics 4', 'Shopify/WooCommerce', 'DataFeedWatch', 'Feedonomics', 'Looker Studio', 'Excel/Google Sheets', 'SEMrush', 'Slack'],
      bottomLine: 'A great Google Shopping Specialist doesn\'t just run product ads — they turn your entire catalog into a profit center. Every product they optimize, every feed improvement they make, every campaign they structure drives more sales at a lower cost. Shopping is the highest-intent traffic you can buy.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Google Merchant Center Management',
      'Product Feed Optimization',
      'Shopping Campaign Structure',
      'Product Title Optimization',
      'GTIN & Product Categorization',
      'Smart Shopping Campaigns',
      'Performance Max Campaigns',
      'Product-Level Bid Management',
      'Feed Troubleshooting',
      'Product Disapproval Resolution',
      'Google Ads Shopping',
      'E-commerce Platform Integration',
      'DataFeedWatch / Feedonomics',
      'ROAS Optimization',
      'Negative Keyword Strategy',
      'Product Segmentation',
      'Conversion Tracking',
      'Monthly Product Reporting'
    ],
    testimonial: {
      text: 'Our Google Shopping specialist from Rapid Tal increased our Shopping ROAS from 2.1x to 5.8x in 5 months. She fixed our product feed issues and restructured everything. Shopping is now our #1 revenue channel.',
      attribution: '— Australian online retailer, Perth'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["google-ads-specialist","ppc-manager","retargeting-specialist"]
  },

  'programmatic-advertising-specialist': {
    slug: 'programmatic-advertising-specialist',
    title: 'Programmatic Advertising Specialist',
    metaDescription: 'How much does a Programmatic Advertising Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 70% average savings for display at scale.',
    heroGhost: 'PA',
    roleTag: 'Cost Comparison — Programmatic Advertising Roles',
    headline: 'PROGRAMMATIC\nADVERTISING\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Programmatic Advertising Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '70%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Programmatic Advertising Specialist is not someone who runs basic display ads through Google Ads. They are a sophisticated media buyer who operates demand-side platforms (DSPs), manages real-time bidding, and executes data-driven display campaigns at scale across the open web.',
        'Most businesses either avoid programmatic entirely or waste budget on poorly targeted display campaigns that generate impressions but zero conversions. A Programmatic Advertising Specialist builds audience-first campaigns that reach the right people at the right time with the right message — driving measurable business outcomes.',
        'Their day starts in DSP platforms like The Trade Desk, DV360, or Amazon DSP — analyzing campaign performance, reviewing audience segments, checking viewability metrics, and adjusting bids based on what\'s converting. From there they move into audience strategy — building custom segments, layering first-party data, and refining targeting to eliminate waste.',
        'On the creative side, they manage display creative production — briefing designers, testing ad formats (static, animated, video), and ensuring every creative is optimized for each placement. They also implement sophisticated retargeting sequences that move prospects through the funnel.',
        'They manage programmatic budgets at scale — often six or seven figures monthly — with ruthless efficiency. They monitor brand safety, prevent ad fraud, optimize for viewability, and ensure every impression has the potential to drive value.',
        'Every month they deliver a report that shows programmatic performance — impressions, viewability, click-through rate, conversions, cost per acquisition, and audience insights. No fluff. Just display advertising that actually works.'
      ],
      tasks: [
        'DSP platform management (Trade Desk, DV360, Amazon DSP)',
        'Audience segmentation and targeting strategy',
        'Real-time bidding optimization',
        'Display creative strategy and briefing',
        'Retargeting campaign management',
        'First-party data integration',
        'Brand safety and fraud prevention',
        'Viewability optimization',
        'Cross-device campaign management',
        'Monthly programmatic performance reporting'
      ],
      tools: ['The Trade Desk', 'Google DV360', 'Amazon DSP', 'Adobe Advertising Cloud', 'Google Analytics 4', 'Looker Studio', 'Excel/Google Sheets', 'IAS/DoubleVerify', 'Segment', 'Slack'],
      bottomLine: 'A great Programmatic Advertising Specialist doesn\'t just buy impressions — they build precision targeting machines. Every audience they segment, every campaign they optimize, every creative they test drives more conversions at scale. Programmatic is display advertising done right.'
    },
    costs: {
      auBaseSalary: 7000,
      phBaseSalary: 2000,
      auSuper: 805,
      auLeave: 606,
      auSick: 323,
      auRecruitment: 1250,
      phRecruitment: 333,
      tools: 450,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 105
    },
    skills: [
      'DSP Platform Management',
      'The Trade Desk Expertise',
      'Google DV360',
      'Amazon DSP',
      'Audience Segmentation',
      'Real-Time Bidding (RTB)',
      'Display Creative Strategy',
      'Retargeting Campaigns',
      'First-Party Data Integration',
      'Brand Safety Management',
      'Viewability Optimization',
      'Ad Fraud Prevention',
      'Cross-Device Targeting',
      'Programmatic Video',
      'Native Advertising',
      'CPA & ROAS Optimization',
      'Data Management Platforms',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our programmatic specialist from Rapid Tal manages $400K/month in display spend with a 4.2x ROAS. She built audience segments we didn\'t know existed and cut our CPA by 62%. Worth every dollar.',
      attribution: '— Australian enterprise marketing director, Sydney'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["ppc-manager","retargeting-specialist","google-ads-specialist"]
  },

  'linkedin-ads-specialist': {
    slug: 'linkedin-ads-specialist',
    title: 'LinkedIn Ads Specialist',
    metaDescription: 'How much does a LinkedIn Ads Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for B2B advertising.',
    heroGhost: 'LI',
    roleTag: 'Cost Comparison — B2B Advertising Roles',
    headline: 'LINKEDIN ADS\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a LinkedIn Ads Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A LinkedIn Ads Specialist is not someone who runs generic sponsored content and hopes for leads. They are a B2B performance marketer who understands professional targeting, lead generation funnels, and how to turn LinkedIn\'s premium audience into qualified sales pipeline — despite the platform\'s higher CPCs.',
        'Most B2B companies waste budget on LinkedIn because their targeting is too broad, their creative doesn\'t speak to decision-makers, their lead forms are poorly designed, and they have no nurture strategy. A LinkedIn Ads Specialist fixes all of it and turns LinkedIn into a predictable lead generation engine.',
        'Their day starts in LinkedIn Campaign Manager — analyzing campaign performance, reviewing lead quality, checking audience insights, and adjusting bids based on what\'s converting into actual sales opportunities. From there they move into audience strategy — building hyper-targeted segments by job title, seniority, company size, and industry.',
        'On the creative side, they\'re writing B2B-focused ad copy that speaks to pain points, creating thought leadership content that builds trust, and designing lead gen forms that balance conversion rate with lead quality. They know that on LinkedIn, quality beats quantity every time.',
        'They also manage the full funnel — awareness campaigns to build brand recognition, consideration campaigns with gated content, and bottom-funnel conversion campaigns with strong CTAs. They implement LinkedIn Insight Tag, set up matched audiences, and ensure CRM integration is tracking pipeline properly.',
        'Every month they deliver a report that shows LinkedIn performance — impressions, clicks, leads, cost per lead, lead quality scores, pipeline generated, and closed revenue from LinkedIn campaigns. No fluff. Just B2B leads that convert.'
      ],
      tasks: [
        'LinkedIn Campaign Manager setup and management',
        'B2B audience targeting and segmentation',
        'Sponsored Content and InMail campaigns',
        'Lead Gen Form optimization',
        'Ad creative strategy and copywriting',
        'LinkedIn Insight Tag implementation',
        'Matched audience and retargeting setup',
        'CRM integration and lead tracking',
        'A/B testing and campaign optimization',
        'Monthly lead quality and pipeline reporting'
      ],
      tools: ['LinkedIn Campaign Manager', 'LinkedIn Sales Navigator', 'LinkedIn Insight Tag', 'HubSpot', 'Salesforce', 'Google Analytics 4', 'Looker Studio', 'Canva', 'Excel/Google Sheets', 'Slack'],
      bottomLine: 'A great LinkedIn Ads Specialist doesn\'t just generate leads — they generate qualified pipeline. Every audience they target, every campaign they optimize, every lead form they test drives more sales opportunities at a predictable cost. LinkedIn is the #1 B2B acquisition channel.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'LinkedIn Campaign Manager',
      'B2B Audience Targeting',
      'Sponsored Content Campaigns',
      'InMail Campaign Management',
      'Lead Gen Form Optimization',
      'B2B Ad Copywriting',
      'LinkedIn Insight Tag Setup',
      'Matched Audience Strategy',
      'Retargeting Campaigns',
      'CRM Integration',
      'Lead Quality Analysis',
      'Pipeline Attribution',
      'A/B Testing',
      'Budget Management',
      'Conversion Optimization',
      'Sales Navigator Integration',
      'Thought Leadership Content',
      'Monthly Pipeline Reporting'
    ],
    testimonial: {
      text: 'Our LinkedIn Ads specialist from Rapid Tal generates 40-60 qualified leads per month at $180 CPL. Lead quality is 10x better than Google Ads and 30% of them turn into sales calls. Best B2B hire we\'ve made.',
      attribution: '— Australian SaaS founder, Melbourne'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["paid-social-specialist","ppc-manager","facebook-ads-specialist"]
  }
,

  'ppc-manager': {
    slug: 'ppc-manager',
    title: 'PPC Manager',
    metaDescription: 'How much does a PPC Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for multi-channel paid advertising.',
    heroGhost: 'PM',
    roleTag: 'Cost Comparison — Paid Advertising Roles',
    headline: 'PPC MANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a PPC Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$59K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A PPC Manager is not just a Google Ads specialist with a fancier title. They are a multi-channel performance marketer who manages pay-per-click campaigns across Google, Bing, Meta, LinkedIn, and other platforms — coordinating budgets, optimizing performance, and ensuring every dollar spent drives measurable ROI.',
        'Most businesses are managing PPC in silos — Google Ads running independently from Facebook, no cross-platform attribution, inconsistent messaging, and zero strategic coordination. A PPC Manager brings it all together and ensures your entire paid advertising ecosystem works as one profit-generating machine.',
        'Their day starts with a cross-platform performance review — checking Google Ads, Meta Ads, LinkedIn, and Bing campaigns to identify what\'s working and what\'s not. From there they move into budget allocation — shifting spend from underperforming channels to winners, testing new platforms, and ensuring total marketing spend stays profitable.',
        'On the strategy side, they\'re building cohesive campaigns across channels — consistent messaging, coordinated audience targeting, and proper attribution so you know which platform is actually driving conversions. They implement cross-platform tracking, set up UTM parameters properly, and ensure your analytics tell the full story.',
        'They also manage teams and agencies — coordinating with creative teams, briefing specialists, reviewing campaign performance, and ensuring everyone is aligned on goals and KPIs. They\'re the strategic brain behind your entire paid advertising operation.',
        'Every month they deliver a comprehensive report that shows performance across all channels — total spend, total conversions, blended ROAS, cost per acquisition by channel, and a strategic roadmap for budget allocation. No fluff. Just total paid advertising performance.'
      ],
      tasks: [
        'Multi-channel PPC campaign management',
        'Budget allocation across platforms',
        'Google Ads, Meta, LinkedIn, Bing coordination',
        'Cross-platform attribution setup',
        'UTM tracking and analytics implementation',
        'Campaign strategy and planning',
        'Team and agency coordination',
        'A/B testing across channels',
        'Performance analysis and optimization',
        'Monthly cross-platform reporting'
      ],
      tools: ['Google Ads', 'Meta Ads Manager', 'LinkedIn Campaign Manager', 'Microsoft Advertising', 'Google Analytics 4', 'Google Tag Manager', 'Looker Studio', 'Supermetrics', 'Excel/Google Sheets', 'Slack'],
      bottomLine: 'A great PPC Manager doesn\'t just run campaigns — they orchestrate your entire paid advertising strategy. Every channel they optimize, every budget decision they make, every test they run drives better overall performance. They turn disconnected campaigns into a coordinated growth engine.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Multi-Channel PPC Management',
      'Google Ads Expertise',
      'Meta Ads Management',
      'LinkedIn Advertising',
      'Microsoft Advertising (Bing)',
      'Budget Allocation Strategy',
      'Cross-Platform Attribution',
      'UTM Tracking & Analytics',
      'Campaign Strategy & Planning',
      'Team & Agency Coordination',
      'Performance Analysis',
      'A/B Testing',
      'Conversion Optimization',
      'ROAS & CPA Analysis',
      'Google Analytics 4',
      'Google Tag Manager',
      'Looker Studio Reporting',
      'Strategic Budget Management'
    ],
    testimonial: {
      text: 'Our PPC Manager from Rapid Tal coordinates $250K/month across 5 platforms with a blended 4.8x ROAS. She optimized our entire paid strategy and cut our overall CPA by 41%. Best strategic hire we\'ve made.',
      attribution: '— Australian e-commerce director, Brisbane'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["google-ads-specialist","facebook-ads-specialist","programmatic-advertising-specialist"]
  },

  'paid-social-specialist': {
    slug: 'paid-social-specialist',
    title: 'Paid Social Specialist',
    metaDescription: 'How much does a Paid Social Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for multi-platform social advertising.',
    heroGhost: 'PS',
    roleTag: 'Cost Comparison — Paid Social Roles',
    headline: 'PAID SOCIAL\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Paid Social Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Paid Social Specialist is not just a Facebook Ads person who dabbles in other platforms. They are a multi-platform social media advertiser who runs profitable campaigns across Meta (Facebook/Instagram), TikTok, Pinterest, Snapchat, and LinkedIn — mastering the unique creative requirements and audience behaviors of each platform.',
        'Most brands are running social ads on one or two platforms and missing massive opportunities on others. A Paid Social Specialist builds a coordinated social advertising strategy that reaches your audience wherever they spend time — with platform-native creative that converts.',
        'Their day starts with a cross-platform performance review — checking Meta, TikTok, Pinterest, and LinkedIn campaigns to identify what\'s working and where to shift budget. From there they move into creative strategy — briefing new concepts, testing different formats, and ensuring every platform gets creative that fits its unique style.',
        'On the execution side, they\'re building full-funnel campaigns across platforms — awareness ads on TikTok, consideration campaigns on Meta, conversion ads on Pinterest, and B2B campaigns on LinkedIn. They implement pixels and tracking across all platforms, set up custom audiences, and ensure attribution is accurate.',
        'They also manage creative production at scale — working with designers and video editors to produce dozens of ad variations per week, testing hooks and formats, and scaling winners across platforms. They know that on social, creative velocity is everything.',
        'Every month they deliver a report that shows performance across all social platforms — spend, conversions, ROAS by platform, creative performance, and a roadmap for the next 30 days. No fluff. Just social advertising that drives revenue.'
      ],
      tasks: [
        'Multi-platform social advertising management',
        'Meta (Facebook/Instagram) campaign optimization',
        'TikTok Ads campaign management',
        'Pinterest and Snapchat advertising',
        'Platform-specific creative strategy',
        'Cross-platform pixel and tracking setup',
        'Audience targeting and segmentation',
        'Creative testing and iteration',
        'Budget allocation across platforms',
        'Monthly cross-platform performance reporting'
      ],
      tools: ['Meta Ads Manager', 'TikTok Ads Manager', 'Pinterest Ads', 'Snapchat Ads', 'LinkedIn Campaign Manager', 'Canva', 'CapCut', 'Google Analytics 4', 'Looker Studio', 'Triple Whale'],
      bottomLine: 'A great Paid Social Specialist doesn\'t just run ads on one platform — they build a multi-platform acquisition engine. Every platform they master, every creative they test, every campaign they optimize drives more customers at a lower cost. Social is where your audience lives.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'Multi-Platform Social Advertising',
      'Meta Ads (Facebook/Instagram)',
      'TikTok Advertising',
      'Pinterest Ads Management',
      'Snapchat Advertising',
      'LinkedIn Paid Social',
      'Platform-Native Creative Strategy',
      'Audience Targeting',
      'Cross-Platform Tracking',
      'Creative Testing & Iteration',
      'Budget Allocation',
      'Video Ad Production',
      'UGC Content Strategy',
      'A/B Testing',
      'ROAS Optimization',
      'Conversion Tracking',
      'Creative Velocity Management',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our Paid Social specialist from Rapid Tal runs campaigns across Meta, TikTok, and Pinterest with a combined 4.5x ROAS. She understands each platform\'s creative language and delivers consistent results across all three.',
      attribution: '— Australian DTC founder, Sydney'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["facebook-ads-specialist","tiktok-ads-specialist","linkedin-ads-specialist"]
  },

  'youtube-ads-specialist': {
    slug: 'youtube-ads-specialist',
    title: 'YouTube Ads Specialist',
    metaDescription: 'How much does a YouTube Ads Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for video advertising.',
    heroGhost: 'YA',
    roleTag: 'Cost Comparison — Video Advertising Roles',
    headline: 'YOUTUBE ADS\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a YouTube Ads Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$59K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A YouTube Ads Specialist is not someone who repurposes TV commercials and calls it a YouTube strategy. They understand how YouTube advertising works — skippable vs non-skippable formats, in-feed discovery ads, bumper ads, and how to create video content that holds attention and drives conversions in a platform built for entertainment.',
        'Most businesses fail with YouTube Ads because their videos are too long, too boring, or too sales-focused — getting skipped in 5 seconds and wasting budget. A YouTube Ads Specialist creates video ads that hook attention immediately, deliver value, and drive action — turning YouTube into a profitable acquisition channel.',
        'Their day starts in Google Ads (YouTube campaigns) — analyzing video performance, checking view-through rates, reviewing audience engagement, and identifying which video formats and hooks are working. From there they move into creative strategy — scripting new video concepts, briefing video editors, and launching rapid creative tests.',
        'On the campaign side, they\'re building full-funnel YouTube strategies — top-of-funnel awareness campaigns with skippable ads, mid-funnel consideration campaigns, and bottom-funnel conversion campaigns with strong CTAs. They implement YouTube remarketing, set up custom intent audiences, and ensure tracking is accurate.',
        'They also manage video production at scale — working with video editors to produce multiple ad variations, testing different hooks, lengths, and formats, and scaling winners. They know that on YouTube, the first 5 seconds determine everything.',
        'Every month they deliver a report that shows video performance — views, view rate, watch time, conversions, cost per view, cost per conversion, and a pipeline of new video concepts to test. No fluff. Just video ads that convert.'
      ],
      tasks: [
        'YouTube Ads campaign setup and management',
        'Video ad creative strategy and scripting',
        'Skippable and non-skippable ad optimization',
        'In-feed discovery ad campaigns',
        'Bumper ad strategy',
        'YouTube remarketing setup',
        'Custom intent audience targeting',
        'Video production coordination',
        'Hook testing and optimization',
        'Monthly video performance reporting'
      ],
      tools: ['Google Ads (YouTube)', 'YouTube Studio', 'Google Analytics 4', 'Video Editing Software', 'Canva', 'TubeBuddy', 'VidIQ', 'Looker Studio', 'Excel/Google Sheets', 'Slack'],
      bottomLine: 'A great YouTube Ads Specialist doesn\'t just run video ads — they build a video acquisition engine. Every hook they test, every format they try, every campaign they optimize drives more customers at a lower cost. YouTube is the second-largest search engine in the world.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'YouTube Ads Campaign Management',
      'Video Ad Creative Strategy',
      'Skippable Ad Optimization',
      'Non-Skippable Ad Strategy',
      'In-Feed Discovery Ads',
      'Bumper Ad Campaigns',
      'YouTube Remarketing',
      'Custom Intent Audiences',
      'Video Scripting & Hooks',
      'Video Production Coordination',
      'A/B Testing',
      'View Rate Optimization',
      'Conversion Tracking',
      'Google Ads (YouTube)',
      'YouTube Analytics',
      'ROAS & CPA Analysis',
      'Audience Targeting',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our YouTube Ads specialist from Rapid Tal built a video funnel that generates 200+ leads per month at $45 CPL. View rates are consistently above 40% and our brand awareness has skyrocketed. YouTube is now our #2 channel.',
      attribution: '— Australian B2B founder, Melbourne'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["tiktok-ads-specialist","paid-social-specialist","retargeting-specialist"]
  },

  'retargeting-specialist': {
    slug: 'retargeting-specialist',
    title: 'Retargeting Specialist',
    metaDescription: 'How much does a Retargeting Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for remarketing campaigns.',
    heroGhost: 'RT',
    roleTag: 'Cost Comparison — Conversion Optimization Roles',
    headline: 'RETARGETING\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Retargeting Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Retargeting Specialist is not someone who shows the same ad to everyone who visited your website. They are a conversion optimization expert who builds sophisticated remarketing sequences across Meta, Google, and other platforms — turning cold traffic into warm prospects and warm prospects into customers through strategic follow-up advertising.',
        'Most businesses are leaving 95%+ of their website traffic on the table because they have no retargeting strategy — no pixel installed, no audience segmentation, no sequential messaging, and no understanding of how to move prospects through the funnel. A Retargeting Specialist fixes all of it and turns your existing traffic into revenue.',
        'Their day starts with pixel and audience management — checking Meta Pixel, Google Ads remarketing tags, and custom audience health across platforms. From there they move into audience segmentation — building lists based on behavior (product viewers, cart abandoners, blog readers), time on site, and pages visited.',
        'On the campaign side, they\'re building sequential retargeting funnels — showing different messages to people based on where they are in the buyer journey. Someone who abandoned cart gets a different ad than someone who just read a blog post. Every audience gets messaging that matches their intent.',
        'They also manage creative specifically for retargeting — dynamic product ads showing exactly what someone viewed, testimonial ads building trust, urgency-based ads with limited-time offers, and educational content nurturing cold traffic. They know that retargeting creative needs to be different from cold traffic creative.',
        'Every month they deliver a report that shows retargeting performance — audience sizes, retargeting conversion rate, cost per retargeting conversion, incremental revenue from remarketing, and ROAS by audience segment. No fluff. Just conversions from traffic you already paid for.'
      ],
      tasks: [
        'Meta Pixel and Google Ads tag implementation',
        'Custom audience creation and segmentation',
        'Sequential retargeting campaign setup',
        'Dynamic product ad management',
        'Cart abandonment campaign optimization',
        'Cross-platform retargeting coordination',
        'Audience exclusion and suppression lists',
        'Retargeting creative strategy',
        'Frequency capping and budget management',
        'Monthly retargeting performance reporting'
      ],
      tools: ['Meta Pixel', 'Google Ads Remarketing', 'Google Tag Manager', 'Google Analytics 4', 'Meta Ads Manager', 'Canva', 'Looker Studio', 'Shopify/WooCommerce', 'Excel/Google Sheets', 'Slack'],
      bottomLine: 'A great Retargeting Specialist doesn\'t just show ads to past visitors — they build conversion machines. Every audience they segment, every sequence they create, every campaign they optimize drives more sales from traffic you already paid for. Retargeting is the highest-ROI advertising you can do.'
    },
    costs: {
      auBaseSalary: 6000,
      phBaseSalary: 1600,
      auSuper: 690,
      auLeave: 519,
      auSick: 277,
      auRecruitment: 1083,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 90
    },
    skills: [
      'Meta Pixel Setup & Management',
      'Google Ads Remarketing Tags',
      'Custom Audience Creation',
      'Audience Segmentation Strategy',
      'Sequential Retargeting Campaigns',
      'Dynamic Product Ads',
      'Cart Abandonment Campaigns',
      'Cross-Platform Retargeting',
      'Audience Exclusion Lists',
      'Retargeting Creative Strategy',
      'Frequency Capping',
      'Google Tag Manager',
      'Conversion Tracking',
      'A/B Testing',
      'ROAS Optimization',
      'Lookalike Audience Creation',
      'Budget Management',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our retargeting specialist from Rapid Tal built a 7-step remarketing sequence that converts 18% of cart abandoners. Retargeting ROAS is 12.4x and it\'s pure profit from traffic we already paid for. Incredible ROI.',
      attribution: '— Australian e-commerce founder, Perth'
    },
    category: 'Paid Advertising Specialists',
    categorySlug: 'paid-advertising-specialists',
    relatedRoles: ["google-ads-specialist","facebook-ads-specialist","programmatic-advertising-specialist"]
  }
,

  'sales-development-rep': {
    slug: 'sales-development-rep',
    title: 'Sales Development Rep (SDR)',
    metaDescription: 'How much does a Sales Development Rep cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for outbound sales.',
    heroGhost: 'SD',
    roleTag: 'Cost Comparison — Sales & Business Development Roles',
    headline: 'SALES DEVELOPMENT\nREP (SDR):\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Sales Development Rep in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Sales Development Rep is not someone who sends generic LinkedIn messages and hopes for replies. They are a professional outbound sales machine who builds pipeline through systematic prospecting, cold outreach, qualification, and meeting booking — turning cold leads into qualified sales opportunities for your closers.',
        'Most businesses struggle with outbound sales because they don\'t have dedicated SDRs doing the grunt work — prospecting is inconsistent, follow-up is weak, qualification is poor, and sales reps are wasting time on unqualified leads. An SDR fixes all of it and fills your pipeline with qualified meetings.',
        'Their day starts with prospecting — building targeted lists of ideal customers, researching companies and decision-makers, and identifying the best people to reach out to. From there they move into outreach — sending personalized cold emails, LinkedIn messages, and making cold calls to book discovery meetings.',
        'On the qualification side, they\'re asking the right questions to determine if a prospect is a good fit — budget, authority, need, and timeline (BANT). They don\'t just book any meeting — they book meetings with prospects who have a real problem your product solves and the budget to fix it.',
        'They also manage follow-up sequences ruthlessly — tracking every touchpoint, following up multiple times, handling objections, and staying persistent without being annoying. They know that most deals happen after the 5th-7th touchpoint, not the first.',
        'Every month they deliver a report that shows outbound performance — emails sent, calls made, meetings booked, show-up rate, qualified opportunities created, and pipeline value generated. No fluff. Just meetings that turn into revenue.'
      ],
      tasks: [
        'Outbound prospecting and list building',
        'Cold email campaign execution',
        'LinkedIn outreach and InMail campaigns',
        'Cold calling and phone prospecting',
        'Lead qualification (BANT framework)',
        'Discovery meeting booking',
        'CRM data entry and pipeline management',
        'Follow-up sequence management',
        'Objection handling and persistence',
        'Monthly pipeline and activity reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'Apollo.io', 'LinkedIn Sales Navigator', 'Outreach.io', 'SalesLoft', 'ZoomInfo', 'Calendly', 'Google Workspace', 'Slack'],
      bottomLine: 'A great SDR doesn\'t just book meetings — they build predictable pipeline. Every prospect they qualify, every meeting they book, every follow-up they send drives more qualified opportunities into your sales funnel. SDRs are the engine of B2B growth.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'Outbound Prospecting',
      'Cold Email Writing',
      'LinkedIn Outreach',
      'Cold Calling',
      'Lead Qualification (BANT)',
      'Discovery Meeting Booking',
      'CRM Management (HubSpot/Salesforce)',
      'Follow-Up Sequences',
      'Objection Handling',
      'Pipeline Management',
      'Apollo.io / ZoomInfo',
      'LinkedIn Sales Navigator',
      'Email Deliverability',
      'Persistence & Resilience',
      'Time Management',
      'Activity Tracking',
      'Sales Messaging',
      'Monthly Reporting'
    ],
    testimonial: {
      text: 'Our SDR from Rapid Tal books 25-30 qualified meetings per month at $180 per meeting. Show-up rate is 78% and 40% turn into opportunities. She\'s built our entire outbound engine from scratch.',
      attribution: '— Australian SaaS founder, Melbourne'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["appointment-setter","cold-calling-specialist","lead-generation-specialist"]
  },

  'appointment-setter': {
    slug: 'appointment-setter',
    title: 'Appointment Setter',
    metaDescription: 'How much does an Appointment Setter cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for meeting booking.',
    heroGhost: 'AS',
    roleTag: 'Cost Comparison — Sales & Lead Generation Roles',
    headline: 'APPOINTMENT\nSETTER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an Appointment Setter in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An Appointment Setter is not a receptionist who occasionally schedules calls. They are a high-volume outbound specialist whose sole job is to book qualified appointments for your sales team — calling through lists, handling objections, and filling your calendar with prospects ready to buy.',
        'Most businesses waste their closers\' time on prospecting and cold calling when they should be closing deals. An Appointment Setter handles the volume game — making 80-120 calls per day, booking 5-10 appointments per week, and ensuring your sales team only talks to qualified, interested prospects.',
        'Their day is pure execution — calling through targeted prospect lists, following proven scripts, handling gatekeepers, overcoming objections, and booking appointments directly into your sales team\'s calendar. They don\'t qualify deeply — they confirm interest, check basic fit, and hand off to closers.',
        'On the metrics side, they\'re measured on pure activity and output — calls made, contacts reached, appointments booked, show-up rate, and cost per appointment. Everything is trackable, everything is measurable, and ROI is crystal clear.',
        'They also manage follow-up relentlessly — calling back no-shows, rescheduling cancelled appointments, and staying persistent with warm leads until they book. They know that most appointments are booked on the 3rd-5th attempt, not the first call.',
        'Every week they deliver a report that shows calling activity — dials made, conversations had, appointments booked, show-up rate, and pipeline value created. No fluff. Just appointments that turn into closed deals.'
      ],
      tasks: [
        'High-volume cold calling (80-120 calls/day)',
        'Gatekeeper navigation',
        'Appointment booking and calendar management',
        'Basic lead qualification',
        'Objection handling and rebuttals',
        'Follow-up call sequences',
        'No-show follow-up and rescheduling',
        'CRM activity logging',
        'Script adherence and optimization',
        'Weekly activity and booking reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'PhoneBurner', 'Aircall', 'Calendly', 'Apollo.io', 'Close.com', 'Google Calendar', 'Excel/Google Sheets', 'Slack'],
      bottomLine: 'A great Appointment Setter doesn\'t just make calls — they fill your calendar with qualified prospects. Every appointment they book, every objection they overcome, every follow-up they make drives more opportunities for your closers. Appointment setters are the highest-ROI sales hire.'
    },
    costs: {
      auBaseSalary: 5750,
      phBaseSalary: 1500,
      auSuper: 661,
      auLeave: 498,
      auSick: 265,
      auRecruitment: 1042,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 86
    },
    skills: [
      'High-Volume Cold Calling',
      'Gatekeeper Navigation',
      'Appointment Booking',
      'Basic Lead Qualification',
      'Objection Handling',
      'Script Adherence',
      'Follow-Up Persistence',
      'No-Show Management',
      'CRM Activity Logging',
      'Calendar Management',
      'PhoneBurner / Aircall',
      'Time Management',
      'Call Metrics Tracking',
      'Resilience & Persistence',
      'Professional Phone Etiquette',
      'Calendly / Scheduling Tools',
      'Pipeline Handoff',
      'Weekly Reporting'
    ],
    testimonial: {
      text: 'Our appointment setter from Rapid Tal makes 500+ calls per week and books 18-22 qualified appointments. Show-up rate is 82% and our closers are finally spending their time selling, not prospecting. Best $1,500/month we spend.',
      attribution: '— Australian B2B founder, Brisbane'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["sales-development-rep","cold-calling-specialist","inside-sales-representative"]
  },

  'cold-calling-specialist': {
    slug: 'cold-calling-specialist',
    title: 'Cold Calling Specialist',
    metaDescription: 'How much does a Cold Calling Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 75% average savings for outbound phone sales.',
    heroGhost: 'CC',
    roleTag: 'Cost Comparison — Outbound Sales Roles',
    headline: 'COLD CALLING\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Cold Calling Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '75%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Cold Calling Specialist is not someone who reads a script and gives up after one "no." They are a professional phone sales operator who excels at cold outreach — navigating gatekeepers, building rapport in seconds, handling objections, and moving prospects through the sales process entirely over the phone.',
        'Most businesses avoid cold calling because it\'s hard, rejection is constant, and most people quit after a week. Filipinos are renowned for cold calling — excellent English, calm under pressure, culturally respectful, and relentlessly persistent. They don\'t take rejection personally and they don\'t quit.',
        'Their day is pure phone work — making 100-150 calls per day, getting past gatekeepers, delivering value propositions in 30 seconds, handling objections on the fly, and either booking meetings or closing deals directly on the call. Every conversation is an opportunity.',
        'On the execution side, they\'re following proven scripts but adapting to each conversation — listening for buying signals, asking discovery questions, identifying pain points, and positioning your solution as the answer. They don\'t just pitch — they sell.',
        'They also manage their own pipeline — tracking every call, logging outcomes in the CRM, scheduling follow-ups, and staying organized across hundreds of prospects. They know that cold calling is a numbers game, but it\'s also a skill game — and they\'re professionals.',
        'Every week they deliver a report that shows calling performance — dials made, conversations had, objections handled, meetings booked, deals closed, and revenue generated. No fluff. Just phone sales that drive results.'
      ],
      tasks: [
        'High-volume cold calling (100-150 calls/day)',
        'Gatekeeper navigation and rapport building',
        'Value proposition delivery',
        'Objection handling and rebuttals',
        'Discovery questioning and pain identification',
        'Meeting booking or direct phone sales',
        'Follow-up call sequences',
        'CRM pipeline management',
        'Call recording review and improvement',
        'Weekly performance and revenue reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'PhoneBurner', 'Aircall', 'Gong.io', 'Chorus.ai', 'Apollo.io', 'Close.com', 'Google Workspace', 'Slack'],
      bottomLine: 'A great Cold Calling Specialist doesn\'t just make calls — they generate revenue. Every gatekeeper they navigate, every objection they handle, every prospect they move forward drives more pipeline and more closed deals. Cold calling is still the fastest way to build B2B pipeline.'
    },
    costs: {
      auBaseSalary: 5500,
      phBaseSalary: 1400,
      auSuper: 633,
      auLeave: 476,
      auSick: 254,
      auRecruitment: 1000,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 83
    },
    skills: [
      'High-Volume Cold Calling',
      'Gatekeeper Navigation',
      'Rapport Building',
      'Value Proposition Delivery',
      'Objection Handling',
      'Discovery Questioning',
      'Pain Point Identification',
      'Phone Sales Closing',
      'Follow-Up Persistence',
      'CRM Pipeline Management',
      'PhoneBurner / Aircall',
      'Call Recording Analysis',
      'Script Adaptation',
      'Resilience & Persistence',
      'Professional Phone Etiquette',
      'Time Management',
      'Activity Tracking',
      'Weekly Performance Reporting'
    ],
    testimonial: {
      text: 'Our cold calling specialist from Rapid Tal makes 600+ calls per week and generates 12-15 qualified opportunities. Close rate on her booked meetings is 35%. She\'s fearless, persistent, and our best outbound hire.',
      attribution: '— Australian enterprise sales director, Sydney'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["sales-development-rep","appointment-setter","inside-sales-representative"]
  }
,

  'account-executive': {
    slug: 'account-executive',
    title: 'Account Executive',
    metaDescription: 'How much does an Account Executive cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for sales closers.',
    heroGhost: 'AE',
    roleTag: 'Cost Comparison — Sales Closing Roles',
    headline: 'ACCOUNT\nEXECUTIVE:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an Account Executive in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An Account Executive is not someone who takes orders and processes paperwork. They are a professional closer who takes qualified leads from SDRs and turns them into paying customers — running discovery calls, delivering demos, handling objections, negotiating deals, and closing revenue.',
        'Most businesses struggle to close deals because their AEs are poorly trained, don\'t follow a process, give up too early, or can\'t handle objections. A great Account Executive follows a proven sales methodology, stays persistent, and closes deals that others would lose.',
        'Their day starts with pipeline review — checking which deals are moving forward, which are stalled, and what actions are needed to push them to close. From there they move into selling — running discovery calls, delivering product demos, sending proposals, and following up relentlessly until deals close.',
        'On the discovery side, they\'re asking deep questions to understand the prospect\'s business, identify pain points, quantify the cost of inaction, and position your solution as the clear answer. They don\'t just demo features — they sell outcomes and ROI.',
        'They also handle negotiations professionally — addressing pricing objections, structuring deals that work for both sides, and closing contracts without discounting unnecessarily. They know their numbers, they know their value, and they don\'t leave money on the table.',
        'Every month they deliver a report that shows sales performance — pipeline value, deals closed, win rate, average deal size, sales cycle length, and revenue generated. No fluff. Just closed deals and predictable revenue.'
      ],
      tasks: [
        'Discovery call execution',
        'Product demo delivery',
        'Needs analysis and pain identification',
        'Proposal creation and presentation',
        'Objection handling and negotiation',
        'Deal closing and contract execution',
        'Pipeline management and forecasting',
        'Follow-up sequences and persistence',
        'CRM hygiene and deal tracking',
        'Monthly sales performance reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'Zoom', 'Gong.io', 'Chorus.ai', 'PandaDoc', 'DocuSign', 'LinkedIn Sales Navigator', 'Looker Studio', 'Slack'],
      bottomLine: 'A great Account Executive doesn\'t just take meetings — they close deals. Every discovery call they run, every demo they deliver, every objection they handle drives more revenue. AEs are the revenue generators of your business.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Discovery Call Execution',
      'Product Demo Delivery',
      'Needs Analysis',
      'Pain Point Identification',
      'Solution Selling',
      'Objection Handling',
      'Negotiation & Closing',
      'Proposal Writing',
      'Pipeline Management',
      'Deal Forecasting',
      'CRM Management (HubSpot/Salesforce)',
      'Follow-Up Persistence',
      'Contract Negotiation',
      'ROI Presentation',
      'Sales Methodology (MEDDIC/SPIN)',
      'Gong.io / Chorus.ai',
      'Time Management',
      'Monthly Revenue Reporting'
    ],
    testimonial: {
      text: 'Our Account Executive from Rapid Tal closes 8-12 deals per month with a 42% win rate and $12K average deal size. She follows our sales process perfectly and never gives up on a deal. Best closer we\'ve hired.',
      attribution: '— Australian SaaS founder, Melbourne'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["inside-sales-representative","account-manager","business-development-manager"]
  },

  'account-manager': {
    slug: 'account-manager',
    title: 'Account Manager',
    metaDescription: 'How much does an Account Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for client retention.',
    heroGhost: 'AM',
    roleTag: 'Cost Comparison — Account Management Roles',
    headline: 'ACCOUNT\nMANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an Account Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An Account Manager is not a customer service rep who answers tickets. They are a strategic relationship owner who manages existing client accounts, reduces churn, identifies upsell opportunities, and drives expansion revenue — turning one-time customers into long-term partners.',
        'Most businesses lose 20-30% of customers annually because no one is actively managing relationships, checking in proactively, identifying issues before they become cancellations, or finding opportunities to expand accounts. An Account Manager fixes all of it and makes retention predictable.',
        'Their day starts with account health review — checking usage data, identifying at-risk accounts, reviewing upcoming renewals, and prioritizing which clients need attention. From there they move into relationship management — running check-in calls, addressing concerns, and ensuring clients are getting value.',
        'On the expansion side, they\'re identifying upsell and cross-sell opportunities — clients who should upgrade plans, add users, or buy additional products. They don\'t just maintain accounts — they grow them.',
        'They also handle renewals professionally — reaching out 60-90 days before contract end, addressing any concerns, demonstrating ROI, and ensuring renewals happen smoothly without last-minute scrambles or discounting.',
        'Every month they deliver a report that shows account performance — retention rate, churn, expansion revenue, net revenue retention (NRR), at-risk accounts, and total account value managed. No fluff. Just retention and growth.'
      ],
      tasks: [
        'Client relationship management',
        'Account health monitoring',
        'Proactive check-in calls',
        'Issue resolution and escalation',
        'Upsell and cross-sell identification',
        'Renewal management and negotiation',
        'Usage analysis and optimization',
        'Quarterly business reviews (QBRs)',
        'Churn prevention and intervention',
        'Monthly retention and expansion reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'Gainsight', 'ChurnZero', 'Zoom', 'Google Workspace', 'Looker Studio', 'Slack', 'Notion', 'PandaDoc'],
      bottomLine: 'A great Account Manager doesn\'t just keep customers — they grow them. Every relationship they nurture, every issue they solve, every upsell they identify drives more revenue and reduces churn. Account managers pay for themselves by preventing cancellations alone.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'Client Relationship Management',
      'Account Health Monitoring',
      'Proactive Communication',
      'Issue Resolution',
      'Upsell & Cross-Sell',
      'Renewal Management',
      'Churn Prevention',
      'Quarterly Business Reviews',
      'Usage Analysis',
      'Contract Negotiation',
      'CRM Management (HubSpot/Salesforce)',
      'Gainsight / ChurnZero',
      'Customer Success Strategy',
      'ROI Demonstration',
      'Escalation Management',
      'Time Management',
      'Net Revenue Retention (NRR)',
      'Monthly Reporting'
    ],
    testimonial: {
      text: 'Our Account Manager from Rapid Tal manages 80 accounts with a 94% retention rate and generates $40K/month in expansion revenue. She catches issues before they become cancellations and our NRR is now 115%.',
      attribution: '— Australian SaaS founder, Sydney'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["customer-success-manager","account-executive","crm-manager"]
  },

  'inside-sales-representative': {
    slug: 'inside-sales-representative',
    title: 'Inside Sales Representative',
    metaDescription: 'How much does an Inside Sales Representative cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for remote sales.',
    heroGhost: 'IS',
    roleTag: 'Cost Comparison — Inside Sales Roles',
    headline: 'INSIDE SALES\nREPRESENTATIVE:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an Inside Sales Representative in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$59K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An Inside Sales Representative is not just an AE who works from home. They are a hybrid sales professional who handles both inbound and outbound sales — working warm leads from marketing, doing outbound prospecting, running demos, and closing mid-market deals entirely remotely without ever meeting prospects in person.',
        'Most businesses waste money on field sales when inside sales can close the same deals faster and cheaper. Inside Sales Reps are perfect for direct hire from the Philippines — excellent English, professional on video calls, and capable of managing the full sales cycle remotely.',
        'Their day is split between inbound and outbound — responding to warm leads from marketing, following up on demo requests, and also doing outbound prospecting via email and phone. They\'re self-sufficient, managing their own pipeline from first touch to closed deal.',
        'On the sales side, they\'re running discovery calls, delivering product demos over Zoom, handling objections, sending proposals, and closing deals — all remotely. They don\'t need to be in the same city as prospects to build trust and close business.',
        'They also manage their own metrics — tracking calls made, emails sent, demos delivered, proposals sent, deals closed, and revenue generated. Everything is measurable, everything is trackable, and ROI is clear.',
        'Every month they deliver a report that shows inside sales performance — pipeline value, deals closed, win rate, average deal size, sales cycle length, and revenue generated. No fluff. Just remote sales that drive revenue.'
      ],
      tasks: [
        'Inbound lead response and qualification',
        'Outbound prospecting (email and phone)',
        'Discovery call execution',
        'Remote product demo delivery',
        'Proposal creation and presentation',
        'Objection handling and negotiation',
        'Deal closing and contract execution',
        'Pipeline management and forecasting',
        'CRM hygiene and activity tracking',
        'Monthly sales performance reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'Zoom', 'Apollo.io', 'LinkedIn Sales Navigator', 'PandaDoc', 'Calendly', 'Gong.io', 'Google Workspace', 'Slack'],
      bottomLine: 'A great Inside Sales Rep doesn\'t need to be in the same room to close deals. Every warm lead they work, every outbound prospect they reach, every demo they deliver drives more revenue. Inside sales is the future of B2B selling.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Inbound Lead Management',
      'Outbound Prospecting',
      'Discovery Call Execution',
      'Remote Demo Delivery',
      'Needs Analysis',
      'Solution Selling',
      'Objection Handling',
      'Negotiation & Closing',
      'Proposal Writing',
      'Pipeline Management',
      'CRM Management (HubSpot/Salesforce)',
      'Video Call Professionalism',
      'Follow-Up Persistence',
      'Time Management',
      'Sales Methodology',
      'Apollo.io / LinkedIn Sales Navigator',
      'Deal Forecasting',
      'Monthly Revenue Reporting'
    ],
    testimonial: {
      text: 'Our Inside Sales Rep from Rapid Tal closes 10-14 deals per month entirely over Zoom with a 38% win rate. She manages both inbound and outbound and our cost per deal is 60% lower than field sales.',
      attribution: '— Australian B2B founder, Brisbane'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["account-executive","sales-development-rep","appointment-setter"]
  }
,

  'business-development-manager': {
    slug: 'business-development-manager',
    title: 'Business Development Manager',
    metaDescription: 'How much does a Business Development Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 70% average savings for strategic growth.',
    heroGhost: 'BD',
    roleTag: 'Cost Comparison — Business Development Roles',
    headline: 'BUSINESS\nDEVELOPMENT\nMANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Business Development Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '70%',
      savedPerYear: '$63K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Business Development Manager is not a glorified sales rep with a fancier title. They are a strategic growth operator who identifies new market opportunities, builds strategic partnerships, opens new revenue channels, and drives expansion into untapped segments — creating long-term growth beyond just closing individual deals.',
        'Most businesses plateau because they\'re only selling to existing markets through existing channels. A BDM breaks through that ceiling by finding new ways to grow — new verticals, new geographies, new partnership models, and new go-to-market strategies.',
        'Their day starts with market research — identifying emerging opportunities, analyzing competitor movements, researching potential partners, and mapping out new market segments worth pursuing. From there they move into relationship building — reaching out to potential partners, running exploratory calls, and building strategic alliances.',
        'On the execution side, they\'re negotiating partnership agreements, structuring channel partnerships, building referral programs, and creating new distribution channels that generate revenue without direct sales effort. They think strategically about how to scale revenue beyond just adding more sales reps.',
        'They also manage complex, long-cycle deals — enterprise partnerships, reseller agreements, and strategic alliances that take 6-12 months to close but generate significant ongoing revenue. They\'re patient, strategic, and focused on deals that compound over time.',
        'Every quarter they deliver a report that shows business development performance — new partnerships signed, new markets entered, partnership revenue generated, pipeline from new channels, and strategic initiatives in progress. No fluff. Just growth that scales.'
      ],
      tasks: [
        'New market identification and research',
        'Strategic partnership development',
        'Channel partner recruitment',
        'Partnership agreement negotiation',
        'Referral program development',
        'Enterprise deal management',
        'Market expansion strategy',
        'Competitive analysis',
        'Long-cycle deal nurturing',
        'Quarterly business development reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'LinkedIn Sales Navigator', 'ZoomInfo', 'PitchBook', 'Crunchbase', 'Google Workspace', 'Notion', 'Looker Studio', 'Slack'],
      bottomLine: 'A great Business Development Manager doesn\'t just close deals — they build growth engines. Every partnership they create, every new market they open, every channel they develop drives scalable, compounding revenue. BDMs are strategic growth multipliers.'
    },
    costs: {
      auBaseSalary: 7000,
      phBaseSalary: 2000,
      auSuper: 805,
      auLeave: 606,
      auSick: 323,
      auRecruitment: 1250,
      phRecruitment: 333,
      tools: 450,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 105
    },
    skills: [
      'Strategic Partnership Development',
      'New Market Identification',
      'Channel Partner Recruitment',
      'Partnership Negotiation',
      'Market Research & Analysis',
      'Competitive Intelligence',
      'Enterprise Deal Management',
      'Long-Cycle Sales',
      'Referral Program Development',
      'Go-To-Market Strategy',
      'CRM Management (HubSpot/Salesforce)',
      'LinkedIn Sales Navigator',
      'Relationship Building',
      'Contract Negotiation',
      'Strategic Thinking',
      'Pipeline Management',
      'Market Expansion',
      'Quarterly Reporting'
    ],
    testimonial: {
      text: 'Our Business Development Manager from Rapid Tal opened 3 new verticals and signed 5 channel partners in 8 months. Partner revenue is now 25% of total revenue and growing. She thinks strategically and executes relentlessly.',
      attribution: '— Australian enterprise founder, Melbourne'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["account-executive","sales-operations-specialist","account-manager"]
  },

  'crm-manager': {
    slug: 'crm-manager',
    title: 'CRM Manager',
    metaDescription: 'How much does a CRM Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for sales tech management.',
    heroGhost: 'CM',
    roleTag: 'Cost Comparison — Sales Operations Roles',
    headline: 'CRM MANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a CRM Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A CRM Manager is not an admin who updates contact records. They are a sales technology expert who owns your entire CRM system — HubSpot, Salesforce, or GoHighLevel — building workflows, automating processes, maintaining data quality, and ensuring your sales team has the tools and data they need to sell effectively.',
        'Most businesses are using 10% of their CRM\'s capabilities because no one owns the system, data is a mess, automation is broken, and sales reps are wasting hours on manual tasks. A CRM Manager fixes all of it and turns your CRM into a revenue-generating machine.',
        'Their day starts with system maintenance — checking data quality, fixing broken automations, reviewing user adoption, and identifying process improvements. From there they move into configuration — building new workflows, creating custom fields, setting up integrations, and optimizing the system for how your team actually sells.',
        'On the automation side, they\'re building sequences that nurture leads automatically, creating task reminders that keep deals moving, setting up notifications that alert reps to hot opportunities, and eliminating manual work wherever possible. Every automation they build saves your team hours per week.',
        'They also manage reporting and dashboards — building custom reports that show pipeline health, forecast accuracy, rep performance, and conversion rates. They turn raw CRM data into actionable insights that drive better decisions.',
        'Every month they deliver a report that shows CRM performance — data quality score, automation uptime, user adoption rate, time saved through automation, and system improvements implemented. No fluff. Just a CRM that works.'
      ],
      tasks: [
        'CRM system administration (HubSpot/Salesforce)',
        'Workflow and automation building',
        'Data quality management and cleanup',
        'Custom field and object creation',
        'Integration setup and maintenance',
        'User training and adoption',
        'Custom report and dashboard building',
        'Process optimization and documentation',
        'System troubleshooting and support',
        'Monthly CRM performance reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'GoHighLevel', 'Zapier', 'Make.com', 'Google Workspace', 'Looker Studio', 'Excel/Google Sheets', 'Notion', 'Slack'],
      bottomLine: 'A great CRM Manager doesn\'t just maintain your system — they multiply your team\'s productivity. Every workflow they build, every automation they create, every report they design makes your sales team faster and more effective. CRM managers pay for themselves in time saved alone.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'HubSpot Administration',
      'Salesforce Administration',
      'Workflow Automation',
      'Data Quality Management',
      'Custom Field Configuration',
      'Integration Setup (Zapier/Make)',
      'Report & Dashboard Building',
      'User Training & Adoption',
      'Process Documentation',
      'System Troubleshooting',
      'API Integration',
      'Data Migration',
      'CRM Best Practices',
      'GoHighLevel',
      'Looker Studio',
      'Excel/Google Sheets',
      'Change Management',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our CRM Manager from Rapid Tal built 40+ automations that save our sales team 15 hours per week. Data quality went from 60% to 95% and our forecast accuracy improved by 30%. Best ops hire we\'ve made.',
      attribution: '— Australian SaaS founder, Sydney'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["sales-operations-specialist","hubspot-administrator","account-manager"]
  },

  'sales-operations-specialist': {
    slug: 'sales-operations-specialist',
    title: 'Sales Operations Specialist',
    metaDescription: 'How much does a Sales Operations Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for sales ops.',
    heroGhost: 'SO',
    roleTag: 'Cost Comparison — Sales Operations Roles',
    headline: 'SALES OPERATIONS\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Sales Operations Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Sales Operations Specialist is not an analyst who sends weekly reports. They are the strategic backbone of your sales organization — managing pipeline reporting, building forecasts, documenting processes, optimizing workflows, integrating tools, and ensuring your sales team operates like a well-oiled machine.',
        'Most sales teams are flying blind because they don\'t have dedicated sales ops — forecasts are guesses, processes aren\'t documented, tools don\'t talk to each other, and no one knows which activities actually drive revenue. A Sales Ops Specialist fixes all of it and brings clarity to chaos.',
        'Their day starts with data analysis — reviewing pipeline health, checking forecast accuracy, identifying bottlenecks in the sales process, and spotting trends that need attention. From there they move into optimization — fixing broken processes, building better reports, and implementing improvements that make the team more efficient.',
        'On the strategic side, they\'re building sales playbooks, documenting best practices, creating onboarding materials for new reps, and ensuring everyone is following the same proven process. They turn tribal knowledge into repeatable systems.',
        'They also manage tool integration — connecting your CRM to your email platform, your dialer to your analytics, and ensuring data flows seamlessly between systems. Every integration they build eliminates manual work and improves data accuracy.',
        'Every month they deliver a report that shows sales operations performance — pipeline coverage, forecast accuracy, win rate trends, sales cycle analysis, rep productivity metrics, and process improvements implemented. No fluff. Just operational excellence.'
      ],
      tasks: [
        'Pipeline reporting and analysis',
        'Sales forecasting and accuracy tracking',
        'Process documentation and optimization',
        'Sales playbook development',
        'Tool integration and automation',
        'Rep productivity analysis',
        'Sales metrics dashboard creation',
        'Onboarding material development',
        'Data quality management',
        'Monthly sales operations reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'Looker Studio', 'Excel/Google Sheets', 'Zapier', 'Make.com', 'Gong.io', 'Chorus.ai', 'Notion', 'Slack'],
      bottomLine: 'A great Sales Operations Specialist doesn\'t just report numbers — they drive performance. Every process they document, every report they build, every integration they create makes your sales team faster, smarter, and more predictable. Sales ops is the force multiplier of revenue teams.'
    },
    costs: {
      auBaseSalary: 6750,
      phBaseSalary: 1900,
      auSuper: 776,
      auLeave: 584,
      auSick: 311,
      auRecruitment: 1208,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 101
    },
    skills: [
      'Pipeline Analysis & Reporting',
      'Sales Forecasting',
      'Process Documentation',
      'Sales Playbook Development',
      'Tool Integration (Zapier/Make)',
      'Data Analysis',
      'Dashboard Building (Looker Studio)',
      'CRM Management (HubSpot/Salesforce)',
      'Excel/Google Sheets Advanced',
      'Rep Productivity Analysis',
      'Sales Metrics Tracking',
      'Onboarding Program Development',
      'Process Optimization',
      'Data Quality Management',
      'Gong.io / Chorus.ai',
      'Strategic Thinking',
      'Change Management',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our Sales Ops Specialist from Rapid Tal built forecasting models that improved our accuracy from 65% to 92%. She documented our entire sales process and our new rep ramp time dropped by 40%. Incredible strategic value.',
      attribution: '— Australian enterprise sales director, Melbourne'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["crm-manager","business-development-manager","operations-manager"]
  },

  'customer-success-manager': {
    slug: 'customer-success-manager',
    title: 'Customer Success Manager',
    metaDescription: 'How much does a Customer Success Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for customer retention.',
    heroGhost: 'CS',
    roleTag: 'Cost Comparison — Customer Success Roles',
    headline: 'CUSTOMER SUCCESS\nMANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Customer Success Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Customer Success Manager is not a support rep who answers tickets. They are a proactive retention specialist who owns the post-sale customer journey — onboarding new customers, driving product adoption, preventing churn, and identifying expansion opportunities. They ensure customers achieve their desired outcomes and stay long-term.',
        'Most SaaS businesses lose 20-30% of customers annually because no one is actively ensuring customers succeed. A CSM prevents churn before it happens by monitoring usage, identifying at-risk accounts, and intervening early. They pay for themselves by preventing cancellations alone.',
        'Their day starts with account health monitoring — checking product usage data, identifying customers who haven\'t logged in recently, reviewing support tickets, and flagging accounts that need attention. From there they move into proactive outreach — running check-in calls, delivering training, and ensuring customers are getting value.',
        'On the onboarding side, they\'re guiding new customers through implementation, running training sessions, setting up integrations, and ensuring customers reach their first value milestone quickly. Fast time-to-value = higher retention.',
        'They also identify expansion opportunities — customers who should upgrade plans, add users, or buy additional products. They don\'t just prevent churn — they grow accounts through upsells and cross-sells.',
        'Every month they deliver a report that shows customer success performance — retention rate, churn, expansion revenue, net revenue retention (NRR), customer health scores, and at-risk accounts. No fluff. Just customers who stay and grow.'
      ],
      tasks: [
        'Customer onboarding and implementation',
        'Product adoption and training',
        'Account health monitoring',
        'Proactive check-in calls',
        'Churn prevention and intervention',
        'Renewal management',
        'Upsell and cross-sell identification',
        'Customer success playbook execution',
        'Support ticket escalation',
        'Monthly retention and NRR reporting'
      ],
      tools: ['HubSpot', 'Salesforce', 'Gainsight', 'ChurnZero', 'Intercom', 'Zoom', 'Google Workspace', 'Looker Studio', 'Notion', 'Slack'],
      bottomLine: 'A great Customer Success Manager doesn\'t just keep customers happy — they keep them paying. Every onboarding they run, every at-risk account they save, every upsell they identify drives more revenue and reduces churn. CSMs are the highest-ROI retention hire.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'Customer Onboarding',
      'Product Training & Adoption',
      'Account Health Monitoring',
      'Proactive Communication',
      'Churn Prevention',
      'Renewal Management',
      'Upsell & Cross-Sell',
      'Customer Success Playbooks',
      'Usage Analysis',
      'Support Escalation',
      'CRM Management (HubSpot/Salesforce)',
      'Gainsight / ChurnZero',
      'Intercom / Support Tools',
      'Quarterly Business Reviews',
      'Net Revenue Retention (NRR)',
      'Customer Health Scoring',
      'Time Management',
      'Monthly Reporting'
    ],
    testimonial: {
      text: 'Our Customer Success Manager from Rapid Tal manages 120 accounts with a 96% retention rate and generates $35K/month in expansion revenue. She catches churn signals early and our NRR is now 118%. Best retention hire we\'ve made.',
      attribution: '— Australian SaaS founder, Brisbane'
    },
    category: 'Sales Specialists',
    categorySlug: 'sales-specialists',
    relatedRoles: ["account-manager","customer-support-specialist","operations-manager"]
  }
,

  'copywriter': {
    slug: 'copywriter',
    title: 'Copywriter',
    metaDescription: 'How much does a Copywriter cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 75% average savings for content creation.',
    heroGhost: 'CW',
    roleTag: 'Cost Comparison — Marketing & Content Roles',
    headline: 'COPYWRITER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Copywriter in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '75%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Copywriter is not someone who writes blog posts and calls it a day. They are a professional wordsmith who crafts persuasive, conversion-focused copy across every marketing channel — websites, ads, emails, landing pages, sales pages, and social media. Every word they write is designed to move prospects closer to buying.',
        'Most businesses have weak copy because no one owns it — marketing managers write it between meetings, founders write it at midnight, and agencies charge $200/hour for mediocre work. A dedicated Copywriter fixes all of it and turns every piece of content into a revenue-generating asset.',
        'Their day starts with research — understanding your audience, studying competitors, analyzing what messaging works, and identifying the pain points your product solves. From there they move into writing — crafting headlines that hook attention, body copy that builds desire, and CTAs that drive action.',
        'On the execution side, they\'re writing website copy that converts visitors into leads, ad copy that stops the scroll, email sequences that nurture prospects, landing pages that drive conversions, and sales pages that close deals. Every piece of copy is tested, refined, and optimized for performance.',
        'They also understand copywriting frameworks — AIDA, PAS, BAB, FAB — and know when to use each one. They don\'t just write pretty words — they write words that sell. Every headline, every sentence, every CTA is intentional.',
        'Every month they deliver a report that shows copy performance — conversion rates by page, email open and click rates, ad performance, A/B test results, and revenue generated from copy improvements. No fluff. Just words that drive revenue.'
      ],
      tasks: [
        'Website copy and landing page writing',
        'Ad copywriting (Google, Meta, LinkedIn)',
        'Email sequence and campaign writing',
        'Sales page and product description writing',
        'Social media copy and captions',
        'Blog post and article writing',
        'Video script writing',
        'A/B testing and copy optimization',
        'Brand voice development',
        'Monthly copy performance reporting'
      ],
      tools: ['Google Docs', 'Notion', 'Grammarly', 'Hemingway Editor', 'ChatGPT', 'Jasper', 'Copy.ai', 'Google Analytics 4', 'Hotjar', 'Slack'],
      bottomLine: 'A great Copywriter doesn\'t just write words — they write revenue. Every headline they craft, every email they send, every landing page they optimize drives more conversions and more sales. Copy is the foundation of all marketing.'
    },
    costs: {
      auBaseSalary: 5500,
      phBaseSalary: 1400,
      auSuper: 633,
      auLeave: 476,
      auSick: 254,
      auRecruitment: 1000,
      phRecruitment: 333,
      tools: 300,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 83
    },
    skills: [
      'Persuasive Copywriting',
      'Website Copy',
      'Landing Page Copy',
      'Ad Copywriting',
      'Email Copywriting',
      'Sales Page Writing',
      'Social Media Copy',
      'Blog Writing',
      'Video Script Writing',
      'A/B Testing',
      'Conversion Optimization',
      'Brand Voice Development',
      'Copywriting Frameworks (AIDA, PAS)',
      'SEO Copywriting',
      'Research & Audience Analysis',
      'Grammarly / Hemingway',
      'Google Analytics',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our copywriter from Rapid Tal rewrote our entire website and landing pages. Conversion rate went from 2.1% to 4.8% in 60 days. She understands persuasion and writes copy that actually sells.',
      attribution: '— Australian e-commerce founder, Melbourne'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["marketing-copywriter","seo-content-writer","content-strategist"]
  },

  'social-media-manager': {
    slug: 'social-media-manager',
    title: 'Social Media Manager',
    metaDescription: 'How much does a Social Media Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for social media management.',
    heroGhost: 'SM',
    roleTag: 'Cost Comparison — Social Media & Content Roles',
    headline: 'SOCIAL MEDIA\nMANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Social Media Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Social Media Manager is not someone who posts random content and hopes for engagement. They are a strategic content operator who owns your entire social media presence — content creation, scheduling, community management, engagement, analytics, and reporting across all platforms.',
        'Most businesses have inconsistent social media because no one owns it — posts go up sporadically, engagement is ignored, content has no strategy, and no one knows what\'s working. A Social Media Manager fixes all of it and turns social into a predictable lead generation and brand-building channel.',
        'Their day starts with community management — responding to comments, answering DMs, engaging with followers, and building relationships. From there they move into content creation — writing captions, designing graphics, editing videos, and scheduling posts across Instagram, Facebook, LinkedIn, TikTok, and Twitter.',
        'On the strategy side, they\'re building content calendars aligned with your marketing goals, planning campaigns around product launches, creating content pillars that resonate with your audience, and ensuring every post serves a purpose — whether it\'s awareness, engagement, or conversion.',
        'They also analyze performance religiously — tracking reach, engagement, follower growth, link clicks, and conversions from social. They know which content formats work, which posting times drive engagement, and which platforms deliver ROI.',
        'Every month they deliver a report that shows social media performance — follower growth, engagement rate, reach, link clicks, conversions, and content performance by platform. No fluff. Just social media that drives business results.'
      ],
      tasks: [
        'Content creation (graphics, videos, captions)',
        'Content calendar planning and scheduling',
        'Community management and engagement',
        'Social media strategy development',
        'Platform-specific content optimization',
        'Influencer outreach and collaboration',
        'Social media advertising coordination',
        'Analytics tracking and reporting',
        'Trend monitoring and adaptation',
        'Monthly social media performance reporting'
      ],
      tools: ['Meta Business Suite', 'Later', 'Buffer', 'Hootsuite', 'Canva', 'CapCut', 'Adobe Creative Suite', 'Google Analytics 4', 'Sprout Social', 'Slack'],
      bottomLine: 'A great Social Media Manager doesn\'t just post content — they build communities and drive business results. Every post they create, every comment they respond to, every campaign they run drives more awareness, engagement, and conversions.'
    },
    costs: {
      auBaseSalary: 5750,
      phBaseSalary: 1500,
      auSuper: 661,
      auLeave: 498,
      auSick: 265,
      auRecruitment: 1042,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 86
    },
    skills: [
      'Content Creation',
      'Social Media Strategy',
      'Community Management',
      'Content Calendar Planning',
      'Instagram Management',
      'Facebook Management',
      'LinkedIn Management',
      'TikTok Content Creation',
      'Twitter/X Management',
      'Canva / Adobe Creative Suite',
      'Video Editing (CapCut)',
      'Copywriting',
      'Engagement & Growth',
      'Social Media Analytics',
      'Trend Monitoring',
      'Influencer Collaboration',
      'Meta Business Suite',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our social media manager from Rapid Tal posts 5x per week across 4 platforms, responds to every comment within 2 hours, and our engagement rate tripled in 4 months. She\'s consistent, creative, and our followers love her.',
      attribution: '— Australian DTC brand owner, Sydney'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["content-strategist","graphic-designer","ugc-manager"]
  },

  'email-marketing-specialist': {
    slug: 'email-marketing-specialist',
    title: 'Email Marketing Specialist',
    metaDescription: 'How much does an Email Marketing Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for email campaigns.',
    heroGhost: 'EM',
    roleTag: 'Cost Comparison — Email Marketing Roles',
    headline: 'EMAIL MARKETING\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an Email Marketing Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An Email Marketing Specialist is not someone who sends occasional newsletters. They are a revenue-generating machine who owns your email list, builds automated sequences, runs campaigns, and turns subscribers into customers — driving 20-40% of total revenue for most e-commerce and SaaS businesses.',
        'Most businesses are leaving money on the table with email because no one owns it — welcome sequences are broken, campaigns are inconsistent, segmentation doesn\'t exist, and the list is full of dead subscribers. An Email Marketing Specialist fixes all of it and turns email into your highest-ROI channel.',
        'Their day starts with performance analysis — checking open rates, click rates, conversion rates, and revenue from yesterday\'s campaigns. From there they move into campaign creation — writing email copy, designing templates, building segments, and scheduling sends.',
        'On the automation side, they\'re building welcome sequences that convert new subscribers, abandoned cart flows that recover lost sales, post-purchase sequences that drive repeat orders, and win-back campaigns that re-engage inactive customers. Every sequence is tested and optimized for maximum revenue.',
        'They also manage list health obsessively — cleaning inactive subscribers, running re-engagement campaigns, implementing double opt-in, maintaining deliverability, and ensuring your emails land in the inbox, not spam. They know that a smaller, engaged list beats a large, dead list every time.',
        'Every month they deliver a report that shows email performance — list growth, open rate, click rate, conversion rate, revenue per subscriber, and total email revenue. No fluff. Just email marketing that drives predictable revenue.'
      ],
      tasks: [
        'Email campaign creation and execution',
        'Automated sequence building (Klaviyo/Mailchimp)',
        'Email copywriting and design',
        'List segmentation and targeting',
        'A/B testing and optimization',
        'Deliverability management',
        'List growth strategy',
        'Abandoned cart flow optimization',
        'Post-purchase sequence management',
        'Monthly email revenue reporting'
      ],
      tools: ['Klaviyo', 'Mailchimp', 'ActiveCampaign', 'FunnelKit', 'Canva', 'Litmus', 'Google Analytics 4', 'Shopify/WooCommerce', 'Looker Studio', 'Slack'],
      bottomLine: 'A great Email Marketing Specialist doesn\'t just send emails — they generate revenue. Every sequence they build, every campaign they send, every segment they create drives more sales at the highest ROI of any marketing channel. Email is still king.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'Email Campaign Management',
      'Klaviyo Expertise',
      'Mailchimp / ActiveCampaign',
      'Email Copywriting',
      'Email Design & Templates',
      'List Segmentation',
      'Automated Sequence Building',
      'A/B Testing',
      'Deliverability Management',
      'Abandoned Cart Flows',
      'Post-Purchase Sequences',
      'List Growth Strategy',
      'Conversion Optimization',
      'Google Analytics 4',
      'E-commerce Integration',
      'Revenue Attribution',
      'Looker Studio Reporting',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our email marketing specialist from Rapid Tal built automated sequences that generate $45K/month on autopilot. Email is now 32% of our total revenue and our list engagement is the highest it\'s ever been.',
      attribution: '— Australian e-commerce founder, Brisbane'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["marketing-copywriter","marketing-assistant","content-strategist"]
  }
,

  'video-editor': {
    slug: 'video-editor',
    title: 'Video Editor',
    metaDescription: 'How much does a Video Editor cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 76% average savings for video production.',
    heroGhost: 'VE',
    roleTag: 'Cost Comparison — Video Production Roles',
    headline: 'VIDEO EDITOR:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Video Editor in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '76%',
      savedPerYear: '$63K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Video Editor is not someone who stitches clips together in iMovie. They are a professional video production specialist who transforms raw footage into polished, engaging content — Reels, YouTube videos, ads, testimonials, product demos, and brand content that stops the scroll and drives action.',
        'Most businesses are sitting on hours of raw footage that never gets edited because local editors charge $100-150/hour and have 2-week turnarounds. Filipino video editors are exceptional, fast, and criminally underpriced — delivering broadcast-quality work at a fraction of the cost.',
        'Their day starts with footage review — organizing raw files, selecting the best takes, and planning the edit. From there they move into editing — cutting footage, adding transitions, color grading, sound design, motion graphics, captions, and exporting in the right formats for each platform.',
        'On the creative side, they understand platform-specific editing styles — fast cuts and captions for Reels and TikTok, longer storytelling for YouTube, polished professionalism for LinkedIn, and scroll-stopping hooks for ads. They don\'t just edit — they optimize for each platform\'s algorithm and audience behavior.',
        'They also manage the entire post-production workflow — file organization, version control, feedback implementation, and delivery. They work fast, iterate quickly, and can turn around edits in 24-48 hours instead of weeks.',
        'Every month they deliver a report that shows video production output — videos edited, turnaround time, platform performance, engagement metrics, and content pipeline status. No fluff. Just video content that performs.'
      ],
      tasks: [
        'Video editing (Reels, YouTube, ads, testimonials)',
        'Color grading and color correction',
        'Sound design and audio mixing',
        'Motion graphics and text overlays',
        'Caption and subtitle creation',
        'Platform-specific optimization',
        'Thumbnail design',
        'File organization and asset management',
        'Feedback implementation and revisions',
        'Monthly video production reporting'
      ],
      tools: ['Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects', 'CapCut', 'Canva', 'Frame.io', 'Google Drive', 'Dropbox', 'Slack'],
      bottomLine: 'A great Video Editor doesn\'t just edit footage — they create content that converts. Every video they produce, every edit they refine, every platform they optimize for drives more engagement and more sales. Video is the highest-performing content format in 2026.'
    },
    costs: {
      auBaseSalary: 5250,
      phBaseSalary: 1300,
      auSuper: 604,
      auLeave: 454,
      auSick: 242,
      auRecruitment: 958,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 79
    },
    skills: [
      'Video Editing (Premiere Pro)',
      'Final Cut Pro / DaVinci Resolve',
      'Color Grading & Correction',
      'Sound Design & Audio Mixing',
      'Motion Graphics (After Effects)',
      'Caption & Subtitle Creation',
      'Reels & TikTok Editing',
      'YouTube Video Editing',
      'Ad Video Production',
      'Thumbnail Design',
      'Platform-Specific Optimization',
      'CapCut / Mobile Editing',
      'File Management',
      'Fast Turnaround',
      'Feedback Implementation',
      'Frame.io / Collaboration Tools',
      'Creative Storytelling',
      'Monthly Production Reporting'
    ],
    testimonial: {
      text: 'Our video editor from Rapid Tal edits 15-20 videos per week with 24-hour turnaround. Our Reels get 3x more engagement than before and our YouTube channel finally looks professional. She\'s fast, creative, and costs less than one local edit.',
      attribution: '— Australian content creator, Melbourne'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["graphic-designer","ugc-manager","podcast-producer"]
  },

  'graphic-designer': {
    slug: 'graphic-designer',
    title: 'Graphic Designer',
    metaDescription: 'How much does a Graphic Designer cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 75% average savings for design work.',
    heroGhost: 'GD',
    roleTag: 'Cost Comparison — Design & Creative Roles',
    headline: 'GRAPHIC DESIGNER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Graphic Designer in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '75%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Graphic Designer is not someone who makes logos in Canva. They are a professional visual communicator who creates ad creatives, social assets, pitch decks, brand collateral, email designs, landing page graphics, and every visual element your business needs — turning ideas into designs that convert.',
        'Most businesses are paying agencies $150/hour for design work or using Fiverr for inconsistent quality. A full-time dedicated designer costs less than 10 hours of agency work per month and delivers unlimited revisions, consistent brand execution, and designs that actually perform.',
        'Their day starts with design briefs — understanding what needs to be created, the goal of each asset, and the target audience. From there they move into creation — designing ad creatives for Meta and Google, social graphics for Instagram and LinkedIn, email headers, landing page assets, and presentation decks.',
        'On the execution side, they work in Adobe Creative Suite (Photoshop, Illustrator, InDesign) and Figma, creating designs that are on-brand, conversion-optimized, and platform-specific. They understand design principles — hierarchy, contrast, color theory, typography — and apply them to every asset.',
        'They also manage the design system — maintaining brand guidelines, organizing design files, creating templates for recurring needs, and ensuring every piece of content is visually consistent. They don\'t just design — they build scalable design systems.',
        'Every month they deliver a report that shows design output — assets created, turnaround time, design performance (ad CTR, landing page conversion rate), and creative pipeline status. No fluff. Just design work that drives results.'
      ],
      tasks: [
        'Ad creative design (Meta, Google, LinkedIn)',
        'Social media graphic creation',
        'Email design and templates',
        'Landing page and website graphics',
        'Pitch deck and presentation design',
        'Brand collateral (brochures, flyers, etc.)',
        'Infographic design',
        'Icon and illustration creation',
        'Design system maintenance',
        'Monthly design output reporting'
      ],
      tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Canva', 'Sketch', 'Google Drive', 'Dropbox', 'Frame.io', 'Slack'],
      bottomLine: 'A great Graphic Designer doesn\'t just make things look good — they create visuals that convert. Every ad creative they design, every social asset they produce, every landing page graphic they create drives more engagement and more sales. Design is the first impression.'
    },
    costs: {
      auBaseSalary: 5500,
      phBaseSalary: 1400,
      auSuper: 633,
      auLeave: 476,
      auSick: 254,
      auRecruitment: 1000,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 83
    },
    skills: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe InDesign',
      'Figma / Sketch',
      'Ad Creative Design',
      'Social Media Graphics',
      'Email Design',
      'Landing Page Design',
      'Presentation Design',
      'Brand Collateral Design',
      'Infographic Design',
      'Icon & Illustration',
      'Typography',
      'Color Theory',
      'Design Systems',
      'Brand Guidelines',
      'Fast Turnaround',
      'Monthly Output Reporting'
    ],
    testimonial: {
      text: 'Our graphic designer from Rapid Tal creates 40-50 assets per week — ad creatives, social graphics, email designs. Our ad CTR improved by 68% with her designs and we stopped paying agencies $6K/month. Best creative hire we\'ve made.',
      attribution: '— Australian DTC founder, Sydney'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["brand-designer","video-editor","social-media-manager"]
  },

  'content-strategist': {
    slug: 'content-strategist',
    title: 'Content Strategist',
    metaDescription: 'How much does a Content Strategist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for content strategy.',
    heroGhost: 'CS',
    roleTag: 'Cost Comparison — Content Strategy Roles',
    headline: 'CONTENT\nSTRATEGIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Content Strategist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Content Strategist is not a writer who occasionally plans topics. They are the strategic brain behind your entire content operation — building editorial calendars, connecting content to revenue goals, identifying content gaps, and ensuring every piece of content serves a business purpose.',
        'Most businesses create content randomly — blog posts that no one reads, social content with no strategy, videos that don\'t convert, and zero connection between content and revenue. A Content Strategist fixes all of it and turns content into a predictable growth engine.',
        'Their day starts with performance analysis — reviewing which content is driving traffic, engagement, and conversions, and which is underperforming. From there they move into planning — building content calendars aligned with product launches, seasonal trends, and business goals.',
        'On the strategy side, they\'re identifying content pillars that resonate with your audience, mapping content to the buyer journey (awareness, consideration, decision), and ensuring you\'re creating content that moves prospects toward purchase, not just content for content\'s sake.',
        'They also coordinate content production — briefing writers, designers, and video editors, managing deadlines, reviewing drafts, and ensuring everything is on-brand and on-strategy. They\'re the conductor of your content orchestra.',
        'Every month they deliver a report that shows content performance — traffic by content type, engagement metrics, conversion rate, pipeline influenced by content, and content ROI. No fluff. Just content that drives business results.'
      ],
      tasks: [
        'Editorial calendar planning and management',
        'Content strategy development',
        'Content pillar identification',
        'Buyer journey content mapping',
        'Content brief creation',
        'Content team coordination',
        'Performance analysis and optimization',
        'Content gap analysis',
        'SEO content strategy',
        'Monthly content performance reporting'
      ],
      tools: ['Notion', 'Airtable', 'Google Analytics 4', 'SEMrush', 'Ahrefs', 'Google Docs', 'Looker Studio', 'HubSpot', 'Slack', 'Trello'],
      bottomLine: 'A great Content Strategist doesn\'t just plan content — they connect content to revenue. Every calendar they build, every strategy they develop, every piece they brief drives more traffic, more leads, and more sales. Content strategy is the difference between random posts and predictable growth.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Content Strategy Development',
      'Editorial Calendar Planning',
      'Content Pillar Identification',
      'Buyer Journey Mapping',
      'Content Brief Writing',
      'Team Coordination',
      'Performance Analysis',
      'Content Gap Analysis',
      'SEO Strategy',
      'Google Analytics 4',
      'SEMrush / Ahrefs',
      'Notion / Airtable',
      'Content ROI Tracking',
      'Strategic Thinking',
      'Project Management',
      'Looker Studio Reporting',
      'HubSpot',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our content strategist from Rapid Tal built a 90-day content calendar that aligns perfectly with our product launches. Content-driven leads are up 180% and our content team finally knows what to create and why. She thinks strategically and executes flawlessly.',
      attribution: '— Australian SaaS founder, Brisbane'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["copywriter","social-media-manager","email-marketing-specialist"]
  }
,

  'ugc-manager': {
    slug: 'ugc-manager',
    title: 'UGC Manager',
    metaDescription: 'How much does a UGC Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for user-generated content management.',
    heroGhost: 'UG',
    roleTag: 'Cost Comparison — Content & Creator Management Roles',
    headline: 'UGC MANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a UGC Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A UGC Manager is not someone who occasionally asks customers for reviews. They are a creator coordination specialist who manages your entire user-generated content operation — finding creators, briefing them, managing deliverables, repurposing content across channels, and turning authentic creator content into your highest-performing marketing assets.',
        'Most brands are missing out on UGC because no one owns the process — creator outreach is inconsistent, briefs are unclear, content delivery is slow, and great content sits unused. A UGC Manager fixes all of it and builds a systematic UGC engine that produces 20-40 pieces of content per month.',
        'Their day starts with creator management — reaching out to potential creators, reviewing applications, onboarding new creators, and maintaining relationships with your creator roster. From there they move into briefing — creating clear content briefs, setting expectations, managing timelines, and ensuring creators deliver what you need.',
        'On the content side, they\'re reviewing submissions, selecting the best content, editing for platform optimization, adding captions and CTAs, and repurposing UGC across ads, social media, email, and landing pages. One piece of UGC becomes 5-10 assets across channels.',
        'They also track performance obsessively — monitoring which creators produce the best-performing content, which content formats drive conversions, and which platforms respond best to UGC. They optimize your creator roster based on data, not guesswork.',
        'Every month they deliver a report that shows UGC performance — creators managed, content pieces delivered, repurposing output, ad performance, engagement metrics, and UGC ROI. No fluff. Just authentic content that converts better than brand content.'
      ],
      tasks: [
        'Creator outreach and recruitment',
        'Creator onboarding and management',
        'Content brief creation',
        'Deliverable management and review',
        'Content editing and optimization',
        'Multi-platform repurposing',
        'UGC ad creative testing',
        'Creator performance tracking',
        'Payment and contract management',
        'Monthly UGC performance reporting'
      ],
      tools: ['Notion', 'Airtable', 'Google Drive', 'Canva', 'CapCut', 'Frame.io', 'Meta Ads Manager', 'Google Ads', 'Slack', 'PayPal'],
      bottomLine: 'A great UGC Manager doesn\'t just collect content — they build a content production engine. Every creator they manage, every brief they send, every piece they repurpose drives more authentic, high-performing content at a fraction of traditional production costs. UGC is the highest-converting content format in 2026.'
    },
    costs: {
      auBaseSalary: 5750,
      phBaseSalary: 1500,
      auSuper: 661,
      auLeave: 498,
      auSick: 265,
      auRecruitment: 1042,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 86
    },
    skills: [
      'Creator Outreach & Recruitment',
      'Creator Relationship Management',
      'Content Brief Writing',
      'Deliverable Management',
      'Content Editing & Optimization',
      'Multi-Platform Repurposing',
      'UGC Ad Creative Strategy',
      'Performance Tracking',
      'Contract & Payment Management',
      'Canva / CapCut',
      'Frame.io / Collaboration Tools',
      'Meta Ads Manager',
      'Google Ads',
      'Notion / Airtable',
      'Communication Skills',
      'Project Management',
      'ROI Analysis',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our UGC manager from Rapid Tal manages 25 creators and delivers 30-40 pieces of content per month. UGC ads outperform our brand ads by 3x and our cost per creative dropped 85%. She built our entire UGC system from scratch.',
      attribution: '— Australian DTC founder, Melbourne'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["social-media-manager","video-editor","content-strategist"]
  },

  'brand-designer': {
    slug: 'brand-designer',
    title: 'Brand Designer',
    metaDescription: 'How much does a Brand Designer cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for brand design work.',
    heroGhost: 'BD',
    roleTag: 'Cost Comparison — Brand & Design Roles',
    headline: 'BRAND DESIGNER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Brand Designer in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Brand Designer is not a graphic designer who makes logos. They are a strategic visual identity specialist who builds and maintains your entire brand system — identity, brand guidelines, visual language, typography, color systems, and ensuring every visual touchpoint is on-brand and strategically aligned.',
        'Most businesses have inconsistent branding because no one owns it — different designers use different fonts, colors are inconsistent, brand guidelines don\'t exist or aren\'t followed, and the brand looks different everywhere. A Brand Designer fixes all of it and creates visual consistency that builds trust.',
        'Their day starts with brand system maintenance — reviewing recent creative work, ensuring brand guidelines are being followed, updating templates, and maintaining the design system. From there they move into strategic design work — creating new brand assets, designing key marketing materials, and evolving the brand as the business grows.',
        'On the strategic side, they\'re thinking about brand positioning, competitive differentiation, and how visual identity supports business goals. They don\'t just make things look good — they make strategic design decisions that strengthen brand perception and drive business results.',
        'They also create comprehensive brand guidelines — documenting logo usage, color palettes, typography, photography style, iconography, and design principles. They ensure anyone creating content for your brand can do so consistently and on-brand.',
        'Every quarter they deliver a report that shows brand consistency metrics, design system usage, brand asset creation, and brand perception improvements. No fluff. Just strategic brand design that builds equity and drives business value.'
      ],
      tasks: [
        'Brand identity development and evolution',
        'Brand guidelines creation and maintenance',
        'Visual language and design system development',
        'Typography and color system design',
        'Logo design and brand mark creation',
        'Brand collateral design (strategic)',
        'Photography and visual direction',
        'Brand consistency auditing',
        'Template creation and management',
        'Quarterly brand performance reporting'
      ],
      tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Figma', 'Sketch', 'Brand.ai', 'Google Drive', 'Notion', 'Frame.io', 'Slack'],
      bottomLine: 'A great Brand Designer doesn\'t just design assets — they build brand equity. Every guideline they create, every system they develop, every asset they design strengthens your brand and makes every marketing dollar work harder. Brand consistency is the foundation of trust.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'Brand Identity Design',
      'Brand Guidelines Development',
      'Visual Language Design',
      'Typography Systems',
      'Color System Design',
      'Logo & Brand Mark Design',
      'Design System Development',
      'Adobe Illustrator',
      'Adobe Photoshop',
      'Figma / Sketch',
      'Brand Strategy',
      'Visual Direction',
      'Brand Consistency Auditing',
      'Template Design',
      'Photography Direction',
      'Strategic Thinking',
      'Documentation',
      'Quarterly Reporting'
    ],
    testimonial: {
      text: 'Our brand designer from Rapid Tal built comprehensive brand guidelines and a complete design system. Our brand consistency improved from 40% to 95% and our brand perception scores increased 32%. She thinks strategically and executes beautifully.',
      attribution: '— Australian scale-up founder, Sydney'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["graphic-designer","content-strategist","marketing-assistant"]
  },

  'podcast-producer': {
    slug: 'podcast-producer',
    title: 'Podcast Producer',
    metaDescription: 'How much does a Podcast Producer cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 75% average savings for podcast production.',
    heroGhost: 'PP',
    roleTag: 'Cost Comparison — Podcast Production Roles',
    headline: 'PODCAST\nPRODUCER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Podcast Producer in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '75%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Podcast Producer is not someone who uploads episodes to Spotify. They are a full-service podcast operations specialist who handles editing, show notes, distribution, guest coordination, audiograms, social promotion, and everything needed to run a professional podcast that actually grows an audience.',
        'Most Australian business owners have podcasts that are inconsistent, poorly edited, and get 50 downloads per episode because no one owns the production. A Podcast Producer fixes all of it and turns your podcast into a professional content engine that builds authority and drives business.',
        'Their day starts with episode editing — cleaning up audio, removing filler words, adding intro/outro music, balancing levels, and exporting in the right formats. From there they move into distribution — uploading to all platforms, writing show notes, creating timestamps, and optimizing metadata for discoverability.',
        'On the promotion side, they\'re creating audiograms for social media, pulling quote graphics, writing social captions, and repurposing podcast content into blog posts, LinkedIn articles, and email newsletters. One episode becomes 10+ pieces of content.',
        'They also handle guest coordination — researching potential guests, sending invitations, scheduling recordings, sending prep materials, and following up post-episode. They make guesting on your podcast a seamless, professional experience.',
        'Every month they deliver a report that shows podcast performance — downloads, listener growth, top episodes, social engagement, repurposed content output, and guest pipeline status. No fluff. Just a professional podcast that builds your brand.'
      ],
      tasks: [
        'Podcast episode editing and production',
        'Audio cleanup and enhancement',
        'Show notes and timestamp creation',
        'Multi-platform distribution',
        'Audiogram and social asset creation',
        'Guest research and coordination',
        'Content repurposing (blog, social, email)',
        'Metadata optimization',
        'Social media promotion',
        'Monthly podcast performance reporting'
      ],
      tools: ['Adobe Audition', 'Descript', 'Riverside.fm', 'Anchor/Spotify for Podcasters', 'Canva', 'Headliner', 'Google Docs', 'Calendly', 'Notion', 'Slack'],
      bottomLine: 'A great Podcast Producer doesn\'t just edit episodes — they build a podcast engine. Every episode they produce, every guest they coordinate, every piece of content they repurpose drives more authority, more audience, and more business. Podcasting is the long game that compounds.'
    },
    costs: {
      auBaseSalary: 5500,
      phBaseSalary: 1400,
      auSuper: 633,
      auLeave: 476,
      auSick: 254,
      auRecruitment: 1000,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 83
    },
    skills: [
      'Podcast Editing (Audition/Descript)',
      'Audio Cleanup & Enhancement',
      'Show Notes Writing',
      'Timestamp Creation',
      'Multi-Platform Distribution',
      'Audiogram Creation',
      'Social Asset Design',
      'Guest Coordination',
      'Content Repurposing',
      'Metadata Optimization',
      'Riverside.fm / Recording Platforms',
      'Canva / Headliner',
      'Social Media Promotion',
      'Project Management',
      'Communication Skills',
      'Notion / Organization',
      'SEO for Podcasts',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our podcast producer from Rapid Tal edits our weekly episodes, writes show notes, creates audiograms, and coordinates all our guests. Our downloads tripled in 6 months and the podcast finally feels professional. She handles everything.',
      attribution: '— Australian business owner, Brisbane'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["video-editor","content-strategist","social-media-manager"]
  },

  'marketing-copywriter': {
    slug: 'marketing-copywriter',
    title: 'Marketing Copywriter',
    metaDescription: 'How much does a Marketing Copywriter cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 75% average savings for conversion copywriting.',
    heroGhost: 'MC',
    roleTag: 'Cost Comparison — Marketing & Conversion Roles',
    headline: 'MARKETING\nCOPYWRITER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Marketing Copywriter in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '75%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Marketing Copywriter is not a general writer who occasionally writes ads. They are a conversion-focused specialist who writes copy that sells — ad copy, landing pages, email sequences, sales pages, product descriptions, and every piece of marketing copy designed to move prospects from awareness to purchase.',
        'Most businesses have weak marketing copy because it\'s written by people who don\'t understand direct response principles, conversion psychology, or how to write copy that actually drives action. A Marketing Copywriter fixes all of it and turns every marketing asset into a revenue-generating machine.',
        'Their day starts with research — studying your audience, analyzing competitor messaging, reviewing what\'s working in your industry, and identifying the pain points your product solves. From there they move into writing — crafting headlines that hook attention, body copy that builds desire, and CTAs that drive clicks.',
        'On the execution side, they\'re writing ad copy that stops the scroll and drives clicks, landing page copy that converts visitors into leads, email sequences that nurture prospects into customers, and sales pages that close deals. Every word is intentional, every sentence is tested.',
        'They also understand conversion copywriting frameworks — AIDA, PAS, BAB, FAB, Before-After-Bridge — and know when to use each one. They don\'t just write — they engineer copy for maximum conversion. Every headline, every bullet point, every CTA is optimized for action.',
        'Every month they deliver a report that shows copy performance — ad CTR, landing page conversion rate, email open and click rates, sales page conversion rate, and revenue attributed to copy improvements. No fluff. Just copy that converts.'
      ],
      tasks: [
        'Ad copywriting (Meta, Google, LinkedIn)',
        'Landing page copy and optimization',
        'Email sequence and campaign writing',
        'Sales page copywriting',
        'Product description writing',
        'CTA optimization',
        'A/B testing and copy iteration',
        'Conversion research and analysis',
        'Copywriting framework application',
        'Monthly copy performance reporting'
      ],
      tools: ['Google Docs', 'Notion', 'Grammarly', 'Hemingway Editor', 'ChatGPT', 'Jasper', 'Google Analytics 4', 'Hotjar', 'Unbounce', 'Slack'],
      bottomLine: 'A great Marketing Copywriter doesn\'t just write words — they write revenue. Every ad they craft, every landing page they optimize, every email they send drives more clicks, more leads, and more sales. Marketing copy is the difference between traffic and revenue.'
    },
    costs: {
      auBaseSalary: 5500,
      phBaseSalary: 1400,
      auSuper: 633,
      auLeave: 476,
      auSick: 254,
      auRecruitment: 1000,
      phRecruitment: 333,
      tools: 300,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 83
    },
    skills: [
      'Ad Copywriting',
      'Landing Page Copy',
      'Email Copywriting',
      'Sales Page Writing',
      'Product Description Writing',
      'CTA Optimization',
      'A/B Testing',
      'Conversion Research',
      'Copywriting Frameworks (AIDA, PAS)',
      'Direct Response Copywriting',
      'Conversion Psychology',
      'Grammarly / Hemingway',
      'Google Analytics 4',
      'Hotjar / Heatmaps',
      'Persuasion Principles',
      'Brand Voice Adaptation',
      'Fast Turnaround',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our marketing copywriter from Rapid Tal rewrote our ad copy and landing pages. Ad CTR went from 1.8% to 4.2% and landing page conversion rate doubled. She understands conversion psychology and writes copy that actually sells.',
      attribution: '— Australian SaaS founder, Melbourne'
    },
    category: 'Marketing & Creative Specialists',
    categorySlug: 'marketing-creative-specialists',
    relatedRoles: ["copywriter","email-marketing-specialist","content-strategist"]
  }
,

  'executive-assistant': {
    slug: 'executive-assistant',
    title: 'Executive Assistant',
    metaDescription: 'How much does an Executive Assistant cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 76% average savings for executive support.',
    heroGhost: 'EA',
    roleTag: 'Cost Comparison — Executive Support Roles',
    headline: 'EXECUTIVE\nASSISTANT:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an Executive Assistant in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '76%',
      savedPerYear: '$63K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An Executive Assistant is not someone who answers emails and books meetings. They are a professional operations partner who manages your calendar, inbox, travel, reporting, and everything that keeps you focused on high-value work — turning chaos into systems and giving you back 15-20 hours per week.',
        'Most founders are drowning in admin work because they don\'t have a dedicated EA — calendars are a mess, emails pile up, travel is stressful, and strategic work gets pushed aside. An Executive Assistant fixes all of it and multiplies your productivity by handling everything that doesn\'t require your unique expertise.',
        'Their day starts with inbox management — triaging emails, responding to routine requests, flagging urgent items, and ensuring nothing important falls through the cracks. From there they move into calendar management — scheduling meetings, blocking focus time, coordinating across time zones, and ensuring your day runs smoothly.',
        'On the operations side, they\'re managing travel arrangements, coordinating with your team, preparing meeting agendas and briefs, taking notes, following up on action items, and ensuring every commitment is tracked and completed. They\'re your operational brain.',
        'They also handle reporting and documentation — compiling weekly reports, tracking KPIs, maintaining systems, and keeping everything organized. They know where every file is, what every meeting was about, and what needs to happen next.',
        'Every week they deliver a summary that shows time saved, meetings coordinated, emails managed, travel arranged, and action items completed. No fluff. Just executive support that gives you your time back.'
      ],
      tasks: [
        'Calendar management and scheduling',
        'Inbox management and email triage',
        'Travel coordination and booking',
        'Meeting preparation and agenda creation',
        'Note-taking and action item tracking',
        'Report compilation and KPI tracking',
        'Document organization and filing',
        'Team coordination and communication',
        'Expense tracking and reporting',
        'Weekly executive summary reporting'
      ],
      tools: ['Google Workspace', 'Microsoft 365', 'Calendly', 'Notion', 'Asana', 'Slack', 'Zoom', 'Expensify', 'TravelPerk', 'Loom'],
      bottomLine: 'A great Executive Assistant doesn\'t just handle admin — they multiply your productivity. Every hour they save you, every meeting they coordinate, every system they maintain gives you more time to focus on growing your business. EAs are the highest-ROI hire for scaling founders.'
    },
    costs: {
      auBaseSalary: 5250,
      phBaseSalary: 1300,
      auSuper: 604,
      auLeave: 454,
      auSick: 242,
      auRecruitment: 958,
      phRecruitment: 333,
      tools: 300,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 79
    },
    skills: [
      'Calendar Management',
      'Email Management & Triage',
      'Travel Coordination',
      'Meeting Preparation',
      'Note-Taking & Documentation',
      'Report Compilation',
      'KPI Tracking',
      'Document Organization',
      'Team Coordination',
      'Expense Management',
      'Google Workspace / Microsoft 365',
      'Notion / Asana',
      'Time Zone Management',
      'Communication Skills',
      'Proactive Problem Solving',
      'Discretion & Confidentiality',
      'Fast Response Time',
      'Weekly Reporting'
    ],
    testimonial: {
      text: 'Our executive assistant from Rapid Tal saves me 15-20 hours per week. My calendar is organized, my inbox is under control, and I finally have time to focus on strategy. She\'s proactive, reliable, and worth every dollar.',
      attribution: '— Australian founder, Melbourne'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["virtual-assistant","marketing-assistant","operations-manager"]
  },

  'virtual-assistant': {
    slug: 'virtual-assistant',
    title: 'Virtual Assistant',
    metaDescription: 'How much does a Virtual Assistant cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 75% average savings for remote admin support.',
    heroGhost: 'VA',
    roleTag: 'Cost Comparison — Virtual Assistant Roles',
    headline: 'VIRTUAL\nASSISTANT:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Virtual Assistant in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '75%',
      savedPerYear: '$62K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Virtual Assistant is not a part-time freelancer you hire for one-off tasks. They are a dedicated remote team member who handles administrative work, operational tasks, research, scheduling, and everything that keeps your business running smoothly — working full-time from the Philippines at a fraction of local costs.',
        'Most business owners waste 10-15 hours per week on tasks that don\'t require their expertise — admin work, data entry, research, scheduling, and operational tasks. A Virtual Assistant handles all of it and gives you back time to focus on revenue-generating activities.',
        'Their day is flexible and task-based — managing your calendar, responding to emails, conducting research, updating databases, coordinating with vendors, scheduling appointments, and handling whatever operational work your business needs. They\'re your remote right hand.',
        'On the execution side, they\'re highly adaptable — learning your systems, following your processes, and taking ownership of recurring tasks. They don\'t need hand-holding — they take initiative, solve problems, and get things done without constant supervision.',
        'They also bring cost efficiency that\'s impossible to match locally — full-time dedicated support for less than what you\'d pay a local VA for 10 hours per week. The economics are so favorable that most businesses hire multiple VAs once they see the value.',
        'Every week they deliver a summary that shows tasks completed, hours worked, projects delivered, and operational improvements made. No fluff. Just reliable remote support that keeps your business running.'
      ],
      tasks: [
        'Administrative task management',
        'Email and calendar management',
        'Data entry and database updates',
        'Research and information gathering',
        'Vendor and supplier coordination',
        'Appointment scheduling',
        'Document preparation and formatting',
        'Social media scheduling support',
        'Customer inquiry handling',
        'Weekly task completion reporting'
      ],
      tools: ['Google Workspace', 'Microsoft 365', 'Notion', 'Asana', 'Trello', 'Slack', 'Zoom', 'Canva', 'Calendly', 'Loom'],
      bottomLine: 'A great Virtual Assistant doesn\'t just complete tasks — they give you your time back. Every hour they work, every task they complete, every system they maintain frees you to focus on growing your business. VAs are the foundation of remote-first operations.'
    },
    costs: {
      auBaseSalary: 5000,
      phBaseSalary: 1250,
      auSuper: 575,
      auLeave: 433,
      auSick: 231,
      auRecruitment: 917,
      phRecruitment: 333,
      tools: 250,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 75
    },
    skills: [
      'Administrative Support',
      'Email Management',
      'Calendar Management',
      'Data Entry',
      'Research Skills',
      'Vendor Coordination',
      'Appointment Scheduling',
      'Document Preparation',
      'Social Media Scheduling',
      'Customer Service',
      'Google Workspace / Microsoft 365',
      'Notion / Asana / Trello',
      'Communication Skills',
      'Time Management',
      'Proactive Problem Solving',
      'Fast Learning',
      'Reliability',
      'Weekly Reporting'
    ],
    testimonial: {
      text: 'Our virtual assistant from Rapid Tal handles everything from data entry to research to scheduling. She saves me 12+ hours per week and costs less than a local VA for 8 hours. Best operational hire we\'ve made.',
      attribution: '— Australian business owner, Sydney'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["executive-assistant","marketing-assistant","data-entry-specialist"]
  },

  'marketing-assistant': {
    slug: 'marketing-assistant',
    title: 'Marketing Assistant',
    metaDescription: 'How much does a Marketing Assistant cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for marketing support.',
    heroGhost: 'MA',
    roleTag: 'Cost Comparison — Marketing Support Roles',
    headline: 'MARKETING\nASSISTANT:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Marketing Assistant in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Marketing Assistant is not an intern who makes coffee and files papers. They are a professional marketing support specialist who handles scheduling, reporting, asset management, campaign coordination, and all the operational work that keeps your marketing team productive — freeing your marketers to focus on strategy and execution.',
        'Most marketing teams are bogged down in admin work — scheduling social posts, organizing assets, compiling reports, updating spreadsheets, and coordinating campaigns. A Marketing Assistant handles all of it and makes your marketing team 30-40% more productive.',
        'Their day starts with campaign support — scheduling social media posts, uploading blog content, updating email sequences, and ensuring all marketing activities are executed on time. From there they move into asset management — organizing creative files, maintaining brand libraries, and ensuring everyone has access to what they need.',
        'On the reporting side, they\'re compiling performance data, building dashboards, tracking KPIs, and creating reports that show what\'s working. They turn raw data into actionable insights that inform marketing decisions.',
        'They also coordinate across teams — managing marketing calendars, scheduling meetings, tracking project deadlines, and ensuring campaigns launch on time. They\'re the operational glue that holds marketing together.',
        'Every week they deliver a summary that shows tasks completed, campaigns supported, reports compiled, and marketing operations improvements. No fluff. Just marketing support that multiplies team productivity.'
      ],
      tasks: [
        'Social media post scheduling',
        'Content uploading and publishing',
        'Marketing asset organization',
        'Campaign coordination and tracking',
        'Performance report compilation',
        'Marketing calendar management',
        'Email sequence updates',
        'Dashboard creation and maintenance',
        'Team coordination and communication',
        'Weekly marketing operations reporting'
      ],
      tools: ['HubSpot', 'Google Analytics 4', 'Meta Business Suite', 'Canva', 'Notion', 'Asana', 'Google Workspace', 'Looker Studio', 'Slack', 'Airtable'],
      bottomLine: 'A great Marketing Assistant doesn\'t just handle admin — they multiply marketing team productivity. Every task they complete, every report they compile, every asset they organize gives your marketers more time to focus on strategy and growth. Marketing assistants are force multipliers.'
    },
    costs: {
      auBaseSalary: 5500,
      phBaseSalary: 1450,
      auSuper: 633,
      auLeave: 476,
      auSick: 254,
      auRecruitment: 1000,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 83
    },
    skills: [
      'Marketing Coordination',
      'Social Media Scheduling',
      'Content Publishing',
      'Asset Management',
      'Campaign Tracking',
      'Report Compilation',
      'Calendar Management',
      'Dashboard Creation',
      'Team Coordination',
      'HubSpot / Marketing Platforms',
      'Google Analytics 4',
      'Meta Business Suite',
      'Canva / Creative Tools',
      'Notion / Asana',
      'Looker Studio',
      'Communication Skills',
      'Attention to Detail',
      'Weekly Reporting'
    ],
    testimonial: {
      text: 'Our marketing assistant from Rapid Tal handles all our scheduling, reporting, and asset management. Our marketing team is 40% more productive and we finally have organized systems. She\'s the operational backbone of our marketing.',
      attribution: '— Australian marketing director, Brisbane'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["virtual-assistant","project-manager","social-media-manager"]
  }
,

  'project-manager': {
    slug: 'project-manager',
    title: 'Project Manager',
    metaDescription: 'How much does a Project Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 72% average savings for project coordination.',
    heroGhost: 'PM',
    roleTag: 'Cost Comparison — Project Management Roles',
    headline: 'PROJECT MANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Project Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '72%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Project Manager is not someone who sends status update emails. They are a professional delivery specialist who coordinates campaigns, manages agencies, tracks deliverables, ensures deadlines are met, and keeps complex marketing operations running smoothly — turning chaos into predictable execution.',
        'Most marketing teams miss deadlines, overspend budgets, and deliver inconsistent results because no one owns project coordination. A Project Manager fixes all of it and ensures every campaign launches on time, on budget, and on strategy.',
        'Their day starts with status tracking — checking project progress, identifying blockers, updating timelines, and ensuring everyone knows what needs to happen next. From there they move into coordination — running standups, managing agency relationships, tracking deliverables, and keeping all stakeholders aligned.',
        'On the execution side, they\'re building project plans, creating timelines, managing budgets, tracking resources, and ensuring every campaign has a clear path from brief to launch. They don\'t just track work — they remove obstacles and drive delivery.',
        'They also manage risk proactively — identifying potential delays, escalating issues early, finding solutions before problems become crises, and ensuring projects stay on track. They\'re the safety net that prevents marketing disasters.',
        'Every week they deliver a summary that shows project status, deliverables completed, budget tracking, timeline adherence, and upcoming milestones. No fluff. Just project management that ensures marketing operations run like clockwork.'
      ],
      tasks: [
        'Campaign coordination and planning',
        'Agency and vendor management',
        'Timeline creation and tracking',
        'Budget management and tracking',
        'Deliverable tracking and quality control',
        'Stakeholder communication',
        'Risk identification and mitigation',
        'Resource allocation and management',
        'Status reporting and updates',
        'Weekly project performance reporting'
      ],
      tools: ['Asana', 'Monday.com', 'Notion', 'Trello', 'Google Workspace', 'Slack', 'Zoom', 'Miro', 'Looker Studio', 'Excel/Google Sheets'],
      bottomLine: 'A great Project Manager doesn\'t just track tasks — they ensure delivery. Every campaign they coordinate, every deadline they meet, every budget they manage drives more predictable marketing execution. Project managers turn marketing chaos into systems.'
    },
    costs: {
      auBaseSalary: 6500,
      phBaseSalary: 1800,
      auSuper: 748,
      auLeave: 563,
      auSick: 300,
      auRecruitment: 1167,
      phRecruitment: 333,
      tools: 350,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 98
    },
    skills: [
      'Project Coordination',
      'Campaign Management',
      'Agency Management',
      'Timeline Planning',
      'Budget Tracking',
      'Deliverable Management',
      'Stakeholder Communication',
      'Risk Management',
      'Resource Allocation',
      'Asana / Monday.com',
      'Notion / Trello',
      'Google Workspace',
      'Status Reporting',
      'Problem Solving',
      'Cross-Team Coordination',
      'Deadline Management',
      'Process Documentation',
      'Weekly Performance Reporting'
    ],
    testimonial: {
      text: 'Our project manager from Rapid Tal coordinates 15-20 campaigns per month with zero missed deadlines. Agency relationships are smooth, budgets are on track, and our marketing operations finally feel professional. She\'s the glue that holds everything together.',
      attribution: '— Australian marketing director, Melbourne'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["operations-manager","marketing-assistant","sales-operations-specialist"]
  },

  'data-entry-specialist': {
    slug: 'data-entry-specialist',
    title: 'Data Entry Specialist',
    metaDescription: 'How much does a Data Entry Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 78% average savings for data processing.',
    heroGhost: 'DE',
    roleTag: 'Cost Comparison — Data Processing Roles',
    headline: 'DATA ENTRY\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Data Entry Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '78%',
      savedPerYear: '$64K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Data Entry Specialist is not a temporary worker you hire for one-off projects. They are a dedicated data processing professional who handles high-volume data entry, database management, CRM updates, and all the repetitive data work that keeps your business systems accurate and up-to-date — at a fraction of local costs.',
        'Most businesses have messy data because no one owns it — CRMs are outdated, spreadsheets are incomplete, databases have duplicates, and manual data work piles up. A Data Entry Specialist fixes all of it and ensures your data is clean, accurate, and actionable.',
        'Their day is pure execution — entering data from forms, updating CRM records, cleaning databases, processing invoices, digitizing documents, and maintaining data quality. They work fast, accurately, and consistently — processing hundreds or thousands of records per day.',
        'On the quality side, they\'re checking for errors, removing duplicates, standardizing formats, and ensuring data integrity. They don\'t just enter data — they maintain systems that your business relies on for decision-making.',
        'They also bring cost efficiency that\'s impossible to match locally — AU$55K locally vs AU$1,200/month direct. The ROI is so obvious that data entry is often the first role businesses offshore. The numbers are brutal.',
        'Every week they deliver a summary that shows records processed, databases updated, data quality improvements, and processing speed metrics. No fluff. Just high-volume data work that keeps your systems running.'
      ],
      tasks: [
        'High-volume data entry',
        'CRM database updates',
        'Spreadsheet data processing',
        'Invoice and document processing',
        'Data cleaning and deduplication',
        'Database maintenance',
        'Data quality checking',
        'Document digitization',
        'Data formatting and standardization',
        'Weekly data processing reporting'
      ],
      tools: ['Excel/Google Sheets', 'HubSpot', 'Salesforce', 'Airtable', 'Google Workspace', 'Microsoft 365', 'Notion', 'Data validation tools', 'OCR software', 'Slack'],
      bottomLine: 'A great Data Entry Specialist doesn\'t just enter data — they maintain system accuracy. Every record they process, every database they clean, every duplicate they remove ensures your business has reliable data to make decisions. Data entry is the easiest ROI story in offshore hiring.'
    },
    costs: {
      auBaseSalary: 4750,
      phBaseSalary: 1100,
      auSuper: 546,
      auLeave: 411,
      auSick: 219,
      auRecruitment: 875,
      phRecruitment: 333,
      tools: 200,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 71
    },
    skills: [
      'High-Volume Data Entry',
      'CRM Data Management',
      'Spreadsheet Processing',
      'Data Cleaning',
      'Database Maintenance',
      'Data Quality Control',
      'Document Processing',
      'Data Validation',
      'Excel / Google Sheets Advanced',
      'HubSpot / Salesforce',
      'Airtable',
      'Fast Typing Speed',
      'Attention to Detail',
      'Accuracy',
      'Time Management',
      'Process Following',
      'Data Formatting',
      'Weekly Reporting'
    ],
    testimonial: {
      text: 'Our data entry specialist from Rapid Tal processes 500-800 records per day with 99.8% accuracy. Our CRM is finally clean, our databases are up-to-date, and we\'re paying $1,200/month instead of $55K locally. The ROI is insane.',
      attribution: '— Australian operations manager, Sydney'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["virtual-assistant","lead-generation-specialist","crm-manager"]
  },

  'lead-generation-specialist': {
    slug: 'lead-generation-specialist',
    title: 'Lead Generation Specialist',
    metaDescription: 'How much does a Lead Generation Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 74% average savings for lead gen.',
    heroGhost: 'LG',
    roleTag: 'Cost Comparison — Lead Generation Roles',
    headline: 'LEAD GENERATION\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Lead Generation Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '74%',
      savedPerYear: '$61K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Lead Generation Specialist is not someone who buys email lists and sends spam. They are a professional prospecting machine who builds targeted lists, enriches data, conducts LinkedIn outreach, and fills your pipeline with qualified leads — turning cold databases into warm opportunities for your sales team.',
        'Most businesses struggle with lead generation because it\'s time-consuming, repetitive, and requires dedicated focus. A Lead Generation Specialist handles all of it and ensures your sales team always has fresh, qualified leads to work.',
        'Their day starts with list building — identifying ideal customer profiles, researching companies and decision-makers, using tools like Apollo and ZoomInfo to build targeted prospect lists. From there they move into data enrichment — finding email addresses, phone numbers, LinkedIn profiles, and all the contact information your sales team needs.',
        'On the outreach side, they\'re conducting LinkedIn prospecting, sending connection requests, engaging with content, and warming up prospects before handing them to sales. They don\'t just build lists — they start conversations.',
        'They also maintain data quality obsessively — verifying email addresses, updating contact information, removing bounces, and ensuring your CRM is full of accurate, actionable leads. Every lead they generate is qualified and ready to be worked.',
        'Every week they deliver a summary that shows leads generated, lists built, data enriched, LinkedIn connections made, and pipeline value created. No fluff. Just lead generation that keeps your sales team busy.'
      ],
      tasks: [
        'Targeted prospect list building',
        'Data enrichment and contact finding',
        'LinkedIn prospecting and outreach',
        'Email verification and validation',
        'CRM lead database management',
        'Ideal customer profile research',
        'Lead qualification and scoring',
        'Prospect engagement tracking',
        'Data quality maintenance',
        'Weekly lead generation reporting'
      ],
      tools: ['Apollo.io', 'ZoomInfo', 'LinkedIn Sales Navigator', 'Hunter.io', 'HubSpot', 'Salesforce', 'Google Workspace', 'Phantombuster', 'Clearbit', 'Slack'],
      bottomLine: 'A great Lead Generation Specialist doesn\'t just build lists — they fill pipelines. Every lead they generate, every contact they enrich, every prospect they warm up drives more opportunities for your sales team. Lead gen specialists are pipeline multipliers.'
    },
    costs: {
      auBaseSalary: 5750,
      phBaseSalary: 1500,
      auSuper: 661,
      auLeave: 498,
      auSick: 265,
      auRecruitment: 1042,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 86
    },
    skills: [
      'Prospect List Building',
      'Data Enrichment',
      'LinkedIn Prospecting',
      'Email Verification',
      'CRM Lead Management',
      'ICP Research',
      'Lead Qualification',
      'Contact Finding',
      'Apollo.io / ZoomInfo',
      'LinkedIn Sales Navigator',
      'Hunter.io / Email Tools',
      'HubSpot / Salesforce',
      'Research Skills',
      'Attention to Detail',
      'Data Quality Management',
      'Process Following',
      'Communication Skills',
      'Weekly Reporting'
    ],
    testimonial: {
      text: 'Our lead generation specialist from Rapid Tal generates 200-300 qualified leads per week. Our sales team always has fresh prospects to work and our pipeline is consistently full. She\'s systematic, accurate, and our best pipeline investment.',
      attribution: '— Australian B2B founder, Brisbane'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["sales-development-rep","data-entry-specialist","research-analyst"]
  }
,

  'research-analyst': {
    slug: 'research-analyst',
    title: 'Research Analyst',
    metaDescription: 'How much does a Research Analyst cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for market research.',
    heroGhost: 'RA',
    roleTag: 'Cost Comparison — Research & Analysis Roles',
    headline: 'RESEARCH ANALYST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Research Analyst in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Research Analyst is not someone who Googles competitors and calls it research. They are a professional intelligence gatherer who conducts market research, competitive analysis, customer insight studies, and strategic research that informs business decisions — turning questions into data-backed answers.',
        'Most businesses make decisions based on gut feel because they don\'t have dedicated research capacity. A Research Analyst fixes that and ensures every strategic decision is backed by data, competitive intelligence, and customer insights.',
        'Their day starts with research planning — understanding what questions need answering, defining research methodologies, and planning data collection. From there they move into execution — conducting desk research, analyzing competitors, surveying customers, and gathering intelligence from multiple sources.',
        'On the analysis side, they\'re synthesizing findings, identifying patterns, drawing insights, and creating reports that answer strategic questions. They don\'t just collect data — they turn data into actionable recommendations.',
        'They also monitor markets continuously — tracking competitor movements, industry trends, customer sentiment, and emerging opportunities. They\'re your strategic early warning system that spots threats and opportunities before they become obvious.',
        'Every month they deliver research reports that show market insights, competitive intelligence, customer findings, and strategic recommendations. No fluff. Just research that drives better business decisions.'
      ],
      tasks: [
        'Market research and analysis',
        'Competitive intelligence gathering',
        'Customer insight research',
        'Industry trend monitoring',
        'Survey design and execution',
        'Data synthesis and analysis',
        'Report writing and presentation',
        'Strategic recommendation development',
        'Research database maintenance',
        'Monthly research reporting'
      ],
      tools: ['Google Workspace', 'Excel/Google Sheets', 'SurveyMonkey', 'Typeform', 'SEMrush', 'SimilarWeb', 'Crunchbase', 'LinkedIn', 'Notion', 'Looker Studio'],
      bottomLine: 'A great Research Analyst doesn\'t just gather data — they generate insights. Every report they deliver, every competitor they analyze, every customer they survey drives better strategic decisions. Research analysts turn questions into answers.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
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
      'Market Research',
      'Competitive Analysis',
      'Customer Research',
      'Industry Analysis',
      'Survey Design',
      'Data Analysis',
      'Report Writing',
      'Strategic Thinking',
      'Excel / Google Sheets Advanced',
      'SurveyMonkey / Typeform',
      'SEMrush / SimilarWeb',
      'Research Methodologies',
      'Data Synthesis',
      'Insight Generation',
      'Presentation Skills',
      'Attention to Detail',
      'Critical Thinking',
      'Monthly Reporting'
    ],
    testimonial: {
      text: 'Our research analyst from Rapid Tal delivers 2-3 comprehensive research reports per month. We finally have competitive intelligence, customer insights, and market data informing our strategy. She\'s thorough, analytical, and invaluable.',
      attribution: '— Australian strategy director, Melbourne'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["lead-generation-specialist","data-entry-specialist","operations-manager"]
  },

  'customer-support-specialist': {
    slug: 'customer-support-specialist',
    title: 'Customer Support Specialist',
    metaDescription: 'How much does a Customer Support Specialist cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 76% average savings for customer service.',
    heroGhost: 'CS',
    roleTag: 'Cost Comparison — Customer Support Roles',
    headline: 'CUSTOMER SUPPORT\nSPECIALIST:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a Customer Support Specialist in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '76%',
      savedPerYear: '$63K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A Customer Support Specialist is not someone who reads scripts and transfers calls. They are a professional customer experience operator who handles live chat, email support, ticketing, and everything needed to keep customers happy — delivering service that builds loyalty and reduces churn.',
        'The Philippines is the global benchmark for customer support — excellent English, naturally service-oriented culture, patient communication style, and a genuine desire to help. Filipino support specialists consistently outperform local hires in customer satisfaction scores.',
        'Their day starts with ticket management — responding to customer inquiries, troubleshooting issues, escalating complex problems, and ensuring every customer gets a timely, helpful response. From there they move into proactive support — checking in with at-risk customers, following up on open issues, and preventing problems before they escalate.',
        'On the execution side, they\'re managing multiple channels — live chat, email, phone, and social media support. They respond fast, communicate clearly, and resolve issues efficiently. They don\'t just answer questions — they create positive customer experiences.',
        'They also maintain support quality obsessively — tracking response times, monitoring satisfaction scores, documenting common issues, and continuously improving support processes. They know that great support is the difference between customers who stay and customers who churn.',
        'Every week they deliver a summary that shows tickets resolved, response times, satisfaction scores, common issues, and support quality metrics. No fluff. Just customer support that builds loyalty and reduces churn.'
      ],
      tasks: [
        'Live chat and email support',
        'Ticket management and resolution',
        'Customer issue troubleshooting',
        'Escalation management',
        'Proactive customer outreach',
        'Multi-channel support coordination',
        'Support documentation maintenance',
        'Customer satisfaction tracking',
        'Common issue identification',
        'Weekly support performance reporting'
      ],
      tools: ['Zendesk', 'Intercom', 'Freshdesk', 'HubSpot Service Hub', 'Slack', 'Zoom', 'Google Workspace', 'Notion', 'Loom', 'Help Scout'],
      bottomLine: 'A great Customer Support Specialist doesn\'t just answer tickets — they build customer loyalty. Every issue they resolve, every customer they help, every experience they create drives higher satisfaction and lower churn. Filipino support specialists are world-class.'
    },
    costs: {
      auBaseSalary: 5250,
      phBaseSalary: 1300,
      auSuper: 604,
      auLeave: 454,
      auSick: 242,
      auRecruitment: 958,
      phRecruitment: 333,
      tools: 300,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 79
    },
    skills: [
      'Customer Service',
      'Live Chat Support',
      'Email Support',
      'Ticket Management',
      'Issue Troubleshooting',
      'Escalation Management',
      'Multi-Channel Support',
      'Proactive Communication',
      'Zendesk / Intercom / Freshdesk',
      'HubSpot Service Hub',
      'Empathy & Patience',
      'Clear Communication',
      'Problem Solving',
      'Fast Response Time',
      'Customer Satisfaction Focus',
      'Documentation Skills',
      'Time Management',
      'Weekly Reporting'
    ],
    testimonial: {
      text: 'Our customer support specialist from Rapid Tal handles 40-60 tickets per day with a 96% satisfaction score. Response times are under 2 hours and our customers love her. She\'s patient, empathetic, and costs a fraction of local support.',
      attribution: '— Australian SaaS founder, Sydney'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["customer-success-manager","virtual-assistant","hubspot-administrator"]
  },

  'hubspot-administrator': {
    slug: 'hubspot-administrator',
    title: 'HubSpot Administrator',
    metaDescription: 'How much does a HubSpot Administrator cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 73% average savings for HubSpot management.',
    heroGhost: 'HA',
    roleTag: 'Cost Comparison — CRM Administration Roles',
    headline: 'HUBSPOT\nADMINISTRATOR:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring a HubSpot Administrator in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '73%',
      savedPerYear: '$60K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'A HubSpot Administrator is not someone who occasionally updates contact records. They are a HubSpot power user who owns your entire CRM setup — workflows, automation, pipeline management, reporting dashboards, integrations, and everything needed to make HubSpot your revenue-generating command center.',
        'Most businesses use 10% of HubSpot\'s capabilities because no one owns the system. A HubSpot Administrator unlocks the other 90% and turns HubSpot into a fully automated marketing and sales machine that drives predictable revenue.',
        'Their day starts with system maintenance — checking workflow health, monitoring automation performance, reviewing data quality, and ensuring HubSpot is running smoothly. From there they move into optimization — building new workflows, creating custom reports, setting up integrations, and continuously improving the system.',
        'On the automation side, they\'re building sequences that nurture leads automatically, creating task reminders that keep deals moving, setting up notifications that alert reps to hot opportunities, and eliminating manual work wherever possible. Every automation they build saves your team hours per week.',
        'They also manage reporting and dashboards — building custom reports that show pipeline health, forecast accuracy, rep performance, and conversion rates. They turn raw HubSpot data into actionable insights that drive better decisions.',
        'Every month they deliver a summary that shows HubSpot performance — data quality score, automation uptime, workflows created, time saved, and system improvements implemented. No fluff. Just HubSpot administration that drives revenue.'
      ],
      tasks: [
        'HubSpot CRM administration',
        'Workflow and automation building',
        'Pipeline management and setup',
        'Custom report and dashboard creation',
        'Integration setup and maintenance',
        'Data quality management',
        'User training and support',
        'System optimization',
        'HubSpot troubleshooting',
        'Monthly HubSpot performance reporting'
      ],
      tools: ['HubSpot', 'Zapier', 'Make.com', 'Google Workspace', 'Looker Studio', 'Excel/Google Sheets', 'Notion', 'Slack', 'Loom', 'API tools'],
      bottomLine: 'A great HubSpot Administrator doesn\'t just maintain your CRM — they multiply your team\'s productivity. Every workflow they build, every automation they create, every report they design makes your revenue team faster and more effective. HubSpot admins are force multipliers.'
    },
    costs: {
      auBaseSalary: 6250,
      phBaseSalary: 1750,
      auSuper: 719,
      auLeave: 540,
      auSick: 288,
      auRecruitment: 1125,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 94
    },
    skills: [
      'HubSpot Administration',
      'Workflow Automation',
      'Pipeline Management',
      'Custom Report Building',
      'Dashboard Creation',
      'Integration Setup (Zapier/Make)',
      'Data Quality Management',
      'User Training',
      'System Optimization',
      'HubSpot Troubleshooting',
      'API Integration',
      'Looker Studio',
      'Excel / Google Sheets',
      'Process Documentation',
      'Problem Solving',
      'HubSpot Best Practices',
      'Change Management',
      'Monthly Reporting'
    ],
    testimonial: {
      text: 'Our HubSpot administrator from Rapid Tal built 50+ automations that save our team 20 hours per week. Data quality went from 65% to 98% and our HubSpot finally works the way it should. Best ops hire we\'ve made.',
      attribution: '— Australian SaaS founder, Brisbane'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["crm-manager","customer-support-specialist","operations-manager"]
  },

  'operations-manager': {
    slug: 'operations-manager',
    title: 'Operations Manager',
    metaDescription: 'How much does an Operations Manager cost in Australia vs hiring directly from the Philippines? Real numbers, full cost breakdown, and 70% average savings for operations leadership.',
    heroGhost: 'OM',
    roleTag: 'Cost Comparison — Operations Leadership Roles',
    headline: 'OPERATIONS\nMANAGER:\nAUSTRALIA VS\nPHILIPPINES DIRECT.',
    heroSub: 'The real numbers behind hiring an Operations Manager in Australia versus hiring one directly from the Philippines — salary, super, leave, tools and every hidden cost your accountant isn\'t counting.',
    stats: {
      saving: '70%',
      savedPerYear: '$65K+',
      daysToHire: '18',
      fee: '$3,990'
    },
    roleDescription: {
      intro: [
        'An Operations Manager is not an admin coordinator with a fancy title. They are a strategic operations leader who owns processes, systems, team coordination, and everything that keeps your business running smoothly — turning operational chaos into predictable, scalable systems.',
        'Most businesses plateau because operations are broken — processes aren\'t documented, systems don\'t talk to each other, teams work in silos, and the founder is the bottleneck for everything. An Operations Manager fixes all of it and builds the operational foundation for scale.',
        'Their day starts with operations review — checking system health, identifying bottlenecks, reviewing team performance, and prioritizing operational improvements. From there they move into execution — building processes, implementing systems, coordinating teams, and ensuring operations run smoothly.',
        'On the strategic side, they\'re thinking about scalability — what processes need to be documented, what systems need to be implemented, what automation can eliminate manual work, and how to build operations that support 10x growth. They don\'t just manage operations — they architect them.',
        'They also manage operational teams — coordinating VAs, assistants, and operational staff, ensuring everyone is aligned, productive, and delivering results. They\'re the operational brain that keeps everything running while the founder focuses on growth.',
        'Every month they deliver a summary that shows operational performance — process improvements, system implementations, team productivity, cost savings, and operational efficiency gains. No fluff. Just operations that scale.'
      ],
      tasks: [
        'Operations strategy and planning',
        'Process documentation and optimization',
        'System implementation and integration',
        'Team coordination and management',
        'Vendor and supplier management',
        'Budget tracking and cost optimization',
        'Operational reporting and dashboards',
        'Bottleneck identification and resolution',
        'Automation and efficiency improvements',
        'Monthly operations performance reporting'
      ],
      tools: ['Notion', 'Asana', 'Monday.com', 'Google Workspace', 'Slack', 'Zapier', 'Make.com', 'Looker Studio', 'Excel/Google Sheets', 'Loom'],
      bottomLine: 'A great Operations Manager doesn\'t just manage operations — they build scalable systems. Every process they document, every system they implement, every bottleneck they remove makes your business more efficient and more scalable. Operations managers are the foundation of growth.'
    },
    costs: {
      auBaseSalary: 7000,
      phBaseSalary: 2000,
      auSuper: 805,
      auLeave: 606,
      auSick: 323,
      auRecruitment: 1250,
      phRecruitment: 333,
      tools: 400,
      auOffice: 500,
      auHR: 150,
      auWorkersComp: 105
    },
    skills: [
      'Operations Strategy',
      'Process Documentation',
      'System Implementation',
      'Team Management',
      'Vendor Management',
      'Budget Management',
      'Operational Reporting',
      'Bottleneck Resolution',
      'Automation & Efficiency',
      'Notion / Asana / Monday.com',
      'Zapier / Make.com',
      'Looker Studio',
      'Strategic Thinking',
      'Leadership',
      'Problem Solving',
      'Change Management',
      'Scalability Focus',
      'Monthly Performance Reporting'
    ],
    testimonial: {
      text: 'Our operations manager from Rapid Tal built processes, implemented systems, and coordinated our entire operations team. We went from operational chaos to predictable execution in 6 months. She\'s strategic, systematic, and worth 10x her cost.',
      attribution: '— Australian founder, Melbourne'
    },
    category: 'Operations & Admin Specialists',
    categorySlug: 'operations-admin-specialists',
    relatedRoles: ["project-manager","executive-assistant","sales-operations-specialist"]
  }

};

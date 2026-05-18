/* ═══════════════════════════════════════════════════════════════════════════
 * Server-rendered JSON-LD structured data for industry landing pages.
 *
 * Emits three linked schemas Google understands:
 *   • Service          — what RapidTAL provides for this industry
 *   • FAQPage          — pulled straight from config.faq.items
 *   • BreadcrumbList   — Home → Industries → {industry}
 *
 * Rendered as a plain <script type="application/ld+json"> so it ships in the
 * HTML payload (no JS required, indexable immediately).
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { IndustryConfig } from './types';

const SITE_URL = 'https://rapidtal.com';
const ORG_NAME = 'RapidTAL';

export default function StructuredData({ config }: { config: IndustryConfig }) {
  const pageUrl = `${SITE_URL}/industries/${config.slug}`;

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Offshore Marketing for ${config.industryName}s`,
    serviceType: 'Offshore Marketing Team Outsourcing',
    provider: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
    areaServed: { '@type': 'Country', name: 'Australia' },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: config.industryName,
    },
    description: config.meta.description,
    url: pageUrl,
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faq.items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',       item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Industries', item: `${SITE_URL}/industries` },
      { '@type': 'ListItem', position: 3, name: config.industryName, item: pageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}

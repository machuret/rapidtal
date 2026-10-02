import { GUIDES } from '@/data/guides';
import type { MetadataRoute } from 'next';
import { ROLES } from '@/data/roles';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/calculator", "/case-studies", "/cpas-au", "/driving-schools", "/hire-marketing-sales-philippines", "/how-we-hire", "/industries/car-dealerships", "/industries/commercial-real-estate", "/marketing-creative-specialists", "/operations-admin-specialists", "/paid-advertising-specialists", "/real-estate-au", "/roles", "/roles/content", "/roles/marketing", "/roles/ops", "/roles/sales", "/sales-specialists", "/seo-specialists"];
  return [...paths, "/guides", "/guides/editorial-policy", "/tools/hiring-budget", ...GUIDES.map(guide => `/guides/${guide.slug}`), ...Object.keys(ROLES).map(slug => `/hire-${slug}`)]
    .map(path => ({ url: `https://rapidtal.com${path}` }));
}

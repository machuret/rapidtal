import type { MetadataRoute } from 'next';
import { ROLES } from '@/data/roles';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/calculator", "/case-studies", "/cpas-au", "/driving-schools", "/hire-marketing-sales-philippines", "/how-we-hire", "/industries/car-dealerships", "/industries/commercial-real-estate", "/marketing-creative-specialists", "/operations-admin-specialists", "/paid-advertising-specialists", "/real-estate-au", "/roles", "/roles/content", "/roles/marketing", "/roles/ops", "/roles/sales", "/sales-specialists", "/seo-specialists"];
  return [...paths, ...Object.keys(ROLES).map(slug => `/hire-${slug}`)]
    .map(path => ({ url: `https://rapidtal.com${path}` }));
}

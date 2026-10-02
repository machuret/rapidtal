import { notFound, permanentRedirect } from 'next/navigation';
import { ROLES } from '@/data/roles';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(ROLES).map((slug) => ({ slug }));
}

export default async function CostComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!Object.hasOwn(ROLES, slug)) notFound();
  permanentRedirect(`/hire-${slug}`);
}

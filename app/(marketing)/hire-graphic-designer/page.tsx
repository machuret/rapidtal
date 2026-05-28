import type { Metadata } from 'next';
import RoleComparisonPage, { buildRoleMetadata } from '@/components/comparison/RoleComparisonPage';

const ROLE_SLUG = 'graphic-designer';

export function generateMetadata(): Promise<Metadata> {
  return buildRoleMetadata(ROLE_SLUG);
}

export default function Page() {
  return <RoleComparisonPage roleSlug={ROLE_SLUG} />;
}

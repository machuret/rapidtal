import Link from 'next/link';
import { getGuidesForRole } from '@/data/guides';
import GuideCard from './GuideCard';
import s from './guides.module.css';

export default function RoleGuides({ roleSlug }: { roleSlug: string }) {
  const guides = getGuidesForRole(roleSlug);
  if (!guides.length) return <section className={`${s.container} ${s.related}`}><h2>Prepare for your next hire.</h2><p><Link href="/guides">Explore hiring guides, interview questions, and onboarding checklists →</Link></p></section>;
  return <section className={`${s.container} ${s.related}`}><h2>Make a more informed hiring decision.</h2><div className={s.grid}>{guides.map(guide => <GuideCard key={guide.slug} guide={guide} />)}</div></section>;
}

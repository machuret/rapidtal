import Link from 'next/link';
import { Guide, guidePath, readingMinutes } from '@/data/guides';
import s from './guides.module.css';

export default function GuideCard({ guide }: { guide: Guide }) {
  return <article className={s.card}>
    <small>{guide.category} · {readingMinutes(guide)} min read</small>
    <h3><Link href={guidePath(guide)}>{guide.title}</Link></h3>
    <p>{guide.description}</p>
    {guide.download && <span className={s.cardLabel}>Includes an editable worksheet</span>}
  </article>;
}

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { CALCOM_BOOKING_URL } from '@/lib/booking';
import s from './guides.module.css';

export default function GuideShell({ children }: { children: React.ReactNode }) {
  return <div className={s.shell}>
    <a href="#guide-main" className="skip-link">Skip to content</a>
    <header className={s.header}>
      <Link className={s.logo} href="/">RAPID<span>TAL</span></Link>
      <nav aria-label="Guide navigation" className={s.nav}>
        <Link href="/guides">Hiring guides</Link>
        <Link href="/roles">Explore roles</Link>
        <Link href="/tools/hiring-budget">Budget calculator</Link>
        <a href={CALCOM_BOOKING_URL}>Discuss your hire ↗</a>
        <ThemeToggle />
      </nav>
    </header>
    <div className={s.container}>{children}
      <footer className={s.footer}>
        <span>© {new Date().getFullYear()} Rapid Tal · Practical hiring resources</span>
        <Link href="/guides/editorial-policy">How these guides are prepared</Link>
        <a href="mailto:hello@rapidtal.com">hello@rapidtal.com</a>
      </footer>
    </div>
  </div>;
}

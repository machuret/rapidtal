import ThemeToggle from '@/components/ThemeToggle';
import styles from './ComparisonNav.module.css';

export default function ComparisonNav() {
  return (
    <nav className={styles.nav}>
      <a href="/" className={styles.logo}>RAPID<span>TAL</span></a>
      <div className={styles.navRight}>
        <a href="/roles" className={styles.navLink}>Roles</a>
        <a href="/how-we-hire" className={styles.navLink}>How It Works</a>
        <a href="/#pricing" className={styles.navLink}>Pricing</a>
        <a href="/calculator" className={styles.navCta}>Find Your Hire</a>
        <a href="https://rapidtal.online" className={styles.navPortal} target="_blank" rel="noopener noreferrer">Login to Portal</a>
        <ThemeToggle />
      </div>
    </nav>
  );
}

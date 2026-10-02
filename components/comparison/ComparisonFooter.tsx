import styles from './ComparisonFooter.module.css';

export default function ComparisonFooter() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Rapid Tal — Direct Hire. Zero Middlemen.</span>
      <span>
        <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms</a> · <a href="mailto:hello@rapidtal.com">hello@rapidtal.com</a>
      </span>
    </footer>
  );
}

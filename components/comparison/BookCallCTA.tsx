import styles from './BookCallCTA.module.css';

interface BookCallCTAProps {
  variant?: 'primary' | 'secondary' | 'inline';
}

export default function BookCallCTA({ variant = 'primary' }: BookCallCTAProps) {
  return (
    <div className={`${styles.bookCallCta} ${styles[variant]}`}>
      <a href="/quiz" className={styles.bookCallBtn}>
        Book a Call
      </a>
      <span className={styles.bookCallSubtitle}>Start saving $ for your business</span>
    </div>
  );
}

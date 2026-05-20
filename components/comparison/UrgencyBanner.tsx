import styles from './UrgencyBanner.module.css';

export default function UrgencyBanner() {
  return (
    <div className={styles.urgencyBanner}>
      <div className={styles.content}>
        <span className={styles.icon}>⚡</span>
        <span className={styles.text}>
          <strong>Next cohort starts in 12 days</strong> — 3 spots remaining this month
        </span>
      </div>
    </div>
  );
}

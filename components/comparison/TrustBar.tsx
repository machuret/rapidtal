import styles from './TrustBar.module.css';

export default function TrustBar() {
  return (
    <section className={styles.trustBar}>
      <div className={styles.container}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>100+</div>
          <div className={styles.statLabel}>Australian Businesses</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>14mo</div>
          <div className={styles.statLabel}>Average Retention</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>18 Days</div>
          <div className={styles.statLabel}>Average Time to Hire</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>72%</div>
          <div className={styles.statLabel}>Average Cost Savings</div>
        </div>
      </div>
    </section>
  );
}

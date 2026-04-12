import styles from './SavingsBanner.module.css';

interface SavingsBannerProps {
  annualSaving: number;
  savingPercent: number;
  auTotal: number;
  phTotal: number;
}

export default function SavingsBanner({ annualSaving, savingPercent, auTotal, phTotal }: SavingsBannerProps) {
  return (
    <div className={styles.savingsBanner}>
      <div className={styles.savingsLeft}>
        <div className={styles.savingsEyebrow}>Your Annual Saving</div>
        <div className={styles.savingsHeadline}>
          THAT'S AU${annualSaving.toLocaleString()}<br />
          BACK IN YOUR POCKET.<br />
          EVERY YEAR.
        </div>
        <p className={styles.savingsSub}>
          AU${auTotal.toLocaleString()}/month vs AU${phTotal.toLocaleString()}/month. 
          The work is the same. The skills are the same. The difference is you're no longer paying for a postcode.
        </p>
      </div>
      <div className={styles.savingsRight}>
        <span className={styles.savingsNum}>{savingPercent}%</span>
        <div className={styles.savingsPer}>Cost Reduction</div>
      </div>
    </div>
  );
}

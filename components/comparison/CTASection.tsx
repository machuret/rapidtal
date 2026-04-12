import styles from './CTASection.module.css';

interface CTASectionProps {
  roleTitle: string;
}

export default function CTASection({ roleTitle }: CTASectionProps) {
  return (
    <div className={styles.ctaSection}>
      <div>
        <h2 className={styles.ctaHeadline}>
          READY TO FIND YOUR<br />{roleTitle.toUpperCase()}?
        </h2>
        <p className={styles.ctaSub}>
          Get a shortlist of 3–4 senior {roleTitle}s in 18 days. One fee. You own the hire. Backed by a 6-month guarantee.
        </p>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:'14px', alignItems:'center'}}>
        <a href="/calculator" className={styles.btnDark}>Start Saving$ Calculator →</a>
        <span className={styles.ctaNote}>Or call 0440 137 834</span>
      </div>
    </div>
  );
}

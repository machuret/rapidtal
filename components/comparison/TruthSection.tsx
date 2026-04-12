import styles from './TruthSection.module.css';

interface TruthSectionProps {
  testimonial: {
    text: string;
    attribution: string;
  };
}

export default function TruthSection({ testimonial }: TruthSectionProps) {
  return (
    <div className={styles.truthSection}>
      <div className={styles.truthBody}>
        <h2 className={styles.truthHeadline}>
          THE UNCOMFORTABLE<br /><em>TRUTH ABOUT</em><br />WORDPRESS SEO HIRES.
        </h2>
        <p>The Australian market charges a premium for WordPress SEO skills that are honestly not that rare. A mid-range AU$75K WordPress SEO hire is still figuring out their Ahrefs workflow.</p>
        <p>Meanwhile, a senior Filipino WordPress SEO specialist — someone who has managed 20+ WordPress sites, built link profiles from scratch, and lived through multiple Google algorithm updates — is available right now for AU$1,700/month.</p>
        <p><strong>They're not a cheaper version. They're usually more experienced.</strong> They stay longer. They go deeper into your site. They take ownership of your rankings like it's their own business.</p>
      </div>
      <div>
        <div className={styles.truthQuote}>
          <div className={styles.truthQuoteText}>{testimonial.text}</div>
          <div className={styles.truthQuoteAttr}>{testimonial.attribution}</div>
        </div>
      </div>
    </div>
  );
}

'use client';

import styles from './AnimatedCTA.module.css';

interface AnimatedCTAProps {
  variant?: 'primary' | 'secondary' | 'inline';
}

export default function AnimatedCTA({ variant = 'primary' }: AnimatedCTAProps) {
  return (
    <div className={`${styles.animatedCta} ${styles[variant]}`}>
      <a href="https://calendly.com/machuret/rapid-tal" className={styles.ctaButton}>
        <span className={styles.buttonGlow}></span>
        <span className={styles.buttonContent}>
          Book a Call
        </span>
      </a>
      <span className={styles.ctaSubtitle}>Start saving $ for your business</span>
    </div>
  );
}

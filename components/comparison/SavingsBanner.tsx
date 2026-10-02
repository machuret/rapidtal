'use client';

import styles from './SavingsBanner.module.css';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatPrice } from '@/lib/currency';

interface SavingsBannerProps {
  annualSaving: number;
  savingPercent: number;
  auTotal: number;
  phTotal: number;
}

export default function SavingsBanner({ annualSaving, savingPercent, auTotal, phTotal }: SavingsBannerProps) {
  const { currency } = useCurrency();
  return (
    <div className={styles.savingsBanner}>
      <div className={styles.savingsLeft}>
        <div className={styles.savingsEyebrow}>Illustrative First-Year Saving</div>
        <div className={styles.savingsHeadline}>
          THAT&apos;S {formatPrice(annualSaving, currency)}<br />
          ESTIMATED DIFFERENCE.<br />
          IN YEAR ONE.
        </div>
        <p className={styles.savingsSub}>
          {formatPrice(auTotal, currency)}/month vs {formatPrice(phTotal, currency)}/month. 
          Based on the assumptions above, including first-year recruitment costs. Actual costs and outcomes vary.
        </p>
      </div>
      <div className={styles.savingsRight}>
        <span className={styles.savingsNum}>{savingPercent}%</span>
        <div className={styles.savingsPer}>Estimated Reduction</div>
      </div>
    </div>
  );
}

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
        <div className={styles.savingsEyebrow}>Your Annual Saving</div>
        <div className={styles.savingsHeadline}>
          THAT&apos;S {formatPrice(annualSaving, currency)}<br />
          BACK IN YOUR POCKET.<br />
          EVERY YEAR.
        </div>
        <p className={styles.savingsSub}>
          {formatPrice(auTotal, currency)}/month vs {formatPrice(phTotal, currency)}/month. 
          The work is the same. The skills are the same. The difference is you&apos;re no longer paying for a postcode.
        </p>
      </div>
      <div className={styles.savingsRight}>
        <span className={styles.savingsNum}>{savingPercent}%</span>
        <div className={styles.savingsPer}>Cost Reduction</div>
      </div>
    </div>
  );
}

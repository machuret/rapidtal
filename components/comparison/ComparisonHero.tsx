'use client';

import { useEffect, useRef } from 'react';
import styles from './ComparisonHero.module.css';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatPrice } from '@/lib/currency';
import type { Currency } from '@/lib/currency';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

function formatSavedPerYear(value: string, currency: Currency): string {
  const match = value.match(/\$(\d+)K\+/);
  if (!match) return value;
  const audK = parseInt(match[1], 10);
  if (currency === 'AUD') return value;
  const usdK = Math.round(audK * 0.65);
  return `US$${usdK}K+`;
}

interface HeroStats {
  saving: string;
  savedPerYear: string;
  daysToHire: string;
  fee: string;
}

interface ComparisonHeroProps {
  roleTag: string;
  headline: string;
  heroSub: string;
  heroGhost: string;
  stats: HeroStats;
}

export default function ComparisonHero({ roleTag, headline, heroSub, heroGhost, stats }: ComparisonHeroProps) {
  const { currency } = useCurrency();
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = 'https://calendly.com/machuret/rapid-tal?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=ff7100';
    function initWidget() {
      if (window.Calendly && calRef.current) {
        calRef.current.innerHTML = '';
        window.Calendly.initInlineWidget({ url, parentElement: calRef.current });
      }
    }
    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (existing) { initWidget(); } else {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}></div>
      <div className={styles.heroGhost}>{heroGhost}</div>
      <div className={styles.heroIcons}>
        <div className={styles.iconCircle}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
            <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l-3.124-5.406c.898-.518 1.503-1.476 1.503-2.569 0-1.094-.606-2.052-1.503-2.569l3.124-5.406c1.704.984 3.107 2.375 4.045 4.05zm-9.544 1.325c0 1.094-.606 2.052-1.503 2.569L7.298 15.8c-3.207-1.869-5.363-5.346-5.363-9.325 0-1.875.478-3.638 1.318-5.175.938-1.675 2.342-3.066 4.045-4.05l3.124 5.406c-.897.517-1.503 1.475-1.503 2.569z"/>
          </svg>
        </div>
        <div className={styles.iconVs}>VS</div>
        <div className={styles.iconCircle}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
      <div className={styles.heroColumns}>
        <div className={styles.heroInner}>
          <div className={styles.roleTag}>
            <div className={styles.roleTagDot}></div>
            {roleTag}
          </div>
          <h1 className={styles.heroHeadline}>
            {headline.split('\n').map((line, i) => (
              <span key={i}>
                {line.includes('PHILIPPINES') || line.includes('DIRECT') ? (
                  <em>{line}</em>
                ) : line}
                {i < headline.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className={styles.heroSub}>{heroSub}</p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{stats.saving}</span>
              <span className={styles.heroStatLabel}>Average saving</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{formatSavedPerYear(stats.savedPerYear, currency)}</span>
              <span className={styles.heroStatLabel}>Saved per year</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{stats.daysToHire}</span>
              <span className={styles.heroStatLabel}>Days to hire</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{formatPrice(3990, currency)}</span>
              <span className={styles.heroStatLabel}>One-time fee</span>
            </div>
          </div>
        </div>
        <div className={styles.heroCalendly}>
          <div className={styles.heroCalendlyLabel}>Book a Free Discovery Call</div>
          <div ref={calRef} className={styles.heroCalendlyWidget} />
        </div>
      </div>
    </section>
  );
}

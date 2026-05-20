'use client';

import { useCurrency } from '@/components/CurrencyProvider';
import { formatPrice } from '@/lib/currency';

const features = [
  "300+ candidates sourced and screened",
  "Role-specific technical assessment (marketing / sales)",
  "Top 10 interviewed, 3–4 shortlisted for you",
  "Reference checks completed",
  "Contract & onboarding support",
  "6-month replacement guarantee",
  "Compliant direct-hire guidance",
];

export default function Pricing() {
  const { currency } = useCurrency();

  return (
    <section className="pricing" id="pricing">
      <div className="reveal">
        <span className="section-label">— Simple Pricing</span>
        <h2 className="section-heading">ONE FEE.<br /><em>ZERO SURPRISES.</em></h2>
      </div>
      <div className="pricing-card reveal">
        <div className="pricing-badge">Most Chosen</div>
        <div className="pricing-price"><span>{formatPrice(3990, currency).replace(/[0-9,]/g, '')}</span>{formatPrice(3990, currency).replace(/[^0-9,]/g, '')}</div>
        <div className="pricing-note">One-time placement fee — paid only when you hire</div>
        <div className="pricing-vs">
          vs. agencies charging <strong>{formatPrice(8000, currency)}–{formatPrice(15000, currency)}+</strong> per placement
        </div>
        <ul className="pricing-features">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <a href="/calculator" className="btn-primary pricing-btn">
          <span>Book a Discovery Call →</span>
        </a>
      </div>
    </section>
  );
}

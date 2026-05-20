'use client';

import { useCurrency } from '@/components/CurrencyProvider';

export default function CurrencyToggle() {
  const { currency, toggleCurrency, isReady } = useCurrency();

  // Avoid hydration mismatch — render nothing until client detection is done
  if (!isReady) {
    return <span className="currency-toggle-placeholder" />;
  }

  return (
    <button
      type="button"
      className="currency-toggle"
      onClick={toggleCurrency}
      aria-label={`Current currency: ${currency}. Click to toggle.`}
      title={`Switch to ${currency === 'AUD' ? 'USD' : 'AUD'}`}
    >
      <span className={currency === 'AUD' ? 'active' : ''}>AU$</span>
      <span className="divider">|</span>
      <span className={currency === 'USD' ? 'active' : ''}>US$</span>
    </button>
  );
}

export type Currency = 'AUD' | 'USD';

/** Fixed conversion rate — swap for a live API later without touching UI code */
export const AUD_TO_USD_RATE = 0.65;

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  AUD: 'AU$',
  USD: 'US$',
};

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}

export function convertAudToUsd(audAmount: number): number {
  return Math.round(audAmount * AUD_TO_USD_RATE);
}

export function convertUsdToAud(usdAmount: number): number {
  return Math.round(usdAmount / AUD_TO_USD_RATE);
}

/** Format a price like 3990 → "AU$3,990" or "US$2,594" */
export function formatPrice(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  const value = currency === 'USD' ? convertAudToUsd(amount) : amount;
  return `${symbol}${value.toLocaleString('en-US')}`;
}

/** Format with decimal places for large/comparison numbers */
export function formatPriceDetailed(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  const value = currency === 'USD' ? amount * AUD_TO_USD_RATE : amount;
  return `${symbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/** Format a monthly salary range or similar string that contains "$" */
export function formatPriceInString(text: string, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  // Replace currency symbols (AU$, US$, or bare $) with the correct one
  return text.replace(/(AU\$|US\$|\$)/g, symbol);
}

/** Detect currency preference:
 *  1. URL param ?currency=AUD|USD (override)
 *  2. localStorage saved preference
 *  3. navigator.language (en-US/en-CA → USD, en-AU → AUD)
 *  4. Default AUD
 */
export function detectCurrency(): Currency {
  if (typeof window === 'undefined') return 'AUD';

  // 1. URL param
  const params = new URLSearchParams(window.location.search);
  const paramCurrency = params.get('currency');
  if (paramCurrency === 'USD' || paramCurrency === 'AUD') {
    return paramCurrency;
  }

  // 2. localStorage
  const saved = localStorage.getItem('rapidtal-currency');
  if (saved === 'USD' || saved === 'AUD') {
    return saved;
  }

  // 3. navigator.language
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('en-us') || lang.startsWith('en-ca')) {
    return 'USD';
  }
  if (lang.startsWith('en-au')) {
    return 'AUD';
  }

  // 4. Default
  return 'AUD';
}

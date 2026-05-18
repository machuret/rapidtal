'use client';

import { useCurrency } from './CurrencyProvider';
import { formatPrice } from '@/lib/currency';

interface FormattedPriceProps {
  amount: number;
}

export default function FormattedPrice({ amount }: FormattedPriceProps) {
  const { currency } = useCurrency();
  return <>{formatPrice(amount, currency)}</>;
}

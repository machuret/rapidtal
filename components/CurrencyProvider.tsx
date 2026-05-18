'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Currency } from '@/lib/currency';
import { detectCurrency } from '@/lib/currency';

const PHONE = '0428208022';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  isReady: boolean;
  phone: string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'AUD',
  setCurrency: () => {},
  toggleCurrency: () => {},
  isReady: false,
  phone: PHONE,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('AUD');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrencyState(detected);
    setIsReady(true);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('rapidtal-currency', c);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency(currency === 'AUD' ? 'USD' : 'AUD');
  }, [currency, setCurrency]);

  const phone = PHONE;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, isReady, phone }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

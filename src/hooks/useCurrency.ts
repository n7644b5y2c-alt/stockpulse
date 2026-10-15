import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { currencyService, type Currency } from '../data/services/currencyService';
import { formatCurrency, formatCompactNumber } from '../lib/format';
import type { FxRate } from '../types';

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>(() => currencyService.getSavedCurrency());

  useEffect(() => {
    return currencyService.onCurrencyChange((newCur) => {
      setCurrencyState(newCur);
    });
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    currencyService.setCurrency(c);
    setCurrencyState(c);
  }, []);

  const fxQuery = useQuery<FxRate, Error>({
    queryKey: ['fxRate', 'USD', 'INR'],
    queryFn: () => currencyService.getFxRate('USD', 'INR'),
    staleTime: 5 * 60 * 1000,
  });

  const fxRate = fxQuery.data?.rate || 83.5;

  const format = useCallback(
    (amount: number): string => {
      return formatCurrency(amount, currency, fxRate);
    },
    [currency, fxRate]
  );

  const formatCompact = useCallback(
    (amount: number): string => {
      return formatCompactNumber(amount, currency);
    },
    [currency]
  );

  return {
    currency,
    setCurrency,
    fxRate,
    isFxLoading: fxQuery.isLoading,
    format,
    formatCompact,
  };
}

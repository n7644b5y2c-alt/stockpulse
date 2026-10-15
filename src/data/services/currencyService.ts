import { activeDataProvider } from '../providers';
import type { FxRate } from '../../types';

const CURRENCY_STORAGE_KEY = 'stockpulse-currency';
const CURRENCY_EVENT = 'stockpulse-currency-change';

export type Currency = 'USD' | 'INR';

export const currencyService = {
  getSavedCurrency: (): Currency => {
    if (typeof window === 'undefined') return 'USD';
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved === 'INR' || saved === 'USD') return saved;
    } catch {
      // ignore
    }
    return 'USD';
  },

  setCurrency: (c: Currency): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
      window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: c }));
    } catch {
      // ignore
    }
  },

  getFxRate: (from: string = 'USD', to: string = 'INR'): Promise<FxRate> =>
    activeDataProvider.getFxRate(from, to),

  onCurrencyChange: (callback: (c: Currency) => void): (() => void) => {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Currency>;
      if (custom.detail) callback(custom.detail);
    };
    window.addEventListener(CURRENCY_EVENT, handler);
    return () => window.removeEventListener(CURRENCY_EVENT, handler);
  },
};

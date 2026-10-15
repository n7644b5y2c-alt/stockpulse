import { useState, useEffect } from 'react';
import { getAllMarketHours } from '../lib/marketHours';
import type { MarketHoursStatus } from '../types';

export function useMarketHours() {
  const [marketHours, setMarketHours] = useState<MarketHoursStatus[]>(() => getAllMarketHours());

  useEffect(() => {
    const update = () => {
      setMarketHours(getAllMarketHours());
    };

    update();
    const interval = setInterval(update, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return {
    marketHours,
    nyse: marketHours.find((m) => m.market === 'NYSE'),
    nse: marketHours.find((m) => m.market === 'NSE'),
    bse: marketHours.find((m) => m.market === 'BSE'),
  };
}

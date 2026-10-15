import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { Candle } from '../types';

export function useCandles(symbol: string, range: '1W' | '1M' | '3M' | 'ALL' = '3M') {
  return useQuery<Candle[], Error>({
    queryKey: ['candles', symbol, range],
    queryFn: () => marketService.getCandles(symbol, range),
    enabled: Boolean(symbol),
    staleTime: 60 * 1000,
  });
}

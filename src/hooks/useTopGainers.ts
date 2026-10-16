import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService.ts';
import type { Stock, Coin, Metal } from '../types/index.ts';

export function useTopGainers(limit: number = 4) {
  return useQuery<(Stock | Coin | Metal)[], Error>({
    queryKey: ['topGainers', limit],
    queryFn: () => marketService.getTopGainers(limit),
    staleTime: 30 * 1000,
  });
}

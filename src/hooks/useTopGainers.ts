import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { Stock, Coin } from '../types';

export function useTopGainers(limit: number = 4) {
  return useQuery<(Stock | Coin)[], Error>({
    queryKey: ['topGainers', limit],
    queryFn: () => marketService.getTopGainers(limit),
    staleTime: 30 * 1000,
  });
}

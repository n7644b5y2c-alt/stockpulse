import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { Coin } from '../types';

export function useCoins() {
  return useQuery<Coin[], Error>({
    queryKey: ['coins'],
    queryFn: () => marketService.getCoins(),
    staleTime: 60 * 1000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { Coin } from '../types';

export function useTrending() {
  return useQuery<Coin[], Error>({
    queryKey: ['trending'],
    queryFn: () => marketService.getTrending(),
    staleTime: 60 * 1000,
  });
}

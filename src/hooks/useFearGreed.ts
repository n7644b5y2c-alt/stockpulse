import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { FearGreedData } from '../types';

export function useFearGreed() {
  return useQuery<FearGreedData, Error>({
    queryKey: ['fearGreed'],
    queryFn: () => marketService.getFearGreed(),
    staleTime: 5 * 60 * 1000,
  });
}

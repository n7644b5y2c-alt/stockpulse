import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { Stock } from '../types';

export function useStocks() {
  return useQuery<Stock[], Error>({
    queryKey: ['stocks'],
    queryFn: () => marketService.getStocks(),
    staleTime: 60 * 1000,
  });
}

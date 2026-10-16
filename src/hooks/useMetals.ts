import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService.ts';
import type { Metal } from '../types/index.ts';

export function useMetals() {
  return useQuery<Metal[], Error>({
    queryKey: ['metals'],
    queryFn: () => marketService.getMetals(),
    staleTime: 60 * 1000,
  });
}

export function useMetal(symbol: string) {
  return useQuery<Metal | null, Error>({
    queryKey: ['metal', symbol.toUpperCase()],
    queryFn: () => marketService.getMetal(symbol),
    staleTime: 60 * 1000,
    enabled: Boolean(symbol),
  });
}

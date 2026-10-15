import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { ComparisonSeries } from '../types';

export function useComparison(symbols: string[], range: '1M' | '3M' | 'ALL' = '1M') {
  return useQuery<ComparisonSeries[], Error>({
    queryKey: ['comparison', symbols.sort().join(','), range],
    queryFn: () => marketService.getComparisonSeries(symbols, range),
    enabled: symbols.length > 0,
    staleTime: 60 * 1000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { profitService } from '../data/services/profitService';
import { usePortfolio } from './usePortfolio';
import type { ExpectedProfitResult } from '../types';

export function useExpectedProfit() {
  const { holdings, isLoading: portfolioLoading } = usePortfolio();

  const query = useQuery<ExpectedProfitResult, Error>({
    queryKey: ['expectedProfit', holdings],
    queryFn: () => profitService.getExpectedProfit(holdings),
    enabled: !portfolioLoading && holdings.length > 0,
    staleTime: 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: portfolioLoading || query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

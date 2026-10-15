import { useQuery } from '@tanstack/react-query';
import { aiService } from '../data/services/aiService';
import type { AiSummaryData } from '../types';

export function useAiSummary(symbol: string) {
  return useQuery<AiSummaryData, Error>({
    queryKey: ['aiSummary', symbol],
    queryFn: () => aiService.getSummary(symbol),
    enabled: Boolean(symbol),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}

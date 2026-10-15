import { useQuery } from '@tanstack/react-query';
import { marketService } from '../data/services/marketService';
import type { ExpertPick } from '../types';

export function useExpertPicks() {
  return useQuery<ExpertPick[], Error>({
    queryKey: ['expertPicks'],
    queryFn: () => marketService.getExpertPicks(),
    staleTime: 60 * 1000,
  });
}

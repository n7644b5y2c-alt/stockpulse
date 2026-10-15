import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '../data/services/portfolioService';
import type { PortfolioHolding, CsvRow } from '../types';

export function usePortfolio() {
  const queryClient = useQueryClient();

  const query = useQuery<PortfolioHolding[], Error>({
    queryKey: ['portfolio'],
    queryFn: () => portfolioService.getHoldings(),
  });

  const addHoldingMutation = useMutation({
    mutationFn: (newHolding: Omit<PortfolioHolding, 'id'>) => portfolioService.addHolding(newHolding),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  });

  const updateHoldingMutation = useMutation({
    mutationFn: (holding: PortfolioHolding) => portfolioService.updateHolding(holding),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  });

  const removeHoldingMutation = useMutation({
    mutationFn: (id: string) => portfolioService.removeHolding(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  });

  const importCsvMutation = useMutation({
    mutationFn: (rows: CsvRow[]) => portfolioService.importCsvRows(rows),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  });

  return {
    holdings: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    addHolding: addHoldingMutation.mutateAsync,
    updateHolding: updateHoldingMutation.mutateAsync,
    removeHolding: removeHoldingMutation.mutateAsync,
    importCsvRows: importCsvMutation.mutateAsync,
  };
}

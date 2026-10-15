import { useMemo } from 'react';
import { usePortfolio } from './usePortfolio';
import { useStocks } from './useStocks';
import { useCoins } from './useCoins';
import { calculatePortfolioAnalytics, type PriceLookup } from '../lib/calc';
import type { PortfolioAnalytics } from '../types';

export function usePortfolioAnalytics() {
  const { holdings, isLoading: portfolioLoading, isError: portfolioError, error, refetch } = usePortfolio();
  const { data: stocks = [], isLoading: stocksLoading } = useStocks();
  const { data: coins = [], isLoading: coinsLoading } = useCoins();

  const priceLookup = useMemo<PriceLookup>(() => {
    const map: PriceLookup = {};
    stocks.forEach((s) => {
      map[s.symbol.toUpperCase()] = { price: s.price, name: s.name, assetType: 'stock' };
    });
    coins.forEach((c) => {
      map[c.symbol.toUpperCase()] = { price: c.price, name: c.name, assetType: 'coin' };
    });
    return map;
  }, [stocks, coins]);

  const analytics = useMemo<PortfolioAnalytics>(() => {
    return calculatePortfolioAnalytics(holdings, priceLookup);
  }, [holdings, priceLookup]);

  return {
    analytics,
    holdings,
    isLoading: portfolioLoading || stocksLoading || coinsLoading,
    isError: portfolioError,
    error,
    refetch,
  };
}

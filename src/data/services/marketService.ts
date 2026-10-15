import { activeDataProvider } from '../providers';
import type { Stock, Coin, Candle, ExpertPick, FearGreedData, ComparisonSeries } from '../../types';

export const marketService = {
  getStocks: (): Promise<Stock[]> => activeDataProvider.getStocks(),
  getStock: (symbol: string): Promise<Stock | null> => activeDataProvider.getStock(symbol),
  getCoins: (): Promise<Coin[]> => activeDataProvider.getCoins(),
  getTopGainers: (limit: number = 4): Promise<(Stock | Coin)[]> => activeDataProvider.getTopGainers(limit),
  getCandles: (symbol: string, range: '1W' | '1M' | '3M' | 'ALL' = '3M'): Promise<Candle[]> =>
    activeDataProvider.getCandles(symbol, range),
  getExpertPicks: (): Promise<ExpertPick[]> => activeDataProvider.getExpertPicks(),
  getFearGreed: (): Promise<FearGreedData> => activeDataProvider.getFearGreed(),
  getTrending: (): Promise<Coin[]> => activeDataProvider.getTrending(),
  getComparisonSeries: (symbols: string[], range: '1M' | '3M' | 'ALL' = '1M'): Promise<ComparisonSeries[]> =>
    activeDataProvider.getComparisonSeries(symbols, range),
};

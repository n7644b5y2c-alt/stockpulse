import type {
  Stock,
  Coin,
  Candle,
  ExpertPick,
  PortfolioHolding,
  ExpectedProfitResult,
  AiSummaryData,
  FearGreedData,
  FxRate,
  ComparisonSeries,
  CsvRow,
} from '../../types';

export interface DataProvider {
  getStocks(): Promise<Stock[]>;
  getStock(symbol: string): Promise<Stock | null>;
  getCoins(): Promise<Coin[]>;
  getTopGainers(limit?: number): Promise<(Stock | Coin)[]>;
  getCandles(symbol: string, range?: '1W' | '1M' | '3M' | 'ALL'): Promise<Candle[]>;
  getExpertPicks(): Promise<ExpertPick[]>;
  getPortfolio(): Promise<PortfolioHolding[]>;
  addHolding(holding: Omit<PortfolioHolding, 'id'>): Promise<PortfolioHolding>;
  updateHolding(holding: PortfolioHolding): Promise<PortfolioHolding>;
  removeHolding(id: string): Promise<boolean>;
  importHoldingsCsv(rows: CsvRow[]): Promise<PortfolioHolding[]>;
  getExpectedProfit(holdings: PortfolioHolding[]): Promise<ExpectedProfitResult>;
  getAiSummary(symbol: string): Promise<AiSummaryData>;
  getFearGreed(): Promise<FearGreedData>;
  getTrending(): Promise<Coin[]>;
  getComparisonSeries(symbols: string[], range?: '1M' | '3M' | 'ALL'): Promise<ComparisonSeries[]>;
  getFxRate(from?: string, to?: string): Promise<FxRate>;
}

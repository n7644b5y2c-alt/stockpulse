import type { DataProvider } from './types';
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
import { mockProvider } from './mockProvider';

export class RealProvider implements DataProvider {
  private async fetchProxy<T>(endpoint: string, fallback: () => Promise<T>): Promise<T> {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || 'Unknown proxy error');
      }
      return data;
    } catch {
      // Graceful fallback to mock data if proxy or backend API key is unset
      return fallback();
    }
  }

  async getStocks(): Promise<Stock[]> {
    return this.fetchProxy('/api/quotes?type=stock', () => mockProvider.getStocks());
  }

  async getStock(symbol: string): Promise<Stock | null> {
    return this.fetchProxy(`/api/quotes?symbol=${symbol}`, () => mockProvider.getStock(symbol));
  }

  async getCoins(): Promise<Coin[]> {
    return this.fetchProxy('/api/quotes?type=coin', () => mockProvider.getCoins());
  }

  async getTopGainers(limit: number = 4): Promise<(Stock | Coin)[]> {
    return this.fetchProxy(`/api/quotes?gainers=true&limit=${limit}`, () => mockProvider.getTopGainers(limit));
  }

  async getCandles(symbol: string, range: '1W' | '1M' | '3M' | 'ALL' = '3M'): Promise<Candle[]> {
    return this.fetchProxy(`/api/candles?symbol=${symbol}&range=${range}`, () => mockProvider.getCandles(symbol, range));
  }

  async getExpertPicks(): Promise<ExpertPick[]> {
    return mockProvider.getExpertPicks();
  }

  async getPortfolio(): Promise<PortfolioHolding[]> {
    return mockProvider.getPortfolio();
  }

  async addHolding(holding: Omit<PortfolioHolding, 'id'>): Promise<PortfolioHolding> {
    return mockProvider.addHolding(holding);
  }

  async updateHolding(holding: PortfolioHolding): Promise<PortfolioHolding> {
    return mockProvider.updateHolding(holding);
  }

  async removeHolding(id: string): Promise<boolean> {
    return mockProvider.removeHolding(id);
  }

  async importHoldingsCsv(rows: CsvRow[]): Promise<PortfolioHolding[]> {
    return mockProvider.importHoldingsCsv(rows);
  }

  async getExpectedProfit(holdings: PortfolioHolding[]): Promise<ExpectedProfitResult> {
    return mockProvider.getExpectedProfit(holdings);
  }

  async getAiSummary(symbol: string): Promise<AiSummaryData> {
    return this.fetchProxy(`/api/ai-summary?symbol=${symbol}`, () => mockProvider.getAiSummary(symbol));
  }

  async getFearGreed(): Promise<FearGreedData> {
    return this.fetchProxy('/api/quotes?fearGreed=true', () => mockProvider.getFearGreed());
  }

  async getTrending(): Promise<Coin[]> {
    return this.fetchProxy('/api/quotes?trending=true', () => mockProvider.getTrending());
  }

  async getComparisonSeries(symbols: string[], range: '1M' | '3M' | 'ALL' = '1M'): Promise<ComparisonSeries[]> {
    return mockProvider.getComparisonSeries(symbols, range);
  }

  async getFxRate(from: string = 'USD', to: string = 'INR'): Promise<FxRate> {
    return this.fetchProxy(`/api/fx?from=${from}&to=${to}`, () => mockProvider.getFxRate(from, to));
  }
}

export const realProvider = new RealProvider();

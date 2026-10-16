import type { DataProvider } from './types';
import type {
  Stock,
  Coin,
  Metal,
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
import { mockStocks } from '../mock/stocks.ts';
import { mockCoins } from '../mock/coins.ts';
import { mockMetals, getMockMetalBySymbol } from '../mock/metals.ts';
import { getMockCandles } from '../mock/candles.ts';
import { mockExpertPicks } from '../mock/expertPicks.ts';
import { getHeadlinesForSymbol } from '../mock/headlines.ts';

const PORTFOLIO_STORAGE_KEY = 'stockpulse-portfolio';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkSimulatedError(): void {
  const errorRateStr = import.meta.env.VITE_MOCK_ERROR_RATE;
  const rate = errorRateStr !== undefined ? parseFloat(errorRateStr) : 0;
  if (rate > 0 && Math.random() < rate) {
    throw new Error('Simulated network error (VITE_MOCK_ERROR_RATE active)');
  }
}

export class MockProvider implements DataProvider {
  private async simulateLatency(): Promise<void> {
    checkSimulatedError();
    const ms = Math.floor(Math.random() * 400) + 200; // 200 - 600ms
    await delay(ms);
  }

  async getStocks(): Promise<Stock[]> {
    await this.simulateLatency();
    return [...mockStocks];
  }

  async getStock(symbol: string): Promise<Stock | null> {
    await this.simulateLatency();
    const found = mockStocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    return found ? { ...found } : null;
  }

  async getCoins(): Promise<Coin[]> {
    await this.simulateLatency();
    return [...mockCoins];
  }

  async getMetals(): Promise<Metal[]> {
    await this.simulateLatency();
    return [...mockMetals];
  }

  async getMetal(symbol: string): Promise<Metal | null> {
    await this.simulateLatency();
    const found = getMockMetalBySymbol(symbol);
    return found ? { ...found } : null;
  }

  async getTopGainers(limit: number = 4): Promise<(Stock | Coin | Metal)[]> {
    await this.simulateLatency();
    const all: (Stock | Coin | Metal)[] = [...mockStocks, ...mockCoins, ...mockMetals];
    const positiveMovers = all.filter((item) => item.change24hPct > 0);
    positiveMovers.sort((a, b) => b.change24hPct - a.change24hPct);
    return positiveMovers.slice(0, limit);
  }

  async getCandles(symbol: string, range: '1W' | '1M' | '3M' | 'ALL' = '3M'): Promise<Candle[]> {
    await this.simulateLatency();
    return getMockCandles(symbol, range);
  }

  async getExpertPicks(): Promise<ExpertPick[]> {
    await this.simulateLatency();
    return [...mockExpertPicks];
  }

  async getPortfolio(): Promise<PortfolioHolding[]> {
    await this.simulateLatency();
    try {
      const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default demo holdings if empty
    return [
      { id: 'h-1', symbol: 'NVDA', name: 'Nvidia Corp.', assetType: 'stock', quantity: 25.0, avgBuyPrice: 112.50, buyDate: '2024-05-15' },
      { id: 'h-2', symbol: 'BTC', name: 'Bitcoin', assetType: 'coin', quantity: 0.45, avgBuyPrice: 58200.00, buyDate: '2024-03-10' },
      { id: 'h-3', symbol: 'ETH', name: 'Ethereum', assetType: 'coin', quantity: 4.2, avgBuyPrice: 2450.00, buyDate: '2024-04-02' },
      { id: 'h-4', symbol: 'AAPL', name: 'Apple Inc.', assetType: 'stock', quantity: 30.0, avgBuyPrice: 215.00, buyDate: '2024-06-20' },
      { id: 'h-5', symbol: 'XAU', name: 'Gold Bullion', assetType: 'metal', quantity: 2.5, avgBuyPrice: 2480.00, buyDate: '2024-02-18' },
    ];
  }

  async addHolding(holding: Omit<PortfolioHolding, 'id'>): Promise<PortfolioHolding> {
    await this.simulateLatency();
    const current = await this.getPortfolio();
    const newHolding: PortfolioHolding = {
      ...holding,
      id: `h-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    const updated = [...current, newHolding];
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(updated));
    return newHolding;
  }

  async updateHolding(holding: PortfolioHolding): Promise<PortfolioHolding> {
    await this.simulateLatency();
    const current = await this.getPortfolio();
    const index = current.findIndex((h) => h.id === holding.id);
    if (index === -1) {
      throw new Error(`Holding ${holding.id} not found`);
    }
    const updated = [...current];
    updated[index] = holding;
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(updated));
    return holding;
  }

  async removeHolding(id: string): Promise<boolean> {
    await this.simulateLatency();
    const current = await this.getPortfolio();
    const filtered = current.filter((h) => h.id !== id);
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  async importHoldingsCsv(rows: CsvRow[]): Promise<PortfolioHolding[]> {
    await this.simulateLatency();
    const current = await this.getPortfolio();
    const newHoldings: PortfolioHolding[] = rows.map((r, i) => {
      const isCoin = mockCoins.some((c) => c.symbol.toUpperCase() === r.symbol.toUpperCase());
      const isMetal = mockMetals.some((m) => m.symbol.toUpperCase() === r.symbol.toUpperCase());
      return {
        id: `csv-${Date.now()}-${i}`,
        symbol: r.symbol.toUpperCase(),
        name: r.symbol.toUpperCase(),
        assetType: isCoin ? 'coin' : isMetal ? 'metal' : 'stock',
        quantity: r.quantity,
        avgBuyPrice: r.price,
        buyDate: r.date,
      };
    });

    const merged = [...current, ...newHoldings];
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  async getExpectedProfit(holdings: PortfolioHolding[]): Promise<ExpectedProfitResult> {
    await this.simulateLatency();
    const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0);

    const calculateScenario = (annualizedBase: number, timeframeMonths: number, mult: number) => {
      const periodYears = timeframeMonths / 12;
      const effectiveAnnual = annualizedBase * mult;
      const returnPct = Math.round(effectiveAnnual * periodYears * 100);
      const projectedValue = Number((totalInvested * (1 + returnPct / 100)).toFixed(2));
      const gain = Number((projectedValue - totalInvested).toFixed(2));
      return { returnPct, projectedValue, gain };
    };

    return {
      totalInvested: Number(totalInvested.toFixed(2)),
      timeframes: {
        '1M': {
          conservative: { scenario: 'conservative', ...calculateScenario(0.08, 1, 0.6) },
          base: { scenario: 'base', ...calculateScenario(0.14, 1, 1.0) },
          optimistic: { scenario: 'optimistic', ...calculateScenario(0.24, 1, 1.5) },
        },
        '6M': {
          conservative: { scenario: 'conservative', ...calculateScenario(0.08, 6, 0.6) },
          base: { scenario: 'base', ...calculateScenario(0.14, 6, 1.0) },
          optimistic: { scenario: 'optimistic', ...calculateScenario(0.24, 6, 1.5) },
        },
        '12M': {
          conservative: { scenario: 'conservative', ...calculateScenario(0.08, 12, 0.6) },
          base: { scenario: 'base', ...calculateScenario(0.14, 12, 1.0) },
          optimistic: { scenario: 'optimistic', ...calculateScenario(0.24, 12, 1.5) },
        },
      },
      disclaimer: 'Illustrative estimate based on historical volatility scenarios. Not financial advice or a guaranteed return prediction.',
    };
  }

  async getAiSummary(symbol: string): Promise<AiSummaryData> {
    await this.simulateLatency();
    const upper = symbol.toUpperCase();
    const headlines = getHeadlinesForSymbol(upper);

    const summaryTemplates: Record<string, { summary: string; keyPoints: string[]; sentiment: 'bullish' | 'bearish' | 'neutral' }> = {
      NVDA: {
        summary: 'NVIDIA maintains market leadership across generative AI compute architectures, supported by strong hyperscaler capex and robust order book visibility.',
        keyPoints: ['Blackwell architectural transition on schedule', 'Gross margins sustaining near historical peaks', 'Datacenter segment driving over 80% of revenue'],
        sentiment: 'bullish',
      },
      BTC: {
        summary: 'Bitcoin demonstrates structural accumulation around institutional demand clusters with post-halving supply compression continuing to support price floors.',
        keyPoints: ['Exchange liquid reserves decline to multi-year lows', 'ETF net flows turn consistently positive', 'Hashrate sets fresh historical highs'],
        sentiment: 'bullish',
      },
      XAU: {
        summary: 'Gold displays steady macro resilience as central bank reserves accumulation and global rate easing cycles bolster spot bullion pricing.',
        keyPoints: ['Central bank gold purchases remain at historic highs', 'Lower sovereign bond yields reduce physical carry costs', 'ETF physical inflows expanding'],
        sentiment: 'bullish',
      },
    };

    const template = summaryTemplates[upper] || {
      summary: `${upper} exhibits balanced market activity with consolidating trading volume and stable technical structure across key moving averages.`,
      keyPoints: [
        headlines[0]?.headline || 'Volume profiles remain consistent with 30-day averages',
        'Support bands holding firm at key Fibonacci retracement levels',
        'Macro market sentiment remains broadly neutral to cautiously optimistic',
      ],
      sentiment: 'neutral',
    };

    return {
      symbol: upper,
      summary: template.summary,
      keyPoints: template.keyPoints,
      sentiment: template.sentiment,
      disclaimer: 'AI-generated summary, not financial advice.',
      generatedAt: Date.now(),
    };
  }

  async getFearGreed(): Promise<FearGreedData> {
    await this.simulateLatency();
    return {
      score: 68,
      label: 'Greed',
      updatedAt: Date.now(),
      isMock: true,
    };
  }

  async getTrending(): Promise<Coin[]> {
    await this.simulateLatency();
    return mockCoins.slice(0, 5);
  }

  async getComparisonSeries(symbols: string[], range: '1M' | '3M' | 'ALL' = '1M'): Promise<ComparisonSeries[]> {
    await this.simulateLatency();
    const count = range === '1M' ? 30 : 90;

    return symbols.map((sym) => {
      const candles = getMockCandles(sym, range);
      const points = candles.slice(-count);
      const baseClose = points[0]?.close || 1;

      return {
        symbol: sym.toUpperCase(),
        normalizedPoints: points.map((p) => ({
          timestamp: p.timestamp,
          value: Number(((p.close / baseClose) * 100).toFixed(2)),
        })),
      };
    });
  }

  async getFxRate(from: string = 'USD', to: string = 'INR'): Promise<FxRate> {
    await this.simulateLatency();
    return {
      from,
      to,
      rate: 83.95,
      lastUpdated: Date.now(),
      isMock: true,
    };
  }
}

export const mockProvider = new MockProvider();

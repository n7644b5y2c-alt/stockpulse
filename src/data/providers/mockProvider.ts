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
import { mockStocks } from '../mock/stocks';
import { mockCoins } from '../mock/coins';
import { getMockCandles } from '../mock/candles';
import { mockExpertPicks } from '../mock/expertPicks';
import { getHeadlinesForSymbol } from '../mock/headlines';

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
    const ms = Math.floor(Math.random() * 500) + 300; // 300 - 800ms
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

  async getTopGainers(limit: number = 4): Promise<(Stock | Coin)[]> {
    await this.simulateLatency();
    const all: (Stock | Coin)[] = [...mockStocks, ...mockCoins];
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
    if (index !== -1) {
      current[index] = holding;
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(current));
    }
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
    const newItems: PortfolioHolding[] = rows.map((r, i) => {
      const isCoin = mockCoins.some((c) => c.symbol.toUpperCase() === r.symbol.toUpperCase());
      return {
        id: `csv-${Date.now()}-${i}`,
        symbol: r.symbol.toUpperCase(),
        name: r.symbol.toUpperCase(),
        assetType: isCoin ? 'coin' : 'stock',
        quantity: r.quantity,
        avgBuyPrice: r.price,
        buyDate: r.date,
      };
    });
    const merged = [...current, ...newItems];
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  async getExpectedProfit(holdings: PortfolioHolding[]): Promise<ExpectedProfitResult> {
    await this.simulateLatency();
    const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0);

    // Documented formula:
    // Conservative: ~8% annualized (0.64% monthly)
    // Base: ~14.5% annualized (1.13% monthly)
    // Optimistic: ~22% annualized (1.67% monthly)
    const calcReturn = (months: number, annualRate: number) => {
      const rate = annualRate * (months / 12);
      const projectedValue = Number((totalInvested * (1 + rate)).toFixed(2));
      const gain = Number((projectedValue - totalInvested).toFixed(2));
      const returnPct = Number((rate * 100).toFixed(2));
      return { returnPct, projectedValue, gain };
    };

    return {
      totalInvested: Number(totalInvested.toFixed(2)),
      timeframes: {
        '1M': {
          conservative: { scenario: 'conservative', ...calcReturn(1, 0.08) },
          base: { scenario: 'base', ...calcReturn(1, 0.145) },
          optimistic: { scenario: 'optimistic', ...calcReturn(1, 0.22) },
        },
        '6M': {
          conservative: { scenario: 'conservative', ...calcReturn(6, 0.08) },
          base: { scenario: 'base', ...calcReturn(6, 0.145) },
          optimistic: { scenario: 'optimistic', ...calcReturn(6, 0.22) },
        },
        '12M': {
          conservative: { scenario: 'conservative', ...calcReturn(12, 0.08) },
          base: { scenario: 'base', ...calcReturn(12, 0.145) },
          optimistic: { scenario: 'optimistic', ...calcReturn(12, 0.22) },
        },
      },
      disclaimer: 'Illustrative mathematical estimate based on hypothetical historical returns. Not financial advice or a guarantee of future performance.',
    };
  }

  async getAiSummary(symbol: string): Promise<AiSummaryData> {
    await this.simulateLatency();
    const headlines = getHeadlinesForSymbol(symbol);
    const upper = symbol.toUpperCase();

    const sampleSummaries: Record<string, { summary: string; keyPoints: string[]; sentiment: 'bullish' | 'bearish' | 'neutral' }> = {
      NVDA: {
        summary: 'NVIDIA demonstrates persistent leadership in datacenter accelerator architecture with multi-quarter backlog commitments across major cloud service providers.',
        keyPoints: [
          'Blackwell GPU ramp on schedule for hyperscale deployments',
          'Enterprise software networking margins expanding',
          'Export controls priced into baseline projections',
        ],
        sentiment: 'bullish',
      },
      BTC: {
        summary: 'Bitcoin exhibits structural on-chain consolidation above major support levels driven by sovereign and institutional ETF reserve accumulation.',
        keyPoints: [
          'Exchange reserves at 3-year lows reducing sell-side liquid supply',
          'Hash rate resilience through halving difficulty adjustments',
          'Macro liquidity easing correlation remains positive',
        ],
        sentiment: 'bullish',
      },
      TSLA: {
        summary: 'Tesla shows strong momentum in stationary Megapack energy storage installations balancing cyclical automotive margin headwinds.',
        keyPoints: [
          'Energy storage revenue growing >60% YoY',
          'Next-gen autonomous platform pilot underway',
          'Global delivery estimates stabilized',
        ],
        sentiment: 'bullish',
      },
    };

    const template = sampleSummaries[upper] || {
      summary: `${upper} displays steady price action within its 30-day technical channel. Recent trading volume indicates balanced retail and institutional positioning.`,
      keyPoints: [
        `${headlines[0]?.headline || 'Volume trending within normal daily standard deviations'}`,
        'Support levels holding above the 20-day exponential moving average',
        'Consensus price targets indicate favorable risk-reward asymmetry',
      ],
      sentiment: 'bullish',
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
    // Return top 5 coins
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
          // Rebased to 100 at starting point
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
      rate: 83.50,
      lastUpdated: Date.now(),
      isMock: true,
    };
  }
}

export const mockProvider = new MockProvider();

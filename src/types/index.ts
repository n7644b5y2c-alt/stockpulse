/**
 * StockPulse Core TypeScript Definitions (Stage 2 Redesigned)
 */

export * from '../data/schemas/index.ts';

import type {
  Stock as ZodStock,
  Coin as ZodCoin,
  Metal as ZodMetal,
  Candle,
  PriceTick,
  PriceAlert,
  PortfolioHolding as ZodPortfolioHolding,
  ExpertPick as ZodExpertPick,
  ExpectedProfitResult,
  FearGreedData,
  AiSummaryData,
  FxRate,
  ChartDrawing,
} from '../data/schemas/index.ts';

export type {
  ZodStock,
  ZodCoin,
  ZodMetal,
  Candle,
  PriceTick,
  PriceAlert,
  ZodPortfolioHolding,
  ZodExpertPick,
  ExpectedProfitResult,
  FearGreedData,
  AiSummaryData,
  FxRate,
  ChartDrawing,
};

export type AssetType = 'stock' | 'coin' | 'metal';

export type PriceDirection = 'up' | 'down' | 'flat';

export type StreamStatus = 'connected' | 'paused' | 'disconnected' | 'connecting';

export interface PriceStream {
  subscribe(symbols: string[], callback: (tick: PriceTick) => void): void;
  unsubscribe(symbols: string[], callback?: (tick: PriceTick) => void): void;
  pause(): void;
  resume(): void;
  getStatus(): StreamStatus;
}

export interface IndicatorConfig {
  smaPeriod?: number;
  emaPeriod?: number;
  rsiPeriod?: number;
  bbPeriod?: number;
  bbMultiplier?: number;
}

export interface IndicatorValues {
  sma: (number | null)[];
  ema: (number | null)[];
  rsi: (number | null)[];
  bollingerBands: {
    upper: (number | null)[];
    middle: (number | null)[];
    lower: (number | null)[];
  };
}

export interface MarketHoursStatus {
  market: 'NYSE' | 'NSE' | 'BSE' | 'CRYPTO' | 'METALS';
  timezone: string;
  isOpen: boolean;
  isPreOpen: boolean;
  status: 'open' | 'closed' | 'pre-open';
  localTime: string;
  nextOpen: string;
  timeToNextOpen: string;
}

export interface PortfolioAnalytics {
  currentValue: number;
  totalCostBasis: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdingsWithPnl: Array<{
    id: string;
    symbol: string;
    name: string;
    assetType: 'stock' | 'coin' | 'metal';
    quantity: number;
    avgBuyPrice: number;
    currentPrice: number;
    currentValue: number;
    totalCost: number;
    gainLoss: number;
    gainLossPercent: number;
    allocationPercent: number;
  }>;
  allocationByType: {
    stock: number;
    coin: number;
    metal: number;
  };
  bestPerformer: { symbol: string; gainLossPercent: number } | null;
  worstPerformer: { symbol: string; gainLossPercent: number } | null;
}

export interface ComparisonSeries {
  symbol: string;
  normalizedPoints: Array<{ timestamp: number; value: number }>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isDemoUser: boolean;
  createdAt: number;
}

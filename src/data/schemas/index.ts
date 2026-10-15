import { z } from 'zod';

export const CandleSchema = z.object({
  timestamp: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export type Candle = z.infer<typeof CandleSchema>;

export const StockSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  type: z.literal('stock'),
  price: z.number(),
  change24hPct: z.number(),
  volume: z.number(),
  marketCap: z.number(),
  sector: z.string(),
  sparkline: z.array(z.number()),
  candles: z.array(CandleSchema).optional(),
});

export type Stock = z.infer<typeof StockSchema>;

export const CoinSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  type: z.literal('coin'),
  price: z.number(),
  change24hPct: z.number(),
  volume: z.number(),
  marketCap: z.number(),
  category: z.string(),
  sparkline: z.array(z.number()),
  candles: z.array(CandleSchema).optional(),
  isExpertPick: z.boolean().optional(),
});

export type Coin = z.infer<typeof CoinSchema>;

export const MarketItemSchema = z.discriminatedUnion('type', [
  StockSchema,
  CoinSchema,
]);

export type MarketItem = z.infer<typeof MarketItemSchema>;

export const PriceTickSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  previousPrice: z.number(),
  direction: z.enum(['up', 'down', 'flat']),
  timestamp: z.number(),
});

export type PriceTick = z.infer<typeof PriceTickSchema>;

export const AlertSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  symbol: z.string().min(1),
  condition: z.enum(['above', 'below']),
  targetPrice: z.number().positive(),
  status: z.enum(['active', 'triggered']),
  createdAt: z.number(),
  triggeredAt: z.number().optional(),
});

export type PriceAlert = z.infer<typeof AlertSchema>;

export const PortfolioHoldingSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().optional(),
  assetType: z.enum(['stock', 'coin']),
  quantity: z.number().positive(),
  avgBuyPrice: z.number().positive(),
  buyDate: z.string().min(1),
});

export type PortfolioHolding = z.infer<typeof PortfolioHoldingSchema>;

export const CsvRowSchema = z.object({
  symbol: z.string().min(1),
  quantity: z.coerce.number().positive(),
  price: z.coerce.number().positive(),
  date: z.string().min(1),
  side: z.enum(['buy', 'sell']),
});

export type CsvRow = z.infer<typeof CsvRowSchema>;

export const ExpertPickSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  assetType: z.enum(['stock', 'coin']),
  rating: z.enum(['Strong Buy', 'Buy']),
  currentPrice: z.number(),
  targetPrice: z.number(),
  rationale: z.string(),
  analystName: z.string(),
  confidencePct: z.number().min(0).max(100),
  isHighlighted: z.boolean(),
  timeframe: z.string(),
});

export type ExpertPick = z.infer<typeof ExpertPickSchema>;

export const ExpectedProfitScenarioSchema = z.object({
  scenario: z.enum(['conservative', 'base', 'optimistic']),
  returnPct: z.number(),
  projectedValue: z.number(),
  gain: z.number(),
});

export type ExpectedProfitScenario = z.infer<typeof ExpectedProfitScenarioSchema>;

export const ExpectedProfitTimeframeSchema = z.object({
  timeframe: z.enum(['1M', '6M', '12M']),
  scenarios: z.record(z.enum(['conservative', 'base', 'optimistic']), ExpectedProfitScenarioSchema),
});

export type ExpectedProfitTimeframe = z.infer<typeof ExpectedProfitTimeframeSchema>;

export const ExpectedProfitResultSchema = z.object({
  totalInvested: z.number(),
  timeframes: z.record(z.enum(['1M', '6M', '12M']), z.record(z.enum(['conservative', 'base', 'optimistic']), ExpectedProfitScenarioSchema)),
  disclaimer: z.string(),
});

export type ExpectedProfitResult = z.infer<typeof ExpectedProfitResultSchema>;

export const FearGreedSchema = z.object({
  score: z.number().min(0).max(100),
  label: z.enum(['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed']),
  updatedAt: z.number(),
  isMock: z.boolean(),
});

export type FearGreedData = z.infer<typeof FearGreedSchema>;

export const AiSummarySchema = z.object({
  symbol: z.string(),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  sentiment: z.enum(['bullish', 'bearish', 'neutral']),
  disclaimer: z.string(),
  generatedAt: z.number(),
});

export type AiSummaryData = z.infer<typeof AiSummarySchema>;

export const FxRateSchema = z.object({
  from: z.string(),
  to: z.string(),
  rate: z.number().positive(),
  lastUpdated: z.number(),
  isMock: z.boolean(),
});

export type FxRate = z.infer<typeof FxRateSchema>;

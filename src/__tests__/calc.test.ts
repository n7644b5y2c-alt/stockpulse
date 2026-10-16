import { describe, it, expect } from 'vitest';
import { calculatePortfolioAnalytics, type PriceLookup } from '../lib/calc';
import type { PortfolioHolding } from '../types';

describe('Portfolio Analytics Engine (calc.ts)', () => {
  const sampleHoldings: PortfolioHolding[] = [
    {
      id: 'h-1',
      symbol: 'NVDA',
      name: 'NVIDIA',
      assetType: 'stock',
      quantity: 10,
      avgBuyPrice: 100, // Cost: $1,000
      buyDate: '2024-01-01',
    },
    {
      id: 'h-2',
      symbol: 'BTC',
      name: 'Bitcoin',
      assetType: 'coin',
      quantity: 1,
      avgBuyPrice: 50000, // Cost: $50,000
      buyDate: '2024-01-01',
    },
  ];

  const priceLookup: PriceLookup = {
    NVDA: { price: 150, name: 'NVIDIA', assetType: 'stock' }, // Value: $1,500 (+50%)
    BTC: { price: 60000, name: 'Bitcoin', assetType: 'coin' }, // Value: $60,000 (+20%)
  };

  it('calculates total portfolio valuation and cost basis accurately', () => {
    const analytics = calculatePortfolioAnalytics(sampleHoldings, priceLookup);
    // Total cost = 1,000 + 50,000 = 51,000
    expect(analytics.totalCostBasis).toBe(51000);
    // Total value = 1,500 + 60,000 = 61,500
    expect(analytics.currentValue).toBe(61500);
    // Total gain = 61,500 - 51,000 = 10,500
    expect(analytics.totalGainLoss).toBe(10500);
    // Gain percent = (10,500 / 51,000) * 100 = ~20.59%
    expect(analytics.totalGainLossPercent).toBeCloseTo(20.59, 1);
  });

  it('computes asset allocations correctly', () => {
    const analytics = calculatePortfolioAnalytics(sampleHoldings, priceLookup);
    // Stock value = 1,500. Total = 61,500 -> 1500 / 61500 = 2.44%
    // Coin value = 60,000. Total = 61,500 -> 60000 / 61500 = 97.56%
    expect(analytics.allocationByType.stock).toBeCloseTo(2.44, 1);
    expect(analytics.allocationByType.coin).toBeCloseTo(97.56, 1);
    expect(analytics.allocationByType.stock + analytics.allocationByType.coin).toBeCloseTo(100, 1);
  });

  it('identifies best and worst performers accurately', () => {
    const analytics = calculatePortfolioAnalytics(sampleHoldings, priceLookup);
    // NVDA gained +50%, BTC gained +20%
    expect(analytics.bestPerformer?.symbol).toBe('NVDA');
    expect(analytics.bestPerformer?.gainLossPercent).toBe(50);
    expect(analytics.worstPerformer?.symbol).toBe('BTC');
    expect(analytics.worstPerformer?.gainLossPercent).toBe(20);
  });
});

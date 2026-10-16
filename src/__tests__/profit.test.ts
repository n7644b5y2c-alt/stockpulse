import { describe, it, expect } from 'vitest';
import { mockProvider } from '../data/providers/mockProvider';
import type { PortfolioHolding } from '../types';

describe('Expected Profit Scenarios Engine', () => {
  const sampleHoldings: PortfolioHolding[] = [
    {
      id: 'h-1',
      symbol: 'NVDA',
      name: 'NVIDIA',
      assetType: 'stock',
      quantity: 10,
      avgBuyPrice: 100, // Total invested: $1,000
      buyDate: '2024-01-01',
    },
  ];

  it('returns valid projections for 1M, 6M, and 12M across all 3 scenarios', async () => {
    const result = await mockProvider.getExpectedProfit(sampleHoldings);

    expect(result.totalInvested).toBe(1000);
    expect(result.disclaimer).toContain('Not financial advice');

    // Check timeframes exist
    expect(result.timeframes['1M']).toBeDefined();
    expect(result.timeframes['6M']).toBeDefined();
    expect(result.timeframes['12M']).toBeDefined();

    // Check scenarios in 12M
    const twelveMonth = result.timeframes['12M'];
    expect(twelveMonth.conservative.projectedValue).toBeGreaterThan(1000);
    expect(twelveMonth.base.projectedValue).toBeGreaterThan(twelveMonth.conservative.projectedValue);
    expect(twelveMonth.optimistic.projectedValue).toBeGreaterThan(twelveMonth.base.projectedValue);

    // Gains should equal projectedValue - totalInvested
    expect(twelveMonth.base.gain).toBe(Number((twelveMonth.base.projectedValue - 1000).toFixed(2)));
  });
});

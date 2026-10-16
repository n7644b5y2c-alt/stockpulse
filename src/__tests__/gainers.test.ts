import { describe, it, expect } from 'vitest';
import { mockProvider } from '../data/providers/mockProvider';

describe('Gainers-First Market Query (getTopGainers)', () => {
  it('returns positive movers sorted descending by percentage change', async () => {
    const gainers = await mockProvider.getTopGainers(6);

    expect(gainers.length).toBeLessThanOrEqual(6);
    expect(gainers.length).toBeGreaterThan(0);

    // All must be strictly positive
    gainers.forEach((item) => {
      expect(item.change24hPct).toBeGreaterThan(0);
    });

    // Strictly sorted descending
    for (let i = 1; i < gainers.length; i++) {
      expect(gainers[i - 1].change24hPct).toBeGreaterThanOrEqual(gainers[i].change24hPct);
    }
  });

  it('top 4 gainers match NVDA, TSLA, PLTR, AMD in order', async () => {
    const top4 = await mockProvider.getTopGainers(4);
    const symbols = top4.map((t) => t.symbol);
    expect(symbols).toEqual(['NVDA', 'TSLA', 'PLTR', 'AMD']);
  });
});

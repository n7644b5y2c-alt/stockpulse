import type { Candle } from '../schemas/index.ts';
import { mockStocks } from './stocks.ts';
import { mockCoins } from './coins.ts';
import { mockMetals } from './metals.ts';

const candleMap = new Map<string, Candle[]>();

[...mockStocks, ...mockCoins, ...mockMetals].forEach((asset) => {
  if (asset.candles) {
    candleMap.set(asset.symbol.toUpperCase(), asset.candles);
  }
});

export function getMockCandles(symbol: string, range: '1W' | '1M' | '3M' | 'ALL' = '3M'): Candle[] {
  const allCandles = candleMap.get(symbol.toUpperCase());
  if (!allCandles || allCandles.length === 0) {
    return [];
  }

  const count = range === '1W' ? 7 : range === '1M' ? 30 : 90;
  return allCandles.slice(-count);
}

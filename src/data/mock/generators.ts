import type { Candle } from '../schemas/index.ts';

/**
 * Deterministically generates 90 daily OHLC candles ending exactly at targetPrice.
 * Ensures the final candle's close equals targetPrice (internal consistency rule).
 */
export function generateCandlesForAsset(
  targetPrice: number,
  change24hPct: number,
  volatility: number = 0.02,
  days: number = 90
): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Work backwards from current price
  const closePrices: number[] = new Array(days);
  closePrices[days - 1] = targetPrice;

  // Yesterday's close based on change24hPct:
  // change24hPct = ((today - yesterday) / yesterday) * 100
  // yesterday = today / (1 + change24hPct / 100)
  const prevClose = targetPrice / (1 + change24hPct / 100);
  if (days > 1) {
    closePrices[days - 2] = Number(prevClose.toFixed(2));
  }

  // Generate historical close prices backwards deterministically with pseudo-random walk
  let current = prevClose;
  for (let i = days - 3; i >= 0; i--) {
    // Pseudo random generator with consistent variance
    const seed = Math.sin(i * 997 + targetPrice) * 10000;
    const factor = 1 + ((seed - Math.floor(seed)) - 0.49) * volatility;
    current = Math.max(0.01, current / factor);
    closePrices[i] = Number(current.toFixed(2));
  }

  // Build OHLC candles
  for (let i = 0; i < days; i++) {
    const timestamp = now - (days - 1 - i) * dayMs;
    const close = closePrices[i];
    const prev = i > 0 ? closePrices[i - 1] : close * 0.99;
    const open = Number(prev.toFixed(2));
    const high = Number((Math.max(open, close) * (1 + Math.abs(Math.sin(i * 13)) * (volatility * 0.8))).toFixed(2));
    const low = Number((Math.min(open, close) * (1 - Math.abs(Math.cos(i * 17)) * (volatility * 0.8))).toFixed(2));
    const volume = Math.floor(100000 + Math.abs(Math.sin(i * 29)) * 5000000);

    candles.push({
      timestamp,
      open,
      high: Math.max(high, open, close),
      low: Math.min(low, open, close),
      close,
      volume,
    });
  }

  // Absolute guarantee: last candle close strictly equals targetPrice
  candles[days - 1].close = targetPrice;

  return candles;
}

/**
 * Extracts a 30-day sparkline from candles, ending strictly with the targetPrice.
 */
export function extractSparkline(candles: Candle[], points: number = 30): number[] {
  const slice = candles.slice(-points);
  return slice.map((c) => c.close);
}

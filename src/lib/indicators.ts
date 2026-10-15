import type { Candle } from '../schemas';

/**
 * Calculates Simple Moving Average (SMA) on candle close prices.
 * Returns null for indices before period is reached.
 */
export function calculateSMA(candles: Candle[], period: number): (number | null)[] {
  if (period <= 0 || candles.length === 0) return [];
  const result: (number | null)[] = [];
  let sum = 0;

  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) {
      sum -= candles[i - period].close;
    }

    if (i >= period - 1) {
      result.push(Number((sum / period).toFixed(2)));
    } else {
      result.push(null);
    }
  }

  return result;
}

/**
 * Calculates Exponential Moving Average (EMA) on candle close prices.
 * Initial EMA is the SMA of the first `period` points, followed by:
 * multiplier = 2 / (period + 1)
 * EMA_today = (price_today * multiplier) + (EMA_yesterday * (1 - multiplier))
 */
export function calculateEMA(candles: Candle[], period: number): (number | null)[] {
  if (period <= 0 || candles.length === 0) return [];
  const result: (number | null)[] = new Array(candles.length).fill(null);

  if (candles.length < period) return result;

  // First EMA value is SMA of first `period` elements
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  let prevEma = sum / period;
  result[period - 1] = Number(prevEma.toFixed(2));

  const multiplier = 2 / (period + 1);

  for (let i = period; i < candles.length; i++) {
    const currentPrice = candles[i].close;
    prevEma = (currentPrice - prevEma) * multiplier + prevEma;
    result[i] = Number(prevEma.toFixed(2));
  }

  return result;
}

/**
 * Calculates Relative Strength Index (RSI) using Wilder's smoothed moving average method.
 * Standard default period is 14.
 */
export function calculateRSI(candles: Candle[], period: number = 14): (number | null)[] {
  if (period <= 0 || candles.length <= period) {
    return new Array(candles.length).fill(null);
  }

  const result: (number | null)[] = new Array(candles.length).fill(null);

  let gains = 0;
  let losses = 0;

  // First period changes
  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) {
    result[period] = 100;
  } else {
    const rs = avgGain / avgLoss;
    result[period] = Number((100 - 100 / (1 + rs)).toFixed(2));
  }

  // Smooth remaining values using Wilder's technique
  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const currentGain = diff > 0 ? diff : 0;
    const currentLoss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    if (avgLoss === 0) {
      result[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      result[i] = Number((100 - 100 / (1 + rs)).toFixed(2));
    }
  }

  return result;
}

export interface BollingerBandsResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

/**
 * Calculates Bollinger Bands (default period 20, multiplier 2).
 * Middle Band = 20-day SMA
 * Upper Band = 20-day SMA + (2 * 20-day standard deviation)
 * Lower Band = 20-day SMA - (2 * 20-day standard deviation)
 */
export function calculateBollingerBands(
  candles: Candle[],
  period: number = 20,
  multiplier: number = 2
): BollingerBandsResult {
  const middle = calculateSMA(candles, period);
  const upper: (number | null)[] = new Array(candles.length).fill(null);
  const lower: (number | null)[] = new Array(candles.length).fill(null);

  for (let i = period - 1; i < candles.length; i++) {
    const ma = middle[i];
    if (ma === null) continue;

    // Calculate sample standard deviation
    let varianceSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = candles[j].close - ma;
      varianceSum += diff * diff;
    }
    const stdDev = Math.sqrt(varianceSum / period);

    upper[i] = Number((ma + multiplier * stdDev).toFixed(2));
    lower[i] = Number((ma - multiplier * stdDev).toFixed(2));
  }

  return { upper, middle, lower };
}

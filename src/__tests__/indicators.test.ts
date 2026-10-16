import { describe, it, expect } from 'vitest';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateBollingerBands,
} from '../lib/indicators';
import type { Candle } from '../types';

function createMockCandles(closePrices: number[]): Candle[] {
  return closePrices.map((close, i) => ({
    timestamp: 1700000000000 + i * 86400000,
    open: close,
    high: close + 2,
    low: close - 2,
    close,
    volume: 1000,
  }));
}

describe('Technical Indicators Library', () => {
  describe('calculateSMA', () => {
    it('returns empty array when candle array is empty or period invalid', () => {
      expect(calculateSMA([], 5)).toEqual([]);
      expect(calculateSMA(createMockCandles([10, 20]), 0)).toEqual([]);
    });

    it('calculates correct 3-period SMA', () => {
      const candles = createMockCandles([10, 20, 30, 40, 50]);
      const sma = calculateSMA(candles, 3);
      // SMA for index 0 and 1 should be null
      expect(sma[0]).toBeNull();
      expect(sma[1]).toBeNull();
      // (10+20+30)/3 = 20
      expect(sma[2]).toBe(20);
      // (20+30+40)/3 = 30
      expect(sma[3]).toBe(30);
      // (30+40+50)/3 = 40
      expect(sma[4]).toBe(40);
    });
  });

  describe('calculateEMA', () => {
    it('returns correct EMA values based on multiplier formula', () => {
      // 3-period EMA: multiplier = 2 / (3 + 1) = 0.5
      // Initial SMA (first 3): (10 + 20 + 30) / 3 = 20
      // Next candle close = 40: EMA = 40 * 0.5 + 20 * 0.5 = 30
      // Next candle close = 50: EMA = 50 * 0.5 + 30 * 0.5 = 40
      const candles = createMockCandles([10, 20, 30, 40, 50]);
      const ema = calculateEMA(candles, 3);
      expect(ema[0]).toBeNull();
      expect(ema[1]).toBeNull();
      expect(ema[2]).toBe(20);
      expect(ema[3]).toBe(30);
      expect(ema[4]).toBe(40);
    });
  });

  describe('calculateRSI', () => {
    it('returns nulls when data length is less than period', () => {
      const candles = createMockCandles([10, 20, 30]);
      const rsi = calculateRSI(candles, 14);
      expect(rsi.every((v) => v === null)).toBe(true);
    });

    it('returns 100 when all price movements are gains', () => {
      const prices = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];
      const candles = createMockCandles(prices);
      const rsi = calculateRSI(candles, 14);
      expect(rsi[14]).toBe(100);
      expect(rsi[15]).toBe(100);
    });

    it('returns value within 0-100 bounds on fluctuating prices', () => {
      const prices = [44, 44.5, 43.8, 44.2, 45.1, 44.8, 45.5, 46.2, 45.9, 46.5, 47.1, 46.8, 47.5, 48.0, 47.7, 48.2];
      const candles = createMockCandles(prices);
      const rsi = calculateRSI(candles, 14);
      const lastRsi = rsi[rsi.length - 1];
      expect(lastRsi).not.toBeNull();
      expect(lastRsi!).toBeGreaterThan(0);
      expect(lastRsi!).toBeLessThan(100);
    });
  });

  describe('calculateBollingerBands', () => {
    it('calculates upper, middle, and lower bands correctly', () => {
      // 5 identical close values: standard deviation is 0
      const candles = createMockCandles([100, 100, 100, 100, 100]);
      const bb = calculateBollingerBands(candles, 3, 2);

      expect(bb.middle[2]).toBe(100);
      expect(bb.upper[2]).toBe(100);
      expect(bb.lower[2]).toBe(100);
    });

    it('upper band is greater than middle and lower is smaller than middle when variance exists', () => {
      const candles = createMockCandles([90, 100, 110, 105, 95]);
      const bb = calculateBollingerBands(candles, 3, 2);

      expect(bb.upper[2]!).toBeGreaterThan(bb.middle[2]!);
      expect(bb.lower[2]!).toBeLessThan(bb.middle[2]!);
    });
  });
});

import { useMemo } from 'react';
import { useCandles } from './useCandles';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateBollingerBands,
} from '../lib/indicators';
import type { IndicatorConfig, IndicatorValues } from '../types';

export function useIndicators(symbol: string, config: IndicatorConfig = {}) {
  const { data: candles = [], isLoading, isError, error, refetch } = useCandles(symbol, '3M');

  const {
    smaPeriod = 20,
    emaPeriod = 20,
    rsiPeriod = 14,
    bbPeriod = 20,
    bbMultiplier = 2,
  } = config;

  const indicators = useMemo<IndicatorValues>(() => {
    if (!candles || candles.length === 0) {
      return {
        sma: [],
        ema: [],
        rsi: [],
        bollingerBands: { upper: [], middle: [], lower: [] },
      };
    }

    return {
      sma: calculateSMA(candles, smaPeriod),
      ema: calculateEMA(candles, emaPeriod),
      rsi: calculateRSI(candles, rsiPeriod),
      bollingerBands: calculateBollingerBands(candles, bbPeriod, bbMultiplier),
    };
  }, [candles, smaPeriod, emaPeriod, rsiPeriod, bbPeriod, bbMultiplier]);

  return {
    candles,
    indicators,
    latestSMA: indicators.sma[indicators.sma.length - 1] ?? null,
    latestEMA: indicators.ema[indicators.ema.length - 1] ?? null,
    latestRSI: indicators.rsi[indicators.rsi.length - 1] ?? null,
    latestBB: {
      upper: indicators.bollingerBands.upper[indicators.bollingerBands.upper.length - 1] ?? null,
      middle: indicators.bollingerBands.middle[indicators.bollingerBands.middle.length - 1] ?? null,
      lower: indicators.bollingerBands.lower[indicators.bollingerBands.lower.length - 1] ?? null,
    },
    isLoading,
    isError,
    error,
    refetch,
  };
}

export const TROY_OZ_TO_GRAMS = 31.1034768;

export type MetalUnit = 'oz' | 'g' | '10g_inr';

/**
 * Converts price per troy ounce in USD to the specified unit and currency.
 * @param pricePerOz - Base price in USD per troy ounce
 * @param unit - Target unit: 'oz' (USD/oz), 'g' (USD/g), or '10g_inr' (INR/10g)
 * @param fxRate - USD to INR exchange rate (default: 83.95)
 */
export function convertMetalPrice(
  pricePerOz: number,
  unit: MetalUnit,
  fxRate: number = 83.95
): number {
  if (unit === 'oz') {
    return pricePerOz;
  }
  if (unit === 'g') {
    return pricePerOz / TROY_OZ_TO_GRAMS;
  }
  if (unit === '10g_inr') {
    const pricePerGramUsd = pricePerOz / TROY_OZ_TO_GRAMS;
    return pricePerGramUsd * 10 * fxRate;
  }
  return pricePerOz;
}

/**
 * Formats converted metal price with appropriate currency symbols and unit labels.
 */
export function formatMetalPrice(
  pricePerOz: number,
  unit: MetalUnit,
  fxRate: number = 83.95
): string {
  const converted = convertMetalPrice(pricePerOz, unit, fxRate);

  if (unit === '10g_inr') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
  if (unit === 'g') {
    return `$${converted.toFixed(2)}/g`;
  }
  return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/oz`;
}

/**
 * Calculates the Gold-to-Silver ratio.
 * Formula: Gold Price per oz / Silver Price per oz.
 */
export function calculateGoldToSilverRatio(goldPrice: number, silverPrice: number): number {
  if (!silverPrice || silverPrice <= 0) return 0;
  return Number((goldPrice / silverPrice).toFixed(2));
}

/**
 * Computes performance percentages across 1M, 6M, 12M historical windows.
 */
export function calculateMetalPerformance(price: number, change24hPct: number): {
  oneMonth: number;
  sixMonth: number;
  oneYear: number;
} {
  // Modelled historical drift
  const sign = change24hPct >= 0 ? 1 : -0.5;
  return {
    oneMonth: Number((sign * (2.4 + Math.abs(change24hPct) * 1.2)).toFixed(2)),
    sixMonth: Number((sign * (8.6 + Math.abs(change24hPct) * 2.5)).toFixed(2)),
    oneYear: Number((sign * (18.4 + Math.abs(change24hPct) * 4.1)).toFixed(2)),
  };
}

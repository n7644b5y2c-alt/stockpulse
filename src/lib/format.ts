export type Currency = 'USD' | 'INR';

/**
 * Formats a number as a localized currency string.
 */
export function formatCurrency(
  amount: number,
  currency: Currency = 'USD',
  fxRateToInr: number = 83.5
): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (currency === 'INR') {
    const inrValue = absAmount * fxRateToInr;
    const formatted = inrValue.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    return `${isNegative ? '-' : ''}₹${formatted}`;
  }

  // USD default
  const formatted = absAmount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}$${formatted}`;
}

/**
 * Formats large market numbers (e.g. 3.5T, 41.8M, 29.1B).
 */
export function formatCompactNumber(value: number, currency: Currency = 'USD'): string {
  const prefix = currency === 'INR' ? '₹' : '$';
  if (value >= 1e12) {
    return `${prefix}${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${prefix}${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${prefix}${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${prefix}${(value / 1e3).toFixed(2)}K`;
  }
  return `${prefix}${value.toFixed(2)}`;
}

/**
 * Formats percentage change with leading sign (+ or -).
 */
export function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

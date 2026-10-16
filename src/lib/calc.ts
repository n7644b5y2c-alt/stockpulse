import type { PortfolioHolding, PortfolioAnalytics } from '../types/index.ts';

export interface PriceLookup {
  [symbol: string]: {
    price: number;
    name?: string;
    assetType?: 'stock' | 'coin' | 'metal';
  };
}

/**
 * Calculates consolidated portfolio valuation, P/L, asset allocation (stock, coin, metal),
 * and identifies top and bottom performers.
 */
export function calculatePortfolioAnalytics(
  holdings: PortfolioHolding[],
  prices: PriceLookup
): PortfolioAnalytics {
  let currentValue = 0;
  let totalCostBasis = 0;
  let stockValue = 0;
  let coinValue = 0;
  let metalValue = 0;

  // Compute individual holding P/L
  const intermediateHoldings = holdings.map((h) => {
    const assetMeta = prices[h.symbol.toUpperCase()] || {
      price: h.avgBuyPrice,
      name: h.name || h.symbol,
      assetType: h.assetType,
    };

    const currentPrice = assetMeta.price;
    const itemValue = h.quantity * currentPrice;
    const itemCost = h.quantity * h.avgBuyPrice;
    const gainLoss = itemValue - itemCost;
    const gainLossPercent = itemCost > 0 ? (gainLoss / itemCost) * 100 : 0;

    currentValue += itemValue;
    totalCostBasis += itemCost;

    if (h.assetType === 'stock') {
      stockValue += itemValue;
    } else if (h.assetType === 'metal') {
      metalValue += itemValue;
    } else {
      coinValue += itemValue;
    }

    return {
      id: h.id,
      symbol: h.symbol,
      name: h.name || assetMeta.name || h.symbol,
      assetType: h.assetType,
      quantity: h.quantity,
      avgBuyPrice: h.avgBuyPrice,
      currentPrice,
      currentValue: Number(itemValue.toFixed(2)),
      totalCost: Number(itemCost.toFixed(2)),
      gainLoss: Number(gainLoss.toFixed(2)),
      gainLossPercent: Number(gainLossPercent.toFixed(2)),
      allocationPercent: 0, // computed below
    };
  });

  // Calculate allocation percentages
  const holdingsWithPnl = intermediateHoldings.map((h) => ({
    ...h,
    allocationPercent: currentValue > 0 ? Number(((h.currentValue / currentValue) * 100).toFixed(2)) : 0,
  }));

  const totalGainLoss = Number((currentValue - totalCostBasis).toFixed(2));
  const totalGainLossPercent = totalCostBasis > 0 ? Number(((totalGainLoss / totalCostBasis) * 100).toFixed(2)) : 0;

  // Best & worst performers
  let bestPerformer: { symbol: string; gainLossPercent: number } | null = null;
  let worstPerformer: { symbol: string; gainLossPercent: number } | null = null;

  if (holdingsWithPnl.length > 0) {
    const sorted = [...holdingsWithPnl].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
    bestPerformer = { symbol: sorted[0].symbol, gainLossPercent: sorted[0].gainLossPercent };
    worstPerformer = { symbol: sorted[sorted.length - 1].symbol, gainLossPercent: sorted[sorted.length - 1].gainLossPercent };
  }

  const stockAllocation = currentValue > 0 ? Number(((stockValue / currentValue) * 100).toFixed(2)) : 0;
  const coinAllocation = currentValue > 0 ? Number(((coinValue / currentValue) * 100).toFixed(2)) : 0;
  const metalAllocation = currentValue > 0 ? Number(((metalValue / currentValue) * 100).toFixed(2)) : 0;

  return {
    currentValue: Number(currentValue.toFixed(2)),
    totalCostBasis: Number(totalCostBasis.toFixed(2)),
    totalGainLoss,
    totalGainLossPercent,
    holdingsWithPnl,
    allocationByType: {
      stock: stockAllocation,
      coin: coinAllocation,
      metal: metalAllocation,
    },
    bestPerformer,
    worstPerformer,
  };
}

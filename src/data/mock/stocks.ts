import type { Stock } from '../schemas';
import { generateCandlesForAsset, extractSparkline } from './generators';

interface RawStock {
  symbol: string;
  name: string;
  price: number;
  change24hPct: number;
  volume: number;
  marketCap: number;
  sector: string;
  volatility?: number;
}

const rawStocks: RawStock[] = [
  // Top 4 matching Home Stage 0 values (+8.80%, +6.68%, +6.03%, +5.32%)
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 138.45, change24hPct: 8.80, volume: 54200000, marketCap: 3410000000000, sector: 'Semiconductors', volatility: 0.025 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 262.10, change24hPct: 6.68, volume: 41800000, marketCap: 835000000000, sector: 'Automotive & AI', volatility: 0.03 },
  { symbol: 'PLTR', name: 'Palantir Tech', price: 44.80, change24hPct: 6.03, volume: 29100000, marketCap: 99400000000, sector: 'Enterprise Software', volatility: 0.028 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 156.30, change24hPct: 5.32, volume: 33500000, marketCap: 253000000000, sector: 'Semiconductors', volatility: 0.025 },

  // Remaining US Large Caps
  { symbol: 'AAPL', name: 'Apple Inc.', price: 232.15, change24hPct: 0.80, volume: 48500000, marketCap: 3520000000000, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 428.60, change24hPct: -0.56, volume: 21400000, marketCap: 3180000000000, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 176.40, change24hPct: 1.79, volume: 24500000, marketCap: 2190000000000, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 189.90, change24hPct: 1.44, volume: 31200000, marketCap: 1980000000000, sector: 'Consumer Cyclical' },
  { symbol: 'META', name: 'Meta Platforms, Inc.', price: 588.20, change24hPct: -0.73, volume: 14800000, marketCap: 1490000000000, sector: 'Technology' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', price: 182.40, change24hPct: 2.15, volume: 19300000, marketCap: 848000000000, sector: 'Semiconductors' },
  { symbol: 'LLY', name: 'Eli Lilly and Company', price: 915.20, change24hPct: 1.10, volume: 3200000, marketCap: 869000000000, sector: 'Healthcare' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 222.80, change24hPct: 0.45, volume: 10200000, marketCap: 638000000000, sector: 'Financial Services' },
  { symbol: 'V', name: 'Visa Inc.', price: 284.10, change24hPct: -0.22, volume: 6800000, marketCap: 574000000000, sector: 'Financial Services' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 81.30, change24hPct: 0.62, volume: 15400000, marketCap: 653000000000, sector: 'Consumer Defensive' },
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 588.90, change24hPct: -1.05, volume: 3900000, marketCap: 541000000000, sector: 'Healthcare' },
  { symbol: 'COST', name: 'Costco Wholesale', price: 910.80, change24hPct: 0.95, volume: 2200000, marketCap: 404000000000, sector: 'Consumer Defensive' },
  { symbol: 'NFLX', name: 'Netflix, Inc.', price: 712.50, change24hPct: 3.40, volume: 5100000, marketCap: 306000000000, sector: 'Communication' },
  { symbol: 'HD', name: 'The Home Depot', price: 408.50, change24hPct: -0.38, volume: 4100000, marketCap: 405000000000, sector: 'Consumer Cyclical' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 172.40, change24hPct: 0.18, volume: 6200000, marketCap: 405000000000, sector: 'Consumer Defensive' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.20, change24hPct: -0.40, volume: 7400000, marketCap: 390000000000, sector: 'Healthcare' },
  { symbol: 'BAC', name: 'Bank of America Corp', price: 42.60, change24hPct: 0.85, volume: 38200000, marketCap: 331000000000, sector: 'Financial Services' },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 121.70, change24hPct: 1.55, volume: 17800000, marketCap: 483000000000, sector: 'Energy' },
  { symbol: 'CVX', name: 'Chevron Corporation', price: 152.10, change24hPct: 0.90, volume: 8900000, marketCap: 278000000000, sector: 'Energy' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', price: 194.50, change24hPct: 0.72, volume: 5600000, marketCap: 343000000000, sector: 'Healthcare' },
  { symbol: 'CRM', name: 'Salesforce, Inc.', price: 290.40, change24hPct: 2.10, volume: 7100000, marketCap: 280000000000, sector: 'Technology' },
  { symbol: 'ADBE', name: 'Adobe Inc.', price: 510.20, change24hPct: -1.20, volume: 2900000, marketCap: 228000000000, sector: 'Technology' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.', price: 174.60, change24hPct: 0.30, volume: 5100000, marketCap: 239000000000, sector: 'Consumer Defensive' },
  { symbol: 'INTC', name: 'Intel Corporation', price: 22.90, change24hPct: -2.15, volume: 55400000, marketCap: 97800000000, sector: 'Semiconductors' },

  // Indian / Global Names
  { symbol: 'RELIANCE', name: 'Reliance Industries (NSE)', price: 32.87, change24hPct: 1.65, volume: 8200000, marketCap: 222000000000, sector: 'Energy & Conglomerate' },
  { symbol: 'TCS', name: 'Tata Consultancy Services (NSE)', price: 49.34, change24hPct: 0.92, volume: 3400000, marketCap: 178000000000, sector: 'IT Services' },
];

export const mockStocks: Stock[] = rawStocks.map((stock) => {
  const candles = generateCandlesForAsset(stock.price, stock.change24hPct, stock.volatility || 0.018);
  const sparkline = extractSparkline(candles, 30);
  return {
    symbol: stock.symbol,
    name: stock.name,
    type: 'stock',
    price: stock.price,
    change24hPct: stock.change24hPct,
    volume: stock.volume,
    marketCap: stock.marketCap,
    sector: stock.sector,
    sparkline,
    candles,
  };
});

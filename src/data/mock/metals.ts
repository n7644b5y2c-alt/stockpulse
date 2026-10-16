import type { Metal } from '../schemas/index.ts';
import { generateCandlesForAsset, extractSparkline } from './generators.ts';

interface RawMetal {
  symbol: string;
  name: string;
  price: number; // USD per troy ounce
  change24hPct: number;
  volume: number;
  marketCap: number;
  category: string;
  unit: string;
  isExpertPick?: boolean;
}

const rawMetals: RawMetal[] = [
  {
    symbol: 'XAU',
    name: 'Gold',
    price: 2654.20,
    change24hPct: 1.15,
    volume: 185000000000,
    marketCap: 17500000000000,
    category: 'Precious Metal',
    unit: 'troy_oz',
  },
  {
    symbol: 'XAG',
    name: 'Silver',
    price: 31.85,
    change24hPct: 2.40,
    volume: 28400000000,
    marketCap: 1820000000000,
    category: 'Precious & Industrial Metal',
    unit: 'troy_oz',
  },
  {
    symbol: 'XPT',
    name: 'Platinum',
    price: 982.50,
    change24hPct: 0.65,
    volume: 6200000000,
    marketCap: 295000000000,
    category: 'Precious Metal',
    unit: 'troy_oz',
  },
  {
    symbol: 'XPD',
    name: 'Palladium',
    price: 1024.00,
    change24hPct: -0.45,
    volume: 4800000000,
    marketCap: 215000000000,
    category: 'Industrial Precious Metal',
    unit: 'troy_oz',
  },
  {
    symbol: 'HG',
    name: 'Copper',
    price: 4.38,
    change24hPct: 1.80,
    volume: 14200000000,
    marketCap: 740000000000,
    category: 'Industrial Metal',
    unit: 'lb',
  },
];

export const mockMetals: Metal[] = rawMetals.map((m) => {
  const candles = generateCandlesForAsset(m.price, m.change24hPct, 0.015, 90);
  const sparkline = extractSparkline(candles, 30);

  return {
    symbol: m.symbol,
    name: m.name,
    type: 'metal',
    price: m.price,
    change24hPct: m.change24hPct,
    volume: m.volume,
    marketCap: m.marketCap,
    category: m.category,
    unit: m.unit,
    sparkline,
    candles,
    isExpertPick: m.isExpertPick,
  };
});

export function getMockMetalBySymbol(symbol: string): Metal | undefined {
  return mockMetals.find((m) => m.symbol.toUpperCase() === symbol.toUpperCase());
}

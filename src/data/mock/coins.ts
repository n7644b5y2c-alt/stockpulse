import type { Coin } from '../schemas/index.ts';
import { generateCandlesForAsset, extractSparkline } from './generators.ts';

interface RawCoin {
  symbol: string;
  name: string;
  price: number;
  change24hPct: number;
  volume: number;
  marketCap: number;
  category: string;
  isExpertPick?: boolean;
}

const rawCoins: RawCoin[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67400.00, change24hPct: 2.85, volume: 38400000000, marketCap: 1329000000000, category: 'Layer 1 / Store of Value', isExpertPick: true },
  { symbol: 'ETH', name: 'Ethereum', price: 2640.00, change24hPct: 3.42, volume: 18900000000, marketCap: 317000000000, category: 'Smart Contracts', isExpertPick: true },
  { symbol: 'SOL', name: 'Solana', price: 154.20, change24hPct: 4.11, volume: 3950000000, marketCap: 72000000000, category: 'High-Throughput L1', isExpertPick: true },
  { symbol: 'BNB', name: 'BNB', price: 588.50, change24hPct: 1.15, volume: 920000000, marketCap: 85900000000, category: 'Exchange Ecosystem' },
  { symbol: 'XRP', name: 'XRP', price: 0.542, change24hPct: -0.65, volume: 810000000, marketCap: 30800000000, category: 'Payments' },
  { symbol: 'ADA', name: 'Cardano', price: 0.354, change24hPct: 1.25, volume: 340000000, marketCap: 12700000000, category: 'Smart Contracts' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.124, change24hPct: 3.90, volume: 1100000000, marketCap: 18100000000, category: 'Meme & Community' },
  { symbol: 'AVAX', name: 'Avalanche', price: 28.40, change24hPct: 2.45, volume: 460000000, marketCap: 11500000000, category: 'Layer 1 Subnets', isExpertPick: true },
  { symbol: 'DOT', name: 'Polkadot', price: 4.30, change24hPct: -0.80, volume: 190000000, marketCap: 6200000000, category: 'Interoperability' },
  { symbol: 'LINK', name: 'Chainlink', price: 11.80, change24hPct: 2.10, volume: 280000000, marketCap: 7100000000, category: 'Oracles & Data', isExpertPick: true },
  { symbol: 'POL', name: 'Polygon', price: 0.382, change24hPct: 1.40, volume: 130000000, marketCap: 3100000000, category: 'Ethereum L2' },
  { symbol: 'NEAR', name: 'NEAR Protocol', price: 4.85, change24hPct: 3.65, volume: 390000000, marketCap: 5800000000, category: 'Sharded L1 & AI' },
];

export const mockCoins: Coin[] = rawCoins.map((coin) => {
  const candles = generateCandlesForAsset(coin.price, coin.change24hPct, 0.035);
  const sparkline = extractSparkline(candles, 30);
  return {
    symbol: coin.symbol,
    name: coin.name,
    type: 'coin',
    price: coin.price,
    change24hPct: coin.change24hPct,
    volume: coin.volume,
    marketCap: coin.marketCap,
    category: coin.category,
    isExpertPick: coin.isExpertPick,
    sparkline,
    candles,
  };
});

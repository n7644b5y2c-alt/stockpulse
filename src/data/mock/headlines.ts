export interface Headline {
  symbol: string;
  headline: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export const mockHeadlines: Headline[] = [
  { symbol: 'NVDA', headline: 'NVIDIA Expands AI Infrastructure Partnerships with Tier-1 Cloud Hyperscalers', source: 'Simulated Markets Wire', publishedAt: '2 hours ago', sentiment: 'positive' },
  { symbol: 'NVDA', headline: 'Next-Gen Compute Cluster Demand Exceeds Supply Constraints Through Next Quarter', source: 'Tech Pulse Daily', publishedAt: '5 hours ago', sentiment: 'positive' },
  { symbol: 'TSLA', headline: 'Autonomous Driving Test Fleet Logs 1 Billion Simulated Miles with Safety Gains', source: 'Automotive Future', publishedAt: '3 hours ago', sentiment: 'positive' },
  { symbol: 'BTC', headline: 'Institutional Crypto Custody Balances Hit 18-Month High Following Regulatory Clarity', source: 'Crypto Insider Digest', publishedAt: '1 hour ago', sentiment: 'positive' },
  { symbol: 'ETH', headline: 'Ethereum Layer-2 Rollups Reach Record Daily Settlement Volume', source: 'Web3 Observer', publishedAt: '4 hours ago', sentiment: 'positive' },
  { symbol: 'SOL', headline: 'Decentralized Exchange Volume on Solana Rivals Centralized Venues for Third Week', source: 'DeFi Review', publishedAt: '2 hours ago', sentiment: 'positive' },
  { symbol: 'AAPL', headline: 'Apple Silicon Services Revenue Growth Offsets Mature Device Replacement Cycles', source: 'Financial Ledger', publishedAt: '6 hours ago', sentiment: 'neutral' },
  { symbol: 'MSFT', headline: 'Enterprise Copilot Adoption Doubles Across Fortune 500 Subscriptions', source: 'Enterprise Cloud', publishedAt: '4 hours ago', sentiment: 'positive' },
  { symbol: 'PLTR', headline: 'Defense and Commercial Contracts Surge 34% Year-over-Year on AIP Integration', source: 'SaaS Bulletin', publishedAt: '1 hour ago', sentiment: 'positive' },
];

export function getHeadlinesForSymbol(symbol: string): Headline[] {
  const match = mockHeadlines.filter((h) => h.symbol.toUpperCase() === symbol.toUpperCase());
  if (match.length > 0) return match;
  return [
    {
      symbol: symbol.toUpperCase(),
      headline: `${symbol.toUpperCase()} Maintains Active Trading Volume Amid Broad Market Consolidation`,
      source: 'Global Market Wire',
      publishedAt: '3 hours ago',
      sentiment: 'neutral',
    },
  ];
}

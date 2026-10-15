import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { Sparkles, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const mockExpertPicks = [
  {
    id: 'pick-btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$67,400.00',
    targetPrice: '$85,000.00',
    upside: '+26.1%',
    timeframe: '6-12 Months',
    confidence: 'Very High',
    badge: 'Expert Pick',
    rationale:
      'Institutional accumulation through spot ETF inflows and post-halving structural supply reduction suggest sustained bullish continuation.',
    catalysts: ['Spot ETF capital flows', 'Macro rate cut cycle', 'Network hash rate all-time high'],
  },
  {
    id: 'pick-eth',
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$2,640.00',
    targetPrice: '$3,800.00',
    upside: '+43.9%',
    timeframe: '6-9 Months',
    confidence: 'High',
    badge: 'Expert Pick',
    rationale:
      'Dominance in decentralized finance (DeFi), Layer 2 scaling adoption, and strong staking yield yield favorable risk-adjusted asymmetry.',
    catalysts: ['L2 fee burn mechanics', 'Institutional staking demand', 'EVM ecosystem growth'],
  },
  {
    id: 'pick-sol',
    symbol: 'SOL',
    name: 'Solana',
    price: '$154.20',
    targetPrice: '$240.00',
    upside: '+55.6%',
    timeframe: '3-6 Months',
    confidence: 'High',
    badge: 'Expert Pick',
    rationale:
      'High transaction throughput, leading developer mindshare in retail DeFi, and rapid decentralized physical infrastructure (DePIN) deployment.',
    catalysts: ['Retail on-chain volume', 'Firedancer validator rollout', 'Mobile ecosystem'],
  },
];

export const ExpertPicks: React.FC = () => {
  return (
    <PageContainer
      title="Expert Picks"
      subtitle="Hand-curated digital assets selected for high momentum, on-chain volume, and structural tailwinds"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockExpertPicks.map((pick) => (
          <div
            key={pick.id}
            className="rounded-card border border-accent-gold/40 bg-bg-surface p-6 shadow-gold-glow flex flex-col justify-between relative transition-all duration-fast hover:border-accent-gold"
          >
            {/* Top Header & Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-text-primary">
                    {pick.symbol}
                  </span>
                  <span className="text-xs text-text-muted">
                    {pick.name}
                  </span>
                </div>
                {/* Expert Pick Badge with Gold Accent */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-gold-bg text-accent-gold border border-accent-gold/30">
                  <Sparkles className="w-3 h-3" />
                  <span>{pick.badge}</span>
                </div>
              </div>

              {/* Price & Target stats */}
              <div className="grid grid-cols-2 gap-3 py-3 px-3.5 rounded-btn bg-bg-surface-hover/50 border border-border-token mb-4">
                <div>
                  <span className="text-xs text-text-muted block">Market Price</span>
                  <span className="font-mono text-base font-semibold text-text-primary">
                    {pick.price}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Target Price</span>
                  <span className="font-mono text-base font-semibold text-profit flex items-center">
                    {pick.targetPrice}
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block mb-1">
                  Analyst Rationale
                </span>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {pick.rationale}
                </p>
              </div>

              {/* Catalysts list */}
              <div className="mb-5">
                <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block mb-2">
                  Key Catalysts
                </span>
                <ul className="space-y-1 text-xs text-text-muted">
                  {pick.catalysts.map((cat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-accent-gold shrink-0" />
                      <span>{cat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Target Box */}
            <div className="pt-4 border-t border-border-token flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-accent-gold" />
                Timeframe: {pick.timeframe}
              </span>
              <span className="font-mono font-medium text-profit bg-profit-bg px-2 py-0.5 rounded-btn border border-profit/20">
                Upside: {pick.upside}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { Briefcase, ArrowUpRight, PieChart, Plus, Wallet } from 'lucide-react';

const mockHoldings = [
  { id: '1', symbol: 'NVDA', name: 'Nvidia Corp.', type: 'Stock', units: '25.0', avgPrice: '$112.50', currentPrice: '$138.45', total: '$3,461.25', gain: '+$648.75', gainPercent: '+23.07%' },
  { id: '2', symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', units: '0.45', avgPrice: '$58,200.00', currentPrice: '$67,400.00', total: '$30,330.00', gain: '+$4,140.00', gainPercent: '+15.81%' },
  { id: '3', symbol: 'ETH', name: 'Ethereum', type: 'Crypto', units: '4.2', avgPrice: '$2,450.00', currentPrice: '$2,640.00', total: '$11,088.00', gain: '+$798.00', gainPercent: '+7.76%' },
  { id: '4', symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', units: '30.0', avgPrice: '$215.00', currentPrice: '$232.15', total: '$6,964.50', gain: '+$514.50', gainPercent: '+7.98%' },
];

export const Portfolio: React.FC = () => {
  return (
    <PageContainer
      title="Portfolio Overview"
      subtitle="Track your simulated holdings across Equities and Cryptocurrencies"
      action={
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-btn bg-bg-surface border border-border-token text-text-muted cursor-not-allowed opacity-80"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Holding (Stage 3)</span>
        </button>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-card border border-border-token bg-bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium">Total Balance</span>
            <Wallet className="w-4 h-4 text-text-muted" />
          </div>
          <div className="font-mono text-2xl font-bold text-text-primary">$51,843.75</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-profit font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+$6,101.25 (+13.34%) All-time</span>
          </div>
        </div>

        <div className="rounded-card border border-border-token bg-bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium">Today's P&L</span>
            <Briefcase className="w-4 h-4 text-text-muted" />
          </div>
          <div className="font-mono text-2xl font-bold text-profit">+$1,420.30</div>
          <div className="text-xs text-text-muted mt-1 font-mono">
            +2.81% past 24 hours
          </div>
        </div>

        <div className="rounded-card border border-border-token bg-bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium">Asset Allocation</span>
            <PieChart className="w-4 h-4 text-text-muted" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-border-token overflow-hidden flex">
                <div className="bg-accent-gold w-[80%]" title="Crypto 80%" />
                <div className="bg-profit w-[20%]" title="Stocks 20%" />
              </div>
              <div className="flex justify-between text-xs text-text-muted mt-1.5 font-mono">
                <span>Crypto: 80%</span>
                <span>Stocks: 20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings List Placeholder */}
      <div className="rounded-card border border-border-token bg-bg-surface overflow-hidden shadow-subtle">
        <div className="px-5 py-4 border-b border-border-token flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Current Holdings</h2>
          <span className="text-xs font-mono text-text-muted">4 Assets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-token text-xs uppercase tracking-wider text-text-muted font-medium bg-bg-surface-hover/30">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4 text-right">Holdings</th>
                <th className="py-3 px-4 text-right">Avg Price</th>
                <th className="py-3 px-4 text-right">Market Price</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-right">Gain / Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-token/60 text-sm">
              {mockHoldings.map((h) => (
                <tr key={h.id} className="hover:bg-bg-surface-hover/40 transition-colors duration-fast">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-text-primary">{h.symbol}</span>
                      <span className="text-xs text-text-muted">{h.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-text-primary">{h.units}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-text-muted">{h.avgPrice}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-text-primary">{h.currentPrice}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-text-primary">{h.total}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-profit font-medium">
                    {h.gain} ({h.gainPercent})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

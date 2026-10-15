import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockStocksList = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$232.15', change: '+$1.85', percent: '+0.80%', isUp: true, cap: '$3.52T', pe: '34.2' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$428.60', change: '-$2.40', percent: '-0.56%', isUp: false, cap: '$3.18T', pe: '35.8' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$176.40', change: '+$3.10', percent: '+1.79%', isUp: true, cap: '$2.19T', pe: '24.1' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$189.90', change: '+$2.70', percent: '+1.44%', isUp: true, cap: '$1.98T', pe: '42.5' },
  { symbol: 'META', name: 'Meta Platforms', price: '$588.20', change: '-$4.30', percent: '-0.73%', isUp: false, cap: '$1.49T', pe: '28.9' },
  { symbol: 'TSM', name: 'Taiwan Semi', price: '$198.70', change: '+$5.60', percent: '+2.90%', isUp: true, cap: '$1.03T', pe: '31.4' },
];

export const Stocks: React.FC = () => {
  return (
    <PageContainer
      title="All Stocks"
      subtitle="Comprehensive market list and ticker scanner (Mock data ready for live API integration)"
    >
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by company or ticker (e.g. NVDA, AAPL)..."
            disabled
            className="w-full pl-10 pr-4 py-2 text-sm rounded-btn bg-bg-surface border border-border-token text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 opacity-90 cursor-not-allowed"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-btn border border-border-token bg-bg-surface text-text-muted cursor-not-allowed opacity-80"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <span className="text-xs font-mono text-text-muted px-2.5 py-1 bg-bg-surface rounded-btn border border-border-token">
            Mock Mode
          </span>
        </div>
      </div>

      {/* Stock Table Placeholder */}
      <div className="rounded-card border border-border-token bg-bg-surface overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-token text-xs uppercase tracking-wider text-text-muted font-medium bg-bg-surface-hover/40">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">Market Cap</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">P/E Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-token/60 text-sm">
              {mockStocksList.map((item) => (
                <tr key={item.symbol} className="hover:bg-bg-surface-hover/50 transition-colors duration-fast">
                  <td className="py-3.5 px-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-text-primary">{item.symbol}</span>
                      <span className="text-xs text-text-muted hidden sm:inline">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-text-primary">
                    {item.price}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono text-xs font-medium px-2 py-0.5 rounded-btn ${
                        item.isUp
                          ? 'text-profit bg-profit-bg border border-profit/20'
                          : 'text-loss bg-loss-bg border border-loss/20'
                      }`}
                    >
                      {item.isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {item.percent}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-text-muted hidden sm:table-cell">
                    {item.cap}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-text-muted hidden md:table-cell">
                    {item.pe}
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

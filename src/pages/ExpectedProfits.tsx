import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { Calculator, TrendingUp, AlertCircle, Percent } from 'lucide-react';

export const ExpectedProfits: React.FC = () => {
  return (
    <PageContainer
      title="Expected Profits Calculator"
      subtitle="Simulate multi-asset capital growth, risk-weighted outcomes, and compounding scenarios"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Calculator Controls */}
        <div className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-btn bg-profit-bg text-profit border border-profit/20">
              <Calculator className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Projection Inputs</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">
                Initial Investment ($)
              </label>
              <input
                type="text"
                value="$10,000"
                disabled
                className="w-full px-3 py-2 text-sm font-mono rounded-btn bg-bg-surface-hover border border-border-token text-text-primary cursor-not-allowed opacity-90"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">
                Estimated Annual Return (%)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="14.5%"
                  disabled
                  className="w-full px-3 py-2 text-sm font-mono rounded-btn bg-bg-surface-hover border border-border-token text-text-primary cursor-not-allowed opacity-90"
                />
                <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">
                Investment Horizon
              </label>
              <select
                disabled
                className="w-full px-3 py-2 text-sm rounded-btn bg-bg-surface-hover border border-border-token text-text-primary cursor-not-allowed opacity-90"
              >
                <option>3 Years (Medium-term)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled
                className="w-full py-2.5 text-xs font-medium rounded-btn bg-profit text-bg-primary cursor-not-allowed opacity-80"
              >
                Recalculate Projections (Stage 3)
              </button>
            </div>
          </div>
        </div>

        {/* Mock Results / Model Outcomes */}
        <div className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-text-primary">Projected Growth Outcomes</h2>
              <span className="text-xs font-mono text-text-muted px-2 py-0.5 rounded-btn bg-bg-surface-hover border border-border-token">
                Compound Frequency: Monthly
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-btn bg-bg-surface-hover/60 border border-border-token">
                <span className="text-xs text-text-muted block mb-1">Conservative (+8%)</span>
                <span className="font-mono text-xl font-bold text-text-primary block">$12,702.37</span>
                <span className="font-mono text-xs text-profit">+$2,702.37 gain</span>
              </div>
              <div className="p-4 rounded-btn bg-profit-bg border border-profit/30">
                <span className="text-xs text-text-muted block mb-1">Base Target (+14.5%)</span>
                <span className="font-mono text-xl font-bold text-text-primary block">$15,358.90</span>
                <span className="font-mono text-xs text-profit font-semibold">+$5,358.90 gain</span>
              </div>
              <div className="p-4 rounded-btn bg-bg-surface-hover/60 border border-border-token">
                <span className="text-xs text-text-muted block mb-1">Optimistic (+22%)</span>
                <span className="font-mono text-xl font-bold text-text-primary block">$19,061.14</span>
                <span className="font-mono text-xs text-profit">+$9,061.14 gain</span>
              </div>
            </div>

            <div className="p-4 rounded-btn border border-border-token bg-bg-surface-hover/30 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <div className="text-xs text-text-muted leading-relaxed">
                <strong className="text-text-primary font-medium">Model Note: </strong>
                All returns are purely mathematical estimations based on past simulated asset distributions. Actual market returns are volatile and subject to risk.
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border-token flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-profit" />
              Monte Carlo simulation engine scheduled for Stage 3
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

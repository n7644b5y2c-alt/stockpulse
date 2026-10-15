import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Radio, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  const isMockProvider = (import.meta.env.VITE_DATA_PROVIDER || 'mock').toLowerCase() === 'mock';
  const isSimulatedStream = (import.meta.env.VITE_STREAM_PROVIDER || 'simulated').toLowerCase() === 'simulated';

  return (
    <footer className="w-full border-t border-border-token bg-bg-surface mt-auto transition-colors duration-fast">
      <div className="w-full max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mandatory Financial Disclaimer Banner */}
        <div className="rounded-card border border-border-token bg-bg-surface p-4 mb-8 flex items-start gap-3 shadow-subtle">
          <ShieldAlert className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-text-muted leading-relaxed">
            <span className="font-semibold text-text-primary">Disclaimer: </span>
            Demo project with mock data. Not financial advice. All stock and cryptocurrency information shown is simulated for demonstration and educational purposes only.
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          {/* Brand info & Data tags */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 rounded-btn bg-bg-surface border border-border-token flex items-center justify-center text-profit">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              Stock<span className="text-profit">Pulse</span>
            </span>

            {/* Stage 1 Required Data Tags */}
            <div className="flex items-center gap-1.5 ml-1">
              <span
                data-testid="mock-data-tag"
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border border-border-token bg-bg-surface-hover text-text-muted"
                title={isMockProvider ? 'Data Provider: Mock dataset with 90-day candles' : 'Data Provider: Live proxy API'}
              >
                <Database className="w-3 h-3 text-accent-gold" />
                {isMockProvider ? 'Mock data' : 'Live API'}
              </span>

              <span
                data-testid="stream-tag"
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border border-border-token bg-bg-surface-hover text-text-muted"
                title={isSimulatedStream ? 'Price Stream: Simulated random drift' : 'Price Stream: Live WebSocket'}
              >
                <Radio className="w-3 h-3 text-profit animate-pulse" />
                {isSimulatedStream ? 'Simulated live' : 'Live stream'}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-muted">
            <Link to="/stocks" className="hover:text-text-primary transition-colors duration-fast">
              All Stocks
            </Link>
            <Link to="/expert-picks" className="hover:text-text-primary transition-colors duration-fast">
              Expert Picks
            </Link>
            <Link to="/expected-profits" className="hover:text-text-primary transition-colors duration-fast">
              Expected Profits
            </Link>
            <Link to="/future" className="hover:text-text-primary transition-colors duration-fast">
              Roadmap
            </Link>
            <Link to="/appearance" className="hover:text-text-primary transition-colors duration-fast">
              Appearance
            </Link>
            <Link
              to="/dev-data"
              className="text-accent-gold hover:underline font-mono transition-colors duration-fast"
              title="Temporary developer data inspection page"
            >
              /dev-data
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useMemo } from 'react';
import { PageContainer } from '../components/PageContainer';
import { ArrowUpRight, TrendingUp, Sparkles, Layers, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTopGainers } from '../hooks/useTopGainers';
import { usePriceStream } from '../hooks/usePriceStream';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

export const Home: React.FC = () => {
  const { data: topGainers = [], isLoading, isError, error, refetch } = useTopGainers(4);

  // Collect symbols for streaming updates
  const gainerSymbols = useMemo(() => {
    return topGainers.map((g) => g.symbol);
  }, [topGainers]);

  const { prices: livePrices, ticks } = usePriceStream(gainerSymbols);

  return (
    <PageContainer>
      {/* Top Section: RISING PRICES FIRST (Top Gainers) */}
      <section className="mb-12" aria-labelledby="top-gainers-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-btn bg-profit-bg text-profit border border-border-token">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="top-gainers-heading" className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                  Top Gainers Today
                </h2>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-profit-bg text-profit border border-profit">
                  RISING FIRST
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Highest percentage upward movement across monitored market assets (simulated mock data)
              </p>
            </div>
          </div>
          <Link
            to="/stocks"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-text-muted hover:text-text-primary transition-colors duration-fast self-start sm:self-auto"
          >
            <span>View all stocks</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top Gainers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-40" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to Load Top Gainers"
            message={error?.message || 'Unable to fetch the latest market gainers. Please try again.'}
            onRetry={() => refetch()}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topGainers.map((stock) => {
              const livePrice = livePrices[stock.symbol] ?? stock.price;
              const tick = ticks[stock.symbol];

              // Compute 24h dollar change based on change24hPct
              // yesterdayPrice = price / (1 + change24hPct/100)
              // changeDollar = price - yesterdayPrice
              const yesterdayPrice = stock.price / (1 + stock.change24hPct / 100);
              const changeDollar = livePrice - yesterdayPrice;

              return (
                <div
                  key={stock.symbol}
                  className="rounded-card border border-border-token bg-bg-surface p-5 hover:border-profit hover:bg-bg-surface-hover transition-all duration-fast shadow-subtle group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="font-mono text-base font-bold text-text-primary tracking-tight block">
                          {stock.symbol}
                        </span>
                        <span className="text-xs text-text-muted truncate block max-w-[140px]">
                          {stock.name}
                        </span>
                      </div>
                      <div className="flex items-center text-xs font-mono font-medium text-profit bg-profit-bg px-2 py-1 rounded-btn border border-profit">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                        +{stock.change24hPct.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-token flex items-end justify-between">
                    <div>
                      <span className="text-xs text-text-muted block">Current Price</span>
                      <span
                        className={`font-mono text-lg font-semibold text-text-primary transition-colors duration-fast ${
                          tick?.direction === 'up' ? 'text-profit' : tick?.direction === 'down' ? 'text-loss' : ''
                        }`}
                      >
                        ${livePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-text-muted block">24h Change</span>
                      <span className="font-mono text-xs font-medium text-profit">
                        +${changeDollar.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature Navigation Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-btn bg-accent-gold-bg border border-border-token flex items-center justify-center text-accent-gold mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">Expert Picks</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Curated cryptocurrency opportunities with algorithmic momentum flags and analyst target levels.
            </p>
          </div>
          <Link
            to="/expert-picks"
            className="text-xs font-medium text-accent-gold hover:underline flex items-center gap-1"
          >
            Explore top coins <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-btn bg-profit-bg border border-border-token flex items-center justify-center text-profit mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">Portfolio Tracker</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Monitor total asset distribution, real-time unrealized gains, and consolidated performance.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="text-xs font-medium text-profit hover:underline flex items-center gap-1"
          >
            Open portfolio <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-btn bg-bg-surface-hover border border-border-token flex items-center justify-center text-text-primary mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">Expected Profits</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Project scenario returns, estimate risk-adjusted targets, and model compound growth rates.
            </p>
          </div>
          <Link
            to="/expected-profits"
            className="text-xs font-medium text-text-primary hover:underline flex items-center gap-1"
          >
            View profit models <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Stage Status Notice */}
      <section className="rounded-card border border-border-token bg-bg-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-accent-gold font-semibold block mb-1">
            Stage 1 Data Layer Connected
          </span>
          <p className="text-sm text-text-primary font-medium">
            Home cards are now powered by TanStack Query hooks and live price streams.
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            Test all data feeds, calculation engines, and live tick streams on the temporary inspection page.
          </p>
        </div>
        <Link
          to="/dev-data"
          className="px-4 py-2 text-xs font-medium rounded-btn bg-bg-surface border border-border-token text-accent-gold hover:bg-bg-surface-hover transition-colors duration-fast whitespace-nowrap"
        >
          Open /dev-data Inspector
        </Link>
      </section>
    </PageContainer>
  );
};

import React, { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { useTopGainers } from '../hooks/useTopGainers';
import { useExpertPicks } from '../hooks/useExpertPicks';
import { usePortfolioAnalytics } from '../hooks/usePortfolioAnalytics';
import { usePortfolio } from '../hooks/usePortfolio';
import { useIndicators } from '../hooks/useIndicators';
import { usePriceStream } from '../hooks/usePriceStream';
import { useAlerts } from '../hooks/useAlerts';
import { useAiSummary } from '../hooks/useAiSummary';
import { useFearGreed } from '../hooks/useFearGreed';
import { useCurrency } from '../hooks/useCurrency';
import { useMarketHours } from '../hooks/useMarketHours';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { parseHoldingsCsv } from '../lib/csv';
import {
  Code,
  Radio,
  Bell,
  Sparkles,
  TrendingUp,
  Briefcase,
  Clock,
  Coins,
  Bot,
  Play,
  Pause,
  Upload,
} from 'lucide-react';

export const DevData: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA');
  const [alertTargetPrice, setAlertTargetPrice] = useState('140.00');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [csvStatus, setCsvStatus] = useState<string | null>(null);

  // Hook queries
  const { data: gainers = [], isLoading: gainersLoading, isError: gainersError, refetch: refetchGainers } = useTopGainers(6);
  const { data: picks = [], isLoading: picksLoading, isError: picksError, refetch: refetchPicks } = useExpertPicks();
  const { analytics, isLoading: portLoading, isError: portError, refetch: refetchPort } = usePortfolioAnalytics();
  const { importCsvRows } = usePortfolio();
  const { latestSMA, latestEMA, latestRSI, latestBB, isLoading: indLoading } = useIndicators(selectedSymbol);
  const { ticks, status: streamStatus, pause: pauseStream, resume: resumeStream } = usePriceStream(['NVDA', 'TSLA', 'PLTR', 'AMD', 'BTC', 'ETH', 'SOL']);
  const { alerts, createAlert, deleteAlert, requestPermission } = useAlerts();
  const { data: aiSummary, isLoading: aiLoading } = useAiSummary(selectedSymbol);
  const { data: fearGreed, isLoading: fgLoading } = useFearGreed();
  const { currency, setCurrency, fxRate, format } = useCurrency();
  const { marketHours } = useMarketHours();

  const handleCreateTestAlert = () => {
    const priceNum = parseFloat(alertTargetPrice);
    if (!isNaN(priceNum) && priceNum > 0) {
      createAlert(selectedSymbol, alertCondition, priceNum);
    }
  };

  const handleSampleCsvImport = async () => {
    const sampleCsv = `symbol,quantity,price,date,side\nAAPL,15,225.50,2024-07-01,buy\nBTC,0.25,62000.00,2024-07-05,buy\nINVALID_ROW,bad_qty,bad_price,2024-07-10,unknown`;
    const parsed = parseHoldingsCsv(sampleCsv);
    if (parsed.errors.length > 0) {
      setCsvStatus(`CSV Parser correctly detected ${parsed.errors.length} bad row(s): Line ${parsed.errors[0].lineNumber} (${parsed.errors[0].message})`);
    }
    if (parsed.validRows.length > 0) {
      await importCsvRows(parsed.validRows);
    }
  };

  return (
    <PageContainer
      title="Developer Data Layer Inspector (/dev-data)"
      subtitle="Temporary testing dashboard displaying real-time providers, calculation outputs, indicators, streams, and alerts."
    >
      {/* Dev Notice Banner */}
      <div className="rounded-card border border-accent-gold/40 bg-accent-gold-bg/20 p-4 mb-8 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-2.5">
          <Code className="w-5 h-5 text-accent-gold" />
          <span className="text-xs sm:text-sm text-text-primary font-medium">
            Stage 1 Internal Testing Utility &bull; All data feeds and logic engines active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded-btn border border-border-token bg-bg-surface text-text-primary hover:bg-bg-surface-hover"
          >
            Currency: {currency} (Rate: {fxRate})
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Live Price Stream & Ticks */}
        <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-token">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-profit animate-pulse" />
              <h2 className="text-base font-semibold text-text-primary">
                Live Price Stream (usePriceStream)
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-btn bg-bg-surface-hover border border-border-token text-text-muted">
                Status: {streamStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {streamStatus === 'connected' ? (
                <button
                  type="button"
                  onClick={pauseStream}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-btn border border-border-token bg-bg-surface hover:bg-bg-surface-hover text-text-primary"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resumeStream}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-btn bg-profit text-bg-primary"
                >
                  <Play className="w-3.5 h-3.5" /> Resume
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
            {['NVDA', 'TSLA', 'PLTR', 'AMD', 'BTC', 'ETH', 'SOL'].map((sym) => {
              const tick = ticks[sym];
              return (
                <div key={sym} className="p-3 rounded-btn border border-border-token bg-bg-surface-hover">
                  <span className="font-mono text-xs font-bold text-text-primary block">{sym}</span>
                  <span
                    className={`font-mono text-sm font-semibold transition-colors duration-fast ${
                      tick?.direction === 'up'
                        ? 'text-profit'
                        : tick?.direction === 'down'
                        ? 'text-loss'
                        : 'text-text-primary'
                    }`}
                  >
                    {tick ? `$${tick.price.toFixed(2)}` : 'Waiting...'}
                  </span>
                  <span className="text-[10px] text-text-muted block mt-0.5">
                    {tick ? `Dir: ${tick.direction}` : 'Subscribed'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Top Gainers & Expert Picks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-token">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-profit" />
                <h2 className="text-base font-semibold text-text-primary">
                  Top Gainers (useTopGainers)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => refetchGainers()}
                className="text-xs text-text-muted hover:text-text-primary underline"
              >
                Refetch
              </button>
            </div>

            {gainersLoading ? (
              <Skeleton variant="card" className="h-40" />
            ) : gainersError ? (
              <ErrorState title="Error" message="Could not fetch gainers" onRetry={() => refetchGainers()} />
            ) : (
              <div className="space-y-2">
                {gainers.map((g) => (
                  <div
                    key={g.symbol}
                    className="flex items-center justify-between p-2.5 rounded-btn bg-bg-surface-hover text-xs font-mono border border-border-token"
                  >
                    <span className="font-bold text-text-primary">{g.symbol} ({g.name})</span>
                    <div className="flex items-center gap-3">
                      <span className="text-text-primary">${g.price.toFixed(2)}</span>
                      <span className="text-profit font-semibold">+{g.change24hPct.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Expert Picks */}
          <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-token">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-gold" />
                <h2 className="text-base font-semibold text-text-primary">
                  Expert Picks (8 Items, Curated)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => refetchPicks()}
                className="text-xs text-text-muted hover:text-text-primary underline"
              >
                Refetch
              </button>
            </div>

            {picksLoading ? (
              <Skeleton variant="card" className="h-40" />
            ) : picksError ? (
              <ErrorState title="Error" message="Could not fetch picks" onRetry={() => refetchPicks()} />
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {picks.map((p) => (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded-btn border text-xs flex flex-col gap-1 ${
                      p.isHighlighted
                        ? 'border-accent-gold/40 bg-accent-gold-bg/20'
                        : 'border-border-token bg-bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-text-primary">
                        {p.symbol} &bull; {p.name}
                      </span>
                      <span className="font-mono text-profit">Target: ${p.targetPrice}</span>
                    </div>
                    <span className="text-text-muted text-[11px] truncate">{p.rationale}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 3. Portfolio Analytics & CSV Import */}
        <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-3 border-b border-border-token">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-profit" />
              <h2 className="text-base font-semibold text-text-primary">
                Portfolio Analytics Engine (usePortfolioAnalytics)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSampleCsvImport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-btn border border-border-token bg-bg-surface hover:bg-bg-surface-hover text-text-primary"
              >
                <Upload className="w-3.5 h-3.5" /> Test CSV Import
              </button>
              <button
                type="button"
                onClick={() => refetchPort()}
                className="text-xs text-text-muted hover:text-text-primary underline"
              >
                Refetch
              </button>
            </div>
          </div>

          {csvStatus && (
            <div className="p-3 mb-4 rounded-btn bg-accent-gold-bg/30 border border-accent-gold/40 text-xs text-text-primary font-mono">
              {csvStatus}
            </div>
          )}

          {portLoading ? (
            <Skeleton variant="card" className="h-32" />
          ) : portError ? (
            <ErrorState title="Error" message="Portfolio error" onRetry={() => refetchPort()} />
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                  <span className="text-xs text-text-muted block">Current Value</span>
                  <span className="font-mono text-base font-bold text-text-primary">{format(analytics.currentValue)}</span>
                </div>
                <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                  <span className="text-xs text-text-muted block">Total Cost Basis</span>
                  <span className="font-mono text-base font-bold text-text-primary">{format(analytics.totalCostBasis)}</span>
                </div>
                <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                  <span className="text-xs text-text-muted block">Unrealized P/L</span>
                  <span className="font-mono text-base font-bold text-profit">
                    {format(analytics.totalGainLoss)} ({analytics.totalGainLossPercent}%)
                  </span>
                </div>
                <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                  <span className="text-xs text-text-muted block">Allocation</span>
                  <span className="font-mono text-xs text-text-primary block mt-1">
                    Coins: {analytics.allocationByType.coin}% | Stocks: {analytics.allocationByType.stock}%
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-border-token text-text-muted">
                      <th className="py-2 px-3">Symbol</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                      <th className="py-2 px-3 text-right">Buy Price</th>
                      <th className="py-2 px-3 text-right">Current Price</th>
                      <th className="py-2 px-3 text-right">Total Value</th>
                      <th className="py-2 px-3 text-right">P/L (%)</th>
                      <th className="py-2 px-3 text-right">Alloc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-token">
                    {analytics.holdingsWithPnl.map((h) => (
                      <tr key={h.id}>
                        <td className="py-2 px-3 font-bold text-text-primary">{h.symbol}</td>
                        <td className="py-2 px-3 text-right">{h.quantity}</td>
                        <td className="py-2 px-3 text-right">${h.avgBuyPrice}</td>
                        <td className="py-2 px-3 text-right">${h.currentPrice}</td>
                        <td className="py-2 px-3 text-right">{format(h.currentValue)}</td>
                        <td className="py-2 px-3 text-right text-profit">+{h.gainLossPercent}%</td>
                        <td className="py-2 px-3 text-right">{h.allocationPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* 4. Technical Indicators */}
        <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-3 border-b border-border-token">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-accent-gold" />
              <h2 className="text-base font-semibold text-text-primary">
                Technical Indicators Engine (useIndicators)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Select Symbol:</span>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-btn bg-bg-surface border border-border-token text-text-primary font-mono"
              >
                <option value="NVDA">NVDA (NVIDIA)</option>
                <option value="TSLA">TSLA (Tesla)</option>
                <option value="BTC">BTC (Bitcoin)</option>
                <option value="ETH">ETH (Ethereum)</option>
              </select>
            </div>
          </div>

          {indLoading ? (
            <Skeleton variant="card" className="h-28" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                <span className="text-text-muted block mb-1">SMA (20)</span>
                <span className="text-base font-bold text-text-primary">
                  {latestSMA !== null ? `$${latestSMA}` : 'Calculating...'}
                </span>
              </div>
              <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                <span className="text-text-muted block mb-1">EMA (20)</span>
                <span className="text-base font-bold text-text-primary">
                  {latestEMA !== null ? `$${latestEMA}` : 'Calculating...'}
                </span>
              </div>
              <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                <span className="text-text-muted block mb-1">RSI (14)</span>
                <span
                  className={`text-base font-bold ${
                    (latestRSI || 50) > 70 ? 'text-loss' : (latestRSI || 50) < 30 ? 'text-profit' : 'text-text-primary'
                  }`}
                >
                  {latestRSI !== null ? latestRSI : 'Calculating...'}
                </span>
              </div>
              <div className="p-3 rounded-btn bg-bg-surface-hover border border-border-token">
                <span className="text-text-muted block mb-1">Bollinger Bands (20, 2)</span>
                <span className="text-text-primary block text-[11px]">
                  Upper: {latestBB.upper ? `$${latestBB.upper}` : '-'}
                </span>
                <span className="text-text-primary block text-[11px]">
                  Lower: {latestBB.lower ? `$${latestBB.lower}` : '-'}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* 5. Alerts Engine & AI Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-token">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent-gold" />
                <h2 className="text-base font-semibold text-text-primary">
                  Price Alerts Engine (useAlerts)
                </h2>
              </div>
              <button
                type="button"
                onClick={requestPermission}
                className="px-2.5 py-1 text-xs font-medium rounded-btn border border-border-token bg-bg-surface hover:bg-bg-surface-hover text-text-primary"
              >
                Enable Notifications
              </button>
            </div>

            {/* Create Alert Controls */}
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-btn bg-bg-surface-hover border border-border-token text-xs">
              <span className="font-mono font-bold text-text-primary">{selectedSymbol}</span>
              <select
                value={alertCondition}
                onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                className="px-2 py-1 rounded-btn bg-bg-surface border border-border-token text-text-primary"
              >
                <option value="above">Crosses Above</option>
                <option value="below">Crosses Below</option>
              </select>
              <input
                type="number"
                value={alertTargetPrice}
                onChange={(e) => setAlertTargetPrice(e.target.value)}
                className="w-24 px-2 py-1 rounded-btn bg-bg-surface border border-border-token text-text-primary font-mono"
              />
              <button
                type="button"
                onClick={handleCreateTestAlert}
                className="px-3 py-1 font-medium rounded-btn bg-text-primary text-bg-primary hover:opacity-90"
              >
                Set Alert
              </button>
            </div>

            <div className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-xs text-text-muted">No active alerts set.</p>
              ) : (
                alerts.map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-center justify-between p-2.5 rounded-btn border text-xs font-mono ${
                      a.status === 'triggered'
                        ? 'border-profit/40 bg-profit-bg/20'
                        : 'border-border-token bg-bg-surface-hover'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-text-primary">{a.symbol} </span>
                      <span className="text-text-muted">{a.condition} ${a.targetPrice.toFixed(2)}</span>
                      <span
                        className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                          a.status === 'triggered' ? 'bg-profit text-bg-primary font-bold' : 'bg-border-token text-text-muted'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAlert(a.id)}
                      className="text-text-muted hover:text-loss text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* AI Summary */}
          <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-token">
                <Bot className="w-5 h-5 text-accent-gold" />
                <h2 className="text-base font-semibold text-text-primary">
                  AI Summary Engine ({selectedSymbol})
                </h2>
              </div>

              {aiLoading ? (
                <Skeleton variant="card" className="h-32" />
              ) : (
                <div>
                  <p className="text-xs text-text-primary leading-relaxed mb-3">
                    {aiSummary?.summary}
                  </p>
                  <ul className="space-y-1 mb-4 text-xs text-text-muted">
                    {aiSummary?.keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-accent-gold">&bull;</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border-token text-[11px] text-text-muted font-mono">
              {aiSummary?.disclaimer || 'AI-generated summary, not financial advice.'}
            </div>
          </section>
        </div>

        {/* 6. Market Hours & Fear/Greed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Market Hours */}
          <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-token">
              <Clock className="w-5 h-5 text-text-primary" />
              <h2 className="text-base font-semibold text-text-primary">
                Exchange Market Hours
              </h2>
            </div>
            <div className="space-y-3">
              {marketHours.map((mh) => (
                <div
                  key={mh.market}
                  className="p-3 rounded-btn bg-bg-surface-hover border border-border-token flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-text-primary">{mh.market}</span>
                    <span className="text-text-muted ml-2">Time: {mh.localTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        mh.status === 'open'
                          ? 'bg-profit text-bg-primary'
                          : mh.status === 'pre-open'
                          ? 'bg-accent-gold text-bg-primary'
                          : 'bg-border-token text-text-muted'
                      }`}
                    >
                      {mh.status}
                    </span>
                    <span className="text-text-muted text-[11px]">{mh.timeToNextOpen}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fear and Greed */}
          <section className="rounded-card border border-border-token bg-bg-surface p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-token">
                <Coins className="w-5 h-5 text-profit" />
                <h2 className="text-base font-semibold text-text-primary">
                  Market Sentiment (Fear & Greed Index)
                </h2>
              </div>
              {fgLoading ? (
                <Skeleton variant="card" className="h-24" />
              ) : (
                <div className="p-4 rounded-btn bg-bg-surface-hover border border-border-token flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-muted block">Index Score</span>
                    <span className="font-mono text-3xl font-bold text-profit">{fearGreed?.score} / 100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-text-muted block">Classification</span>
                    <span className="font-mono text-base font-semibold text-text-primary">{fearGreed?.label}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-[11px] text-text-muted font-mono pt-3 border-t border-border-token">
              Updated: {fearGreed ? new Date(fearGreed.updatedAt).toLocaleTimeString() : '-'} &bull; Source: {fearGreed?.isMock ? 'Mock Model' : 'Live Index'}
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

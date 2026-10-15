import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { BellRing, BookmarkCheck, Newspaper, Clock, Sparkles } from 'lucide-react';

const futureFeatures = [
  {
    icon: BellRing,
    title: 'Price Alerts',
    status: 'In Design',
    description:
      'Set granular price thresholds, percentage shift triggers, and volatility alerts with real-time browser push notifications and email digests.',
    timeline: 'Stage 2',
  },
  {
    icon: BookmarkCheck,
    title: 'Watchlists',
    status: 'Planned',
    description:
      'Create personalized multi-asset tracking lists with custom tagging, quick comparisons, and sparkline performance previews.',
    timeline: 'Stage 3',
  },
  {
    icon: Newspaper,
    title: 'News Feed',
    status: 'Planned',
    description:
      'Aggregated financial headlines, SEC filing alerts, earnings date reminders, and natural-language market sentiment analysis.',
    timeline: 'Stage 4',
  },
];

export const Future: React.FC = () => {
  return (
    <PageContainer
      title="Future Options & Roadmap"
      subtitle="Explore upcoming platform capabilities scheduled for development across future release stages"
    >
      <div className="max-w-3xl mx-auto">
        {/* Main "Coming Soon" Card */}
        <div className="rounded-card border border-border-token bg-bg-surface p-6 sm:p-8 shadow-subtle mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-token">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-btn bg-accent-gold-bg border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Coming Soon
                  </h2>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-accent-gold-bg text-accent-gold border border-accent-gold/20">
                    Roadmap
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  The following 3 modules are queued next in the StockPulse development lifecycle:
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-text-muted sm:text-right">
              Stage 0 &bull; Foundations
            </div>
          </div>

          {/* 3 Future Options Listed */}
          <div className="divide-y divide-border-token/60 mt-2">
            {futureFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="py-5 flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-btn bg-bg-surface-hover border border-border-token flex items-center justify-center text-text-primary shrink-0 group-hover:border-accent-gold/40 transition-colors duration-fast">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {feat.title}
                      </h3>
                      <span className="text-xs font-mono text-accent-gold bg-accent-gold-bg px-2 py-0.5 rounded-btn border border-accent-gold/20">
                        {feat.timeline}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-border-token flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              Have feature feedback? Connect during user testing rounds.
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  layoutId = 'active-tab-indicator',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-bg-surface border border-border-token ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-fast flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
              isActive ? 'text-text-primary font-semibold' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {isActive && !shouldReduceMotion && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-bg-surface-hover border border-border-color-glow shadow-sm -z-0"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
              />
            )}
            {isActive && shouldReduceMotion && (
              <div className="absolute inset-0 rounded-lg bg-bg-surface-hover border border-border-token -z-0" />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-border-token/40 text-text-muted">
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

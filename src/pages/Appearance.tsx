import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun, Check, Laptop } from 'lucide-react';

export const Appearance: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <PageContainer
      title="Appearance"
      subtitle="Customize your display theme. Preference is saved in your browser storage and loaded instantly without screen flicker."
    >
      <div className="max-w-2xl">
        <div className="rounded-card border border-border-token bg-bg-surface p-6 sm:p-8 shadow-subtle mb-6">
          <h2 className="text-base font-semibold text-text-primary mb-1">
            Interface Theme
          </h2>
          <p className="text-xs text-text-muted mb-6">
            Choose your preferred color scheme. Dark mode is default to reduce eye strain during prolonged market monitoring sessions.
          </p>

          {/* Theme Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Theme Card */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`text-left p-4 rounded-card border transition-all duration-fast flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-gold/40 ${
                isDark
                  ? 'border-profit bg-profit-bg/20 shadow-subtle ring-1 ring-profit/30'
                  : 'border-border-token bg-bg-surface hover:bg-bg-surface-hover'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-btn bg-[#0B0D10] border border-[#1E232B] flex items-center justify-center text-[#E6E8EB]">
                    <Moon className="w-4 h-4 text-accent-gold" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-primary block">Dark Mode</span>
                    <span className="text-xs text-text-muted">Default Palette</span>
                  </div>
                </div>
                {isDark && (
                  <div className="w-5 h-5 rounded-full bg-profit flex items-center justify-center text-bg-primary">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Mini Preview Box */}
              <div className="w-full h-12 rounded-btn bg-[#0B0D10] border border-[#1E232B] p-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                  <div className="w-10 h-2 rounded-full bg-[#1E232B]" />
                </div>
                <div className="w-8 h-2 rounded-full bg-[#8A919E]" />
              </div>
            </button>

            {/* Light Theme Card */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`text-left p-4 rounded-card border transition-all duration-fast flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-gold/40 ${
                !isDark
                  ? 'border-profit bg-profit-bg/20 shadow-subtle ring-1 ring-profit/30'
                  : 'border-border-token bg-bg-surface hover:bg-bg-surface-hover'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-btn bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                    <Sun className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-primary block">Light Mode</span>
                    <span className="text-xs text-text-muted">High Contrast</span>
                  </div>
                </div>
                {!isDark && (
                  <div className="w-5 h-5 rounded-full bg-profit flex items-center justify-center text-bg-primary">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Mini Preview Box */}
              <div className="w-full h-12 rounded-btn bg-[#F8FAFC] border border-[#E2E8F0] p-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
                  <div className="w-10 h-2 rounded-full bg-[#E2E8F0]" />
                </div>
                <div className="w-8 h-2 rounded-full bg-[#64748B]" />
              </div>
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-border-token flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5" />
              Active Theme: <span className="font-mono font-medium text-text-primary capitalize">{theme}</span>
            </span>
            <span className="font-mono text-profit">
              Persisted in localStorage
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

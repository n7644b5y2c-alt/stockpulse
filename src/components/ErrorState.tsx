import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load data',
  message = 'An unexpected error occurred while fetching the latest market figures. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`rounded-card border border-border-token bg-bg-surface p-6 sm:p-8 flex flex-col items-center text-center max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-loss-bg flex items-center justify-center text-loss mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-bg-surface-hover hover:bg-border-token text-text-primary text-sm font-medium transition-colors duration-fast border border-border-token focus:outline-none focus:ring-2 focus:ring-accent-gold/40 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

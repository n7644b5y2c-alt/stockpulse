import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChangeBadgeProps {
  changePct: number;
  showIcon?: boolean;
  className?: string;
}

export const ChangeBadge: React.FC<ChangeBadgeProps> = ({
  changePct,
  showIcon = true,
  className = '',
}) => {
  const isPositive = changePct > 0;
  const isZero = Math.abs(changePct) < 0.0001;

  const bgClass = isZero
    ? 'bg-border-token text-text-muted'
    : isPositive
    ? 'bg-profit-bg text-profit border border-profit/20'
    : 'bg-loss-bg text-loss border border-loss/20';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-xs font-semibold ${bgClass} ${className}`}
    >
      {showIcon && (
        <>
          {isZero ? (
            <Minus className="w-3 h-3" />
          ) : isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </>
      )}
      <span>{isPositive ? `+${changePct.toFixed(2)}%` : `${changePct.toFixed(2)}%`}</span>
    </span>
  );
};

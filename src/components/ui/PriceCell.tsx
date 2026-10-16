import React, { useEffect, useState } from 'react';
import type { PriceTick } from '../../types';

interface PriceCellProps {
  price: number;
  tick?: PriceTick;
  formatPrice?: (p: number) => string;
  className?: string;
  flashDurationMs?: number;
}

export const PriceCell: React.FC<PriceCellProps> = ({
  price,
  tick,
  formatPrice = (p) => `$${p.toFixed(2)}`,
  className = '',
  flashDurationMs = 700,
}) => {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!tick) return;
    if (tick.direction === 'up') {
      setFlash('up');
      const timer = setTimeout(() => setFlash(null), flashDurationMs);
      return () => clearTimeout(timer);
    } else if (tick.direction === 'down') {
      setFlash('down');
      const timer = setTimeout(() => setFlash(null), flashDurationMs);
      return () => clearTimeout(timer);
    }
  }, [tick?.timestamp, tick?.direction, flashDurationMs]);

  const flashClass =
    flash === 'up'
      ? 'bg-profit/20 text-profit shadow-[0_0_12px_rgba(34,197,94,0.35)]'
      : flash === 'down'
      ? 'bg-loss/20 text-loss shadow-[0_0_12px_rgba(239,68,68,0.35)]'
      : 'text-text-primary';

  return (
    <span
      className={`font-mono transition-colors duration-fast rounded px-1.5 py-0.5 inline-block ${flashClass} ${className}`}
    >
      {formatPrice(price)}
    </span>
  );
};

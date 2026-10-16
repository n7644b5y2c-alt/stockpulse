import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'var(--color-accent-primary)',
  height = 6,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      style={{ height }}
      className={`w-full rounded-full bg-border-token/40 overflow-hidden relative ${className}`}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
};

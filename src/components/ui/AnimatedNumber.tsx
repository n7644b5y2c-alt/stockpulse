import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  durationMs?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = (v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  durationMs = 600,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    const startValue = displayValue;
    const diff = value - startValue;
    if (Math.abs(diff) < 0.0001) return;

    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out quint
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startValue + diff * ease;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, durationMs, shouldReduceMotion]);

  return <span className={className}>{format(displayValue)}</span>;
};

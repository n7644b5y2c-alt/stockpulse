import React, { useId } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  isPositive?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 32,
  isPositive,
  className = '',
}) => {
  const gradientId = useId();

  if (!data || data.length < 2) {
    return <div style={{ width, height }} className={`bg-border-token/20 rounded ${className}`} />;
  }

  const positive = isPositive !== undefined ? isPositive : data[data.length - 1] >= data[0];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * chartWidth;
    const y = height - padding - ((val - min) / range) * chartHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  const strokeColor = positive ? 'var(--color-profit)' : 'var(--color-loss)';
  const fillColor = positive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

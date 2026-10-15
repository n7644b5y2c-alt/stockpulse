import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
}) => {
  const baseClasses = 'animate-pulse bg-bg-surface-hover/80';

  const variantClasses = {
    text: 'h-4 rounded-btn w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-btn',
    card: 'rounded-card border border-border-token p-4 w-full h-32',
  }[variant];

  const style: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      role="status"
      aria-label="Loading placeholder"
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

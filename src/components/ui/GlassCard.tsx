import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isExpertPick?: boolean;
  hoverLift?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  isExpertPick = false,
  hoverLift = true,
  onClick,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const baseClasses = `relative rounded-card transition-all duration-normal backdrop-blur-md ${
    isExpertPick
      ? 'border border-accent-gold/60 gold-glow-border bg-bg-card'
      : 'border border-border-token bg-bg-card hover:border-border-glow hover:shadow-glow-cyan'
  } ${onClick ? 'cursor-pointer' : ''} ${className}`;

  if (shouldReduceMotion || !hoverLift) {
    return (
      <div className={baseClasses} onClick={onClick} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={baseClasses}
      onClick={onClick}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};

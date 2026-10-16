import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none">
      {/* Aurora Radial Glow 1 - Cyan Top Left */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] opacity-20 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%)',
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 25, 0],
                y: [0, 30, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Aurora Radial Glow 2 - Violet Right */}
      <motion.div
        className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[140px] opacity-15 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)',
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -30, 0],
                y: [0, 35, 0],
                scale: [1, 1.08, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Futuristic Cybernetic Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.045]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--text-primary) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />
    </div>
  );
};

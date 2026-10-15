import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`p-2 rounded-btn border border-border-token bg-bg-surface text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-accent-gold/40 cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-accent-gold transition-transform duration-fast" />
      ) : (
        <Moon className="w-4 h-4 text-text-primary transition-transform duration-fast" />
      )}
    </button>
  );
};

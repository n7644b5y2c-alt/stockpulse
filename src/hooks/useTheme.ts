import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'stockpulse-theme';
const THEME_EVENT = 'stockpulse-theme-change';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // ignore localStorage errors (e.g. sandboxed iframe)
  }
  return 'dark'; // Dark is default
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: newTheme }));
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  useEffect(() => {
    // Ensure root class is in sync on mount
    applyTheme(theme);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail && customEvent.detail !== theme) {
        setThemeState(customEvent.detail);
      }
    };

    window.addEventListener(THEME_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_EVENT, handleThemeChange);
  }, [theme, applyTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { demoService } from '../data/services/demoService';

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => demoService.isDemoMode());

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setIsDemoMode(custom.detail);
    };
    window.addEventListener('stockpulse-demo-change', handler);
    return () => window.removeEventListener('stockpulse-demo-change', handler);
  }, []);

  const toggleDemoMode = useCallback(() => {
    const next = !isDemoMode;
    demoService.setDemoMode(next);
    setIsDemoMode(next);
  }, [isDemoMode]);

  return {
    isDemoMode,
    toggleDemoMode,
  };
}

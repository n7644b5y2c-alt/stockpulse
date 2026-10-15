const DEMO_MODE_KEY = 'stockpulse-demo-mode';

export const demoService = {
  isDemoMode: (): boolean => {
    if (typeof window === 'undefined') return true;
    try {
      const val = localStorage.getItem(DEMO_MODE_KEY);
      if (val !== null) {
        return val === 'true';
      }
    } catch {
      // ignore
    }
    // Default on
    const envVal = import.meta.env.VITE_ENABLE_DEMO_MODE;
    return envVal === undefined || envVal === 'true';
  },

  setDemoMode: (enabled: boolean): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DEMO_MODE_KEY, String(enabled));
      window.dispatchEvent(new CustomEvent('stockpulse-demo-change', { detail: enabled }));
    } catch {
      // ignore
    }
  },
};

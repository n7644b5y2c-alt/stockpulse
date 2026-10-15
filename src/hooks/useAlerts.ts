import { useState, useEffect, useCallback } from 'react';
import { alertEngine } from '../data/services/alertService';
import type { PriceAlert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => alertEngine.getAlerts());

  useEffect(() => {
    return alertEngine.subscribe((updated) => {
      setAlerts(updated);
    });
  }, []);

  const createAlert = useCallback((symbol: string, condition: 'above' | 'below', targetPrice: number) => {
    return alertEngine.createAlert(symbol, condition, targetPrice);
  }, []);

  const deleteAlert = useCallback((id: string) => {
    return alertEngine.deleteAlert(id);
  }, []);

  const clearAllAlerts = useCallback(() => {
    alertEngine.clearAllAlerts();
  }, []);

  const requestPermission = useCallback(() => {
    return alertEngine.requestNotificationPermission();
  }, []);

  return {
    alerts,
    createAlert,
    deleteAlert,
    clearAllAlerts,
    requestPermission,
  };
}

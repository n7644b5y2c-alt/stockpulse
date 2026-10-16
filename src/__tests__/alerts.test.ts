import { describe, it, expect, beforeEach } from 'vitest';
import { AlertEngine } from '../data/services/alertService';

describe('Price Alerts Engine (AlertEngine)', () => {
  let engine: AlertEngine;

  beforeEach(() => {
    // Clear localStorage mockup
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    engine = new AlertEngine();
    engine.clearAllAlerts();
  });

  it('triggers alert when price crosses above targetPrice', () => {
    const alert = engine.createAlert('NVDA', 'above', 140.00);
    expect(alert.status).toBe('active');

    // Tick below target: should not trigger
    const tick1 = { symbol: 'NVDA', price: 139.50, previousPrice: 139.00, direction: 'up' as const, timestamp: Date.now() };
    const triggered1 = engine.checkTick(tick1);
    expect(triggered1.length).toBe(0);

    // Tick above target: should trigger
    const tick2 = { symbol: 'NVDA', price: 140.25, previousPrice: 139.50, direction: 'up' as const, timestamp: Date.now() };
    const triggered2 = engine.checkTick(tick2);
    expect(triggered2.length).toBe(1);
    expect(triggered2[0].id).toBe(alert.id);
    expect(triggered2[0].status).toBe('triggered');

    // Subsequent tick should not re-trigger
    const triggered3 = engine.checkTick(tick2);
    expect(triggered3.length).toBe(0);
  });

  it('triggers alert when price crosses below targetPrice', () => {
    const alert = engine.createAlert('BTC', 'below', 65000.00);
    expect(alert.status).toBe('active');

    // Tick below target
    const tick = { symbol: 'BTC', price: 64950.00, previousPrice: 65100.00, direction: 'down' as const, timestamp: Date.now() };
    const triggered = engine.checkTick(tick);
    expect(triggered.length).toBe(1);
    expect(triggered[0].status).toBe('triggered');
  });

  it('deletes alerts properly', () => {
    const alert = engine.createAlert('ETH', 'above', 3000);
    expect(engine.getAlerts().length).toBe(1);

    const deleted = engine.deleteAlert(alert.id);
    expect(deleted).toBe(true);
    expect(engine.getAlerts().length).toBe(0);
  });
});

import { AlertSchema, type PriceAlert, type PriceTick } from '../schemas';

const ALERTS_STORAGE_KEY = 'stockpulse-alerts';

export interface EmailAlertService {
  sendAlert(email: string, alert: PriceAlert, currentPrice: number): Promise<{ success: boolean; id?: string }>;
}

export class MockEmailAlertService implements EmailAlertService {
  async sendAlert(email: string, alert: PriceAlert, currentPrice: number): Promise<{ success: boolean; id: string }> {
    console.log(`[Mock Email Alert] To: ${email} | ${alert.symbol} triggered at $${currentPrice} (Condition: ${alert.condition} $${alert.targetPrice})`);
    return { success: true, id: `mock-email-${Date.now()}` };
  }
}

export class ResendEmailAlertService implements EmailAlertService {
  async sendAlert(email: string, alert: PriceAlert, currentPrice: number): Promise<{ success: boolean; id?: string }> {
    try {
      const res = await fetch('/api/send-alert-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, alert, currentPrice }),
      });
      if (!res.ok) throw new Error(`Email proxy error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Resend alert failed, falling back to mock logger:', err);
      return new MockEmailAlertService().sendAlert(email, alert, currentPrice);
    }
  }
}

export const emailAlertService: EmailAlertService = new MockEmailAlertService();

export class AlertEngine {
  private alerts: PriceAlert[] = [];
  private listeners = new Set<(alerts: PriceAlert[]) => void>();

  constructor() {
    this.loadAlerts();
  }

  getAlerts(): PriceAlert[] {
    return [...this.alerts];
  }

  subscribe(listener: (alerts: PriceAlert[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getAlerts());
    return () => this.listeners.delete(listener);
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }

  createAlert(symbol: string, condition: 'above' | 'below', targetPrice: number): PriceAlert {
    const raw = {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      symbol: symbol.toUpperCase(),
      condition,
      targetPrice,
      status: 'active' as const,
      createdAt: Date.now(),
    };

    const parsed = AlertSchema.parse(raw);
    this.alerts.push(parsed);
    this.saveAlerts();
    this.notify();
    return parsed;
  }

  deleteAlert(id: string): boolean {
    const initialLen = this.alerts.length;
    this.alerts = this.alerts.filter((a) => a.id !== id);
    if (this.alerts.length !== initialLen) {
      this.saveAlerts();
      this.notify();
      return true;
    }
    return false;
  }

  clearAllAlerts(): void {
    this.alerts = [];
    this.saveAlerts();
    this.notify();
  }

  checkTick(tick: PriceTick): PriceAlert[] {
    let changed = false;
    const triggered: PriceAlert[] = [];

    this.alerts = this.alerts.map((alert) => {
      if (alert.status !== 'active') return alert;
      if (alert.symbol.toUpperCase() !== tick.symbol.toUpperCase()) return alert;

      let isTriggered = false;
      if (alert.condition === 'above' && tick.price >= alert.targetPrice) {
        isTriggered = true;
      } else if (alert.condition === 'below' && tick.price <= alert.targetPrice) {
        isTriggered = true;
      }

      if (isTriggered) {
        changed = true;
        const updatedAlert: PriceAlert = {
          ...alert,
          status: 'triggered',
          triggeredAt: tick.timestamp || Date.now(),
        };
        triggered.push(updatedAlert);
        this.fireNotification(updatedAlert, tick.price);
        return updatedAlert;
      }

      return alert;
    });

    if (changed) {
      this.saveAlerts();
      this.notify();
    }

    return triggered;
  }

  private fireNotification(alert: PriceAlert, currentPrice: number): void {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`StockPulse Alert: ${alert.symbol}`, {
          body: `${alert.symbol} crossed ${alert.condition} $${alert.targetPrice.toFixed(2)} (Current: $${currentPrice.toFixed(2)})`,
          icon: '/vite.svg',
        });
      } catch (err) {
        console.error('Failed to dispatch browser notification:', err);
      }
    }
  }

  private loadAlerts(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.alerts = parsed
            .map((item) => {
              const res = AlertSchema.safeParse(item);
              return res.success ? res.data : null;
            })
            .filter((a): a is PriceAlert => a !== null);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default sample alerts for demo
    this.alerts = [
      { id: 'sample-alt-1', symbol: 'NVDA', condition: 'above', targetPrice: 140.00, status: 'active', createdAt: Date.now() - 3600000 },
      { id: 'sample-alt-2', symbol: 'BTC', condition: 'above', targetPrice: 68000.00, status: 'active', createdAt: Date.now() - 7200000 },
    ];
    this.saveAlerts();
  }

  private saveAlerts(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(this.alerts));
    } catch {
      // ignore
    }
  }

  private notify(): void {
    const copy = this.getAlerts();
    this.listeners.forEach((l) => l(copy));
  }
}

export const alertEngine = new AlertEngine();

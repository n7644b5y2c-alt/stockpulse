import type { PriceTick, PriceStream, StreamStatus } from '../../types';
import type { PriceTickCallback } from './types';
import { mockStocks } from '../mock/stocks';
import { mockCoins } from '../mock/coins';

export class SimulatedStream implements PriceStream {
  private subscribers = new Map<string, Set<PriceTickCallback>>();
  private currentPrices = new Map<string, number>();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private status: StreamStatus = 'disconnected';

  constructor() {
    // Initialize base prices from mock collections
    [...mockStocks, ...mockCoins].forEach((asset) => {
      this.currentPrices.set(asset.symbol.toUpperCase(), asset.price);
    });
  }

  subscribe(symbols: string[], callback: PriceTickCallback): void {
    symbols.forEach((sym) => {
      const upper = sym.toUpperCase();
      if (!this.subscribers.has(upper)) {
        this.subscribers.set(upper, new Set());
      }
      this.subscribers.get(upper)!.add(callback);
    });

    if (!this.intervalId && this.status !== 'paused') {
      this.startInterval();
    }
  }

  unsubscribe(symbols: string[], callback?: PriceTickCallback): void {
    symbols.forEach((sym) => {
      const upper = sym.toUpperCase();
      const set = this.subscribers.get(upper);
      if (set) {
        if (callback) {
          set.delete(callback);
        } else {
          set.clear();
        }
        if (set.size === 0) {
          this.subscribers.delete(upper);
        }
      }
    });

    if (this.subscribers.size === 0 && this.intervalId) {
      this.clearInterval();
    }
  }

  pause(): void {
    this.status = 'paused';
    this.clearInterval();
  }

  resume(): void {
    if (this.status === 'paused' && this.subscribers.size > 0) {
      this.startInterval();
    }
  }

  getStatus(): StreamStatus {
    return this.status;
  }

  getCurrentPrice(symbol: string): number | undefined {
    return this.currentPrices.get(symbol.toUpperCase());
  }

  private startInterval(): void {
    this.clearInterval();
    this.status = 'connected';
    this.intervalId = setInterval(() => {
      this.tick();
    }, 2000);
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.status !== 'paused') {
      this.status = 'disconnected';
    }
  }

  private tick(): void {
    if (this.subscribers.size === 0) return;

    this.subscribers.forEach((callbacks, symbol) => {
      const prevPrice = this.currentPrices.get(symbol) || 100;

      // Random drift max ±0.3% (0.003)
      const driftPercent = (Math.random() * 0.006) - 0.003;
      const rawNewPrice = prevPrice * (1 + driftPercent);
      const newPrice = Number(rawNewPrice.toFixed(prevPrice < 1 ? 4 : 2));

      let direction: 'up' | 'down' | 'flat' = 'flat';
      if (newPrice > prevPrice) direction = 'up';
      else if (newPrice < prevPrice) direction = 'down';

      this.currentPrices.set(symbol, newPrice);

      const tickData: PriceTick = {
        symbol,
        price: newPrice,
        previousPrice: prevPrice,
        direction,
        timestamp: Date.now(),
      };

      callbacks.forEach((cb) => {
        try {
          cb(tickData);
        } catch (err) {
          console.error(`Error in simulated stream listener for ${symbol}:`, err);
        }
      });
    });
  }
}

export const simulatedStream = new SimulatedStream();

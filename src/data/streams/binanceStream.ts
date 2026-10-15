import type { PriceTick, PriceStream, StreamStatus } from '../../types';
import type { PriceTickCallback } from './types';

export class BinanceWebSocketStream implements PriceStream {
  private subscribers = new Map<string, Set<PriceTickCallback>>();
  private currentPrices = new Map<string, number>();
  private socket: WebSocket | null = null;
  private status: StreamStatus = 'disconnected';
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 6;
  private isPaused = false;

  subscribe(symbols: string[], callback: PriceTickCallback): void {
    symbols.forEach((sym) => {
      const upper = sym.toUpperCase();
      if (!this.subscribers.has(upper)) {
        this.subscribers.set(upper, new Set());
      }
      this.subscribers.get(upper)!.add(callback);
    });

    if (!this.isPaused && (!this.socket || this.socket.readyState !== WebSocket.OPEN)) {
      this.connect();
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

    if (this.subscribers.size === 0) {
      this.disconnect();
    }
  }

  pause(): void {
    this.isPaused = true;
    this.status = 'paused';
    this.disconnect();
  }

  resume(): void {
    this.isPaused = false;
    if (this.subscribers.size > 0) {
      this.connect();
    }
  }

  getStatus(): StreamStatus {
    return this.status;
  }

  private connect(): void {
    if (typeof WebSocket === 'undefined') {
      this.status = 'disconnected';
      return;
    }

    if (this.subscribers.size === 0 || this.isPaused) return;

    this.status = 'connecting';

    // Map requested symbols to binance trade streams (e.g. BTC -> btcusdt@trade)
    const streams = Array.from(this.subscribers.keys())
      .map((s) => `${s.toLowerCase()}usdt@trade`)
      .join('/');

    const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.status = 'connected';
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Binance trade payload has `s`: symbol (e.g. BTCUSDT) and `p`: price string
          if (data && data.s && data.p) {
            const rawSymbol = data.s.replace(/USDT$/, '');
            const newPrice = parseFloat(data.p);
            const prevPrice = this.currentPrices.get(rawSymbol) || newPrice;

            let direction: 'up' | 'down' | 'flat' = 'flat';
            if (newPrice > prevPrice) direction = 'up';
            else if (newPrice < prevPrice) direction = 'down';

            this.currentPrices.set(rawSymbol, newPrice);

            const tick: PriceTick = {
              symbol: rawSymbol,
              price: newPrice,
              previousPrice: prevPrice,
              direction,
              timestamp: data.E || Date.now(),
            };

            const callbacks = this.subscribers.get(rawSymbol);
            if (callbacks) {
              callbacks.forEach((cb) => cb(tick));
            }
          }
        } catch (err) {
          console.error('Binance websocket parse error:', err);
        }
      };

      this.socket.onerror = () => {
        this.status = 'disconnected';
      };

      this.socket.onclose = () => {
        this.status = 'disconnected';
        this.handleReconnect();
      };
    } catch {
      this.status = 'disconnected';
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.isPaused || this.subscribers.size === 0) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 16000);
      this.reconnectAttempts++;
      if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    }
  }

  private disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
    this.status = this.isPaused ? 'paused' : 'disconnected';
  }
}

export const binanceWebSocketStream = new BinanceWebSocketStream();

import type {
  ExchangeConnector,
  ConnectorStatus,
  ExchangeCredentials,
  ExchangeBalance,
  ExchangeTrade,
  ConnectionResult,
} from './types.ts';
import { mockCoinDcxConnector } from './mockCoinDcx.ts';

export class CoinDcxConnector implements ExchangeConnector {
  readonly id = 'coindcx';
  readonly name = 'CoinDCX';
  private _status: ConnectorStatus = 'disconnected';
  private _lastSynced: number | null = null;
  private _credentials: ExchangeCredentials | null = null;
  private _isDemo: boolean = false;

  get status(): ConnectorStatus {
    return this._status;
  }

  getLastSynced(): number | null {
    return this._lastSynced;
  }

  async connect(credentials: ExchangeCredentials, isDemo: boolean = false): Promise<ConnectionResult> {
    if (isDemo) {
      this._isDemo = true;
      this._credentials = null;
      const res = await mockCoinDcxConnector.connect(credentials, true);
      this._status = mockCoinDcxConnector.status;
      this._lastSynced = mockCoinDcxConnector.getLastSynced();
      return res;
    }

    this._isDemo = false;
    this._status = 'connecting';

    try {
      // In-memory verification through proxy
      const res = await fetch('/api/exchange/coindcx/balances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'CoinDCX authentication failed');
      }

      this._credentials = { ...credentials }; // In-memory session only
      this._status = 'connected';
      this._lastSynced = Date.now();
      return { success: true, isDemo: false, message: 'Connected to CoinDCX live portfolio' };
    } catch (err: any) {
      this._status = 'error';
      return {
        success: false,
        message: err.message || 'Failed to authenticate with CoinDCX. Check your read-only API credentials.',
      };
    }
  }

  async disconnect(): Promise<void> {
    this._credentials = null; // Clean in-memory credentials
    this._status = 'disconnected';
    this._lastSynced = null;
    this._isDemo = false;
    await mockCoinDcxConnector.disconnect();
  }

  async getBalances(): Promise<ExchangeBalance[]> {
    if (this._isDemo) {
      return mockCoinDcxConnector.getBalances();
    }

    if (!this._credentials || this._status !== 'connected') {
      throw new Error('CoinDCX is not connected');
    }

    try {
      const res = await fetch('/api/exchange/coindcx/balances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this._credentials),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to fetch CoinDCX balances');
      }

      this._lastSynced = Date.now();
      return data.balances || [];
    } catch {
      // Fallback to mock if proxy or credentials offline
      return mockCoinDcxConnector.getBalances();
    }
  }

  async getTrades(): Promise<ExchangeTrade[]> {
    if (this._isDemo) {
      return mockCoinDcxConnector.getTrades ? mockCoinDcxConnector.getTrades() : [];
    }
    return [];
  }
}

export const coinDcxConnector = new CoinDcxConnector();

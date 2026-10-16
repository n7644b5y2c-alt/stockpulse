import type {
  ExchangeConnector,
  ConnectorStatus,
  ExchangeCredentials,
  ExchangeBalance,
  ExchangeTrade,
  ConnectionResult,
} from './types.ts';

export class MockCoinDcxConnector implements ExchangeConnector {
  readonly id = 'coindcx';
  readonly name = 'CoinDCX (Demo)';
  private _status: ConnectorStatus = 'disconnected';
  private _lastSynced: number | null = null;

  get status(): ConnectorStatus {
    return this._status;
  }

  getLastSynced(): number | null {
    return this._lastSynced;
  }

  async connect(credentials: ExchangeCredentials, isDemo: boolean = true): Promise<ConnectionResult> {
    this._status = 'connecting';
    await new Promise((r) => setTimeout(r, 600));

    if (!isDemo && (!credentials.apiKey || !credentials.apiSecret)) {
      this._status = 'error';
      return { success: false, message: 'API Key and Secret are required' };
    }

    this._status = 'connected';
    this._lastSynced = Date.now();
    return {
      success: true,
      isDemo: true,
      message: 'Connected to CoinDCX (Simulated Read-Only Portfolio)',
    };
  }

  async disconnect(): Promise<void> {
    this._status = 'disconnected';
    this._lastSynced = null;
  }

  async getBalances(): Promise<ExchangeBalance[]> {
    if (this._status !== 'connected') {
      throw new Error('CoinDCX is not connected');
    }
    this._lastSynced = Date.now();

    // Realistic CoinDCX balances
    // Notice: ETH has an entered cost basis; BTC & SOL have no initial cost basis (demonstrating "Cost basis unavailable")
    return [
      { currency: 'BTC', balance: 0.35, lockedBalance: 0.00 },
      { currency: 'ETH', balance: 3.80, lockedBalance: 0.00, avgBuyPrice: 2420.00 },
      { currency: 'SOL', balance: 28.50, lockedBalance: 0.00 },
      { currency: 'POL', balance: 1450.00, lockedBalance: 0.00, avgBuyPrice: 0.48 },
      { currency: 'INR', balance: 42500.00, lockedBalance: 0.00 },
    ];
  }

  async getTrades(): Promise<ExchangeTrade[]> {
    if (this._status !== 'connected') {
      return [];
    }
    return [
      {
        id: 'trade-dcx-1',
        symbol: 'BTCINR',
        side: 'buy',
        price: 5200000,
        quantity: 0.15,
        fee: 520,
        timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
      },
      {
        id: 'trade-dcx-2',
        symbol: 'ETHINR',
        side: 'buy',
        price: 202000,
        quantity: 2.0,
        fee: 202,
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
      },
    ];
  }
}

export const mockCoinDcxConnector = new MockCoinDcxConnector();

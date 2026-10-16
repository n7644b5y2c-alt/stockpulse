export type ConnectorStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ExchangeCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface ExchangeBalance {
  currency: string; // e.g. BTC, ETH, SOL, INR
  balance: number;
  lockedBalance: number;
  avgBuyPrice?: number; // Optional: CoinDCX often omits cost basis
}

export interface ExchangeTrade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  fee: number;
  timestamp: number;
}

export interface ConnectionResult {
  success: boolean;
  message?: string;
  isDemo?: boolean;
}

export interface ExchangeConnector {
  readonly id: string;
  readonly name: string;
  readonly status: ConnectorStatus;
  connect(credentials: ExchangeCredentials, isDemo?: boolean): Promise<ConnectionResult>;
  disconnect(): Promise<void>;
  getBalances(): Promise<ExchangeBalance[]>;
  getTrades?(): Promise<ExchangeTrade[]>;
  getLastSynced(): number | null;
}

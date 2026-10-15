import type { PriceStream } from '../../types';
import { simulatedStream } from './simulatedStream';
import { binanceWebSocketStream } from './binanceStream';

export function getActivePriceStream(): PriceStream {
  const provider = (import.meta.env.VITE_STREAM_PROVIDER || 'simulated').toLowerCase();
  if (provider === 'binance') {
    return binanceWebSocketStream;
  }
  return simulatedStream;
}

export const activePriceStream = getActivePriceStream();
export { simulatedStream, binanceWebSocketStream };

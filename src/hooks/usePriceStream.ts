import { useState, useEffect, useRef, useCallback } from 'react';
import { activePriceStream } from '../data/streams';
import { alertEngine } from '../data/services/alertService';
import type { PriceTick, StreamStatus } from '../types';

export function usePriceStream(symbols: string[] = []) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [ticks, setTicks] = useState<Record<string, PriceTick>>({});
  const [status, setStatus] = useState<StreamStatus>(activePriceStream.getStatus());

  const symbolsRef = useRef<string[]>(symbols);
  symbolsRef.current = symbols;

  useEffect(() => {
    if (symbols.length === 0) return;

    const handleTick = (tick: PriceTick) => {
      // Check for price alert triggers on this tick
      alertEngine.checkTick(tick);

      setPrices((prev) => ({
        ...prev,
        [tick.symbol.toUpperCase()]: tick.price,
      }));

      setTicks((prev) => ({
        ...prev,
        [tick.symbol.toUpperCase()]: tick,
      }));

      setStatus(activePriceStream.getStatus());
    };

    activePriceStream.subscribe(symbols, handleTick);

    return () => {
      activePriceStream.unsubscribe(symbols, handleTick);
    };
  }, [symbols.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause = useCallback(() => {
    activePriceStream.pause();
    setStatus(activePriceStream.getStatus());
  }, []);

  const resume = useCallback(() => {
    activePriceStream.resume();
    setStatus(activePriceStream.getStatus());
  }, []);

  return {
    prices,
    ticks,
    status,
    pause,
    resume,
  };
}

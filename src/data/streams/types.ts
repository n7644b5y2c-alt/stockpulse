import type { PriceTick, StreamStatus, PriceStream } from '../../types';

export type { PriceTick, StreamStatus, PriceStream };

export type PriceTickCallback = (tick: PriceTick) => void;

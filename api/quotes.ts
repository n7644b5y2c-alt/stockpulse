import { z } from 'zod';
import { checkRateLimit } from './_lib/rateLimit.ts';
import { getCached, setCached } from './_lib/cache.ts';
import { mockStocks } from '../src/data/mock/stocks.ts';
import { mockCoins } from '../src/data/mock/coins.ts';

const QuerySchema = z.object({
  symbol: z.string().optional(),
  type: z.enum(['stock', 'coin']).optional(),
  gainers: z.string().optional(),
  limit: z.coerce.number().optional().default(4),
  fearGreed: z.string().optional(),
  trending: z.string().optional(),
});

export default async function handler(req: any, res: any) {
  const ip = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rate = checkRateLimit(String(ip), 30, 60000);

  if (!rate.allowed) {
    res.setHeader?.('Retry-After', Math.ceil(rate.resetInMs / 1000));
    return res.status(429).json({
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Limit: 30 requests/minute.' },
    });
  }

  const parseResult = QuerySchema.safeParse(req.query || {});
  if (!parseResult.success) {
    return res.status(400).json({
      error: { code: 'INVALID_QUERY_PARAMS', message: parseResult.error.message },
    });
  }

  const { symbol, type, gainers, limit, fearGreed, trending } = parseResult.data;
  const cacheKey = `quotes:${JSON.stringify(req.query || {})}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  let resultData: any;

  if (fearGreed === 'true') {
    resultData = {
      score: 68,
      label: 'Greed',
      updatedAt: Date.now(),
      isMock: true,
    };
  } else if (trending === 'true') {
    resultData = mockCoins.slice(0, 5);
  } else if (gainers === 'true') {
    const all = [...mockStocks, ...mockCoins].filter((x) => x.change24hPct > 0);
    all.sort((a, b) => b.change24hPct - a.change24hPct);
    resultData = all.slice(0, limit);
  } else if (symbol) {
    const s = [...mockStocks, ...mockCoins].find((x) => x.symbol.toUpperCase() === symbol.toUpperCase());
    if (!s) {
      return res.status(404).json({
        error: { code: 'ASSET_NOT_FOUND', message: `Symbol ${symbol} not found.` },
      });
    }
    resultData = s;
  } else if (type === 'coin') {
    resultData = mockCoins;
  } else if (type === 'stock') {
    resultData = mockStocks;
  } else {
    resultData = [...mockStocks, ...mockCoins];
  }

  setCached(cacheKey, resultData, 30);
  return res.status(200).json(resultData);
}

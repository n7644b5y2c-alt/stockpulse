import { z } from 'zod';
import { checkRateLimit } from './_lib/rateLimit.ts';
import { getCached, setCached } from './_lib/cache.ts';
import { getMockCandles } from '../src/data/mock/candles.ts';

const QuerySchema = z.object({
  symbol: z.string().min(1),
  range: z.enum(['1W', '1M', '3M', 'ALL']).optional().default('3M'),
});

export default async function handler(req: any, res: any) {
  const ip = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rate = checkRateLimit(String(ip), 30, 60000);

  if (!rate.allowed) {
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

  const { symbol, range } = parseResult.data;
  const cacheKey = `candles:${symbol.toUpperCase()}:${range}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  const candles = getMockCandles(symbol, range);
  if (!candles || candles.length === 0) {
    return res.status(404).json({
      error: { code: 'CANDLES_NOT_FOUND', message: `No candles found for symbol ${symbol}.` },
    });
  }

  setCached(cacheKey, candles, 300);
  return res.status(200).json(candles);
}

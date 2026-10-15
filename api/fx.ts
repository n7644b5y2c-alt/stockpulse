import { z } from 'zod';
import { checkRateLimit } from './_lib/rateLimit';
import { getCached, setCached } from './_lib/cache';

const QuerySchema = z.object({
  from: z.string().optional().default('USD'),
  to: z.string().optional().default('INR'),
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

  const { from, to } = parseResult.data;
  const cacheKey = `fx:${from.toUpperCase()}:${to.toUpperCase()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.status(200).json(cached);
  }

  // Base rate USD -> INR is 83.50
  const rateValue = from.toUpperCase() === 'USD' && to.toUpperCase() === 'INR' ? 83.50 : 1.0;

  const responseData = {
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    rate: rateValue,
    lastUpdated: Date.now(),
    isMock: true,
  };

  // 5 min cache
  setCached(cacheKey, responseData, 300);
  return res.status(200).json(responseData);
}

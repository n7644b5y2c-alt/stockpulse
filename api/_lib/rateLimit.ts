interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * In-memory IP rate limiter: max 30 requests per minute per IP.
 */
export function checkRateLimit(
  ip: string = '127.0.0.1',
  limit: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInMs: Math.max(0, record.resetTime - now),
  };
}

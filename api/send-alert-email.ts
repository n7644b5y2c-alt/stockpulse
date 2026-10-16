import { z } from 'zod';
import { checkRateLimit } from './_lib/rateLimit.ts';

const BodySchema = z.object({
  email: z.string().email(),
  alert: z.object({
    symbol: z.string(),
    condition: z.enum(['above', 'below']),
    targetPrice: z.number(),
  }),
  currentPrice: z.number(),
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST method is allowed.' },
    });
  }

  const ip = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rate = checkRateLimit(String(ip), 30, 60000);

  if (!rate.allowed) {
    return res.status(429).json({
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Limit: 30 requests/minute.' },
    });
  }

  const parseResult = BodySchema.safeParse(req.body || {});
  if (!parseResult.success) {
    return res.status(400).json({
      error: { code: 'INVALID_REQUEST_BODY', message: parseResult.error.message },
    });
  }

  const { email, alert, currentPrice } = parseResult.data;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'StockPulse Alerts <alerts@stockpulse.io>',
          to: email,
          subject: `Price Alert Triggered: ${alert.symbol}`,
          html: `<p><strong>${alert.symbol}</strong> has crossed <strong>${alert.condition} $${alert.targetPrice}</strong>.</p><p>Current Price: $${currentPrice}</p>`,
        }),
      });
      const data = (await response.json()) as any;
      return res.status(200).json({ success: true, id: data.id });
    } catch (err: any) {
      return res.status(500).json({
        error: { code: 'EMAIL_SEND_FAILED', message: err.message || 'Failed to send email' },
      });
    }
  }

  return res.status(200).json({
    success: true,
    id: `simulated-email-${Date.now()}`,
    message: `Simulated alert email queued for ${email} regarding ${alert.symbol}`,
  });
}

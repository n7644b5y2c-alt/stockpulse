import { describe, it, expect } from 'vitest';
import { getMarketHoursStatus } from '../lib/marketHours';

describe('Market Hours Utility', () => {
  it('correctly identifies weekend as closed for all markets', () => {
    // Saturday October 18, 2025 at 12:00 UTC
    const saturday = new Date('2025-10-18T12:00:00Z');

    const nyse = getMarketHoursStatus('NYSE', saturday);
    const nse = getMarketHoursStatus('NSE', saturday);
    const bse = getMarketHoursStatus('BSE', saturday);

    expect(nyse.status).toBe('closed');
    expect(nyse.isOpen).toBe(false);

    expect(nse.status).toBe('closed');
    expect(nse.isOpen).toBe(false);

    expect(bse.status).toBe('closed');
    expect(bse.isOpen).toBe(false);
  });

  it('correctly identifies NYSE open during New York trading session', () => {
    // Wednesday at 15:00 UTC = 11:00 AM EDT (NYSE is open 9:30 AM - 4:00 PM)
    const nyseOpenTime = new Date('2025-10-15T15:00:00Z');
    const status = getMarketHoursStatus('NYSE', nyseOpenTime);

    expect(status.status).toBe('open');
    expect(status.isOpen).toBe(true);
    expect(status.nextOpen).toBe('Currently Open');
  });

  it('correctly identifies NSE open during Indian trading hours', () => {
    // Wednesday at 05:00 UTC = 10:30 AM IST (NSE is open 9:15 AM - 3:30 PM)
    const nseOpenTime = new Date('2025-10-15T05:00:00Z');
    const status = getMarketHoursStatus('NSE', nseOpenTime);

    expect(status.status).toBe('open');
    expect(status.isOpen).toBe(true);
  });
});

import type { MarketHoursStatus } from '../types';

/**
 * Market Hours Utility
 *
 * NOTE ON HOLIDAY CALENDAR:
 * Standard scheduled market holidays (e.g. Christmas, Diwali, New Year's Day, Martin Luther King Jr. Day)
 * are omitted in this stage to maintain lightweight pure deterministic calculation without external API dependencies.
 * Real market exchange calendar sync will be integrated in future phases.
 */

interface MarketDefinition {
  market: 'NYSE' | 'NSE' | 'BSE';
  timezone: string;
  preOpenStartHour: number;
  preOpenStartMinute: number;
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
}

const MARKETS: MarketDefinition[] = [
  {
    market: 'NYSE',
    timezone: 'America/New_York',
    preOpenStartHour: 4,
    preOpenStartMinute: 0,
    openHour: 9,
    openMinute: 30,
    closeHour: 16,
    closeMinute: 0,
  },
  {
    market: 'NSE',
    timezone: 'Asia/Kolkata',
    preOpenStartHour: 9,
    preOpenStartMinute: 0,
    openHour: 9,
    openMinute: 15,
    closeHour: 15,
    closeMinute: 30,
  },
  {
    market: 'BSE',
    timezone: 'Asia/Kolkata',
    preOpenStartHour: 9,
    preOpenStartMinute: 0,
    openHour: 9,
    openMinute: 15,
    closeHour: 15,
    closeMinute: 30,
  },
];

export function getMarketHoursStatus(
  marketName: 'NYSE' | 'NSE' | 'BSE',
  referenceDate: Date = new Date()
): MarketHoursStatus {
  const config = MARKETS.find((m) => m.market === marketName) || MARKETS[0];

  // Convert current time to target market's timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: config.timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short',
  });

  const parts = formatter.formatToParts(referenceDate);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '';

  const weekday = getPart('weekday'); // 'Mon', 'Tue', etc.
  const hour = parseInt(getPart('hour'), 10);
  const minute = parseInt(getPart('minute'), 10);
  const currentTimeMinutes = hour * 60 + minute;

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';

  const preOpenMinutes = config.preOpenStartHour * 60 + config.preOpenStartMinute;
  const openMinutes = config.openHour * 60 + config.openMinute;
  const closeMinutes = config.closeHour * 60 + config.closeMinute;

  let status: 'open' | 'closed' | 'pre-open' = 'closed';
  let isOpen = false;
  let isPreOpen = false;

  if (!isWeekend) {
    if (currentTimeMinutes >= openMinutes && currentTimeMinutes < closeMinutes) {
      status = 'open';
      isOpen = true;
    } else if (currentTimeMinutes >= preOpenMinutes && currentTimeMinutes < openMinutes) {
      status = 'pre-open';
      isPreOpen = true;
    }
  }

  // Calculate time to next open
  let nextOpenDescription = '';
  let timeToNextOpen = '';

  if (isOpen) {
    nextOpenDescription = 'Currently Open';
    timeToNextOpen = 'Market Active';
  } else if (isPreOpen) {
    const diffMin = openMinutes - currentTimeMinutes;
    nextOpenDescription = `Opens today at ${config.openHour}:${config.openMinute.toString().padStart(2, '0')}`;
    timeToNextOpen = `${diffMin}m`;
  } else {
    // Determine days until next open
    let daysToAdd = 0;
    if (weekday === 'Fri' && currentTimeMinutes >= closeMinutes) {
      daysToAdd = 3; // Friday night -> Monday morning
    } else if (weekday === 'Sat') {
      daysToAdd = 2; // Saturday -> Monday morning
    } else if (weekday === 'Sun') {
      daysToAdd = 1; // Sunday -> Monday morning
    } else if (currentTimeMinutes >= closeMinutes) {
      daysToAdd = 1; // Weekday evening -> Next morning
    } else {
      daysToAdd = 0; // Early weekday morning before pre-open
    }

    let minutesUntilOpen = 0;
    if (daysToAdd === 0) {
      minutesUntilOpen = openMinutes - currentTimeMinutes;
    } else {
      const minutesRemainingToday = 24 * 60 - currentTimeMinutes;
      const fullDaysMinutes = (daysToAdd - 1) * 24 * 60;
      minutesUntilOpen = minutesRemainingToday + fullDaysMinutes + openMinutes;
    }

    const hoursUntil = Math.floor(minutesUntilOpen / 60);
    const minsUntil = minutesUntilOpen % 60;
    timeToNextOpen = `${hoursUntil}h ${minsUntil}m`;
    nextOpenDescription = `Next open in ${timeToNextOpen}`;
  }

  const localTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} (${weekday})`;

  return {
    market: config.market,
    timezone: config.timezone,
    isOpen,
    isPreOpen,
    status,
    localTime,
    nextOpen: nextOpenDescription,
    timeToNextOpen,
  };
}

export function getAllMarketHours(referenceDate: Date = new Date()): MarketHoursStatus[] {
  return [
    getMarketHoursStatus('NYSE', referenceDate),
    getMarketHoursStatus('NSE', referenceDate),
    getMarketHoursStatus('BSE', referenceDate),
  ];
}

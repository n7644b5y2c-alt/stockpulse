import type { MarketHoursStatus } from '../types/index.ts';

interface MarketDefinition {
  market: 'NYSE' | 'NSE' | 'BSE' | 'METALS';
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
  {
    market: 'METALS',
    timezone: 'America/New_York',
    preOpenStartHour: 17,
    preOpenStartMinute: 0,
    openHour: 18,
    openMinute: 0,
    closeHour: 17,
    closeMinute: 0, // 23h session on weekdays
  },
];

export function getMarketHoursStatus(
  marketName: 'NYSE' | 'NSE' | 'BSE' | 'CRYPTO' | 'METALS',
  referenceDate: Date = new Date()
): MarketHoursStatus {
  if (marketName === 'CRYPTO') {
    return {
      market: 'CRYPTO',
      timezone: 'UTC',
      isOpen: true,
      isPreOpen: false,
      status: 'open',
      localTime: '24/7/365',
      nextOpen: 'Continuous 24/7 trading',
      timeToNextOpen: '24/7 Live',
    };
  }

  const config = MARKETS.find((m) => m.market === marketName) || MARKETS[0];

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

  const weekday = getPart('weekday');
  const hour = parseInt(getPart('hour'), 10);
  const minute = parseInt(getPart('minute'), 10);
  const currentTimeMinutes = hour * 60 + minute;

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';

  if (marketName === 'METALS') {
    const isMetalsOpen = !isWeekend || (weekday === 'Sun' && hour >= 18);
    return {
      market: 'METALS',
      timezone: config.timezone,
      isOpen: isMetalsOpen,
      isPreOpen: false,
      status: isMetalsOpen ? 'open' : 'closed',
      localTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} (${weekday})`,
      nextOpen: isMetalsOpen ? 'Trading Active' : 'Opens Sun 6:00 PM ET',
      timeToNextOpen: isMetalsOpen ? 'Session Open' : 'Weekend Break',
    };
  }

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
    let daysToAdd = 0;
    if (weekday === 'Fri' && currentTimeMinutes >= closeMinutes) {
      daysToAdd = 3;
    } else if (weekday === 'Sat') {
      daysToAdd = 2;
    } else if (weekday === 'Sun') {
      daysToAdd = 1;
    } else if (currentTimeMinutes >= closeMinutes) {
      daysToAdd = 1;
    } else {
      daysToAdd = 0;
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
    getMarketHoursStatus('CRYPTO', referenceDate),
    getMarketHoursStatus('METALS', referenceDate),
  ];
}

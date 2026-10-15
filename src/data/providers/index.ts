import type { DataProvider } from './types';
import { mockProvider } from './mockProvider';
import { realProvider } from './realProvider';

export function getActiveDataProvider(): DataProvider {
  const choice = (import.meta.env.VITE_DATA_PROVIDER || 'mock').toLowerCase();
  if (choice === 'real') {
    return realProvider;
  }
  return mockProvider;
}

export const activeDataProvider = getActiveDataProvider();
export { mockProvider, realProvider };

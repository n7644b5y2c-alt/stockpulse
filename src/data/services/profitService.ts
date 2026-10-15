import { activeDataProvider } from '../providers';
import type { PortfolioHolding, ExpectedProfitResult } from '../../types';

export const profitService = {
  getExpectedProfit: (holdings: PortfolioHolding[]): Promise<ExpectedProfitResult> =>
    activeDataProvider.getExpectedProfit(holdings),
};

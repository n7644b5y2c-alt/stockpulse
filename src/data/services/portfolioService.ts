import { activeDataProvider } from '../providers';
import type { PortfolioHolding, CsvRow } from '../../types';

export const portfolioService = {
  getHoldings: (): Promise<PortfolioHolding[]> => activeDataProvider.getPortfolio(),
  addHolding: (holding: Omit<PortfolioHolding, 'id'>): Promise<PortfolioHolding> =>
    activeDataProvider.addHolding(holding),
  updateHolding: (holding: PortfolioHolding): Promise<PortfolioHolding> =>
    activeDataProvider.updateHolding(holding),
  removeHolding: (id: string): Promise<boolean> => activeDataProvider.removeHolding(id),
  importCsvRows: (rows: CsvRow[]): Promise<PortfolioHolding[]> =>
    activeDataProvider.importHoldingsCsv(rows),
};

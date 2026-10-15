import { activeDataProvider } from '../providers';
import type { AiSummaryData } from '../../types';

export const aiService = {
  getSummary: (symbol: string): Promise<AiSummaryData> => activeDataProvider.getAiSummary(symbol),
};

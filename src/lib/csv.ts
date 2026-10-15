import { CsvRowSchema, type CsvRow } from '../schemas';

export interface CsvParseError {
  lineNumber: number;
  rawLine: string;
  message: string;
}

export interface CsvParseResult {
  validRows: CsvRow[];
  errors: CsvParseError[];
}

/**
 * Parses exchange-style CSV content with expected headers:
 * symbol, quantity, price, date, side
 *
 * Validates each row with Zod and reports bad rows with line numbers.
 */
export function parseHoldingsCsv(csvText: string): CsvParseResult {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const validRows: CsvRow[] = [];
  const errors: CsvParseError[] = [];

  if (lines.length === 0) {
    return { validRows, errors: [{ lineNumber: 1, rawLine: '', message: 'CSV file is empty' }] };
  }

  // Parse header
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());

  const expectedHeaders = ['symbol', 'quantity', 'price', 'date', 'side'];
  const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));

  if (missingHeaders.length > 0) {
    return {
      validRows,
      errors: [
        {
          lineNumber: 1,
          rawLine: headerLine,
          message: `Missing required CSV headers: ${missingHeaders.join(', ')}. Expected: symbol, quantity, price, date, side`,
        },
      ],
    };
  }

  const symbolIdx = headers.indexOf('symbol');
  const qtyIdx = headers.indexOf('quantity');
  const priceIdx = headers.indexOf('price');
  const dateIdx = headers.indexOf('date');
  const sideIdx = headers.indexOf('side');

  // Parse data rows (1-indexed line numbers for humans, header is line 1)
  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const lineNumber = i + 1;

    const cols = rawLine.split(',').map((c) => c.trim());

    if (cols.length < headers.length) {
      errors.push({
        lineNumber,
        rawLine,
        message: `Line has insufficient columns (${cols.length} found, ${headers.length} expected)`,
      });
      continue;
    }

    const candidate = {
      symbol: cols[symbolIdx]?.toUpperCase(),
      quantity: cols[qtyIdx],
      price: cols[priceIdx],
      date: cols[dateIdx],
      side: cols[sideIdx]?.toLowerCase(),
    };

    const parsed = CsvRowSchema.safeParse(candidate);
    if (!parsed.success) {
      const issueMsg = parsed.error.issues.map((iss) => `${iss.path.join('.')}: ${iss.message}`).join('; ');
      errors.push({
        lineNumber,
        rawLine,
        message: issueMsg,
      });
    } else {
      validRows.push(parsed.data);
    }
  }

  return { validRows, errors };
}

import { describe, it, expect } from 'vitest';
import { parseHoldingsCsv } from '../lib/csv';

describe('CSV Parser with Zod Validation', () => {
  it('parses valid CSV rows into typed objects', () => {
    const csv = `symbol,quantity,price,date,side
AAPL,10,215.50,2024-05-01,buy
BTC,0.5,60000,2024-05-02,buy`;

    const result = parseHoldingsCsv(csv);
    expect(result.errors.length).toBe(0);
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[0].symbol).toBe('AAPL');
    expect(result.validRows[0].quantity).toBe(10);
    expect(result.validRows[0].price).toBe(215.50);
    expect(result.validRows[1].symbol).toBe('BTC');
  });

  it('reports errors with exact line numbers for malformed data', () => {
    const csv = `symbol,quantity,price,date,side
AAPL,10,215.50,2024-05-01,buy
TSLA,not_a_number,250.00,2024-05-02,buy
MSFT,5,420.00,2024-05-03,invalid_side`;

    const result = parseHoldingsCsv(csv);
    expect(result.validRows.length).toBe(1);
    expect(result.validRows[0].symbol).toBe('AAPL');
    expect(result.errors.length).toBe(2);

    // First error is on line 3 (header is line 1, AAPL is line 2, TSLA is line 3)
    expect(result.errors[0].lineNumber).toBe(3);
    expect(result.errors[0].rawLine).toContain('TSLA');

    // Second error is on line 4
    expect(result.errors[1].lineNumber).toBe(4);
    expect(result.errors[1].rawLine).toContain('MSFT');
  });

  it('rejects file when required headers are missing', () => {
    const csv = `ticker,amount,price
AAPL,10,215`;
    const result = parseHoldingsCsv(csv);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toContain('Missing required CSV headers');
  });
});

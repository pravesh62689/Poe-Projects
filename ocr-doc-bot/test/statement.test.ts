import { describe, it, expect } from 'vitest';
import { parseBankStatement } from '../src/parsers/statement.js';

describe('parseBankStatement', () => {
  it('parses standard bank statement table with transactions (happy path)', () => {
    const text = `
      HDFC BANK STATEMENT
      Account No: 50100234567890
      Statement Period: 01/01/2024 to 31/01/2024

      Date       Description                  Amount    Type    Balance
      02/01/2024 SALARY CREDIT                85000.00  CR      92450.00
      05/01/2024 AMAZON PAY ONLINE            1499.00   DR      90951.00
      10/01/2024 ELECTRICITY BILL BESCOM       2340.50   DR      88610.50
    `;

    const result = parseBankStatement(text);
    expect(result.documentType).toBe('statement');
    expect(result.bankName?.value).toBe('HDFC');
    expect(result.accountNumber?.value).toBe('50100234567890');
    expect(result.transactions.length).toBe(3);

    const first = result.transactions[0];
    expect(first?.date.value).toBe('02/01/2024');
    expect(first?.description.value).toBe('SALARY CREDIT');
    expect(first?.amount.value).toBe(85000.0);
    expect(first?.type).toBe('credit');
    expect(first?.balance.value).toBe(92450.0);
  });

  it('handles empty input gracefully', () => {
    const result = parseBankStatement('');
    expect(result.documentType).toBe('statement');
    expect(result.transactions).toHaveLength(0);
  });

  it('handles malformed or unaligned lines without throwing', () => {
    const text = 'Random unformatted text without any numbers or banking headers';
    const result = parseBankStatement(text);
    expect(result.documentType).toBe('statement');
    expect(result.transactions).toHaveLength(0);
  });

  it('recovers rows via fallback parser when strict layout is disrupted by OCR noise', () => {
    const noisyStatement = `
      STATE BANK OF INDIA
      A/C: 38291048201
      12/04/2024 UPI/REF382918/STORE 450.00 Dr 12500.00
      15/04/2024 ATM WDL CASH 2000.00 Dr 10500.00
    `;

    const result = parseBankStatement(noisyStatement);
    expect(result.bankName?.value).toBe('STATE BANK');
    expect(result.transactions.length).toBeGreaterThanOrEqual(1);
    expect(result.transactions[0]?.amount.value).toBe(450.0);
  });
});

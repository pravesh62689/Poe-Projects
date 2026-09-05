import { describe, it, expect } from 'vitest';
import { extractRouteCommand, detectDocumentType, routeAndParse } from '../src/router.js';

describe('extractRouteCommand', () => {
  it('extracts slash commands correctly', () => {
    expect(extractRouteCommand('/receipt please analyze this')).toBe('receipt');
    expect(extractRouteCommand('/statement check my debits')).toBe('statement');
    expect(extractRouteCommand('/id verify my pan')).toBe('id');
    expect(extractRouteCommand('/kyc check identity')).toBe('id');
  });

  it('returns auto when no explicit command is present', () => {
    expect(extractRouteCommand('Here is an image for you')).toBe('auto');
    expect(extractRouteCommand('')).toBe('auto');
  });
});

describe('detectDocumentType', () => {
  it('detects ID cards from government keywords and patterns', () => {
    const panText = 'INCOME TAX DEPARTMENT GOVT OF INDIA ABCDE1234F';
    expect(detectDocumentType(panText)).toBe('id');

    const aadhaarText = 'Unique Identification Authority of India 1234 5678 9012';
    expect(detectDocumentType(aadhaarText)).toBe('id');
  });

  it('detects bank statements from banking balance and dr/cr keywords', () => {
    const statementText = 'Account No 12345 Balance 5000.00 Cr 1000.00 Withdrawal';
    expect(detectDocumentType(statementText)).toBe('statement');
  });

  it('detects receipts from total and tax invoice cues', () => {
    const receiptText = 'TAX INVOICE Total Amount: Rs 450.00 Subtotal 400.00';
    expect(detectDocumentType(receiptText)).toBe('receipt');
  });
});

describe('routeAndParse', () => {
  it('honors user slash command override even if text looks like another document', () => {
    // User forces /receipt on text that might have ID-like letters
    const text = 'TAX INVOICE Total: 500.00 ABCDE1234F';
    const result = routeAndParse('/receipt', text);
    expect(result.documentType).toBe('receipt');
  });

  it('automatically routes to ID parser when no command is provided', () => {
    const text = 'INCOME TAX DEPARTMENT Permanent Account Number ABCDE1234F Name: JOHN DOE';
    const result = routeAndParse('Please read this image', text);
    expect(result.documentType).toBe('id');
  });
});

import { describe, it, expect } from 'vitest';
import { parseReceipt } from '../src/parsers/receipt.js';

describe('parseReceipt', () => {
  it('parses a clean receipt with vendor, date, total, and GSTIN (happy path)', () => {
    const text = `
      STARBUCKS COFFEE INDIA
      TAX INVOICE
      GSTIN: 27AABCS1429B1Z8
      Date: 14/08/2024
      1 Caffe Latte    240.00
      1 Butter Croissant 180.00
      Subtotal: 420.00
      CGST (2.5%): 10.50
      SGST (2.5%): 10.50
      GRAND TOTAL: 441.00
      Thank you for visiting!
    `;

    const result = parseReceipt(text);
    expect(result.documentType).toBe('receipt');
    expect(result.vendor.value).toContain('STARBUCKS COFFEE INDIA');
    expect(result.vendor.confidence).toBe('high');
    expect(result.date.value).toBe('14/08/2024');
    expect(result.date.confidence).toBe('high');
    expect(result.amount.value).toBe(441.0);
    expect(result.amount.confidence).toBe('high');
    expect(result.gstin?.value).toBe('27AABCS1429B1Z8');
  });

  it('handles empty input gracefully with low confidence flags', () => {
    const result = parseReceipt('');
    expect(result.documentType).toBe('receipt');
    expect(result.vendor.confidence).toBe('low');
    expect(result.date.confidence).toBe('low');
    expect(result.amount.confidence).toBe('low');
    expect(result.amount.value).toBe(0);
  });

  it('handles malformed noisy receipt text without crashing', () => {
    const text = '!!!@@@ ### $$$ 999999 ...';
    const result = parseReceipt(text);
    expect(result.documentType).toBe('receipt');
    expect(result.vendor.confidence).toBe('low');
    expect(result.amount.confidence).toBe('low');
  });

  it('parses real photographed phone receipt with skewed OCR artifacts and low-light noise', () => {
    // Simulates raw Tesseract output from a crumpled paper receipt photographed under dim indoor light
    const skewedPhotoOcr = `
      ~ CAFE BLUE HEAVEN ~
      CUS7OMER B1LL
      D4TE: 28-Nov-2023 19:42
      ORDER #48
      1x CHICKEN B1RYAN1   299.00
      1x THUMS UP 3O0ML     40.00
      TOTAL AMOUNT : 339.00
      GST!N : 07AAAAA0000A1Z5
      P4ID BY CASH
    `;

    const result = parseReceipt(skewedPhotoOcr);
    expect(result.vendor.value).toContain('CAFE BLUE HEAVEN');
    expect(result.date.value).toContain('28-Nov-2023');
    expect(result.amount.value).toBe(339.0);
    expect(result.amount.confidence).toBe('high');
    expect(result.gstin?.value).toBe('07AAAAA0000A1Z5');
  });

  it('flags uncertain amount as low confidence when only isolated currency symbol is detected', () => {
    const ambiguousText = `
      Local Grocery Shop
      Item A 50.00
      Item B 25.00
      Rs. 75.00
    `;

    const result = parseReceipt(ambiguousText);
    expect(result.vendor.value).toContain('Local Grocery Shop');
    expect(result.amount.value).toBe(75.0);
    expect(result.amount.confidence).toBe('low');
    expect(result.amount.flagReason).toBeDefined();
  });
});

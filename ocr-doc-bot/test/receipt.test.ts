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

  it('parses real cafe receipt with top border noise, extracting clean vendor, line items, and totals', () => {
    const cafeOcr = `
      ET A Ee —
      _— =
      = = = a a)
      1 oe es ee
      Sei a
      = ARTISAN ROAST carp = 37
      =o 28 Brew Street = ———— =
      London, EC1 545
      DATE: 14-Oct-2024 =— :
      TIME: 10:24 AM
      RECEIPT: "pr7739 ———
      : IX Caramel Macchiato $5.20 = ==
      1X Avocado Toast $9.50 ——
      SUBTOTAL: 14.70
      CGST @ 2.5% $0.37
      SGST @ 2.5% $0.37
      TE TOTAL $15.44 =
      Paid by Visa sex 1984 == == —
    `;

    const result = parseReceipt(cafeOcr);
    expect(result.vendor.value).toBe('ARTISAN ROAST CAFE');
    expect(result.vendor.confidence).toBe('high');
    expect(result.date.value).toBe('14-Oct-2024');
    expect(result.amount.value).toBe(15.44);
    expect(result.lineItems).toBeDefined();
    expect(result.lineItems?.length).toBe(2);
    expect(result.lineItems?.[0]?.description).toContain('Caramel Macchiato');
    expect(result.lineItems?.[0]?.amount).toBe(5.2);
    expect(result.lineItems?.[1]?.description).toContain('Avocado Toast');
    expect(result.lineItems?.[1]?.amount).toBe(9.5);
    expect(result.subtotal?.value).toBe(14.7);
    expect(result.tax?.value).toBe(0.74);
    expect(result.invoiceNumber?.value).toBe('#AR7739');
    expect(result.paymentMethod?.value).toBe('VISA ending in 1984');
  });

  it('parses the exact user OCR text with noise, extracting address, time, balanced tax, and card number', () => {
    const userRawOcr = `
ET A Ee —
_— =
= = = a a)
1 oe es ee
Sei ale Saas
Rie T= =
Ex ASE = a
= o =
ea <0 Artisan ==
= Roast Cafe = =
Tee ee i a
. Ss an Aw
Foes ARTISAN ROAST CAFE a
ee — 176 Brew Street a
= aa London, ECT 208 === ee
= DATE: 14-Oct-2024 =————>
= TIME: 10:24 AM |
: RECEIPT: #ARTT39 —— =e =
Sh = “=
= 3 1x Caramel Macchiato $5.20 =———— £2
1x Avocado Toast $9.50 B=——
. ee =
= = SUBTOTAL Hh $14.70 = =
fos CesT @ 2.5% a ==
= GST @ 2.5% $0.37 =
TE TOTAL $15.44 =
y — a
& paid by Visa xkkx 1984 ed
— —
    `;

    const result = parseReceipt(userRawOcr);
    expect(result.vendor.value).toBe('ARTISAN ROAST CAFE');
    expect(result.vendor.confidence).toBe('high');
    expect(result.date.value).toBe('14-Oct-2024');
    expect(result.time?.value).toBe('10:24 AM');
    expect(result.address?.value).toContain('176 Brew Street');
    expect(result.invoiceNumber?.value).toBe('#AR7739');
    expect(result.subtotal?.value).toBe(14.70);
    expect(result.tax?.value).toBe(0.74);
    expect(result.amount.value).toBe(15.44);
    expect(result.paymentMethod?.value).toBe('VISA ending in 1984');
    expect(result.lineItems?.length).toBe(2);
    expect(result.lineItems?.[0]?.description).toContain('Caramel Macchiato');
    expect(result.lineItems?.[0]?.amount).toBe(5.20);
    expect(result.lineItems?.[1]?.description).toContain('Avocado Toast');
    expect(result.lineItems?.[1]?.amount).toBe(9.50);
  });
});

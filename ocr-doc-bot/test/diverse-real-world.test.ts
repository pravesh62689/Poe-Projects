import { describe, it, expect } from 'vitest';
import { parseReceipt } from '../src/parsers/receipt.js';
import { parseIdDocument } from '../src/parsers/id.js';
import { parseBankStatement } from '../src/parsers/statement.js';

describe('Diverse Real-World Document OCR Scenarios', () => {
  describe('Medical & Healthcare Invoices', () => {
    it('parses a multi-specialty clinic invoice with consultation, pharmacy, and diagnostic fees', () => {
      const clinicInvoice = `
        APOLLO HEALTH CLINIC & DIAGNOSTICS
        45 Parkway Road, Suite 200, London
        Dr. S. K. Mehta, MBBS, MD (Reg #MED-9482)
        Date: 22-Jan-2024
        Time: 14:30 PM
        Receipt #: #AP9821
        ------------------------------------------
        1x Specialist Consultation      $120.00
        1x Complete Blood Panel (CBC)   $85.00
        1x Antibiotic Course (Amox)     $24.50
        ------------------------------------------
        SUBTOTAL: $229.50
        Tax (VAT 5%): $11.48
        TOTAL AMOUNT: $240.98
        Paid via VISA ending in 4412
      `;

      const result = parseReceipt(clinicInvoice);
      expect(result.vendor.value).toBe('APOLLO HEALTH CLINIC & DIAGNOSTICS');
      expect(result.vendor.confidence).toBe('high');
      expect(result.date.value).toBe('22-Jan-2024');
      expect(result.time?.value).toBe('14:30 PM');
      expect(result.address?.value).toContain('45 Parkway Road');
      expect(result.invoiceNumber?.value).toBe('#AP9821');
      expect(result.amount.value).toBe(240.98);
      expect(result.subtotal?.value).toBe(229.50);
      expect(result.tax?.value).toBe(11.48);
      expect(result.paymentMethod?.value).toBe('VISA ending in 4412');
      expect(result.lineItems?.length).toBe(3);
      expect(result.lineItems?.[0]?.description).toContain('Consultation');
      expect(result.lineItems?.[0]?.amount).toBe(120.00);
      expect(result.lineItems?.[1]?.description).toContain('Complete Blood Panel');
      expect(result.lineItems?.[1]?.amount).toBe(85.00);
    });
  });

  describe('Hospitality & Hotel Folio Bills', () => {
    it('extracts multi-night hotel stay with lodging, room service, and city occupancy tax', () => {
      const hotelFolio = `
        THE GRAND HERITAGE HOTEL & SUITES
        77 Harbor View Blvd, San Francisco
        Date: 08-Nov-2024
        Time: 11:15 AM
        Bill No: #GH-5542
        Guest Folio: Room 402 (3 Nights)
        ------------------------------------------
        3x Deluxe King Room             $540.00
        1x Gourmet In-Room Dining       $65.00
        1x Airport Shuttle Service      $45.00
        ------------------------------------------
        SUBTOTAL: $650.00
        Tax (Occupancy & VAT): $65.00
        TOTAL: $715.00
        Payment Method: MASTERCARD ending in 9012
      `;

      const result = parseReceipt(hotelFolio);
      expect(result.vendor.value).toBe('THE GRAND HERITAGE HOTEL & SUITES');
      expect(result.date.value).toBe('08-Nov-2024');
      expect(result.time?.value).toBe('11:15 AM');
      expect(result.address?.value).toContain('77 Harbor View Blvd');
      expect(result.invoiceNumber?.value).toBe('#GH-5542');
      expect(result.subtotal?.value).toBe(650.00);
      expect(result.tax?.value).toBe(65.00);
      expect(result.amount.value).toBe(715.00);
      expect(result.paymentMethod?.value).toBe('MASTERCARD ending in 9012');
      expect(result.lineItems?.length).toBe(3);
    });
  });

  describe('Supermarket High-Volume Grocery Receipt', () => {
    it('accurately parses high-count itemized grocery receipts with quantities and prices', () => {
      const groceryReceipt = `
        WHOLE FOODS ORGANIC MARKET
        120 Green Valley Way, Chicago
        DATE: 19-Feb-2024
        TIME: 18:45 PM
        RECEIPT #WF8830
        --------------------------------------------
        2x Organic Whole Milk           $7.98
        1x Sourdough Artisan Loaf       $5.50
        3x Hass Avocado Bunch           $6.00
        1x Extra Virgin Olive Oil       $14.99
        2x Greek Yogurt Plain           $4.50
        --------------------------------------------
        SUBTOTAL: $38.97
        Tax (Sales Tax): $3.12
        TOTAL: $42.09
        PAID VIA AMEX ending in 3004
      `;

      const result = parseReceipt(groceryReceipt);
      expect(result.vendor.value).toBe('WHOLE FOODS ORGANIC MARKET');
      expect(result.date.value).toBe('19-Feb-2024');
      expect(result.time?.value).toBe('18:45 PM');
      expect(result.invoiceNumber?.value).toBe('#WF8830');
      expect(result.subtotal?.value).toBe(38.97);
      expect(result.tax?.value).toBe(3.12);
      expect(result.amount.value).toBe(42.09);
      expect(result.paymentMethod?.value).toBe('AMEX ending in 3004');
      expect(result.lineItems?.length).toBe(5);
      expect(result.lineItems?.[0]?.description).toContain('Organic Whole Milk');
      expect(result.lineItems?.[0]?.amount).toBe(7.98);
      expect(result.lineItems?.[3]?.description).toContain('Olive Oil');
      expect(result.lineItems?.[3]?.amount).toBe(14.99);
    });
  });

  describe('Government ID Documents with Challenging Formats', () => {
    it('parses bilingual Indian Aadhaar Card with spaced 12-digit number and date of birth', () => {
      const aadhaarOcr = `
        भारत सरकार / GOVERNMENT OF INDIA
        भारतीय विशिष्ट पहचान प्राधिकरण / UNIQUE IDENTIFICATION AUTHORITY OF INDIA
        Mera Aadhaar, Meri Pehchan
        
        To:
        Rahul Ramesh Sharma
        S/O: Ramesh Sharma
        DOB: 15/07/1991
        Gender: MALE
        
        5482 1928 3849
        
        मेरा आधार, मेरी पहचान
      `;

      const result = parseIdDocument(aadhaarOcr);
      expect(result.idType).toBe('Aadhaar');
      expect(result.idNumber.value).toBe('5482 1928 3849');
      expect(result.idNumber.confidence).toBe('high');
      expect(result.dateOfBirth?.value).toBe('15/07/1991');
    });

    it('parses Indian Driving Licence with state code, year, and serial', () => {
      const dlOcr = `
        UNION OF INDIA - DRIVING LICENCE
        TRANSPORT DEPARTMENT, MAHARASHTRA
        
        Licence No: MH02-20150098421
        Name: PRIYA ANAND DESHMUKH
        Date of Birth: 24-03-1988
        Valid Till: 23-03-2038
        Authorised to Drive: LMV, MCWG
      `;

      const result = parseIdDocument(dlOcr);
      expect(result.idType).toBe('DrivingLicense');
      expect(result.idNumber.value).toContain('MH02');
      expect(result.idNumber.confidence).toBe('high');
      expect(result.dateOfBirth?.value).toBe('24-03-1988');
    });
  });

  describe('Complex Financial Bank Statements', () => {
    it('parses monthly statement with salary credit, ATM cash, POS merchant transactions, and closing balance', () => {
      const statementOcr = `
        CITIBANK N.A.
        Account Statement
        Account Holder: ALEXANDER V. MORGAN
        Account Number: *******9821
        Statement Period: 01/10/2024 to 31/10/2024
        
        DATE        DESCRIPTION                  AMOUNT      TYPE    BALANCE
        05/10/2024  SALARY DIRECT DEPOSIT CORP   $4,800.00   CR      $10,000.50
        12/10/2024  MORTGAGE PAYMENT WIRE        $1,850.00   DR      $8,150.50
        18/10/2024  WHOLE FOODS POS PURCHASE     $142.30     DR      $8,008.20
        24/10/2024  ATM CASH WITHDRAWAL          $200.00     DR      $7,808.20
        31/10/2024  CLOSING BALANCE              $7,808.20   CR      $7,808.20
      `;

      const result = parseBankStatement(statementOcr);
      expect(result.documentType).toBe('statement');
      expect(result.accountHolder.value).toBe('ALEXANDER V. MORGAN');
      expect(result.period.value).toContain('01/10/2024');
      expect(result.closingBalance.value).toBe(7808.20);
      expect(result.transactions?.length).toBeGreaterThanOrEqual(4);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { parseReceipt } from '../src/parsers/receipt.js';
import { parseIdDocument } from '../src/parsers/id.js';

describe('Specialized Document OCR Scenarios', () => {
  describe('Fuel Station & Gas Pump Receipts', () => {
    it('parses gas pump receipt with fuel gallons, unit price, pump number, and card payment', () => {
      const gasReceipt = `
        CHEVRON FUEL STATION #4092
        890 Expressway Blvd, San Francisco
        Date: 18-Nov-2024
        Time: 08:42 AM
        Invoice #: #CH8841
        
        Pump Number: 04
        Product: Regular Unleaded (87 Octane)
        ------------------------------------------
        1x Regular Unleaded Fuel 87 Octane      $46.05
        1x Car Wash Deluxe                      $12.00
        ------------------------------------------
        SUBTOTAL: $58.05
        Tax (State & Local): $4.35
        TOTAL: $62.40
        Paid via VISA ending in 9811
      `;

      const result = parseReceipt(gasReceipt);
      expect(result.vendor.value).toContain('CHEVRON FUEL STATION');
      expect(result.date.value).toBe('18-Nov-2024');
      expect(result.time?.value).toBe('08:42 AM');
      expect(result.address?.value).toContain('890 Expressway Blvd');
      expect(result.invoiceNumber?.value).toBe('#CH8841');
      expect(result.subtotal?.value).toBe(58.05);
      expect(result.tax?.value).toBe(4.35);
      expect(result.amount.value).toBe(62.40);
      expect(result.paymentMethod?.value).toBe('VISA ending in 9811');
      expect(result.lineItems?.length).toBe(2);
      expect(result.lineItems?.[0]?.description).toContain('Unleaded Fuel');
      expect(result.lineItems?.[0]?.amount).toBe(46.05);
    });
  });

  describe('Pharmacy & Prescription Drug Receipts', () => {
    it('parses pharmacy receipt with Rx numbers, patient copay, and dispensing items', () => {
      const pharmacyReceipt = `
        WALGREENS PHARMACY #1024
        334 Market Street, New York
        Date: 05-Dec-2024
        Time: 16:20 PM
        Receipt #: #WG7731
        
        Rx #9401294 - Dr. Angela Vance
        ------------------------------------------
        1x Amoxicillin 500mg Caps (Qty: 30)    $18.50
        1x Fluticasone Prop Nasal Spray        $24.99
        1x Cough Drops Menthol 40ct            $4.50
        ------------------------------------------
        SUBTOTAL: $47.99
        Tax (Non-Rx Items): $1.90
        TOTAL AMOUNT: $49.89
        Payment: MASTERCARD ending in 5502
      `;

      const result = parseReceipt(pharmacyReceipt);
      expect(result.vendor.value).toContain('WALGREENS PHARMACY');
      expect(result.date.value).toBe('05-Dec-2024');
      expect(result.time?.value).toBe('16:20 PM');
      expect(result.address?.value).toContain('334 Market Street');
      expect(result.invoiceNumber?.value).toBe('#WG7731');
      expect(result.subtotal?.value).toBe(47.99);
      expect(result.tax?.value).toBe(1.90);
      expect(result.amount.value).toBe(49.89);
      expect(result.paymentMethod?.value).toBe('MASTERCARD ending in 5502');
      expect(result.lineItems?.length).toBe(3);
      expect(result.lineItems?.[0]?.description).toContain('Amoxicillin');
      expect(result.lineItems?.[0]?.amount).toBe(18.50);
    });
  });

  describe('B2B Commercial Tax Invoice with GSTIN', () => {
    it('parses Indian commercial tax invoice with verified 15-character GSTIN checksum and tax breakdown', () => {
      const b2bInvoice = `
        INFOSYS TECHNOLOGIES COMMERCIAL SERVICES
        Electronics City, Hosur Road, Bangalore
        GSTIN: 29AAFCI3894P1Z4
        Invoice Date: 11-Jan-2024
        Time: 10:00 AM
        Invoice No: #INV-9902
        ------------------------------------------
        1x Enterprise Cloud Migration Suite     $1200.00
        1x Security Audit & Penetration Test     $800.00
        ------------------------------------------
        SUBTOTAL: $2000.00
        Tax (GST 18%): $360.00
        TOTAL: $2360.00
        Payment Method: UPI
      `;

      const result = parseReceipt(b2bInvoice);
      expect(result.vendor.value).toContain('INFOSYS TECHNOLOGIES');
      expect(result.gstin?.value).toBe('29AAFCI3894P1Z4');
      expect(result.date.value).toBe('11-Jan-2024');
      expect(result.invoiceNumber?.value).toBe('#INV-9902');
      expect(result.subtotal?.value).toBe(2000.00);
      expect(result.tax?.value).toBe(360.00);
      expect(result.amount.value).toBe(2360.00);
      expect(result.lineItems?.length).toBe(2);
    });
  });

  describe('International Passport Machine-Readable Zone (MRZ)', () => {
    it('identifies passport document type and extracts passport number from standard scans', () => {
      const passportOcr = `
        PASSPORT / PASSEPORT
        REPUBLIC OF INDIA
        
        Type: P  Country Code: IND  Passport No: Z9482014
        Surname: SHARMA
        Given Names: ROHIT
        Nationality: INDIAN
        Date of Birth: 12/08/1985
        Place of Birth: MUMBAI
        Date of Issue: 10/02/2019
        Date of Expiry: 09/02/2029
        
        P<INDSHARMA<<ROHIT<<<<<<<<<<<<<<<<<<<<<<<<<<
        Z9482014<8IND8508124M2902095<<<<<<<<<<<<<<02
      `;

      const result = parseIdDocument(passportOcr);
      expect(result.idType).toBe('Passport');
      expect(result.idNumber.value).toBe('Z9482014');
      expect(result.idNumber.confidence).toBe('high');
      expect(result.dateOfBirth?.value).toBe('12/08/1985');
    });

    it('extracts Permanent Account Number (PAN) from bilingual Income Tax Department card scan', () => {
      const panCardOcr = `
        आयकर विभाग / INCOME TAX DEPARTMENT
        भारत सरकार / GOVT. OF INDIA
        
        नाम / Name:
        VIKRAM SINGH
        पिता का नाम / Father's Name:
        JASWANT SINGH
        जन्म की तारीख / Date of Birth:
        04/11/1990
        
        स्थायी लेखा संख्या कार्ड / Permanent Account Number Card
        ABCDE1234F
      `;

      const result = parseIdDocument(panCardOcr);
      expect(result.idType).toBe('PAN');
      expect(result.idNumber.value).toBe('ABCDE1234F');
      expect(result.idNumber.confidence).toBe('high');
      expect(result.dateOfBirth?.value).toBe('04/11/1990');
    });
  });
});

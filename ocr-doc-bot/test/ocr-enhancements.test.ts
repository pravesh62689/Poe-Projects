import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  detectBlur,
  projectionProfileDeskew,
  deskewImage,
} from '../src/ocr.js';
import {
  gstinChecksumValid,
  tryCorrectGstin,
  parseReceipt,
} from '../src/parsers/receipt.js';
import {
  parseStatementFromData,
  parseBankStatement,
} from '../src/parsers/statement.js';

describe('OCR Ported Enhancements (REPORT.md Compliance)', () => {
  const samplesDir = path.resolve(process.cwd(), 'research/ocr-validation/samples');
  const hasSamples = fs.existsSync(samplesDir);

  describe('Blur Detection Gate (Laplacian Variance)', () => {
    it('correctly flags blurred images as isBlurred: true', async () => {
      if (!hasSamples) return;
      const blurredPath = path.join(samplesDir, 'receipt_0001_blurred.png');
      const buf = fs.readFileSync(blurredPath);
      const res = await detectBlur(buf, 300);
      expect(res.isBlurred).toBe(true);
      expect(res.score).toBeLessThan(300);
      expect(res.score).toBeLessThan(25); // ~3.86 in empirical testing
    });

    it('accepts clean and low-contrast images without false rejection', async () => {
      if (!hasSamples) return;
      const cleanPath = path.join(samplesDir, 'receipt_0003_clean.png');
      const cleanBuf = fs.readFileSync(cleanPath);
      const cleanRes = await detectBlur(cleanBuf, 300);
      expect(cleanRes.isBlurred).toBe(false);
      expect(cleanRes.score).toBeGreaterThan(1000);

      const lowContrastPath = path.join(samplesDir, 'receipt_0007_low_contrast.png');
      const lcBuf = fs.readFileSync(lowContrastPath);
      const lcRes = await detectBlur(lcBuf, 300);
      expect(lcRes.isBlurred).toBe(false);
      expect(lcRes.score).toBeGreaterThan(600);
    });
  });

  describe('Guarded Deskew (Projection Profile Scan)', () => {
    it('detects and corrects tilt on rotated images', async () => {
      if (!hasSamples) return;
      const rotatedPath = path.join(samplesDir, 'receipt_0006_rotated.png');
      const buf = fs.readFileSync(rotatedPath);
      const angle = await projectionProfileDeskew(buf);
      expect(Math.abs(angle)).toBeGreaterThan(5);

      const deskewed = await deskewImage(buf);
      expect(deskewed.angle).toBe(angle);
      expect(deskewed.buffer).toBeInstanceOf(Buffer);
    }, 15000);

    it('guard protects clean upright images from spurious rotation', async () => {
      if (!hasSamples) return;
      const cleanPath = path.join(samplesDir, 'receipt_0003_clean.png');
      const buf = fs.readFileSync(cleanPath);
      const angle = await projectionProfileDeskew(buf);
      // Guard ensures bestScore > baseline * 1.30, preventing spurious rotation
      expect(angle).toBe(0);

      const deskewed = await deskewImage(buf);
      expect(deskewed.angle).toBe(0);
    }, 15000);
  });

  describe('GSTIN Checksum & Confusion Auto-Correction', () => {
    // Known valid GSTIN from synthetic ground truth
    const validGstin = '06FNAFQ5258A3ZO';

    it('validates a correct 15-character GSTIN checksum', () => {
      expect(gstinChecksumValid(validGstin)).toBe(true);
      expect(gstinChecksumValid('06FNAFQ5258A3Z9')).toBe(false);
    });

    it('recovers GSTIN from single-character OCR confusion substitution (0 <-> O)', () => {
      const corrupted = 'O' + validGstin.slice(1); // '0' replaced by 'O'
      expect(gstinChecksumValid(corrupted)).toBe(false);

      const corrected = tryCorrectGstin(corrupted);
      expect(corrected).not.toBeNull();
      expect(corrected?.valid).toBe(true);
      expect(corrected?.corrected).toBe(true);
      expect(corrected?.value).toBe(validGstin);
    });

    it('recovers GSTIN from single-character OCR confusion substitution (8 <-> B)', () => {
      // 06FNAFQ5258A3ZO -> index 10 is '8'
      const corrupted = validGstin.slice(0, 10) + 'B' + validGstin.slice(11);
      expect(gstinChecksumValid(corrupted)).toBe(false);

      const corrected = tryCorrectGstin(corrupted);
      expect(corrected?.valid).toBe(true);
      expect(corrected?.corrected).toBe(true);
      expect(corrected?.value).toBe(validGstin);
    });

    it('marks uncorrectable GSTIN as low confidence with flagReason', () => {
      const uncorrectable = '99ZZZZZ9999Z9Z9';
      const ocr = `
        SUPERMARKET
        Date: 12/03/2024
        TOTAL: 500.00
        GSTIN: ${uncorrectable}
      `;
      const res = parseReceipt(ocr);
      expect(res.gstin).toBeDefined();
      expect(res.gstin?.confidence).toBe('low');
      expect(res.gstin?.flagReason).toContain('failed checksum validation');
    });
  });

  describe('Statement Table Bounding-Box Row-Reconstruction', () => {
    it('reconstructs rows from scrambled reading order using y-clustering (top / 15)', () => {
      // Simulate Tesseract default PSM bug where columns are read column-by-column:
      // All dates grouped first, then all amounts, then all balances
      const scrambledWords = [
        // Column 1: Dates (y=150, 180, 210)
        { text: '01/04/2024', left: 50, top: 151 },
        { text: '05/04/2024', left: 50, top: 181 },
        { text: '10/04/2024', left: 50, top: 211 },

        // Column 2: Descriptions
        { text: 'SALARY', left: 200, top: 150 },
        { text: 'GROCERY', left: 200, top: 179 },
        { text: 'UTILITIES', left: 200, top: 212 },

        // Column 3: Amounts
        { text: '50000.00', left: 400, top: 149 },
        { text: '-1200.00', left: 400, top: 182 },
        { text: '-850.00', left: 400, top: 209 },

        // Column 4: Balances
        { text: '55000.00', left: 600, top: 152 },
        { text: '53800.00', left: 600, top: 180 },
        { text: '52950.00', left: 600, top: 210 },
      ];

      const rows = parseStatementFromData(scrambledWords);
      expect(rows).toHaveLength(3);

      // Verify Row 1: SALARY
      expect(rows[0]?.date.value).toBe('01/04/2024');
      expect(rows[0]?.description.value).toContain('SALARY');
      expect(rows[0]?.amount.value).toBe(50000.0);
      expect(rows[0]?.balance.value).toBe(55000.0);

      // Verify Row 2: GROCERY
      expect(rows[1]?.date.value).toBe('05/04/2024');
      expect(rows[1]?.description.value).toContain('GROCERY');
      expect(rows[1]?.amount.value).toBe(1200.0);
      expect(rows[1]?.type).toBe('debit');
      expect(rows[1]?.balance.value).toBe(53800.0);

      // Verify Row 3: UTILITIES
      expect(rows[2]?.date.value).toBe('10/04/2024');
      expect(rows[2]?.description.value).toContain('UTILITIES');
      expect(rows[2]?.amount.value).toBe(850.0);
      expect(rows[2]?.type).toBe('debit');
      expect(rows[2]?.balance.value).toBe(52950.0);
    });

    it('integrates parseBankStatement with word bounding boxes object input', () => {
      const input = {
        text: 'HDFC BANK A/C: 123456789012',
        words: [
          { text: '12/05/2024', left: 50, top: 150 },
          { text: 'ATM', left: 150, top: 150 },
          { text: 'CASH', left: 200, top: 150 },
          { text: '500.00', left: 350, top: 150 },
          { text: '9500.00', left: 500, top: 150 },
        ],
      };

      const result = parseBankStatement(input);
      expect(result.bankName?.value).toBe('HDFC');
      expect(result.accountNumber?.value).toBe('123456789012');
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0]?.date.value).toBe('12/05/2024');
      expect(result.transactions[0]?.amount.value).toBe(500.0);
    });
  });
});

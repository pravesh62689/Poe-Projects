import { ParsedReceipt, FieldValue } from '../types.js';

export const GST_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const CONFUSION_SUBS: Record<string, string> = {
  '0': 'O',
  'O': '0',
  '1': 'I',
  'I': '1',
  '2': 'Z',
  'Z': '2',
  '5': 'S',
  'S': '5',
  '8': 'B',
  'B': '8',
};

/**
 * Validates 15-character GSTIN format and mod-36 checksum.
 * Ported directly from research/ocr-validation/run_ocr_eval.py.
 */
export function gstinChecksumValid(gstin: string): boolean {
  const upper = gstin.toUpperCase();
  if (upper.length !== 15) return false;
  for (let i = 0; i < 15; i++) {
    if (!GST_ALPHABET.includes(upper[i]!)) return false;
  }
  let total = 0;
  for (let i = 0; i < 14; i++) {
    const factor = i % 2 === 1 ? 2 : 1;
    const cp = GST_ALPHABET.indexOf(upper[i]!);
    let product = cp * factor;
    product = Math.floor(product / 36) + (product % 36);
    total += product;
  }
  const checkCp = (36 - (total % 36)) % 36;
  return GST_ALPHABET[checkCp] === upper[14];
}

/**
 * Checks whether a character conforms to standard GSTIN positional types:
 * - 0..1: State code (digits)
 * - 2..6: PAN alphanumeric prefix (letters)
 * - 7..10: PAN sequential digits (digits)
 * - 11: PAN letter (letter)
 * - 12: Entity code (1-9 or A-Z)
 * - 13: Default 'Z'
 * - 14: Check code
 */
function isPositionalClassMatch(char: string, index: number): boolean {
  if (index === 0 || index === 1 || (index >= 7 && index <= 10)) {
    return /[0-9]/.test(char);
  }
  if ((index >= 2 && index <= 6) || index === 11 || index === 13) {
    return /[A-Z]/.test(char);
  }
  return true;
}

/**
 * Tries single-character OCR confusion substitutions to recover a valid GSTIN checksum.
 * Ported directly from research/ocr-validation/run_ocr_eval.py with positional sanity checks.
 */
export function tryCorrectGstin(raw: string | undefined | null): {
  value: string;
  corrected: boolean;
  valid: boolean;
} | null {
  if (!raw) return null;
  const cleaned = raw.toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (cleaned.length !== 15) {
    return { value: cleaned, corrected: false, valid: false };
  }
  if (gstinChecksumValid(cleaned)) {
    return { value: cleaned, corrected: false, valid: true };
  }

  // Try single-character confusion substitutions
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i]!;
    const sub = CONFUSION_SUBS[ch];
    if (sub && isPositionalClassMatch(sub, i)) {
      const candidate = cleaned.slice(0, i) + sub + cleaned.slice(i + 1);
      if (gstinChecksumValid(candidate)) {
        return { value: candidate, corrected: true, valid: true };
      }
    }
  }

  // If positional pass failed, try unconstrained confusion substitutions as fallback
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i]!;
    const sub = CONFUSION_SUBS[ch];
    if (sub) {
      const candidate = cleaned.slice(0, i) + sub + cleaned.slice(i + 1);
      if (gstinChecksumValid(candidate)) {
        return { value: candidate, corrected: true, valid: true };
      }
    }
  }

  return { value: cleaned, corrected: false, valid: false };
}

const DATE_REGEXES = [
  /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/,
  /\b(\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/,
  /\b(\d{1,2}[-\s]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-\s]+\d{2,4})\b/i,
];
const TOTAL_REGEXES = [
  /(?:grand\s+total|total\s+amount|net\s+payable|total|balance\s+due|t_t_l)\s*[:=-]?\s*[~≈]?\s*(?:(?:rs\.?|inr|[$€£])\s*)?([\d,]+\.?\d{0,2})/i,
  /(?:amount|subtotal)\s*[:=-]?\s*[~≈]?\s*(?:(?:rs\.?|inr|[$€£])\s*)?([\d,]+\.?\d{0,2})/i,
];

export function parseReceipt(ocrText: string): ParsedReceipt {
  const lines = ocrText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Extract Vendor
  let vendor: FieldValue<string> = {
    value: 'Unknown Vendor',
    confidence: 'low',
    flagReason: 'No vendor name identified in header',
  };

  const ignoredVendorKeywords = [
    'tax invoice',
    'receipt',
    'bill',
    'cash memo',
    'welcome',
    'customer copy',
    'note:',
    'wifi:',
    'call ',
    'remember to',
    'todo',
  ];
  for (const line of lines.slice(0, 5)) {
    const lower = line.toLowerCase();
    const isHeaderKeyword = ignoredVendorKeywords.some((k) => lower.includes(k));
    const hasSufficientLetters = (line.match(/[a-zA-Z]/g) || []).length >= 3;
    if (!isHeaderKeyword && hasSufficientLetters && !/^\d+$/.test(line)) {
      vendor = {
        value: line,
        confidence: line.length > 4 ? 'high' : 'medium',
        rawText: line,
      };
      break;
    }
  }

  // 2. Extract Date
  let date: FieldValue<string> = {
    value: 'Unknown Date',
    confidence: 'low',
    flagReason: 'No valid date format found in text',
  };

  for (const line of lines) {
    for (const regex of DATE_REGEXES) {
      const match = line.match(regex);
      if (match && match[1]) {
        date = {
          value: match[1],
          confidence: 'high',
          rawText: line,
        };
        break;
      }
    }
    if (date.confidence === 'high') {
      break;
    }
  }

  // 3. Extract Amount
  let amount: FieldValue<number> = {
    value: 0,
    confidence: 'low',
    flagReason: 'No total or subtotal amount detected',
  };

  for (const line of lines) {
    for (const regex of TOTAL_REGEXES) {
      const match = line.match(regex);
      if (match && match[1]) {
        const rawNum = match[1].replace(/,/g, '');
        const parsedNum = parseFloat(rawNum);
        if (!isNaN(parsedNum) && parsedNum > 0) {
          const isSubtotal = /\bsubtotal\b/i.test(line);
          const isGrandTotal =
            !isSubtotal &&
            /\b(grand\s+total|net\s+payable|total\s+amount|total|कुल\s+राशि)\b/i.test(line);
          const isHandwrittenOrApprox = /~|approx|handwritten|\?|estimated/i.test(line);
          amount = {
            value: parsedNum,
            confidence: isHandwrittenOrApprox ? 'low' : isGrandTotal ? 'high' : 'medium',
            flagReason: isHandwrittenOrApprox
              ? 'Handwritten, approximate, or uncertain amount notation'
              : undefined,
            rawText: line,
          };
          break;
        }
      }
    }
    if (amount.confidence === 'high') {
      break;
    }
  }

  // Fallback: If no explicit TOTAL keyword, look for standalone monetary values
  if (amount.confidence === 'low') {
    const standaloneMatch = ocrText.match(/(?:rs\.?|inr|[$€£])\s*([\d,]+\.\d{2})/i);
    if (standaloneMatch && standaloneMatch[1]) {
      const val = parseFloat(standaloneMatch[1].replace(/,/g, ''));
      if (!isNaN(val)) {
        amount = {
          value: val,
          confidence: 'low',
          flagReason: 'Derived from isolated currency symbol; verify against receipt',
          rawText: standaloneMatch[0],
        };
      }
    }
  }

  // 4. Extract GSTIN
  let gstin: FieldValue<string> | undefined;

  // Keyword match: e.g. "GSTIN: 27AABCS1429B1Z8" or "GST!N : 07AAAAA0000A1Z5"
  const keywordMatch = ocrText.match(/(?:gstin|gst\s*no|gst!n|gst)\s*[:=-]?\s*([0-9A-Za-z]{15})/i);
  let rawCandidate: string | undefined = keywordMatch?.[1];

  // Pattern match if keyword not found
  if (!rawCandidate) {
    const structMatch = ocrText.match(
      /\b([0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz][0-9A-Za-z]{1})\b/
    );
    rawCandidate = structMatch?.[1];
  }

  // Candidate scan from 15-character tokens if pattern didn't match
  if (!rawCandidate) {
    const tokens = ocrText.split(/\s+/);
    for (const token of tokens) {
      const cleanToken = token.replace(/[^0-9A-Za-z]/g, '');
      if (cleanToken.length === 15) {
        const testRes = tryCorrectGstin(cleanToken);
        if (testRes && testRes.valid) {
          rawCandidate = cleanToken;
          break;
        }
      }
    }
  }

  if (rawCandidate) {
    const rawVal = rawCandidate.toUpperCase();
    const corrected = tryCorrectGstin(rawVal);
    if (corrected) {
      gstin = {
        value: corrected.value,
        confidence: corrected.valid ? 'high' : 'low',
        flagReason: corrected.valid
          ? corrected.corrected
            ? 'GSTIN checksum auto-corrected via confusion substitution'
            : undefined
          : 'GSTIN failed checksum validation; verify against source document',
        rawText: rawCandidate,
      };
    }
  }

  return {
    documentType: 'receipt',
    vendor,
    date,
    amount,
    ...(gstin ? { gstin } : {}),
  };
}

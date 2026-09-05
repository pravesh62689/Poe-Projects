import { ParsedReceipt, FieldValue } from '../types.js';

const GSTIN_REGEX = /\b([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})\b/i;
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
            flagReason: isHandwrittenOrApprox ? 'Handwritten, approximate, or uncertain amount notation' : undefined,
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

  // 4. Extract GSTIN (if present)
  let gstin: FieldValue<string> | undefined;
  const gstinMatch = ocrText.match(GSTIN_REGEX);
  if (gstinMatch && gstinMatch[1]) {
    gstin = {
      value: gstinMatch[1].toUpperCase(),
      confidence: 'high',
      rawText: gstinMatch[0],
    };
  }

  return {
    documentType: 'receipt',
    vendor,
    date,
    amount,
    ...(gstin ? { gstin } : {}),
  };
}

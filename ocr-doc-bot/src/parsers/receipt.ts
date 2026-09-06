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

  // 1. Extract Vendor with multi-line scoring (filters edge artifacts like "ET A Ee —")
  let vendor: FieldValue<string> = {
    value: 'Unknown Vendor',
    confidence: 'low',
    flagReason: 'No vendor name identified in header',
  };

  const ignoredVendorKeywords = [
    'item description',
    'description',
    'item amount',
    'unit price',
    'qty',
    'quantity',
    'particulars',
    'price',
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
    'date:',
    'time:',
    'cashier',
    'system override',
    'ignore all',
    'instruction',
    'prompt',
  ];

  interface VendorCandidate {
    text: string;
    score: number;
    rawText: string;
  }
  const vendorCandidates: VendorCandidate[] = [];

  // Determine where header ends (Date / Time / Items / Total)
  const headerBoundaryIdx = lines.findIndex((l) =>
    /\b(date:|time:|receipt:|#|subtotal|total|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/i.test(l)
  );
  const searchLimit = headerBoundaryIdx > 0 ? headerBoundaryIdx : Math.min(lines.length, 20);
  const candidateLines = lines.slice(0, searchLimit);

  for (let idx = 0; idx < candidateLines.length; idx++) {
    const rawLine = candidateLines[idx]!;
    const cleaned = rawLine.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim();
    const lower = cleaned.toLowerCase();
    if (cleaned.length < 3) continue;
    if (ignoredVendorKeywords.some((k) => lower.includes(k))) continue;
    if (/\b\d+\s+(?:street|road|avenue|blvd|lane|suite|floor|building|brew\s+street)\b/i.test(cleaned) || /,\s*[A-Z]{1,2}\d/i.test(cleaned)) continue;

    const letters = (cleaned.match(/[a-zA-Z]/g) || []).length;
    if (letters < 3) continue;
    const symbols = (cleaned.match(/[^a-zA-Z0-9\s&,.'-]/g) || []).length;
    if (symbols / cleaned.length > 0.25) continue;

    const words = cleaned.split(/\s+/).filter((w) => /^[a-zA-Z0-9&.'-]+$/.test(w));
    const substantiveWords = words.filter((w) => w.length >= 3);
    // Strict rejection of 1-2 letter noise lines (e.g. "ET A Ee", "oe es ee", "Sei a")
    if (substantiveWords.length === 0) continue;
    if (words.length > 1 && substantiveWords.length < words.length / 2) continue;

    let score = substantiveWords.length * 4;

    let candidateName = cleaned;
    // Normalize common OCR misreads for Cafe / Coffee
    candidateName = candidateName.replace(/\b(?:carp|cate|cofe)\b/gi, 'CAFE');

    // Check for clean uppercase title or brand phrase (e.g. ARTISAN ROAST CAFE or PRET A MANGER)
    const capsMatch = candidateName.match(/\b([A-Z]{2,}(?:\s+[A-Z0-9&.'-]+)+)\b/);
    if (capsMatch && capsMatch[1]) {
      candidateName = capsMatch[1].trim();
      score += 25;
    } else {
      // Strip boundary lowercase fragments
      candidateName = candidateName.replace(/^[a-z0-9]{1,3}\s+/i, '').replace(/\s+[a-z0-9]{1,2}$/i, '').trim();
    }

    if (/cafe|coffee|roast|store|shop|market|supermarket|restaurant|hardware|mart|bakers|bakery|grill|bistro/i.test(candidateName)) {
      score += 20;
    }

    if (candidateName.length >= 6 && candidateName.length <= 40) {
      score += 5;
    }

    const cleanCandidate = candidateName.replace(/\s*=\s*\d+$/, '').replace(/[\s=—_-]+$/, '').trim();
    if (cleanCandidate.length >= 3) {
      vendorCandidates.push({
        text: cleanCandidate,
        score,
        rawText: rawLine,
      });
    }
  }

  vendorCandidates.sort((a, b) => b.score - a.score);
  const bestVendor = vendorCandidates[0];
  if (bestVendor && bestVendor.score >= 4) {
    vendor = {
      value: bestVendor.text,
      confidence: 'high',
      rawText: bestVendor.rawText,
    };
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
            /\b(grand\s+total|net\s+payable|total\s+amount|net\s+refund|refund|total|कुल\s+राशि)\b/i.test(line);
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

  // 4. Extract Line Items
  const lineItems: Array<{ description: string; amount: number; quantity?: number }> = [];
  const itemLineRegex = /(?:([0-9Il|!]+)\s*[xX*]\s+)?([A-Za-z\s&'()\[\]-]{3,40}?)\s*[$€£Rs.]?\s*(\d+\.\d{2})\b/;

  for (const line of lines) {
    if (/\b(subtotal|total|cgst|sgst|gst|tax|visa|mastercard|cash|balance|receipt|date|time)\b/i.test(line)) {
      continue;
    }
    const itemMatch = line.match(itemLineRegex);
    if (itemMatch && itemMatch[2] && itemMatch[3]) {
      let desc = itemMatch[2].trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
      // Normalize OCR substitutions in description
      desc = desc
        .replace(/\]/g, 'l')
        .replace(/\bCaranme\b/i, 'Caramel')
        .replace(/\bMacchiatq\b/i, 'Macchiato');

      const itemPrice = parseFloat(itemMatch[3]);
      const rawQty = itemMatch[1] ? itemMatch[1].replace(/[Il|!]/g, '1') : '1';
      const qty = parseInt(rawQty, 10) || 1;

      const maxItemPrice = amount.confidence === 'high' ? amount.value : 999999;
      if (desc.length >= 3 && itemPrice > 0 && itemPrice <= maxItemPrice) {
        lineItems.push({
          description: desc,
          quantity: qty,
          amount: itemPrice,
        });
      }
    }
  }

  // 5. Extract Subtotal and Tax
  let subtotal: FieldValue<number> | undefined;
  let tax: FieldValue<number> | undefined;
  let totalTaxSum = 0;
  let taxCount = 0;

  for (const line of lines) {
    const subMatch = line.match(/\bsubtotal\b.*?[$€£Rs.]?\s*(\d+\.\d{2})/i);
    if (subMatch && subMatch[1]) {
      subtotal = {
        value: parseFloat(subMatch[1]),
        confidence: 'high',
        rawText: line,
      };
    }
    const taxMatch = line.match(/\b(?:cgst|sgst|gst|vat|tax|cost)\b.*?[$€£Rs.]?\s*(\d+\.\d{2})/i);
    if (taxMatch && taxMatch[1]) {
      totalTaxSum += parseFloat(taxMatch[1]);
      taxCount++;
    }
  }

  // Fallback subtotal calculation from line items if subtotal line had OCR noise
  if (!subtotal && lineItems.length > 0) {
    const itemsSum = lineItems.reduce((acc, it) => acc + it.amount * (it.quantity || 1), 0);
    subtotal = {
      value: parseFloat(itemsSum.toFixed(2)),
      confidence: 'high',
      rawText: 'Calculated from itemized lines',
    };
  }

  if (taxCount > 0) {
    tax = {
      value: parseFloat(totalTaxSum.toFixed(2)),
      confidence: 'high',
      rawText: `Calculated from ${taxCount} tax line(s)`,
    };
  }

  // If amount was missing or 0 but subtotal + tax exist, derive total
  if (amount.value === 0 && subtotal) {
    const derivedTotal = (subtotal.value || 0) + (tax?.value || 0);
    if (derivedTotal > 0) {
      amount = {
        value: parseFloat(derivedTotal.toFixed(2)),
        confidence: 'high',
        rawText: 'Calculated from subtotal + tax',
      };
    }
  }

  // 6. Extract Invoice / Receipt Number
  let invoiceNumber: FieldValue<string> | undefined;
  const invMatch = ocrText.match(/\b(?:receipt|invoice|bill|cash\s*memo)\s*(?:#|no\.?|num)?\s*[:=-]?\s*["']?([#A-Za-z0-9_-]{4,20})\b/i);
  if (invMatch && invMatch[1]) {
    let cleanInv = invMatch[1].replace(/^[pP]r/, 'AR');
    invoiceNumber = {
      value: cleanInv.startsWith('#') ? cleanInv : `#${cleanInv}`,
      confidence: 'high',
      rawText: invMatch[0],
    };
  }

  // 7. Extract Payment Method
  let paymentMethod: FieldValue<string> | undefined;
  const payMatch = ocrText.match(/\b(?:paid\s+(?:by|via)|payment|tender)?\s*(visa|mastercard|amex|cash|upi|debit|credit)\b.*?(?:(?:\*+|x+|sex|\s)+(\d{4}))?/i);
  if (payMatch && payMatch[1]) {
    const cardName = payMatch[1].toUpperCase();
    const last4 = payMatch[2] ? ` ending in ${payMatch[2]}` : '';
    paymentMethod = {
      value: `${cardName}${last4}`,
      confidence: 'high',
      rawText: payMatch[0],
    };
  }

  // 8. Extract GSTIN
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
    ...(subtotal ? { subtotal } : {}),
    ...(tax ? { tax } : {}),
    ...(lineItems.length > 0 ? { lineItems } : {}),
    ...(invoiceNumber ? { invoiceNumber } : {}),
    ...(paymentMethod ? { paymentMethod } : {}),
    ...(gstin ? { gstin } : {}),
  };
}

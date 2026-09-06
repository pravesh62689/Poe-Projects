import { DocumentRoute, ParsedDocument } from './types.js';
import { parseReceipt } from './parsers/receipt.js';
import { parseBankStatement } from './parsers/statement.js';
import { parseIdDocument } from './parsers/id.js';

/**
 * Extracts explicit slash command if present in the user prompt.
 */
export function extractRouteCommand(prompt: string): DocumentRoute {
  const lower = prompt.toLowerCase().trim();
  if (lower.startsWith('/receipt') || lower.includes('receipt') || lower.includes('bill') || lower.includes('invoice')) {
    if (lower.startsWith('/receipt')) return 'receipt';
  }
  if (lower.startsWith('/statement') || lower.includes('bank statement') || lower.includes('passbook')) {
    if (lower.startsWith('/statement')) return 'statement';
  }
  if (lower.startsWith('/id') || lower.startsWith('/kyc') || lower.includes('id card') || lower.includes('pan card') || lower.includes('aadhaar')) {
    if (lower.startsWith('/id') || lower.startsWith('/kyc')) return 'id';
  }
  return 'auto';
}

/**
 * Analyzes text shape and keywords to automatically detect the document type.
 */
export function detectDocumentType(ocrText: string): 'receipt' | 'statement' | 'id' {
  const lower = ocrText.toLowerCase();

  // ID cues: government keywords, specific ID number formats, passports, driver licenses
  const isId =
    /\b([a-z]{5}[0-9]{4}[a-z]{1})\b/i.test(ocrText) || // PAN
    /\b(\d{4}\s\d{4}\s\d{4})\b/.test(ocrText) || // Aadhaar
    /P<[A-Z]{3}<<[A-Z<]+/i.test(ocrText) || // Passport MRZ
    /\b(passport|driver\s+licen[cs]e|driving\s+licen[cs]e|national\s+id|identity\s+card|photo\s+id|document\s+number)\b/i.test(ocrText) ||
    lower.includes('income tax department') ||
    lower.includes('permanent account number') ||
    lower.includes('unique identification authority') ||
    lower.includes('republic of india') ||
    lower.includes('election commission') ||
    lower.includes('personalausweis') ||
    lower.includes('carte nationale') ||
    lower.includes('documento nacional');

  if (isId) {
    return 'id';
  }

  // Bank Statement cues: balance columns, transaction lines, bank headers
  const isStatement =
    /\b(account\s+statement|bank\s+statement|statement\s+period|closing\s+balance|opening\s+balance)\b/i.test(ocrText) ||
    (/\b(cr|dr|credit|debit)\b/i.test(ocrText) &&
     /\b(balance|withdrawal|deposit|a\/c|account no)\b/i.test(ocrText));

  if (isStatement) {
    return 'statement';
  }

  // Receipt cues: Total, Subtotal, GSTIN, Cash Memo, Tax Invoice
  const isReceipt =
    /\b(total|subtotal|tax\s+invoice|cash\s+memo|gstin|change|bill\s+to)\b/i.test(ocrText);

  if (isReceipt) {
    return 'receipt';
  }

  // Default fallback if ambiguous: receipts are the most common single-page snapshot
  return 'receipt';
}

/**
 * Routes OCR text to the appropriate parser, honoring user overrides.
 */
export function routeAndParse(
  userPrompt: string,
  ocrInput: string | { text: string; words?: any[] }
): ParsedDocument {
  const ocrText = typeof ocrInput === 'string' ? ocrInput : ocrInput.text;
  const explicitRoute = extractRouteCommand(userPrompt);
  const route = explicitRoute !== 'auto' ? explicitRoute : detectDocumentType(ocrText);

  switch (route) {
    case 'statement':
      return parseBankStatement(ocrInput);
    case 'id':
      return parseIdDocument(ocrText);
    case 'receipt':
    default:
      return parseReceipt(ocrText);
  }
}

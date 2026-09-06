import { ParsedBankStatement, StatementTransaction, FieldValue } from '../types.js';

export interface BoundingBoxWord {
  text: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
}

export interface StatementInputObject {
  text: string;
  words?: BoundingBoxWord[];
}

const TRANSACTION_LINE_REGEX =
  /^(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\s+(.+?)\s+([\d,]+\.\d{2})\s*(cr|dr|credit|debit)?\s+([\d,]+\.\d{2})/i;

const BANK_NAMES = [
  'HDFC',
  'SBI',
  'STATE BANK',
  'ICICI',
  'AXIS',
  'KOTAK',
  'PUNJAB NATIONAL',
  'CHASE',
  'WELLS FARGO',
  'BANK OF AMERICA',
  'CITIBANK',
  'BARCLAYS',
];

/**
 * Reconstructs rows from word bounding boxes via y-clustering (top / 15).
 * Ported directly from research/ocr-validation/run_ocr_eval.py's parse_statement_from_data().
 * Prevents Tesseract's default column-by-column scrambled reading order on tabular data.
 */
export function parseStatementFromData(words: BoundingBoxWord[]): StatementTransaction[] {
  const buckets = new Map<number, Array<{ left: number; text: string }>>();
  for (const w of words) {
    const txt = w.text.trim();
    if (!txt) continue;
    const key = Math.round(w.top / 15);
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key)!.push({ left: w.left, text: txt });
  }

  const sortedKeys = Array.from(buckets.keys()).sort((a, b) => a - b);
  const rows: StatementTransaction[] = [];

  for (const k of sortedKeys) {
    const bucketWords = buckets.get(k)!.sort((a, b) => a.left - b.left);
    const line = bucketWords.map((b) => b.text).join(' ');
    const nums = [...line.matchAll(/-?[\d,]+\.\d{2}/g)].map((m) => m[0]);
    const dateM = line.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/);
    if (dateM && nums.length >= 2) {
      const rawDate = dateM[0];
      const rawAmt = nums[nums.length - 2]!.replace(/,/g, '');
      const rawBal = nums[nums.length - 1]!.replace(/,/g, '');
      const parsedAmt = parseFloat(rawAmt);
      const parsedBal = parseFloat(rawBal);
      const isDebit = parsedAmt < 0 || /\b(dr|debit)\b/i.test(line);
      const isCredit = parsedAmt > 0 || /\b(cr|credit)\b/i.test(line);

      const descPart = line
        .replace(rawDate, '')
        .replace(nums[nums.length - 2]!, '')
        .replace(nums[nums.length - 1]!, '')
        .trim();

      rows.push({
        date: {
          value: rawDate,
          confidence: 'high',
          rawText: rawDate,
        },
        description: {
          value: descPart || 'Transaction',
          confidence: descPart.length >= 4 ? 'high' : 'medium',
          rawText: descPart,
          flagReason: descPart.length < 4 ? 'Truncated description' : undefined,
        },
        amount: {
          value: Math.abs(parsedAmt),
          confidence: 'high',
          rawText: rawAmt,
        },
        type: isDebit ? 'debit' : isCredit ? 'credit' : 'unknown',
        balance: {
          value: parsedBal,
          confidence: 'high',
          rawText: rawBal,
        },
      });
    }
  }
  return rows;
}

export function parseBankStatement(
  input: string | StatementInputObject
): ParsedBankStatement {
  const ocrText = typeof input === 'string' ? input : input.text;
  const wordData = typeof input === 'object' && input.words ? input.words : undefined;

  const lines = ocrText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Identify Bank Name
  let bankName: FieldValue<string> | undefined;
  for (const b of BANK_NAMES) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(ocrText)) {
      bankName = {
        value: b,
        confidence: 'high',
        rawText: b,
      };
      break;
    }
  }

  // 2. Identify Account Number
  let accountNumber: FieldValue<string> | undefined;
  const accMatch = ocrText.match(/(?:a\/c|account(?:\s+no)?\.?)\s*[:=-]?\s*([xX*\d]{8,18})/i);
  if (accMatch && accMatch[1]) {
    accountNumber = {
      value: accMatch[1],
      confidence: accMatch[1].length >= 9 ? 'high' : 'medium',
      rawText: accMatch[0],
    };
  }

  // 3. Extract Transactions
  let transactions: StatementTransaction[] = [];

  // Mandatory primary approach: If word bounding boxes exist, use y-clustering reconstruction
  if (wordData && wordData.length > 0) {
    transactions = parseStatementFromData(wordData);
  }

  // Fallback if word boxes were unavailable or didn't match rows (e.g. raw text mocks)
  if (transactions.length === 0) {
    for (const line of lines) {
      const match = line.match(TRANSACTION_LINE_REGEX);
      if (match && match[1] && match[2] && match[3] && match[5]) {
        const rawDate = match[1];
        const rawDesc = match[2].trim();
        const rawAmount = parseFloat(match[3].replace(/,/g, ''));
        const indicator = match[4]?.toLowerCase();
        const rawBalance = parseFloat(match[5].replace(/,/g, ''));

        let type: 'debit' | 'credit' | 'unknown' = 'unknown';
        if (indicator === 'cr' || indicator === 'credit') {
          type = 'credit';
        } else if (indicator === 'dr' || indicator === 'debit') {
          type = 'debit';
        }

        transactions.push({
          date: {
            value: rawDate,
            confidence: 'high',
            rawText: rawDate,
          },
          description: {
            value: rawDesc,
            confidence: rawDesc.length >= 4 ? 'high' : 'low',
            rawText: rawDesc,
            flagReason: rawDesc.length < 4 ? 'Truncated or noisy description text' : undefined,
          },
          amount: {
            value: rawAmount,
            confidence: 'high',
            rawText: match[3],
          },
          type,
          balance: {
            value: rawBalance,
            confidence: 'high',
            rawText: match[5],
          },
        });
      }
    }
  }

  // Second fallback: tabular heuristic
  if (transactions.length === 0) {
    for (const line of lines) {
      const dateMatch = line.match(/^(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/);
      const amounts = [...line.matchAll(/([\d,]+\.\d{2})/g)].map((m) => m[1]);
      if (dateMatch && dateMatch[1] && amounts.length >= 2) {
        const amtStr = amounts[0]?.replace(/,/g, '') ?? '0';
        const balStr = amounts[amounts.length - 1]?.replace(/,/g, '') ?? '0';
        const amountNum = parseFloat(amtStr);
        const balNum = parseFloat(balStr);

        const descText = line.substring(dateMatch[0].length).replace(/[\d,]+\.\d{2}/g, '').trim();

        transactions.push({
          date: {
            value: dateMatch[1],
            confidence: 'medium',
            rawText: dateMatch[1],
          },
          description: {
            value: descText || 'Transaction',
            confidence: descText ? 'medium' : 'low',
            flagReason: descText ? undefined : 'Uncertain description in statement row',
          },
          amount: {
            value: isNaN(amountNum) ? 0 : amountNum,
            confidence: 'medium',
            flagReason: 'Extracted via fallback tabular heuristic',
          },
          type: /dr|debit/i.test(line) ? 'debit' : /cr|credit/i.test(line) ? 'credit' : 'unknown',
          balance: {
            value: isNaN(balNum) ? 0 : balNum,
            confidence: 'medium',
          },
        });
      }
    }
  }

  // 4. Extract Account Holder
  let accountHolder: FieldValue<string> | undefined;
  const holderMatch = ocrText.match(/(?:account\s+holder|customer\s+name|name)\s*[:=-]?\s*([A-Za-z\s.]+)/i);
  if (holderMatch && holderMatch[1]) {
    const cleanHolder = holderMatch[1].trim();
    if (cleanHolder.length >= 3) {
      accountHolder = {
        value: cleanHolder,
        confidence: 'high',
        rawText: holderMatch[0],
      };
    }
  }

  // 5. Extract Statement Period
  let period: FieldValue<string> | undefined;
  const periodMatch = ocrText.match(/(?:statement\s+period|period|date\s+range)\s*[:=-]?\s*([A-Za-z0-9\s,.-]+)/i);
  if (periodMatch && periodMatch[1]) {
    const cleanPeriod = periodMatch[1].trim();
    if (cleanPeriod.length >= 5) {
      period = {
        value: cleanPeriod,
        confidence: 'high',
        rawText: periodMatch[0],
      };
    }
  }

  // 6. Extract Closing / Ending Balance
  let closingBalance: FieldValue<number> | undefined;
  const closeMatch = ocrText.match(/(?:closing\s+balance|ending\s+balance|final\s+balance|balance\s+as\s+of)\s*[:=-]?\s*[$€£Rs.]?\s*([\d,]+\.\d{2})/i);
  if (closeMatch && closeMatch[1]) {
    const cleanBal = parseFloat(closeMatch[1].replace(/,/g, ''));
    if (!isNaN(cleanBal)) {
      closingBalance = {
        value: cleanBal,
        confidence: 'high',
        rawText: closeMatch[0],
      };
    }
  } else if (transactions.length > 0) {
    const lastTx = transactions[transactions.length - 1];
    if (lastTx && lastTx.balance?.value !== undefined) {
      closingBalance = {
        value: lastTx.balance.value,
        confidence: 'high',
        rawText: 'Derived from final ledger transaction balance',
      };
    }
  }

  return {
    documentType: 'statement',
    ...(bankName ? { bankName } : {}),
    ...(accountNumber ? { accountNumber } : {}),
    ...(accountHolder ? { accountHolder } : {}),
    ...(period ? { period } : {}),
    ...(closingBalance ? { closingBalance } : {}),
    transactions,
  };
}

import { ParsedBankStatement, StatementTransaction, FieldValue } from '../types.js';

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

export function parseBankStatement(ocrText: string): ParsedBankStatement {
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
  const transactions: StatementTransaction[] = [];

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

  // Fallback transaction row scanning if strict regex produced zero rows
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

  return {
    documentType: 'statement',
    ...(bankName ? { bankName } : {}),
    ...(accountNumber ? { accountNumber } : {}),
    transactions,
  };
}

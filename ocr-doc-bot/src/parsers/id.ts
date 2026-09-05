import { ParsedIdDocument, IdType, FieldValue } from '../types.js';

const PAN_REGEX = /\b([A-Z]{5}[0-9]{4}[A-Z]{1})\b/;
const AADHAAR_REGEX = /\b(\d{4}\s\d{4}\s\d{4}|\d{12})\b/;
const PASSPORT_REGEX = /\b([A-Z][0-9]{7})\b/;
const DL_REGEX = /\b([A-Z]{2}[0-9]{2}[ -]?[0-9]{11})\b/i;

const DOB_REGEXES = [
  /(?:dob|date\s+of\s+birth|birth\s+date|born)\s*[:=-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
  /\b(\d{1,2}[/-]\d{1,2}[/-]\d{4})\b/,
];

export function parseIdDocument(ocrText: string): ParsedIdDocument {
  const lines = ocrText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let idType: IdType = 'Unknown';
  let idNumber: FieldValue<string> = {
    value: 'Unknown',
    confidence: 'low',
    flagReason: 'No matching government ID number format discovered',
  };

  // 1. Identify PAN Card
  const panMatch = ocrText.match(PAN_REGEX);
  const isIncomeTax = /income\s+tax\s+department|permanent\s+account\s+number/i.test(ocrText);
  if (panMatch && panMatch[1]) {
    idType = 'PAN';
    idNumber = {
      value: panMatch[1].toUpperCase(),
      confidence: isIncomeTax ? 'high' : 'medium',
      rawText: panMatch[0],
    };
  }

  // 2. Identify Aadhaar Card
  if (idType === 'Unknown') {
    const aadhaarMatch = ocrText.match(AADHAAR_REGEX);
    const isAadhaarText = /aadhaar|uidai|unique\s+identification|mera\s+aadhaar/i.test(ocrText);
    if (aadhaarMatch && aadhaarMatch[1] && (isAadhaarText || /^\d{4}\s\d{4}\s\d{4}$/.test(aadhaarMatch[1]))) {
      idType = 'Aadhaar';
      idNumber = {
        value: aadhaarMatch[1].replace(/\s+/g, ' '),
        confidence: isAadhaarText ? 'high' : 'medium',
        rawText: aadhaarMatch[0],
      };
    }
  }

  // 3. Identify Passport
  if (idType === 'Unknown') {
    const passportMatch = ocrText.match(PASSPORT_REGEX);
    const isPassport = /republic\s+of\s+india|passport/i.test(ocrText);
    if (passportMatch && passportMatch[1] && isPassport) {
      idType = 'Passport';
      idNumber = {
        value: passportMatch[1].toUpperCase(),
        confidence: 'high',
        rawText: passportMatch[0],
      };
    }
  }

  // 4. Identify Driving License
  if (idType === 'Unknown') {
    const dlMatch = ocrText.match(DL_REGEX);
    const isDL = /driving\s+licen[cs]e|transport\s+department|motor\s+vehicles/i.test(ocrText);
    if (dlMatch && dlMatch[1]) {
      idType = 'DrivingLicense';
      idNumber = {
        value: dlMatch[1].toUpperCase(),
        confidence: isDL ? 'high' : 'medium',
        rawText: dlMatch[0],
      };
    }
  }

  // 5. Extract Name
  let name: FieldValue<string> = {
    value: 'Unknown Name',
    confidence: 'low',
    flagReason: 'Unable to discern human name with high confidence',
  };

  const namePrefixMatch = ocrText.match(/(?:name\s*[:=-]|given\s+name[s]?\s*[:=-])\s*([A-Za-z .]+)/i);
  if (namePrefixMatch && namePrefixMatch[1]) {
    const clean = namePrefixMatch[1].trim();
    if (clean.length > 2) {
      name = {
        value: clean,
        confidence: 'high',
        rawText: namePrefixMatch[0],
      };
    }
  } else {
    // Heuristic: On PAN card, name is typically right above Father's name or after Government header
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const lower = line.toLowerCase();
      if (lower.includes("father's name") || lower.includes('father name')) {
        const candidate = lines[i - 1];
        if (candidate && /^[A-Z\s.]+$/.test(candidate) && candidate.length > 3) {
          name = {
            value: candidate,
            confidence: 'medium',
            rawText: candidate,
          };
          break;
        }
      }
    }
  }

  // 6. Extract Date of Birth
  let dateOfBirth: FieldValue<string> | undefined;
  for (const regex of DOB_REGEXES) {
    const match = ocrText.match(regex);
    if (match && match[1]) {
      dateOfBirth = {
        value: match[1],
        confidence: 'high',
        rawText: match[0],
      };
      break;
    }
  }

  return {
    documentType: 'id',
    idType,
    idNumber,
    name,
    ...(dateOfBirth ? { dateOfBirth } : {}),
  };
}

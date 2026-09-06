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
    const mrzMatch = ocrText.match(/P<([A-Z]{3})<<([A-Z<]+)/i);
    const isPassport = /republic\s+of\s+india|passport/i.test(ocrText) || !!mrzMatch;
    if (isPassport) {
      idType = 'Passport';
      let passportNum = passportMatch ? passportMatch[1] : undefined;
      if (!passportNum && mrzMatch) {
        const mrz2 = ocrText.match(/([A-Z0-9]{8,12})\d[A-Z]{3}/i);
        if (mrz2 && mrz2[1]) passportNum = mrz2[1];
      }
      if (passportNum) {
        idNumber = {
          value: passportNum.toUpperCase(),
          confidence: 'high',
          rawText: passportNum,
        };
      }
    }
  }

  // 4. Identify Driving License
  if (idType === 'Unknown') {
    const dlMatch =
      ocrText.match(DL_REGEX) ||
      ocrText.match(/(?:4d\.?|licen[cs]e\s*(?:no\.?|number)?)\s*[:=-]?\s*([A-Za-z0-9-]*\d[A-Za-z0-9-]{3,16})\b/i) ||
      ocrText.match(/\b(?:DL|DVLA|NSW|UK-DVLA)[ -]?(?:USA|UK|AUS)?[ -]?([A-Za-z0-9-]*\d[A-Za-z0-9-]{3,16})\b/i);
    const isDL = /driving\s+licen[cs]e|driver\s+licen[cs]e|transport\s+department|motor\s+vehicles|dvla/i.test(ocrText);
    if (dlMatch && dlMatch[1] && /\d/.test(dlMatch[1])) {
      idType = 'DrivingLicense';
      idNumber = {
        value: dlMatch[1].toUpperCase(),
        confidence: isDL ? 'high' : 'medium',
        rawText: dlMatch[0],
      };
    }
  }

  // 5. Identify National ID / Other Government ID
  if (idType === 'Unknown') {
    const isNationalId = /national\s+id|identity\s+card|personalausweis|carte\s+nationale|documento\s+nacional|cni|dni/i.test(ocrText);
    const docNumMatch = ocrText.match(/(?:document\s+number|id\s+no\.?|doc\s*#|card\s+no\.?)\s*[:=-]?\s*([A-Za-z0-9 -]{5,22})/i);
    if (isNationalId || docNumMatch) {
      idType = 'NationalID';
      if (docNumMatch && docNumMatch[1]) {
        idNumber = {
          value: docNumMatch[1].trim().toUpperCase(),
          confidence: 'high',
          rawText: docNumMatch[0],
        };
      }
    }
  }

  // Fallback for Document Number if idNumber is still Unknown
  if (idNumber.confidence === 'low') {
    const docNumMatch = ocrText.match(/(?:document\s+number|id\s+no\.?|doc\s*#|card\s+no\.?)\s*[:=-]?\s*([A-Za-z0-9 -]{5,22})/i);
    if (docNumMatch && docNumMatch[1]) {
      idNumber = {
        value: docNumMatch[1].trim().toUpperCase(),
        confidence: 'high',
        rawText: docNumMatch[0],
      };
    }
  }

  // 6. Extract Name
  let name: FieldValue<string> = {
    value: 'Unknown Name',
    confidence: 'low',
    flagReason: 'Unable to discern human name with high confidence',
  };

  const namePrefixMatch = ocrText.match(/(?:full\s+name|given\s+name[s]?|name|nom|nombre)\s*[:=-]?\s*([A-Za-z .'-]+)/i);
  if (namePrefixMatch && namePrefixMatch[1]) {
    const clean = namePrefixMatch[1].trim();
    name = {
      value: clean,
      confidence: 'high',
      rawText: namePrefixMatch[0],
    };
  } else {
    // Check MRZ line: P<USA<<SMITH<JORDAN<<<<
    const mrzNameMatch = ocrText.match(/P<[A-Z]{3}<<([A-Z<]+)/i);
    if (mrzNameMatch && mrzNameMatch[1]) {
      const cleanMrz = mrzNameMatch[1].replace(/<+/g, ' ').trim();
      if (cleanMrz.length > 2) {
        name = {
          value: cleanMrz,
          confidence: 'high',
          rawText: mrzNameMatch[0],
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

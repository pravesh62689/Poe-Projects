import { describe, it, expect } from 'vitest';
import { parseIdDocument } from '../src/parsers/id.js';

describe('parseIdDocument', () => {
  it('parses Indian PAN Card with high confidence (happy path)', () => {
    const text = `
      INCOME TAX DEPARTMENT
      GOVT. OF INDIA
      Permanent Account Number Card
      ABCDE1234F
      Name: RAHUL SHARMA
      Father's Name: SURESH SHARMA
      Date of Birth: 15/08/1992
    `;

    const result = parseIdDocument(text);
    expect(result.documentType).toBe('id');
    expect(result.idType).toBe('PAN');
    expect(result.idNumber.value).toBe('ABCDE1234F');
    expect(result.idNumber.confidence).toBe('high');
    expect(result.name.value).toBe('RAHUL SHARMA');
    expect(result.dateOfBirth?.value).toBe('15/08/1992');
  });

  it('parses Aadhaar Card with 12-digit spaced format', () => {
    const text = `
      Government of India
      Unique Identification Authority of India
      To:
      Priya Patel
      DOB: 22/04/1996
      Female
      9876 5432 1098
      Mera Aadhaar, Meri Pehchan
    `;

    const result = parseIdDocument(text);
    expect(result.documentType).toBe('id');
    expect(result.idType).toBe('Aadhaar');
    expect(result.idNumber.value).toBe('9876 5432 1098');
    expect(result.idNumber.confidence).toBe('high');
    expect(result.dateOfBirth?.value).toBe('22/04/1996');
  });

  it('parses Indian Passport number format', () => {
    const text = `
      REPUBLIC OF INDIA
      PASSPORT
      Type: P  Country Code: IND  Passport No: Z1234567
      Given Name: AMIT KUMAR
      Date of Birth: 01/01/1988
    `;

    const result = parseIdDocument(text);
    expect(result.documentType).toBe('id');
    expect(result.idType).toBe('Passport');
    expect(result.idNumber.value).toBe('Z1234567');
    expect(result.name.value).toBe('AMIT KUMAR');
  });

  it('parses Indian Driving License', () => {
    const text = `
      TRANSPORT DEPARTMENT
      DRIVING LICENCE
      DL No: DL04 20180012345
      Name: VIKRAM SINGH
      DOB: 10/10/1990
    `;

    const result = parseIdDocument(text);
    expect(result.documentType).toBe('id');
    expect(result.idType).toBe('DrivingLicense');
    expect(result.idNumber.value).toContain('DL04');
  });

  it('handles empty input gracefully with low confidence flags', () => {
    const result = parseIdDocument('');
    expect(result.documentType).toBe('id');
    expect(result.idType).toBe('Unknown');
    expect(result.idNumber.confidence).toBe('low');
    expect(result.name.confidence).toBe('low');
  });

  it('handles malformed noisy input gracefully', () => {
    const result = parseIdDocument('Random string xyz 123 !@#');
    expect(result.documentType).toBe('id');
    expect(result.idType).toBe('Unknown');
    expect(result.idNumber.confidence).toBe('low');
  });
});

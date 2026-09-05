export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface FieldValue<T> {
  value: T;
  confidence: ConfidenceLevel;
  rawText?: string;
  flagReason?: string;
}

export interface ParsedReceipt {
  documentType: 'receipt';
  vendor: FieldValue<string>;
  date: FieldValue<string>;
  amount: FieldValue<number>;
  currency?: FieldValue<string>;
  gstin?: FieldValue<string>;
  invoiceNumber?: FieldValue<string>;
  lineItems?: Array<{
    description: string;
    amount: number;
  }>;
}

export interface StatementTransaction {
  date: FieldValue<string>;
  description: FieldValue<string>;
  amount: FieldValue<number>;
  type: 'debit' | 'credit' | 'unknown';
  balance: FieldValue<number>;
}

export interface ParsedBankStatement {
  documentType: 'statement';
  bankName?: FieldValue<string>;
  accountNumber?: FieldValue<string>;
  transactions: StatementTransaction[];
}

export type IdType = 'PAN' | 'Aadhaar' | 'Passport' | 'DrivingLicense' | 'VoterID' | 'Unknown';

export interface ParsedIdDocument {
  documentType: 'id';
  idType: IdType;
  idNumber: FieldValue<string>;
  name: FieldValue<string>;
  dateOfBirth?: FieldValue<string>;
  expirationDate?: FieldValue<string>;
}

export type ParsedDocument = ParsedReceipt | ParsedBankStatement | ParsedIdDocument;

export type DocumentRoute = 'receipt' | 'statement' | 'id' | 'auto';

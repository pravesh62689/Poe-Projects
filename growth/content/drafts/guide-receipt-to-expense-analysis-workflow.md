# From Receipt Image to SQL Expense Analytics: A Zero-Code Cross-Bot Pipeline

**Author:** Solutions Architecture & Automation Lead  
**Published:** September 2026 | **Last Tested:** September 7, 2026  
**Audience:** Finance teams, fractional CFOs, small business owners, automation engineers  
**Services:** [OCR-Doc-Parser](https://poe.com/OCR-Doc-Parser), [Regex-Gen-Tester](https://poe.com/Regex-Gen-Tester), [English-To-SQL](https://poe.com/English-To-SQL) on Poe

---

## 1. The Disconnected Tool Problem

Managing small business expenses typically involves three disjointed steps:
1. Photographing paper receipts and manually typing numbers into spreadsheets.
2. Checking invoice tax IDs (e.g., GSTIN, VAT, EIN) against state or corporate formatting rules.
3. Writing complex spreadsheet formulas or database queries to understand where the money went.

By combining three specialized Poe bots, you can automate this entire chain without maintaining servers, writing custom backend code, or paying monthly SaaS subscription fees.

---

## 2. End-to-End Pipeline Overview

```
[ Receipt Photo ] 
       │
       ▼
1. OCR-Doc-Parser  ───> Extracts structured JSON & reconciles tax arithmetic
       │
       ▼
2. Regex-Gen-Tester ──> Validates format of extracted Tax ID / Invoice Number
       │
       ▼
3. English-To-SQL  ───> Inserts rows into SQLite sandbox & answers natural-language questions
```

---

## 3. Step-by-Step Implementation Guide

### Step 1: Extract Document Metadata with OCR-Doc-Parser
Upload your photographed paper receipt to [@OCR-Doc-Parser](https://poe.com/OCR-Doc-Parser) with this prompt:
```text
Extract this receipt to structured JSON with vendor name, tax ID, date, line items, and tax reconciliation.
```

**Verified Extracted Output:**
```json
{
  "vendor": "OFFICE SUPPLY DEPOT",
  "tax_id": "27AAPFU0912K1ZV",
  "date": "2026-03-12",
  "items": [
    { "name": "Laser Toner Cartridge", "qty": 2, "price": 45.00 },
    { "name": "Recycled Paper Box", "qty": 5, "price": 8.50 }
  ],
  "subtotal": 132.50,
  "tax": 11.93,
  "total": 144.43,
  "reconciliation": "balanced"
}
```

---

### Step 2: Validate Tax Identification Syntax with Regex-Gen-Tester
Before committing the record to financial records, verify that the 15-character GSTIN tax ID follows standard checksum syntax via [@Regex-Gen-Tester](https://poe.com/Regex-Gen-Tester):
```text
Generate a regex for 15-character Indian GSTIN format: 2 digits state code, 10 alphanumeric PAN, 1 entity code, 1 literal Z, 1 check digit.
Test against: 27AAPFU0912K1ZV
```

**Verified Evaluation Response:**
```text
Pattern: ^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$
Evaluation:
✓ 27AAPFU0912K1ZV -> MATCH (Verified syntax)
```

---

### Step 3: Ingest and Analyze Spending Trends with English-To-SQL
Now append the verified record into an expense table and ask analytical questions using [@English-To-SQL](https://poe.com/English-To-SQL):

```sql
CREATE TABLE company_expenses (
  id INTEGER PRIMARY KEY,
  vendor TEXT,
  category TEXT,
  expense_date DATE,
  amount REAL
);

INSERT INTO company_expenses VALUES 
(1, 'OFFICE SUPPLY DEPOT', 'Supplies', '2026-03-12', 144.43),
(2, 'CLOUD HOSTING INC', 'Software', '2026-03-01', 350.00),
(3, 'COFFEE ROASTERS', 'Meals', '2026-03-05', 42.10),
(4, 'OFFICE SUPPLY DEPOT', 'Supplies', '2026-02-18', 85.00);

Question: What is total spend by category, and what percentage of total spend does each represent?
```

**Verified SQL Query & Results:**
```sql
SELECT 
  category, 
  ROUND(SUM(amount), 2) AS total_spent,
  ROUND(SUM(amount) * 100.0 / (SELECT SUM(amount) FROM company_expenses), 1) AS pct_of_total
FROM company_expenses
GROUP BY category
ORDER BY total_spent DESC;
```

#### Verified Results:
| category | total_spent | pct_of_total |
| :--- | :--- | :--- |
| Software | 350.00 | 56.3% |
| Supplies | 229.43 | 36.9% |
| Meals | 42.10 | 6.8% |

---

## 4. Privacy & Operational Invariants

- **Ephemeral Sandboxing:** Neither your receipts nor your financial records are permanently stored. Each bot operates strictly in-memory during conversational turns.
- **Zero Integration Glue:** You don't need Zapier, webhooks, or API keys; the pipeline functions directly within the Poe chat UI.

---

## 5. Get Started Across the Suite

Try the three bots for yourself on Poe:
- 📄 **[OCR-Doc-Parser](https://poe.com/OCR-Doc-Parser)**
- ⚡ **[Regex-Gen-Tester](https://poe.com/Regex-Gen-Tester)**
- 📊 **[English-To-SQL](https://poe.com/English-To-SQL)**

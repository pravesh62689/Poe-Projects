# Apex Forge Technology — Synthetic Receipt-to-Expense Analysis Pipeline

**Document Version:** 1.0.0  
**Pipeline Scope:** Unstructured Document Image -> Structured JSON -> Field Validation -> SQL In-Memory Analysis  
**Last Tested Date:** 2026-09-08  
**Privacy Invariant:** Uses synthetic test entities only.

---

## 1. Pipeline Overview Diagram

```
[Raw Receipt Image]
        |
        v
[Stage 1: Apex Forge OCR (@OCR-Doc-Parser)]
  - Extracts text, dates, subtotal, tax, total
  - Emits field confidence metrics
  - Reconciles: subtotal + tax == total
        |
        v
[Stage 2: Apex Forge Regex (@Regex-Gen-Tester)] (Optional)
  - Validates merchant tax number format (e.g. GSTIN)
  - Rejects malformed invoice codes
        |
        v
[Stage 3: Apex Forge SQL (@English-To-SQL)]
  - Loads rows into temporary SQLite table
  - Answers natural language spending questions
  - Returns structured tabular breakdown
```

---

## 2. Stage-by-Stage Trace

### Stage 1: Document Extraction Output
```json
{
  "merchant_name": "Apex Cloud Infrastructure",
  "invoice_number": "INV-2026-8841",
  "tax_id": "27AAACB1234F1Z5",
  "date": "2026-08-01",
  "category": "Cloud Hosting",
  "amount_usd": 149.00,
  "confidence": 0.96
}
```

### Stage 2: Tax ID Regex Validation
- **Pattern Checked:** `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`
- **Result:** `27AAACB1234F1Z5` -> VALID MATCH.
- **Decision:** Safe to append to expense database.

### Stage 3: In-Memory SQL Analysis
```sql
CREATE TABLE monthly_expenses (
  id INTEGER PRIMARY KEY,
  merchant TEXT,
  category TEXT,
  amount_usd REAL,
  expense_date TEXT
);

-- Insert extracted rows...

-- Question: "What percentage of our monthly budget went to Cloud Hosting?"
SELECT 
  category,
  ROUND(SUM(amount_usd), 2) AS category_total,
  ROUND(SUM(amount_usd) * 100.0 / (SELECT SUM(amount_usd) FROM monthly_expenses), 1) AS pct_of_spend
FROM monthly_expenses
GROUP BY category;
```

---

## 3. Implementation Lessons
1. **Never force Regex where not needed:** Normal line-item math should be done with standard arithmetic, not complex regex.
2. **Always cross-check totals:** If `line_items.sum() != total_amount`, prompt user with a warning chip before running database inserts.

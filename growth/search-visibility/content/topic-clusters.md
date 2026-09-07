# Apex Forge Technology — Strategic Topic Clusters & Content Architecture

**Document Version:** 1.0.0  
**Principle:** Focus on task-specific, high-intent technical queries backed by live tool utility. Avoid broad, non-converting generic keywords.

---

## Cluster 1: Document Extraction & Receipt OCR (Apex Forge OCR)
- **Primary Tool URL:** `/receipt-ocr/`
- **Associated Bot:** `@OCR-Doc-Parser` on Poe
- **Core User Pain Point:** Manual data entry of receipts, invoices, and bills is tedious, error-prone, and slow. Users need structured JSON with per-field confidence scoring and arithmetic verification.
- **Topics & Intent Mapping:**
  1. **Receipt OCR to JSON:** Direct conversion of receipt image into standardized JSON schema.
  2. **Receipt Total, Tax & Line Items:** Parsing line items with quantity, unit price, and subtotal math reconciliation.
  3. **Invoice Fields Extraction:** Extracting vendor name, invoice date, invoice number, and statutory tax codes.
  4. **Receipt Photography Best Practices:** How lighting, framing, and angle directly affect OCR accuracy.
  5. **Blurry & Glare Scan Mitigation:** Tips for scanning thermal paper and avoiding flash bounce.
  6. **Tax & Total Reconciliation:** Arithmetic check `Sum(Items) + Tax == Total` to catch digit transposition.
  7. **Confidence Flags Explained:** What 0.0 to 1.0 field confidence indicates and how to review low-scoring fields.
  8. **Receipt Test Cases:** Standardized test inputs for developers evaluating parsing capabilities.
  9. **Tax Invoice Field Checklist:** Statutory fields required on GST and VAT commercial invoices.
  10. **Document Extraction Pipeline:** How OCR feeds into downstream databases and workflows.

---

## Cluster 2: Regular Expression Generation & Safety (Apex Forge Regex)
- **Primary Tool URL:** `/regex-tester/`
- **Associated Bot:** `@Regex-Gen-Tester` on Poe
- **Core User Pain Point:** Regex syntax is hard to write and easy to break; catastrophic backtracking (ReDoS) can freeze web servers. Users need regex generated from plain English and tested against positive and negative strings in an isolated environment.
- **Topics & Intent Mapping:**
  1. **Regex Generator & Tester:** Turn English requirements into working expressions tested against strings.
  2. **Positive & Negative Test Cases:** Verifying strings that MUST match and strings that MUST fail.
  3. **Capture Groups & Named Substrings:** Extracting domain from email, area code from phone, etc.
  4. **ReDoS Catastrophic Backtracking:** Identifying nested quantifiers `(a+)+` and ambiguous alternations.
  5. **Email Regex Testing:** Validating real-world email formats without breaking RFC standards.
  6. **Phone Number Regex Testing:** Country-specific phone patterns (e.g. 10-digit Indian mobile formats).
  7. **Standard Formats Library:** UUID, ISO-8601 dates, URLs, IPv4/IPv6, and MAC addresses.
  8. **Regex Debugging Guide:** How to step through non-matching expressions and find missing escapes.
  9. **When Regex is Not Appropriate:** Distinguishing regular languages from nested/recursive grammars (HTML/JSON).

---

## Cluster 3: Natural Language to SQL & Sandbox Testing (Apex Forge SQL)
- **Primary Tool URL:** `/english-to-sql/`
- **Associated Bot:** `@English-To-SQL` on Poe
- **Core User Pain Point:** Non-engineers struggle to write complex multi-table SQL JOINs; engineers want rapid query prototyping against an isolated database sandbox. Users need SQL generated from questions and executed against sample schemas.
- **Topics & Intent Mapping:**
  1. **English to SQL with Schema:** Turning questions into queries using user-provided table definitions.
  2. **SQL Query Testing with Sample Data:** Dry-running queries in an in-memory SQLite sandbox.
  3. **Relational JOINs:** INNER, LEFT, and self-referential JOINs on orders and customer tables.
  4. **Aggregations & GROUP BY:** Calculating monthly summaries, counts, and averages.
  5. **Schema DDL Templates:** Clean SQL create table statements ready for testing.
  6. **SQLite Sandbox Architecture:** In-memory `:memory:` database lifecycle and security isolation.
  7. **SQL Error Debugging:** Interpreting syntax errors, ambiguous column names, and type mismatches.
  8. **SQLite vs PostgreSQL / MySQL:** Syntax differences in date arithmetic, boolean types, and upserts.
  9. **Expense Reporting Queries:** Using SQL to analyze extracted document data for monthly budgets.

---

## Cluster 4: Integrated Pipeline (Receipt -> Validate -> SQL)
- **Primary Workflow URL:** `/workflows/receipt-to-expense-analysis/`
- **Core Value:** Demonstrates how Apex Forge OCR extracts data, Apex Forge Regex optionally validates fields, and Apex Forge SQL aggregates expense summaries—all with zero external database setup.

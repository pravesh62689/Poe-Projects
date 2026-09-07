# Growth Asset & Creative Library

**Inventory:** Reusable developer assets, code fixtures, schema sandboxes, and copyable snippets.

---

## 1. Interactive Technical Assets

### A. SQL Learning & Sandbox Schemas
- **E-Commerce Schema:** `users`, `orders`, `order_items`, `products` tables with sample records.
  - Location: `sql-bot/test/fixtures/ecommerce.sql`
  - Web Guide: `https://poe-developer-suite.pages.dev/guides/sql-joins-with-sample-schema/`
- **Department Payroll Schema:** `departments`, `employees`, `salaries` with window function benchmarks.

### B. Regex Test Patterns & Anti-ReDoS Suites
- **Email Validation (RFC 5322 Compliant Subset):** Tested against 50 edge cases.
- **Indian Phone Numbers (+91):** Formats covering standard 10-digit mobile, STD codes, and prefixes.
- **Catastrophic Backtracking Benchmark:** Evil regex samples (`(a+)+$`) demonstrating safe-regex rejection.

### C. Receipt OCR Synthetic Test Images
- Clean Supermarket Receipt (Acme Mart synthetic fixture with human-verified ground truth).
- Skewed Gas Station Receipt (15-degree rotation testing projection profile deskew).
- Blurred Rejection Fixture (Laplacian variance < 100 trigger).

---

## 2. Public Technical Guides & Landing Pages

| Resource | Live Public URL | Primary Value Proposition |
| :--- | :--- | :--- |
| **Suite Homepage** | `https://poe-developer-suite.pages.dev/` | Developer productivity toolkit overview |
| **Receipt OCR Engine** | `https://poe-developer-suite.pages.dev/receipt-ocr/` | Line-item extraction & arithmetic reconciliation |
| **Regex Sandbox** | `https://poe-developer-suite.pages.dev/regex-tester/` | Pattern generation with ReDoS safety analysis |
| **English to SQL** | `https://poe-developer-suite.pages.dev/english-to-sql/` | Instant in-memory SQLite schema execution |
| **Photographing Receipts Guide** | `https://poe-developer-suite.pages.dev/guides/how-to-photograph-receipts/` | Camera angle, lighting, and shadow avoidance |
| **Tax Invoice & GSTIN Fields** | `https://poe-developer-suite.pages.dev/guides/tax-invoice-gstin-fields/` | Breakdown of tax registration numbers and totals |
| **SQL Joins with Sample Data** | `https://poe-developer-suite.pages.dev/guides/sql-joins-with-sample-schema/` | Interactive schema join walkthrough |
| **SQLite vs PostgreSQL Syntax** | `https://poe-developer-suite.pages.dev/guides/sqlite-vs-postgres-syntax/` | Date functions, auto-increment, and types |

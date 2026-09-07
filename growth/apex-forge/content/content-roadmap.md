# Apex Forge Technology — Content Strategy & Production Roadmap

**Document Version:** 1.0.0  
**Core Thesis:** Authority is built on verifiable technical proof, synthetic reproducibility, and transparent limitations—never on shallow AI fluff.

---

## 1. Content Production & Quality Gates
Every published document must pass five automated verification gates before publication:
1. **Gate 1 (Claims):** `node scripts/growth/check-claims.js` — 0 unsubstantiated superlatives.
2. **Gate 2 (Links):** `node scripts/growth/check-links.js` — 0 broken internal or external links.
3. **Gate 3 (SEO):** `node scripts/growth/audit-seo.js` — 0 duplicate titles, descriptions, or H1 tags.
4. **Gate 4 (Accessibility):** `node scripts/growth/check-accessibility.js` — WCAG 2.1 AA compliant.
5. **Gate 5 (Duplicates):** `node scripts/growth/check-duplicate-content.js` — 0 doorway or spun content.

---

## 2. Master Content Inventory & Publication Status

| Page Route | Audience | Search Intent | Primary Topic | Unique Evidence Provided | Primary CTA | Status | Quality Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/receipt-ocr/` | Accountants, Engineers, Bookkeepers | Transactional | Receipt & invoice data extraction to JSON | Field-confidence scoring breakdown and arithmetic cross-check table | Open Apex Forge OCR on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/regex-tester/` | Web Developers, QA Engineers | Transactional | Regex generation, testing, and ReDoS analysis | Positive/negative test case runner, catastrophic backtracking warning | Open Apex Forge Regex on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/english-to-sql/` | Data Analysts, Product Managers | Transactional | Natural language query generation with schema | In-memory SQLite execution result table and dialect comparison note | Open Apex Forge SQL on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/workflows/receipt-to-expense-analysis/` | Finance Ops, Systems Integrators | Transactional / Integration | Synthetic receipt-to-expense SQL pipeline | 3-step synthetic data trace: Receipt -> JSON -> Regex -> SQLite aggregation | Explore the Tools on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/guides/how-to-photograph-receipts/` | Mobile app users, Expense submitters | Informational | Receipt photography best practices | 5-point visual checklist (framing, lighting, glare reduction, flat folding) | Test with Apex Forge OCR on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/guides/tax-invoice-gstin-fields/` | Indian SMBs, Accountants | Informational / Compliance | B2B tax invoice fields & 15-char GSTIN regex | GSTIN regex pattern breakdown and statutory field checklist | Try Apex Forge Tools on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/guides/sql-joins-with-sample-schema/` | Junior analysts, Backend developers | Informational / Educational | Relational SQL JOINs and GROUP BY queries | Executable customer/orders SQLite schema and verified query outputs | Run with Apex Forge SQL on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/guides/sqlite-vs-postgres-syntax/` | Full-stack developers, DBAs | Informational / Technical | SQL dialect differences & compatibility | 6-point comparison matrix (Types, Dates, Strings, Concatenation, Upsert) | Test queries in Apex Forge SQL | PUBLISHED | PASSED (All 5 Gates) |
| `/examples/` | Developers, Technical evaluators | Reference | Copyable prompts & test inputs | Tested prompt library across OCR, Regex, and SQL tools | Open Tools on Poe | PUBLISHED | PASSED (All 5 Gates) |
| `/benchmarks/` | Technical leads, Evaluators | Evaluative | Execution speed, pass rate, and methodology | Transparent test methodology separating local suites from live Poe runs | View Methodology | PUBLISHED | PASSED (All 5 Gates) |

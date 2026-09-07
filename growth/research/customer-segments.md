# Customer Segments & User Personas

**Standard:** Product Marketing & Customer Research  
**Date:** September 2026

---

## 1. Segment 1: Freelance Consultants & Small Business Operators
- **Primary Tool:** `OCR-Doc-Parser` (Secondary: `English-To-SQL`)
- **Key Pain Point:** Collecting paper receipts from travel, coffee shops, and suppliers, manually transcribing them into spreadsheets for monthly expense filing.
- **Willingness to Pay:** Medium ($5–$15/month value). Happy to spend Poe subscription points for automated extraction.
- **Critical Requirement:** Line items, merchant name, date, and tax reconciliation. Blurry photo warnings save time.
- **Conversion Trigger:** Uploads single receipt photo; receives clean JSON/CSV with balanced totals in Turn 1.

---

## 2. Segment 2: Full-Stack Developers & DevOps Engineers
- **Primary Tool:** `Regex-Gen-Tester`
- **Key Pain Point:** Struggling to construct non-trivial regex patterns (e.g. strict email, phone with country code, slugify, markdown parser) and worrying about catastrophic backtracking (ReDoS) crashing Node.js servers.
- **Willingness to Pay:** Low cash direct, high platform points tolerance.
- **Critical Requirement:** Execution against actual positive and negative sample strings, capture group inspection, ReDoS complexity rating.
- **Conversion Trigger:** Provides prompt with test strings; receives passing regex with microsecond execution timing and zero ReDoS risk.

---

## 3. Segment 3: Data Analysts & Product Managers
- **Primary Tool:** `English-To-SQL` (Secondary: `OCR-Doc-Parser` via Cross-Bot Pipeline)
- **Key Pain Point:** Writing complex multi-table SQL queries, date bucketing, and window functions without hallucinated columns or broken JOIN syntax.
- **Willingness to Pay:** High ($10–$30/month value).
- **Critical Requirement:** Sandboxed execution where the bot runs the query in an in-memory SQLite database before presenting the answer.
- **Conversion Trigger:** Pastes a `CREATE TABLE` schema with a question; receives verified SQL along with actual returned rows.

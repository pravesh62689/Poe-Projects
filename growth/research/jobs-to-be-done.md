# Jobs-to-Be-Done (JTBD) Framework

**Standard:** Product Strategy & Customer Value Architecture  
**Date:** September 2026

---

## 1. Job 1: Receipt & Expense Ingestion
- **When:** I finish a business trip or make a supplier purchase and hold paper/digital receipts.
- **I Want To:** Upload photos of my receipts to get clean structured JSON with verified item subtotals and tax amounts.
- **So That:** I can file my expense reports in seconds without manually typing numbers or making accounting errors.
- **Hiring Criteria:**
  - Tolerates camera tilt up to 15°.
  - Flags camera blur before returning garbage numbers.
  - Verifies that $\text{Subtotal} + \text{Tax} = \text{Total}$.
  - Never stores my receipts in external databases.

---

## 2. Job 2: Safe Regular Expression Authoring
- **When:** I need to validate user inputs or parse custom text strings in my web application.
- **I Want To:** Describe the pattern requirements in plain English alongside positive and negative test cases.
- **So That:** I get a regular expression that is proven to match my strings and is verified free of ReDoS catastrophic backtracking.
- **Hiring Criteria:**
  - Evaluates on my test strings in real-time.
  - Explains capture groups clearly.
  - Flags nested quantifiers like `(a+)+$` before they reach production.

---

## 3. Job 3: Schema-Aware Analytical Querying
- **When:** I need to analyze relational data or compute business metrics from database tables.
- **I Want To:** Ask questions in plain English grounded in my physical schema.
- **So That:** I receive working SQL queries that have already been executed and verified in an in-memory database.
- **Hiring Criteria:**
  - Never invents column names not present in my schema.
  - Executes multi-table JOINs and aggregations cleanly.
  - Shows the actual tabular results returned by the SQLite engine.

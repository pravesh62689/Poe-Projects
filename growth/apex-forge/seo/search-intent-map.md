# Apex Forge Technology — Search Intent & Query Mapping

**Document Version:** 1.0.0  
**Strategic Principle:** Target high-intent, task-specific long-tail queries backed by concrete tool execution. Avoid vague generic single-word keywords ("AI", "OCR", "SQL").

---

## 1. Search Intent Classifications
We segment user queries into three primary operational categories:
1. **Transactional / Tool Execution:** The user has an immediate file or schema and wants to execute an action (e.g. "extract data from receipt image", "English to SQL with schema").
2. **Informational / Troubleshooting:** The user encounters an error or requires guidance (e.g. "blurry receipt OCR tips", "regex ReDoS checker", "SQLite vs Postgres syntax").
3. **Workflow / Integration:** The user is architecting an end-to-end multi-step data pipeline (e.g. "receipt image to expense data", "natural language to SQL workflow").

---

## 2. Topic Cluster Strategy

### Cluster 1: Document Extraction & Receipt OCR
- **Core Problem:** Manual entry of receipts and invoices is slow and error-prone. Users need structured JSON with confidence signals.
- **Intent Group A (Immediate Tool Need):**
  - "extract data from receipt image" -> `/receipt-ocr/`
  - "receipt OCR to JSON" -> `/receipt-ocr/`
  - "extract invoice fields from image" -> `/receipt-ocr/`
  - "scan receipt total and tax" -> `/receipt-ocr/`
- **Intent Group B (Image Quality & Best Practices):**
  - "blurry receipt OCR tips" -> `/guides/how-to-photograph-receipts/`
  - "how to take receipt photo for OCR" -> `/guides/how-to-photograph-receipts/`
- **Intent Group C (Regional Tax Compliance Context):**
  - "GST invoice field extraction" -> `/guides/tax-invoice-gstin-fields/`
  - "verify GSTIN on invoice image" -> `/guides/tax-invoice-gstin-fields/`

### Cluster 2: Regular Expression Generation & Safety
- **Core Problem:** Regex syntax is cryptic; catastrophic backtracking (ReDoS) poses a severe security risk. Users need generated patterns validated against real test cases.
- **Intent Group A (Pattern Creation & Testing):**
  - "regex generator with test cases" -> `/regex-tester/`
  - "test regex against examples" -> `/regex-tester/`
  - "regex tester with capture groups" -> `/regex-tester/`
- **Intent Group B (Security & Performance):**
  - "regex ReDoS checker" -> `/regex-tester/`
  - "prevent catastrophic backtracking regex" -> `/regex-tester/`
- **Intent Group C (Concrete Pattern Lookups):**
  - "email regex tester", "Indian phone regex", "UUID regex tester" -> `/examples/`

### Cluster 3: Natural Language to SQL & Query Verification
- **Core Problem:** Non-engineers struggle to write complex JOINs; engineers need rapid query prototyping against an isolated database sandbox.
- **Intent Group A (Schema + English Querying):**
  - "English to SQL with schema" -> `/english-to-sql/`
  - "generate SQL and test it" -> `/english-to-sql/`
  - "SQLite query tester" -> `/english-to-sql/`
- **Intent Group B (Dialect Compatibility):**
  - "SQLite vs PostgreSQL syntax" -> `/guides/sqlite-vs-postgres-syntax/`
- **Intent Group C (Complex Query Construction):**
  - "SQL JOIN examples with sample schema" -> `/guides/sql-joins-with-sample-schema/`
  - "SQL aggregation queries" -> `/guides/sql-joins-with-sample-schema/`

---

## 3. SEO Anti-Patterns Strictly Prohibited
1. **No Keyword Stuffing:** Keywords are embedded naturally in descriptive headings and copy.
2. **No Location / Doorway Spam:** Zero programmatic landing pages generated for geographic cities (e.g. "Receipt OCR in Mumbai", "SQL Generator in London") without genuine localized physical infrastructure.
3. **No Unsubstantiated Ranking Promises:** Never guarantee #1 position or immediate search engine indexing.

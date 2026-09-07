# Apex Forge Technology — Page-to-Keyword Mapping Matrix

**Document Version:** 1.0.0  
**Scope:** 17 public routes in `site/`  
**Rule:** Strict 1-to-1 primary search intent mapping per URL to eliminate internal keyword cannibalization.

---

| Page Route | Page Purpose | Primary Target Query | Secondary Target Queries | Primary User Intent |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Apex Forge Technology Home | "practical developer AI tools" | "developer utility suite", "document extraction regex sql" | Navigational / Brand Evaluation |
| `/receipt-ocr/` | Apex Forge OCR Tool Landing | "extract data from receipt image" | "receipt OCR to JSON", "extract invoice fields from image", "scan receipt total and tax" | Transactional / Tool Execution |
| `/regex-tester/` | Apex Forge Regex Tool Landing | "regex generator with test cases" | "regex tester with capture groups", "regex ReDoS checker", "test regex against examples" | Transactional / Tool Execution |
| `/english-to-sql/` | Apex Forge SQL Tool Landing | "English to SQL with schema" | "generate SQL and test it", "SQLite query tester", "SQL query generator with sample data" | Transactional / Tool Execution |
| `/workflows/receipt-to-expense-analysis/` | End-to-End Expense Pipeline | "receipt image to expense data" | "receipt to SQL workflow", "automated invoice data pipeline" | Transactional / Integration |
| `/guides/` | Technical Knowledge Hub | "developer data extraction guides" | "OCR and SQL tutorials", "regex best practices" | Informational Hub |
| `/guides/how-to-photograph-receipts/` | Document Image Optimization | "blurry receipt OCR tips" | "how to photograph receipts for OCR", "mobile document scanning tips" | Informational Guide |
| `/guides/tax-invoice-gstin-fields/` | Tax Invoice & GST Extraction | "GST invoice field extraction" | "GSTIN regex validation", "tax invoice required fields checklist" | Informational / Educational |
| `/guides/sql-joins-with-sample-schema/` | Schema JOIN Query Design | "SQL JOIN examples with sample schema" | "SQL aggregation queries", "relational database join tutorial" | Informational / Educational |
| `/guides/sqlite-vs-postgres-syntax/` | SQL Dialect Differences | "SQLite vs PostgreSQL syntax" | "convert SQLite query to Postgres", "SQL dialect compatibility" | Informational / Educational |
| `/examples/` | Copyable Prompts & Tests | "receipt OCR and SQL examples" | "tested regex examples", "invoice JSON format sample" | Technical Reference |
| `/benchmarks/` | Latency & Accuracy Methodology | "OCR and SQL bot benchmarks" | "Poe bot latency tests", "document extraction benchmark methodology" | Evidence & Validation |
| `/about/` | Corporate Background | "Apex Forge Technology" | "Apex Forge Tools mission", "developer productivity tools company" | Brand Navigational |
| `/privacy/` | Privacy Policy | "Apex Forge Technology privacy policy" | "Poe bot data handling", "zero-retention document processing" | Trust & Compliance |
| `/terms/` | Terms of Service | "Apex Forge Technology terms of service" | "commercial use policy", "developer tools terms" | Trust & Legal |
| `/contact/` | Support & Feedback | "Apex Forge Technology contact" | "Poe bot feedback", "developer support" | Support / Communication |
| `/404.html` | Error Fallback | N/A (`noindex, follow`) | N/A | Navigation Recovery |

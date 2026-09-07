# Apex Forge Technology — Paid Search Landing Page Match Map

**Document Version:** 1.0.0  
**Quality Score Defense:** Ensure strict parity between user search intent, ad creative copy, and landing page hero content to maintain high Quality Scores (expected 8/10+) and reduce effective CPCs when budget is approved.

---

## Landing Page Match Matrix

| Ad Group Focus | User Search Intent | Primary Ad Copy Promise | Mapped Landing Page | On-Page Hero Headline Confirmation | Conversion Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **OCR / Receipt Extraction** | Convert receipt images to structured JSON with tax/line items | "Extract receipt fields to structured JSON with confidence flags" | `/receipt-ocr/` | "Apex Forge OCR: Extract Structured Data from Receipts & Invoices" | Single click to Poe bot with sample receipt prompt |
| **OCR / Invoice Parsing** | Extract supplier, GSTIN, and total from invoices | "Parse invoice fields from image with field-confidence indicators" | `/receipt-ocr/` | "Apex Forge OCR: Extract Structured Data from Receipts & Invoices" | Single click to Poe bot with invoice prompt |
| **Regex / Pattern Generation** | Generate regex from natural language and test strings | "Generate regex from English and test against sample strings" | `/regex-tester/` | "Apex Forge Regex: Generate, Test, and Inspect Regular Expressions" | Single click to Poe bot with copyable regex test case |
| **Regex / ReDoS Inspection** | Detect exponential backtracking vulnerabilities | "Inspect capture groups and flag catastrophic backtracking risks" | `/regex-tester/` | "Apex Forge Regex: Generate, Test, and Inspect Regular Expressions" | Single click to Poe bot with ReDoS prompt |
| **SQL / Natural Language Query** | Write SQL from plain English using custom schema | "Turn schema + English into SQL and execute in a temporary sandbox" | `/english-to-sql/` | "Apex Forge SQL: Translate Natural Language to Executable SQL" | Single click to Poe bot with sample SQLite schema |
| **SQL / Query Testing** | Validate SQL queries against sample data | "Test query outputs in an in-memory SQLite sandbox environment" | `/english-to-sql/` | "Apex Forge SQL: Translate Natural Language to Executable SQL" | Single click to Poe bot with test query prompt |
| **Full Pipeline / Workflow** | End-to-end receipt extraction and SQL expense analysis | "Extract receipt data, validate formatting, and analyze with SQL" | `/workflows/receipt-to-expense-analysis/` | "End-to-End Workflow: Receipt Extraction to SQL Expense Analysis" | Explore tools on Poe |

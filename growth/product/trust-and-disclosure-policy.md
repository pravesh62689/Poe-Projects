# Product Trust, Disclaimers & Disclosure Policy

**Standard:** Enterprise Consumer Protection & Factual Disclosures  
**Date:** September 2026

---

## 1. Mandatory Product Disclaimers

### OCR Disclaimer
> *"OCR-Doc-Parser provides extraction assistance, not legal, tax, or official document certification. Users must verify financial totals, tax rates, and identification numbers before relying on them for tax filings or accounting ledgers."*

### Regex Disclaimer
> *"Regex-Gen-Tester evaluates string formatting patterns against sample data. A regex match verifies syntax structure; it does not guarantee a functioning email mailbox, an active phone line, or business-rule compliance."*

### SQL Disclaimer
> *"English-To-SQL executes queries in an isolated, temporary SQLite sandbox using the schema you provide. Always verify dialect differences, execution plans, and data safety implications before running queries against production enterprise databases."*

---

## 2. Privacy & Data Handling Disclosures
- **Zero-Persistence:** Documents, raw images, OCR text, database schemas, and sample records exist ephemerally in RAM during the query turn and are garbage-collected upon response completion.
- **No Model Training:** Customer document inputs and prompts are never collected, persisted, or used for model training.
- **Security Isolation:** Unauthenticated traffic is rejected with HTTP 401. Server paths, environment variables, and platform access keys are never emitted into logs or client-facing error payloads.

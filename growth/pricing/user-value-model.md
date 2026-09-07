# Customer Perceived Value & Willingness-to-Pay Model

**Standard:** Value-Based Pricing Architecture  
**Date:** September 2026

---

## 1. Value Metric Quantification

| Bot Service | Core Value Metric | Alternative Customer Option | Customer Time / Cost Saved | Perceived Value Tier |
| :--- | :--- | :--- | :--- | :---: |
| **`OCR-Doc-Parser`** | Accurate receipt line-item extraction with balanced tax math | Manual data entry into QuickBooks / Expensify (3–5 min per receipt) | Saves ~4 minutes per receipt; prevents arithmetic filing errors | **High ($0.05–$0.15 / receipt)** |
| **`English-To-SQL`** | Verified query execution with tabular output in SQLite sandbox | Writing trial-and-error SQL queries or hiring freelance data analyst ($50/hr) | Saves 10–20 minutes of syntax debugging; prevents production syntax crashes | **Medium-High ($0.02–$0.05 / query)** |
| **`Regex-Gen-Tester`** | Real sample execution with ReDoS catastrophic backtracking check | Reading regex syntax manuals or debugging regexes on production servers | Saves 5–15 minutes; protects against Node.js CPU lockouts | **Medium ($0.01–$0.03 / pattern)** |

---

## 2. Poe Platform Willingness-to-Pay Dynamic

Poe users subscribe at $19.99/month for compute points (1,000,000 compute points/month on standard plans). Because points are perceived as a platform allowance rather than direct out-of-pocket credit card charges:
- A fee of **$0.004–$0.010 per message** deducts ~4–10 points per turn.
- This represents less than $0.01\%$ of their monthly point allotment.
- Result: Price sensitivity is exceptionally low as long as the bot reliably completes the task without wasting turns.

# Final Evidence-Based Pricing Recommendation

**Standard:** Enterprise Pricing Strategy & Commercial Operations  
**Date:** September 2026

---

## 1. Executive Pricing Recommendation Table

| Bot Service | Current Setting in Poe | Recommended Initial Price | Candidate Test Price | Strategic Rationale | Cost Risk | User Value Evidence | Activation Risk | Increase Gate | Rollback Trigger |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **OCR-Doc-Parser** | $0.00 (Unmonetized) | **$10.00 / 1,000 msgs** ($0.01/turn) | $12.00 / 1,000 msgs | High compute cost (WASM OCR); high business utility (expense receipts, invoices). | Render free container memory/CPU limits. | Structured JSON extraction with subtotal + tax reconciliation. | User abandons if cold-start latency exceeds 40s. | $\ge 100$ tasks, $>85\%$ success, $>4.5$ stars. | Activation drops $>20\%$; revert to $10.00 in Poe Studio. |
| **English-To-SQL** | $0.00 (Unmonetized) | **$6.00 / 1,000 msgs** ($0.006/turn) | $8.00 / 1,000 msgs | Mid-tier; executed in-memory SQLite sandbox guarantees verified results. | Minimal edge compute risk. | Eliminates guessed syntax; returns verified markdown tables. | User lacks schema on Turn 1. | $\ge 100$ tasks, $>85\%$ success, $>4.5$ stars. | Activation drops $>20\%$; revert to $6.00 in Poe Studio. |
| **Regex-Gen-Tester** | $0.00 (Unmonetized) | **$4.00 / 1,000 msgs** ($0.004/turn) | $5.00 / 1,000 msgs | Low-friction developer gateway bot; drives top-of-funnel cross-bot discovery. | Negligible edge compute cost. | Evaluates pattern against live test strings and checks ReDoS risks. | Crowded category of free regex tools. | $\ge 100$ tasks, $>85\%$ success, $>4.5$ stars. | Activation drops $>15\%$; revert to $4.00 in Poe Studio. |

---

## 2. External Action Requirement

Because Poe Creator Studio does not offer an external REST API or webhook for creator pricing updates:
- This change is marked **BLOCKED_EXTERNAL_ACTION** in automated pipelines.
- Detailed step-by-step instructions to configure these values manually in `poe.com/edit_bot` are documented in [growth/operations/external-actions-required.md](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/growth/operations/external-actions-required.md).

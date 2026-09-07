# Apex Forge Technology — User Retention & Repeat Use Backlog

**Document Version:** 1.0.0  
**Objective:** Improve 7-day and 30-day retention of users who test our bots on Poe.

---

## 1. Prioritized Retention Experiments

| Experiment ID | Focus Area | Proposed Feature / Optimization | Expected Impact | Implementation Complexity | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RET-01** | OCR Response Usability | Offer a 1-click Markdown table output alongside raw JSON | Reduces friction for users copying data into Notion/Excel | Low | P1 |
| **RET-02** | Regex Explanation | Provide plain-English token breakdown of generated patterns | Educates developer and prevents prompt abandonment | Low | P1 |
| **RET-03** | SQL Sandbox Error Recovery | When SQLite returns syntax error, bot suggests exact corrected query with explanation | Keeps user in conversation rather than dropping out | Medium | P1 |
| **RET-04** | Prompt History Memory | In multi-turn sessions, remember the user's active schema across turns | Eliminates need to re-paste DDL on every question | Medium | P2 |
| **RET-05** | Batch Receipt Comparison | Allow user to upload 2 receipts and compare item price differences | High utility for office managers and bookkeepers | High | P3 |

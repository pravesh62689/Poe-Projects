# Apex Forge Technology — Content Gap & Expansion Backlog

**Document Version:** 1.0.0  
**Strategy:** Systematic technical content expansion to capture untapped long-tail developer and business search queries.

---

## 1. Prioritized Content Expansion Backlog

| Backlog ID | Proposed Title / Topic | Target Query | Target URL | Business Intent | Evidence Required Before Publication | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GAP-001** | Extracting Line Items from Multi-Page PDF Invoices | "multi-page invoice OCR to JSON" | `/guides/multi-page-invoice-extraction/` | High (Accounts Payable) | Synthetic 3-page invoice dataset with line-by-line bounding box proof | P1 |
| **GAP-002** | Handling Thermal Paper & Faded Receipts | "thermal receipt OCR scan tips" | `/guides/faded-thermal-receipt-scanning/` | Medium (Expense Reporting) | Contrast enhancement benchmarks comparing raw vs pre-processed images | P1 |
| **GAP-003** | Date Formatting Regex: ISO 8601 vs US vs European | "date regex ISO 8601" | `/guides/date-regex-patterns/` | Medium (Developers) | 20+ unit-tested positive and negative strings with leap year edge cases | P2 |
| **GAP-004** | Writing Safe Password & Token Validation Regex | "password complexity regex without ReDoS" | `/guides/safe-password-regex/` | High (Security) | Backtracking cycle analysis showing linear O(n) execution | P2 |
| **GAP-005** | SQL Window Functions for Expense Trending | "SQL window functions cumulative sum" | `/guides/sql-window-functions-expense-trends/` | High (Analysts) | Executable SQLite query script calculating running totals over sample dates | P1 |
| **GAP-006** | Self-Referential JOINs for Organizational Hierarchies | "self join SQL example with schema" | `/guides/self-referential-joins/` | Medium (Developers) | Schema with manager_id -> employee_id verified in SQLite sandbox | P2 |

---

## 2. Mandatory Publication Gates for New Content
Every future article in this backlog must pass before publishing to `site/`:
1. **Claims Truthfulness Gate:** Zero superlatives or ungrounded claims.
2. **Accessibility Gate:** Clean heading hierarchy, code blocks labeled, WCAG 2.1 AA compliant.
3. **SEO Gate:** Unique title, unique meta description, single H1, canonical URL.
4. **Link Integrity Gate:** All internal and Poe CTA links resolve.
5. **Original Evidence:** Include concrete, copyable, synthetic test payloads.

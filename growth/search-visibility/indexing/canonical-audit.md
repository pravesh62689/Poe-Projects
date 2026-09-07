# Apex Forge Technology — Canonical Tag Consistency Audit

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** 17 HTML files in `site/`  
**Automated Script:** `node scripts/growth/check-canonical-consistency.js`

---

## 1. Canonical Implementation Rules
1. Every HTML file must contain **exactly one** `<link rel="canonical" href="...">` tag.
2. The canonical URL must be an **absolute URL** with the protocol `https://`.
3. The domain must match the production canonical origin: `https://apex-forge-tools.pages.dev`.
4. Zero placeholder domains (`localhost`, `example.com`, `poe-developer-suite.pages.dev`).
5. Trailing slashes must be strictly enforced on directory routes.

---

## 2. Canonical Tag Audit Table

| Local File Path | Embedded Canonical URL | Domain Verified | Matches Route? | Status |
| :--- | :--- | :---: | :---: | :---: |
| `site/index.html` | `https://apex-forge-tools.pages.dev/` | YES | YES | PASS |
| `site/receipt-ocr/index.html` | `https://apex-forge-tools.pages.dev/receipt-ocr/` | YES | YES | PASS |
| `site/regex-tester/index.html` | `https://apex-forge-tools.pages.dev/regex-tester/` | YES | YES | PASS |
| `site/english-to-sql/index.html` | `https://apex-forge-tools.pages.dev/english-to-sql/` | YES | YES | PASS |
| `site/workflows/.../index.html` | `https://apex-forge-tools.pages.dev/workflows/receipt-to-expense-analysis/` | YES | YES | PASS |
| `site/guides/index.html` | `https://apex-forge-tools.pages.dev/guides/` | YES | YES | PASS |
| `site/guides/how-to.../index.html`| `https://apex-forge-tools.pages.dev/guides/how-to-photograph-receipts/` | YES | YES | PASS |
| `site/guides/tax-inv.../index.html`| `https://apex-forge-tools.pages.dev/guides/tax-invoice-gstin-fields/` | YES | YES | PASS |
| `site/guides/sql-jo.../index.html`| `https://apex-forge-tools.pages.dev/guides/sql-joins-with-sample-schema/` | YES | YES | PASS |
| `site/guides/sqlite.../index.html`| `https://apex-forge-tools.pages.dev/guides/sqlite-vs-postgres-syntax/` | YES | YES | PASS |
| `site/examples/index.html` | `https://apex-forge-tools.pages.dev/examples/` | YES | YES | PASS |
| `site/benchmarks/index.html` | `https://apex-forge-tools.pages.dev/benchmarks/` | YES | YES | PASS |
| `site/about/index.html` | `https://apex-forge-tools.pages.dev/about/` | YES | YES | PASS |
| `site/privacy/index.html` | `https://apex-forge-tools.pages.dev/privacy/` | YES | YES | PASS |
| `site/terms/index.html` | `https://apex-forge-tools.pages.dev/terms/` | YES | YES | PASS |
| `site/contact/index.html` | `https://apex-forge-tools.pages.dev/contact/` | YES | YES | PASS |
| `site/404.html` | `https://apex-forge-tools.pages.dev/404.html` | YES | YES | PASS |

---

## 3. Verdict
**Status:** 100% PASS (17/17 Canonical Tags Validated & Consistent)

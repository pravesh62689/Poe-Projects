# Apex Forge Technology — Sitemap Architecture & Quality Audit

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Live Endpoint:** `https://apex-forge-tools.pages.dev/sitemap.xml`  
**Automated Generator:** `node scripts/growth/build-sitemap.js`

---

## 1. Quality & Invariant Checklist

| Invariant Requirement | Standard | Observed Value | Verdict |
| :--- | :--- | :--- | :--- |
| **Well-Formed XML** | Valid UTF-8 XML with `<urlset>` namespace | UTF-8 XML 1.0 | PASS |
| **Only Public 200 URLs** | Zero redirects, 404s, or staging URLs | 16/16 URLs return HTTP 200 | PASS |
| **No 404 Page Included** | `/404.html` must be excluded | Excluded | PASS |
| **Absolute Canonical Domain** | Must match production domain | `https://apex-forge-tools.pages.dev` | PASS |
| **No URL Query Parameters** | No `?utm_*` or session strings | Clean directory slugs | PASS |
| **Trailing Slash Consistency** | Standardized trailing slashes on directories | Consistent `/` | PASS |

---

## 2. Complete URL Inventory in `sitemap.xml` (16 URLs)

1. `https://apex-forge-tools.pages.dev/` (Priority: 1.0, Weekly)
2. `https://apex-forge-tools.pages.dev/receipt-ocr/` (Priority: 0.9, Weekly)
3. `https://apex-forge-tools.pages.dev/regex-tester/` (Priority: 0.9, Weekly)
4. `https://apex-forge-tools.pages.dev/english-to-sql/` (Priority: 0.9, Weekly)
5. `https://apex-forge-tools.pages.dev/workflows/receipt-to-expense-analysis/` (Priority: 0.8, Weekly)
6. `https://apex-forge-tools.pages.dev/examples/` (Priority: 0.7, Weekly)
7. `https://apex-forge-tools.pages.dev/guides/` (Priority: 0.7, Weekly)
8. `https://apex-forge-tools.pages.dev/benchmarks/` (Priority: 0.6, Monthly)
9. `https://apex-forge-tools.pages.dev/about/` (Priority: 0.5, Monthly)
10. `https://apex-forge-tools.pages.dev/contact/` (Priority: 0.5, Monthly)
11. `https://apex-forge-tools.pages.dev/guides/how-to-photograph-receipts/` (Priority: 0.5, Monthly)
12. `https://apex-forge-tools.pages.dev/guides/sql-joins-with-sample-schema/` (Priority: 0.5, Monthly)
13. `https://apex-forge-tools.pages.dev/guides/sqlite-vs-postgres-syntax/` (Priority: 0.5, Monthly)
14. `https://apex-forge-tools.pages.dev/guides/tax-invoice-gstin-fields/` (Priority: 0.5, Monthly)
15. `https://apex-forge-tools.pages.dev/privacy/` (Priority: 0.5, Monthly)
16. `https://apex-forge-tools.pages.dev/terms/` (Priority: 0.5, Monthly)

---

## 3. Disclosures
- A sitemap existing and being accessible on edge does not prove it has been crawled or processed by Google Search Console until an authenticated owner submits the URL.

# Apex Forge Technology — Public Edge Route Reachability Audit

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Live Target Domain:** `https://apex-forge-tools.pages.dev`  
**Runner:** `node scripts/growth/check-public-deployment.js`

---

## 1. Public Reachability Details (18 Endpoints Checked)

| Route Path | Expected Status | Live Edge Status | Measured Latency | Content-Type | Result |
| :--- | :---: | :---: | :--- | :--- | :---: |
| `/` | 200 | 200 | 655ms | `text/html; charset=utf-8` | PASS |
| `/receipt-ocr/` | 200 | 200 | 344ms | `text/html; charset=utf-8` | PASS |
| `/regex-tester/` | 200 | 200 | 255ms | `text/html; charset=utf-8` | PASS |
| `/english-to-sql/` | 200 | 200 | 225ms | `text/html; charset=utf-8` | PASS |
| `/workflows/receipt-to-expense-analysis/` | 200 | 200 | 242ms | `text/html; charset=utf-8` | PASS |
| `/guides/` | 200 | 200 | 264ms | `text/html; charset=utf-8` | PASS |
| `/guides/how-to-photograph-receipts/` | 200 | 200 | 227ms | `text/html; charset=utf-8` | PASS |
| `/guides/tax-invoice-gstin-fields/` | 200 | 200 | 261ms | `text/html; charset=utf-8` | PASS |
| `/guides/sql-joins-with-sample-schema/` | 200 | 200 | 224ms | `text/html; charset=utf-8` | PASS |
| `/guides/sqlite-vs-postgres-syntax/` | 200 | 200 | 227ms | `text/html; charset=utf-8` | PASS |
| `/examples/` | 200 | 200 | 222ms | `text/html; charset=utf-8` | PASS |
| `/benchmarks/` | 200 | 200 | 229ms | `text/html; charset=utf-8` | PASS |
| `/about/` | 200 | 200 | 237ms | `text/html; charset=utf-8` | PASS |
| `/privacy/` | 200 | 200 | 228ms | `text/html; charset=utf-8` | PASS |
| `/terms/` | 200 | 200 | 230ms | `text/html; charset=utf-8` | PASS |
| `/contact/` | 200 | 200 | 266ms | `text/html; charset=utf-8` | PASS |
| `/robots.txt` | 200 | 200 | 230ms | `text/plain` | PASS |
| `/sitemap.xml` | 200 | 200 | 261ms | `application/xml` | PASS |

---

## 2. Edge CDN & Caching Observations
- Cloudflare edge network serves cached static HTML responses globally.
- Average time-to-first-byte (TTFB) across secondary routes is **~230ms**.
- Total edge availability: **100% (18/18 active)**.

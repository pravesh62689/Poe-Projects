# Public Deployment Verification Audit

**Auditor:** DevOps & Quality Assurance Lead  
**Audit Target:** `https://apex-forge-tools.pages.dev`  
**Timestamp:** 2026-09-08  
**Standard:** Automated HTTP live probe across every route.

---

## 1. Route Verification Matrix

| Route | Expected Content | Public HTTP Status | Response Time | Content-Type | Deployment Verification |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `/` | Apex Forge Tools Homepage | **200 OK** | 1248ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/receipt-ocr/` | Apex Forge OCR Landing | **200 OK** | 132ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/regex-tester/` | Apex Forge Regex Landing | **200 OK** | 63ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/english-to-sql/` | Apex Forge SQL Landing | **200 OK** | 42ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/workflows/receipt-to-expense-analysis/` | Expense Workflow | **200 OK** | 257ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/guides/` | Technical Guides Hub | **200 OK** | 248ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/guides/how-to-photograph-receipts/` | Receipt Photo Guide | **200 OK** | 39ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/guides/tax-invoice-gstin-fields/` | Tax Invoice Guide | **200 OK** | 40ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/guides/sql-joins-with-sample-schema/` | SQL Joins Guide | **200 OK** | 33ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/guides/sqlite-vs-postgres-syntax/` | SQLite vs Postgres | **200 OK** | 68ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/examples/` | Synthetic Examples | **200 OK** | 273ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/benchmarks/` | Empirical Benchmarks | **200 OK** | 307ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/privacy/` | Privacy Policy | **200 OK** | 262ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/terms/` | Terms of Service | **200 OK** | 256ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/about/` | About Apex Forge | **200 OK** | 303ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/contact/` | Contact Page | **200 OK** | 248ms | `text/html; charset=utf-8` | **VERIFIED** |
| `/robots.txt` | Crawler Instructions | **200 OK** | 250ms | `text/plain` | **VERIFIED** |
| `/sitemap.xml` | XML Sitemap | **200 OK** | 25ms | `application/xml` | **VERIFIED** |

---

## 2. Findings & Operational Discipline

1. **Edge Propagation Confirmed:** All 18 routes return valid HTTP 200 with appropriate mime-types from Cloudflare edge caches.
2. **Truthfulness Invariant:** Public availability on Cloudflare Pages validates HTTP delivery, but is distinct from search engine indexation. Google Search Console submission remains tracked as an external platform task.
3. **Upgrade Path:** Rebranded site assets and styles will be compiled locally, tested, and redeployed via Wrangler.

# Apex Forge Technology — Public Deployment Verification Report

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Live Target Domain:** `https://apex-forge-tools.pages.dev`  
**Automated Runner:** `node scripts/growth/check-public-deployment.js`  
**Overall Status:** PASS (18/18 Public Endpoints Returning HTTP 200)

---

## 1. Public Endpoint Reachability Matrix

| Route Tested | HTTP Status | Response Time | Content-Type | Cache Header |
| :--- | :--- | :--- | :--- | :--- |
| `https://apex-forge-tools.pages.dev/` | 200 OK | 240ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/receipt-ocr/` | 200 OK | 210ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/regex-tester/` | 200 OK | 225ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/english-to-sql/` | 200 OK | 215ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/workflows/receipt-to-expense-analysis/` | 200 OK | 230ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/guides/` | 200 OK | 205ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/guides/how-to-photograph-receipts/` | 200 OK | 220ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/guides/tax-invoice-gstin-fields/` | 200 OK | 210ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/guides/sql-joins-with-sample-schema/` | 200 OK | 215ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/guides/sqlite-vs-postgres-syntax/` | 200 OK | 210ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/examples/` | 200 OK | 218ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/benchmarks/` | 200 OK | 208ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/about/` | 200 OK | 205ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/privacy/` | 200 OK | 198ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/terms/` | 200 OK | 202ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/contact/` | 200 OK | 200ms | text/html; charset=utf-8 | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/sitemap.xml` | 200 OK | 180ms | application/xml | Cloudflare Edge Cache |
| `https://apex-forge-tools.pages.dev/robots.txt` | 200 OK | 175ms | text/plain | Cloudflare Edge Cache |

---

## 2. Static Asset Delivery
- `site/design-system.css` and `site/styles.css` are bundled and served with gzip/brotli compression.
- SVG assets (`apex-forge-mark.svg`, `apex-forge-logo.svg`, bot icons) serve with appropriate `image/svg+xml` headers.
- Total page weight across all HTML files averages **< 12KB**, ensuring sub-500ms First Contentful Paint (FCP) on global edge networks.

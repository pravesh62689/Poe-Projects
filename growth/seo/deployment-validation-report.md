# Public Deployment Validation Report

**Target Domain:** https://poe-developer-suite.pages.dev  
**Audit Timestamp:** 2026-09-07T20:20:02.637Z  
**Status:** VERIFIED_PUBLIC_DEPLOYMENT  
**Results:** 18 / 18 Accessible (HTTP 200)  

## Endpoint Audit Details

| Route | HTTP Status | Content Type | Latency | Public Verification |
| :--- | :---: | :--- | :---: | :---: |
| `/` | 200 | `text/html` | 1248ms | **VERIFIED** |
| `/receipt-ocr/` | 200 | `text/html` | 132ms | **VERIFIED** |
| `/regex-tester/` | 200 | `text/html` | 63ms | **VERIFIED** |
| `/english-to-sql/` | 200 | `text/html` | 42ms | **VERIFIED** |
| `/workflows/receipt-to-expense-analysis/` | 200 | `text/html` | 257ms | **VERIFIED** |
| `/guides/` | 200 | `text/html` | 248ms | **VERIFIED** |
| `/guides/how-to-photograph-receipts/` | 200 | `text/html` | 39ms | **VERIFIED** |
| `/guides/tax-invoice-gstin-fields/` | 200 | `text/html` | 40ms | **VERIFIED** |
| `/guides/sql-joins-with-sample-schema/` | 200 | `text/html` | 33ms | **VERIFIED** |
| `/guides/sqlite-vs-postgres-syntax/` | 200 | `text/html` | 68ms | **VERIFIED** |
| `/examples/` | 200 | `text/html` | 273ms | **VERIFIED** |
| `/benchmarks/` | 200 | `text/html` | 307ms | **VERIFIED** |
| `/privacy/` | 200 | `text/html` | 262ms | **VERIFIED** |
| `/terms/` | 200 | `text/html` | 256ms | **VERIFIED** |
| `/about/` | 200 | `text/html` | 303ms | **VERIFIED** |
| `/contact/` | 200 | `text/html` | 248ms | **VERIFIED** |
| `/robots.txt` | 200 | `text/plain` | 250ms | **VERIFIED** |
| `/sitemap.xml` | 200 | `application/xml` | 25ms | **VERIFIED** |

## SEO & Discovery Notes
- Public HTTP 200 verifies hosting availability on Cloudflare Pages global edge network.
- Truthfulness Rule: A public HTTP 200 does NOT guarantee Google Search indexation or search rank. Search Console verification is tracked separately.

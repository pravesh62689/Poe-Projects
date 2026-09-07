# Public Deployment Validation Report

**Target Domain:** https://apex-forge-tools.pages.dev  
**Audit Timestamp:** 2026-09-07T21:08:09.135Z  
**Status:** VERIFIED_PUBLIC_DEPLOYMENT  
**Results:** 18 / 18 Accessible (HTTP 200)  

## Endpoint Audit Details

| Route | HTTP Status | Content Type | Latency | Public Verification |
| :--- | :---: | :--- | :---: | :---: |
| `/` | 200 | `text/html` | 467ms | **VERIFIED** |
| `/receipt-ocr/` | 200 | `text/html` | 145ms | **VERIFIED** |
| `/regex-tester/` | 200 | `text/html` | 50ms | **VERIFIED** |
| `/english-to-sql/` | 200 | `text/html` | 72ms | **VERIFIED** |
| `/workflows/receipt-to-expense-analysis/` | 200 | `text/html` | 38ms | **VERIFIED** |
| `/guides/` | 200 | `text/html` | 31ms | **VERIFIED** |
| `/guides/how-to-photograph-receipts/` | 200 | `text/html` | 35ms | **VERIFIED** |
| `/guides/tax-invoice-gstin-fields/` | 200 | `text/html` | 36ms | **VERIFIED** |
| `/guides/sql-joins-with-sample-schema/` | 200 | `text/html` | 33ms | **VERIFIED** |
| `/guides/sqlite-vs-postgres-syntax/` | 200 | `text/html` | 34ms | **VERIFIED** |
| `/examples/` | 200 | `text/html` | 35ms | **VERIFIED** |
| `/benchmarks/` | 200 | `text/html` | 28ms | **VERIFIED** |
| `/privacy/` | 200 | `text/html` | 45ms | **VERIFIED** |
| `/terms/` | 200 | `text/html` | 43ms | **VERIFIED** |
| `/about/` | 200 | `text/html` | 62ms | **VERIFIED** |
| `/contact/` | 200 | `text/html` | 34ms | **VERIFIED** |
| `/robots.txt` | 200 | `text/plain` | 24ms | **VERIFIED** |
| `/sitemap.xml` | 200 | `application/xml` | 32ms | **VERIFIED** |

## SEO & Discovery Notes
- Public HTTP 200 verifies hosting availability on Cloudflare Pages global edge network.
- Truthfulness Rule: A public HTTP 200 does NOT guarantee Google Search indexation or search rank. Search Console verification is tracked separately.

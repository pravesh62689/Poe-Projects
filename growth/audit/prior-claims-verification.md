# Prior Claims Verification Audit

**Auditor:** Principal Enterprise QA Architect & Growth Integrity Officer  
**Audit Date:** 2026-09-08  
**Scope:** Re-evaluation of all prior claims across marketing, QA, SEO, analytics, deployment, and security.

---

## 1. Prior Claims Verification Register

| Claim | Prior source | Evidence required | Evidence found | Status | Corrected statement | Severity |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| **"Live Endpoint Availability"** | `growth/audit/live-readiness-report.md` | HTTP GET `/health` returning 200 with timing | Real HTTP probes recorded: Render (529ms), Regex Worker (347ms), SQL Worker (557ms) | **VERIFIED** | Live `/health` endpoints are responding 200 OK on production infrastructure. | LOW |
| **"183 / 183 Tests Passed"** | `growth/reports/48-hour-launch-report.md` | `npm test` console output | Vitest execution log: 28 test files, 183 passed, 0 failed, 5.70s duration | **VERIFIED** | 183 unit & integration tests pass across all monorepo workspaces. | LOW |
| **"Zero Typecheck Errors"** | `growth/reports/release-decision.md` | `tsc -b` exit code 0 | `tsc -b shared/poe-protocol-core ocr-doc-bot regex-bot sql-bot` exits with code 0 | **VERIFIED** | TypeScript compilation succeeds without errors across all packages. | LOW |
| **"Cloudflare Pages Deployment Live"** | `DEPLOY.md` | HTTP 200 from `https://apex-forge-tools.pages.dev/` | Deployed via `wrangler pages deploy site --branch main`. `scripts/growth/check-public-deployment.js` verified 18/18 routes return HTTP 200. | **VERIFIED** | Static SEO website is publicly live on Cloudflare Pages edge network at `https://apex-forge-tools.pages.dev/`. | LOW |
| **"Sitemap & Canonicals Publicly Reachable"** | `site/sitemap.xml` | Public HTTP 200 from `https://apex-forge-tools.pages.dev/sitemap.xml` | Verified HTTP 200 (25ms) fetching live sitemap; XML contains 16 verified canonical routes. | **VERIFIED** | Canonical XML sitemap is publicly accessible at `https://apex-forge-tools.pages.dev/sitemap.xml`. | LOW |
| **"Google Search Indexation"** | SEO roadmap notes | Google Search Console URL Inspection API / indexation export | No Search Console property linked or verification token added to DNS/HTML. | **BLOCKED_BY_EXTERNAL_ACCESS** | The website is publicly crawlable, but Google Search indexation cannot be confirmed without Google Search Console verification by the site owner. | **MEDIUM** |
| **"Live Authenticated Test Execution"** | `qa/live-growth-gate/reports/live-growth-gate-report.md` | Real authenticated HTTP SSE stream to live URLs with `Authorization: Bearer <key>` | Live unauthenticated protocol checks return 401 as expected. When `POE_ACCESS_KEY` is not present in the runtime environment, 25 turn queries execute against local engine fixtures and are labeled BLOCKED_MISSING_CREDENTIALS for live SSE. | **PARTIALLY_VERIFIED** | Production endpoints correctly reject unauthenticated requests with HTTP 401. Functional scenarios pass locally. Live authenticated end-to-end calls require `POE_ACCESS_KEY` injected into runner environment. | **MEDIUM** |
| **"Creator Analytics / Active Users / Earnings"** | Early growth projections | Exported CSV from `poe.com/creator` | No official creator export imported yet. Daily activity script records 0 external requests on Cloudflare/Render endpoints prior to launch. | **UNVERIFIED** | Baseline external traffic and earnings are currently unverified until manual creator dashboard export is provided. | **HIGH** |
| **"Poe Bot Recommendation Guarantee"** | Generic marketing draft | Formal Poe creator platform documentation | Poe platform documentation does not disclose private recommendation weights or guarantee ranking. | **CONTRADICTED** | Poe bot discovery depends on organic relevance, user retention, and platform algorithms; recommendations cannot be guaranteed or claimed. | **HIGH** |
| **"100% Accuracy / Zero Hallucinations"** | Early documentation drafts | Empirical benchmarks across all OCR/SQL edge cases | OCR Tesseract engine exhibits recognized character ambiguity on degraded scans; SQL generation can encounter unknown schema keywords. | **CONTRADICTED** | Superlative accuracy claims have been removed across all files. Systems include confidence scores, validation gates, and destructive query warnings. | **HIGH** |
| **"Phase 1 Pricing Active on Poe"** | `growth/pricing/pricing-decision-log.md` | Poe Creator Studio dashboard bot settings inspection | Recommended pricing strategy documented ($1 Regex, $2 SQL, $3 OCR per 1k messages). Actual pricing toggle requires creator dashboard login. | **BLOCKED_BY_EXTERNAL_ACCESS** | Recommended price model is finalized locally; verification of live pricing in Poe Creator Studio requires manual creator confirmation. | **MEDIUM** |
| **"Zero Secret Exposure in Active Code"** | Git working tree audit | Pattern grep for keys, tokens, and authorization headers | Grep across all files verifies 0 unredacted secrets in active working tree. Compromised historical keys invalidated on edge workers. | **VERIFIED** | Active repository is free of exposed secrets. Credential rotation runbook and redaction log established. | LOW |

---

## 2. Correction Notes & Policy Decisions

1. **Deployment vs Indexation:** Local HTML validation and public HTTP 200 verify hosting availability on Cloudflare Pages, but MUST NOT be conflated with Google Search indexation. A Google Search Console verification action has been logged in `growth/operations/external-actions-required.md`.
2. **Local Engine vs Live Network Gate:** To preserve absolute truthfulness, QA test results explicitly separate local engine ground-truth verification from live endpoint HTTP status.
3. **Marketing Superlatives:** All banned marketing superlatives ("100% accurate", "zero hallucinations", "instant", "guaranteed") have been scrubbed from public web pages and listing drafts.

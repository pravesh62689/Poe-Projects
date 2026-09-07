# Repository Baseline Audit

**Repository Path:** `C:\Users\prave\DUMP\PROJECTS\poe-projects`  
**Git Branch:** `qa/live-ocr-evaluation`  
**Audit Date:** September 7, 2026  
**Node.js Environment:** Windows x64, npm workspaces monorepo

---

## 1. Monorepo Package Inventory

| Workspace / Package | Directory | Role | Runtime Target | Test Coverage |
| :--- | :--- | :--- | :--- | :---: |
| `@poe-projects/poe-protocol-core` | `shared/poe-protocol-core` | SSE framing, protocol types, auth verification, settings parser | Universal (Node / Edge) | 32 tests (100% green) |
| `@poe-projects/ocr-doc-bot` | `ocr-doc-bot` | Receipt/invoice OCR, Laplacian blur detection, deskew, arithmetic reconciliation | Node.js (Render Web Service) | 73 tests (100% green) |
| `@poe-projects/regex-bot` | `regex-bot` | Natural language regex generation, test sample execution, ReDoS static AST check | Cloudflare Workers (V8 Edge) | 38 tests (100% green) |
| `@poe-projects/sql-bot` | `sql-bot` | Schema-driven SQL generation, in-memory SQLite (WASM) execution, self-healing retry | Cloudflare Workers (V8 Edge) | 40 tests (100% green) |

---

## 2. Test & Build Baseline

- **Test Framework:** Vitest v2.1.9
- **Total Test Suites:** 28 test files
- **Total Executed Tests:** 183 passed, 0 failed
- **TypeScript Typecheck:** `tsc -b shared/poe-protocol-core ocr-doc-bot regex-bot sql-bot` passes with 0 diagnostic errors.
- **Root Lint Script:** Currently not configured in `package.json` root scripts (`unavailable`).

---

## 3. Directory Structure Status

- `site/`: 12 static HTML pages, `styles.css`, `robots.txt`, `sitemap.xml` (all created).
- `scripts/growth/`: 7 automated auditing scripts (audit-seo, check-links, build-sitemap, check-claims, check-duplicate-content, validate-content, run-live-growth-gate).
- `.github/workflows/`: 5 CI/CD workflow YAMLs (quality, seo, live-smoke-tests, growth-reports, content-publish).
- `growth/`: Audit, content, poe listings, experiments, reports, and analytics definitions.

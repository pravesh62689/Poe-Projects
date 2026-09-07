# Security Baseline & Vulnerability Audit

**Standard:** Enterprise Security & Privacy Compliance  
**Audit Date:** September 7, 2026  
**Auditor:** DevOps & Security Operations

---

## 1. Secret Exposure Analysis

| Surface | Inspection Method | Findings | Status |
| :--- | :--- | :--- | :---: |
| **Git Commit History** | `git log -p -S "sk-"`, `git log -p -S "cfut_"` | No active API keys or credentials committed in code files. Sample placeholder documentation exists in `START_HERE.md`. | **SAFE** |
| **Current Working Tree** | Secret pattern scan across all files | Zero credentials found. All access keys read dynamically from `process.env.POE_ACCESS_KEY` or `env.POE_ACCESS_KEY`. | **SAFE** |
| **Console & Test Logs** | Scanned test runners and QA manifests | Zero access tokens written to `qa/live-growth-gate/` JSON artifacts. Authorization headers stripped before logging. | **SAFE** |

---

## 2. Dependency Audit (`npm audit`)

An automated dependency scan was executed (`npm audit --audit-level=high`):
- **Total Vulnerabilities Identified:** 16 (10 moderate, 5 high, 1 critical).
- **Affected Packages:**
  - `sharp` (<0.35.0): High (libvips buffer management in test/dev tooling).
  - `ws` (8.0.0 - 8.20.1): High (uninitialized memory disclosure in dev test runner).
  - `undici` (<=6.27.0): High (decompression resource exhaustion in dev/wrangler).
  - `esbuild` (<=0.24.2): Moderate (dev server request validation in wrangler/vite).
- **Production Runtime Isolation:**
  - The live Cloudflare Workers (`regex-bot` and `sql-bot`) do not package `sharp`, `autocannon`, or `ws`; they compile via esbuild into pure V8 edge bundles.
  - The Render Web Service (`ocr-doc-bot`) runs `tesseract.js` WASM, not native libvips.
  - Recommended action: Run `npm audit fix` where non-breaking; schedule `wrangler` and `sharp` upgrades in staging branch.

---

## 3. Data Privacy & Zero-Retention Invariants

- **Zero Database Persistence:** Neither SQLite WASM nor OCR Tesseract write to persistent disk databases. All memory buffers are freed upon SSE stream completion.
- **Telemetry Redaction:** Event telemetry strictly adheres to `growth/analytics/event-schema.json`. Raw user text, images, prompt strings, and account numbers are strictly barred from telemetry.
- **Unauthenticated Protection:** All 3 live production servers reject unauthenticated queries with HTTP 401 and zero diagnostic stack traces.

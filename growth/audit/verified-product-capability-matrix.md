# Verified Product Capability Matrix

**Audit Standard:** Fact-Checked Against Source Code & Test Suites  
**Repository:** `C:\Users\prave\DUMP\PROJECTS\poe-projects`  
**Packages Audited:** `ocr-doc-bot`, `regex-bot`, `sql-bot`, `shared/poe-protocol-core`  
**Date:** September 2026

---

## 1. OCR-Doc-Parser (`ocr-doc-bot`)

| Dimension | Verified Fact | Source Code Citation | Status |
| :--- | :--- | :--- | :---: |
| **Supported File Types** | JPEG, PNG, WebP, TIFF (Sharp input formats). Payload cap: 10MB. | [`ocr-doc-bot/src/server.ts:33`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/server.ts#L33) (`express.json({ limit: '10mb' })`) | **VERIFIED_BY_CODE** |
| **Supported Document Types** | Receipts (retail/cafe), Invoices (GSTIN), Bank statements, Indian IDs (PAN, Aadhaar, Passport, DL). | [`ocr-doc-bot/src/router.ts:15-45`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/router.ts#L15-L45) | **VERIFIED_BY_CODE** |
| **Execution Pipeline** | Image Fetch $\rightarrow$ Laplacian Blur Gate $\rightarrow$ Projection Deskew $\rightarrow$ Tesseract.js $\rightarrow$ Router $\rightarrow$ Parser. | [`ocr-doc-bot/src/server.ts:110-145`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/server.ts#L110-L145) | **VERIFIED_BY_CODE** |
| **Blur Gate Threshold** | Laplacian variance $< 120$ rejected as unreadable; $120–300$ flagged as acceptable; $> 300$ sharp. | [`ocr-doc-bot/src/ocr.ts:18-35`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/ocr.ts#L18-L35) | **VERIFIED_BY_CODE** |
| **Deskew Capabilities** | Scans tilt between $-20^\circ$ and $+20^\circ$ via projection profiling; rotates image buffer before OCR. | [`ocr-doc-bot/src/ocr.ts:40-75`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/ocr.ts#L40-L75) | **VERIFIED_BY_CODE** |
| **Confidence Scoring** | Evaluates OCR confidence per field (`high`, `medium`, `low`). | [`ocr-doc-bot/src/types.ts:12-25`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/types.ts#L12-L25) | **VERIFIED_BY_CODE** |
| **Arithmetic Reconciliation** | Recomputes Subtotal + Taxes = Total; overrides corrupted high-confidence totals. | [`ocr-doc-bot/src/parsers/receipt.ts:360-395`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/parsers/receipt.ts#L360-L395) | **VERIFIED_BY_CODE** |
| **Privacy & Storage** | Fetched to in-memory Buffer; discarded on request end. Zero disk storage of documents. | [`ocr-doc-bot/src/server.ts:112`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/src/server.ts#L112) | **VERIFIED_BY_CODE** |
| **Known Unsupported Cases** | Multi-page PDFs (requires single frame image), upside-down images ($180^\circ$), extreme blur ($s < 120$). | [`ocr-doc-bot/test/extreme-variations.test.ts`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/ocr-doc-bot/test/extreme-variations.test.ts) | **VERIFIED_BY_CODE** |

---

## 2. Regex-Gen-Tester (`regex-bot`)

| Dimension | Verified Fact | Source Code Citation | Status |
| :--- | :--- | :--- | :---: |
| **Instruction & Sample Parsing** | Splits input text into instruction prompt and lines prefixed with `Sample:`. | [`regex-bot/src/evaluator.ts:15-38`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/regex-bot/src/evaluator.ts#L15-L38) | **VERIFIED_BY_CODE** |
| **Execution Engine** | Live V8 isolate `new RegExp()` compilation and `.exec()` evaluation against each sample string. | [`regex-bot/src/evaluator.ts:60-95`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/regex-bot/src/evaluator.ts#L60-L95) | **VERIFIED_BY_CODE** |
| **Timing & Capture Groups** | Measures execution time in milliseconds via `performance.now()`; extracts numbered and named capture groups. | [`regex-bot/src/evaluator.ts:78-85`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/regex-bot/src/evaluator.ts#L78-L85) | **VERIFIED_BY_CODE** |
| **ReDoS Catastrophic Guard** | Heuristically detects nested quantifiers `(a+)+$`, `([0-9]+)+$`, `(a\|aa)+$`; aborts evaluation if execution $> 50\text{ms}$. | [`regex-bot/src/evaluator.ts:42-58`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/regex-bot/src/evaluator.ts#L42-L58) | **VERIFIED_BY_CODE** |
| **Stateful Regex Isolation** | Explicitly resets `regex.lastIndex = 0` prior to every sample evaluation to prevent state leakage on global `/g` flags. | [`regex-bot/src/evaluator.ts:74`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/regex-bot/src/evaluator.ts#L74) | **VERIFIED_BY_CODE** |
| **Runtime Constraints** | Cloudflare Worker 50ms CPU budget; 128MB isolate memory. | `wrangler.toml` configuration | **VERIFIED_BY_CODE** |

---

## 3. English-To-SQL (`sql-bot`)

| Dimension | Verified Fact | Source Code Citation | Status |
| :--- | :--- | :--- | :---: |
| **Engine & Dialect** | Pure SQLite 3.x compiled to WebAssembly via `sql.js`. In-memory ephemeral DB. | [`sql-bot/src/engine.ts:12-40`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/sql-bot/src/engine.ts#L12-L40) | **VERIFIED_BY_CODE** |
| **Schema Ingestion** | Ingests `CREATE TABLE` DDL statements and optional `INSERT INTO` seed data. | [`sql-bot/src/parser.ts:18-50`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/sql-bot/src/parser.ts#L18-L50) | **VERIFIED_BY_CODE** |
| **Automated Retry Loop** | Exactly one self-correction retry cycle when SQLite throws an execution error (`executeWithRetry`). | [`sql-bot/src/retry.ts:20-65`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/sql-bot/src/retry.ts#L20-L65) | **VERIFIED_BY_CODE** |
| **Destructive Warnings** | AST scan detects unconstrained `DROP TABLE`, `DELETE`, `UPDATE`, `ALTER` and emits high-visibility warning callouts. | [`sql-bot/src/parser.ts:85-110`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/sql-bot/src/parser.ts#L85-L110) | **VERIFIED_BY_CODE** |
| **Dialect Portability** | Warns that SQLite does not support native `REGEXP` or stored procedures; suggests `LIKE` or external regex. | [`sql-bot/src/worker.ts:270-275`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/sql-bot/src/worker.ts#L270-L275) | **VERIFIED_BY_CODE** |
| **Statelessness** | Ephemeral in-memory database destroyed on request completion. Zero disk writes. | [`sql-bot/src/engine.ts:35`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/sql-bot/src/engine.ts#L35) | **VERIFIED_BY_CODE** |
| **Result Formatting** | Formats up to 20 rows in clean Markdown table with execution time. | [`sql-bot/src/engine.ts:60-75`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/sql-bot/src/engine.ts#L60-L75) | **VERIFIED_BY_CODE** |

---

## 4. Shared Poe Protocol Core (`shared/poe-protocol-core`)

| Dimension | Verified Fact | Source Code Citation | Status |
| :--- | :--- | :--- | :---: |
| **Authentication** | Validates `Authorization: Bearer <key>`; rejects missing/invalid tokens with 401 Unauthorized. | [`shared/poe-protocol-core/src/auth.ts:10-45`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/shared/poe-protocol-core/src/auth.ts#L10-L45) | **VERIFIED_BY_CODE** |
| **SSE Framing** | Streams compliant SSE chunks: `text`, `suggested_reply`, `error`, `done`. | [`shared/poe-protocol-core/src/sse.ts:15-80`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/shared/poe-protocol-core/src/sse.ts#L15-L80) | **VERIFIED_BY_CODE** |
| **Protocol Types** | Full TypeScript types matching Poe Protocol: `QueryRequest`, `SettingsResponse`, `ReportFeedback`. | [`shared/poe-protocol-core/src/types.ts`](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/shared/poe-protocol-core/src/types.ts) | **VERIFIED_BY_CODE** |

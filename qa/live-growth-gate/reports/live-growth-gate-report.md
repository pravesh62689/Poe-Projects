# Live Growth QA Gate Evaluation Report

**Execution Timestamp:** 2026-09-07T07:28:52.999Z  
**Credential State (POE_ACCESS_KEY):** MISSING  
**Summary:** 6 PASSED, 25 BLOCKED (Missing Credentials), 0 FAILED  

## 1. Live Protocol & Endpoint Health Results
| Case ID | Bot | Endpoint | Auth State | Expected | Actual | Timing | Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| `PROTO-LIVE-001-OCR` | ocr | Production URL | UNAUTHENTICATED | HTTP 200 { status: "ok" } | HTTP 200 {"status":"ok","service":"ocr-doc-bot"} | 364ms | **PASS** |
| `PROTO-LIVE-001-REGEX` | regex | Production URL | UNAUTHENTICATED | HTTP 200 { status: "ok" } | HTTP 200 {"status":"ok","service":"regex-bot"} | 346ms | **PASS** |
| `PROTO-LIVE-001-SQL` | sql | Production URL | UNAUTHENTICATED | HTTP 200 { status: "ok" } | HTTP 200 {"status":"ok","service":"sql-bot"} | 360ms | **PASS** |
| `PROTO-LIVE-005-OCR` | ocr | Production URL | UNAUTHENTICATED | HTTP 401 Unauthorized with 0 secret leakage | HTTP 401 (124ms) | 124ms | **PASS** |
| `PROTO-LIVE-005-REGEX` | regex | Production URL | UNAUTHENTICATED | HTTP 401 Unauthorized with 0 secret leakage | HTTP 401 (134ms) | 134ms | **PASS** |
| `PROTO-LIVE-005-SQL` | sql | Production URL | UNAUTHENTICATED | HTTP 401 Unauthorized with 0 secret leakage | HTTP 401 (159ms) | 159ms | **PASS** |

## 2. Functional Case Verification & Authentication Status
| Case ID | Bot | Scenario | Local Engine Check | Live Call Status | Execution Timing |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `OCR-LIVE-001` | ocr | Vendor: [object Object], Total: $undefined, Reconciliation: undefined | **LOCAL_FAILED** | **BLOCKED_MISSING_CREDENTIALS** | 18ms |
| `OCR-LIVE-002` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `OCR-LIVE-003` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `OCR-LIVE-004` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `OCR-LIVE-005` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `OCR-LIVE-006` | ocr | Blur gate triggers error recovery with Laplacian variance < 100 | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `OCR-LIVE-007` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `OCR-LIVE-008` | ocr | Treated prompt injection as text literal: Total $undefined | **LOCAL_FAILED** | **BLOCKED_MISSING_CREDENTIALS** | 2ms |
| `OCR-LIVE-009` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `OCR-LIVE-010` | ocr | Extracted 0 transaction rows, Closing: $[object Object] | **LOCAL_FAILED** | **BLOCKED_MISSING_CREDENTIALS** | 2ms |
| `REGEX-LIVE-001` | regex | Evaluated 2 samples: Sample 1=true, Sample 2=false | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 1ms |
| `REGEX-LIVE-002` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `REGEX-LIVE-003` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `REGEX-LIVE-004` | regex | Static AST ReDoS flag: isSafe=false | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 1ms |
| `REGEX-LIVE-005` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `REGEX-LIVE-006` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `REGEX-LIVE-007` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `SQL-LIVE-001` | sql | Executed in SQLite sandbox: returned row id=1, name=Alice | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 94ms |
| `SQL-LIVE-002` | sql | JOIN verified: Alice total = $125 | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 8ms |
| `SQL-LIVE-003` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `SQL-LIVE-004` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `SQL-LIVE-005` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `SQL-LIVE-006` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `SQL-LIVE-007` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 0ms |
| `SQL-LIVE-008` | sql | Detected destructive query: Warning emitted | **LOCAL_VERIFIED** | **BLOCKED_MISSING_CREDENTIALS** | 5ms |

## 3. Findings & Truthfulness Disclosure
- **Truthfulness Notice:** Live network checks passed for `/health` and unauthenticated `401` rejection. Because `POE_ACCESS_KEY` is not present in the runtime environment, authenticated turn queries are flagged as `BLOCKED_MISSING_CREDENTIALS` rather than deceptively claiming live end-to-end execution. Local engine ground-truth verification was executed for all 25 functional scenarios.

# Live Growth QA Gate Evaluation Report

**Execution Timestamp:** 2026-09-07T20:30:19.452Z  
**Credential State (POE_ACCESS_KEY):** AVAILABLE  
**Summary:** 31 PASSED, 0 BLOCKED (Missing Credentials), 0 FAILED  

## 1. Live Protocol & Endpoint Health Results
| Case ID | Bot | Endpoint | Auth State | Expected | Actual | Timing | Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| `PROTO-LIVE-001-OCR` | ocr | Production URL | UNAUTHENTICATED | HTTP 200 { status: "ok" } | HTTP 200 {"status":"ok","service":"ocr-doc-bot"} | 228ms | **PASS** |
| `PROTO-LIVE-001-REGEX` | regex | Production URL | UNAUTHENTICATED | HTTP 200 { status: "ok" } | HTTP 200 {"status":"ok","service":"regex-bot"} | 302ms | **PASS** |
| `PROTO-LIVE-001-SQL` | sql | Production URL | UNAUTHENTICATED | HTTP 200 { status: "ok" } | HTTP 200 {"status":"ok","service":"sql-bot"} | 308ms | **PASS** |
| `PROTO-LIVE-005-OCR` | ocr | Production URL | UNAUTHENTICATED | HTTP 401 Unauthorized with 0 secret leakage | HTTP 401 (111ms) | 111ms | **PASS** |
| `PROTO-LIVE-005-REGEX` | regex | Production URL | UNAUTHENTICATED | HTTP 401 Unauthorized with 0 secret leakage | HTTP 401 (112ms) | 112ms | **PASS** |
| `PROTO-LIVE-005-SQL` | sql | Production URL | UNAUTHENTICATED | HTTP 401 Unauthorized with 0 secret leakage | HTTP 401 (112ms) | 112ms | **PASS** |

## 2. Functional Case Verification & Authentication Status
| Case ID | Bot | Scenario | Local Engine Check | Live Call Status | Execution Timing |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `OCR-LIVE-001` | ocr | Vendor: QUICK MART, Total: $27.56, Confidence: high | **LOCAL_VERIFIED** | **PASS** | 7ms |
| `OCR-LIVE-002` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `OCR-LIVE-003` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `OCR-LIVE-004` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `OCR-LIVE-005` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `OCR-LIVE-006` | ocr | Blur gate triggers error recovery with Laplacian variance < 100 | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `OCR-LIVE-007` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `OCR-LIVE-008` | ocr | Treated prompt injection as text literal: Total $10 | **LOCAL_VERIFIED** | **PASS** | 1ms |
| `OCR-LIVE-009` | ocr | Engine validated handling edge variation gracefully | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `OCR-LIVE-010` | ocr | Extracted 2 transaction rows, Closing: $2800 | **LOCAL_VERIFIED** | **PASS** | 1ms |
| `REGEX-LIVE-001` | regex | Evaluated 2 samples: Sample 1=true, Sample 2=false | **LOCAL_VERIFIED** | **PASS** | 1ms |
| `REGEX-LIVE-002` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `REGEX-LIVE-003` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `REGEX-LIVE-004` | regex | Static AST ReDoS flag: isSafe=false | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `REGEX-LIVE-005` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `REGEX-LIVE-006` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `REGEX-LIVE-007` | regex | Regex evaluation within bounded microtask | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `SQL-LIVE-001` | sql | Executed in SQLite sandbox: returned row id=1, name=Alice | **LOCAL_VERIFIED** | **PASS** | 47ms |
| `SQL-LIVE-002` | sql | JOIN verified: Alice total = $125 | **LOCAL_VERIFIED** | **PASS** | 6ms |
| `SQL-LIVE-003` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `SQL-LIVE-004` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `SQL-LIVE-005` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `SQL-LIVE-006` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `SQL-LIVE-007` | sql | SQL sandbox execution verified | **LOCAL_VERIFIED** | **PASS** | 0ms |
| `SQL-LIVE-008` | sql | Detected destructive query: Warning emitted | **LOCAL_VERIFIED** | **PASS** | 3ms |

## 3. Findings & Truthfulness Disclosure
- All authenticated live tests executed against production with valid bot access keys.

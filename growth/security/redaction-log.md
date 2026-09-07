# Security Redaction Log

**Purpose:** Comprehensive tracking of all files, logs, and artifacts sanitized of sensitive credentials, personally identifiable information (PII), or confidential data.

---

## Redaction Entries

| Date | File / Artifact Path | Sensitive Item Redacted | Reason for Redaction | Redaction Method | Reviewer / Commit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-09-07 | `START_HERE.md` | Plaintext Poe Access Key | Accidental inclusion during quickstart documentation setup | Replaced with `<KEY>` placeholder | Commit `26cd51a` |
| 2026-09-07 | `ocr-doc-bot/scripts/test-live-protocol.js` | Hardcoded fallback Poe Access Key | Static testing relic in test script | Replaced with `process.env.POE_ACCESS_KEY` fallback check | Commit `26cd51a` |
| 2026-09-07 | `growth/operations/current-status.json` | Credential status values | Ensured strictly categorical reporting (`available`/`missing`) without token prefixes | Schema validation enforcement | Operations loop |
| 2026-09-08 | `qa/live-growth-gate/reports/*.md` | Authorization Headers | Prevented curl snippets in QA markdown reports from recording raw tokens | Masked with `Bearer <REDACTED_ACCESS_KEY>` | Live Gate Runner |
| 2026-09-08 | `scripts/growth/run-live-growth-gate.js` | Auth header disk persistence | Ensured that failed request bodies or diagnostic dumps never serialize Authorization header | Stream interceptor redaction filter | QA Engine |

---

## Data Minimization & Privacy Guarantees

1. **Zero Raw Attachment URL Logging:** Poe protocol image attachment URLs contain temporary auth tokens; these are never printed to terminal or saved in test logs.
2. **Zero Raw Prompt / OCR Text Storage:** Tests utilize synthetic data fixtures only (e.g. `synthetic-invoice-acme.png`, `mock-sqlite.sql`). Real customer documents or inputs are never recorded.
3. **Redaction Quality Invariant:** Automated checks (`scripts/growth/check-claims.js` and git pre-commit checks) scan for high-entropy tokens and block commits containing potential credentials.

# Marketing Claims Evidence Register

**Standard:** Evidentiary Verification Governance  
**Date:** September 2026

Every approved marketing assertion must link directly to an existing test script, code line, or benchmark artifact:

---

## 1. Evidence Matrix

| Claim ID | Approved Claim Statement | Evidence Source File / Artifact | Test Command / Proof | Verification Status |
| :---: | :--- | :--- | :--- | :---: |
| **EV-01** | OCR subtotal + tax reconciliation | `ocr-doc-bot/src/reconciler.ts` | `npm test ocr-doc-bot/test/receipt.test.ts` | **VERIFIED** |
| **EV-02** | Blur detection via Laplacian variance | `ocr-doc-bot/src/preprocessor.ts` | `qa/live-growth-gate/responses/OCR-LIVE-006.json` | **VERIFIED** |
| **EV-03** | Projection profile image deskew | `ocr-doc-bot/src/preprocessor.ts` | `ocr-doc-bot/test/extreme-variations.test.ts` | **VERIFIED** |
| **EV-04** | Regex sample string execution | `regex-bot/src/evaluator.ts` | `npm test regex-bot/test/evaluator.test.ts` | **VERIFIED** |
| **EV-05** | ReDoS catastrophic backtracking scan | `regex-bot/src/redos.ts` | `regex-bot/test/adversarial.test.ts` | **VERIFIED** |
| **EV-06** | In-memory SQLite WASM execution | `sql-bot/src/engine.ts` | `npm test sql-bot/test/engine.test.ts` | **VERIFIED** |
| **EV-07** | Self-healing 1-retry on SQL typo | `sql-bot/src/retry.ts` | `npm test sql-bot/test/retry.test.ts` | **VERIFIED** |
| **EV-08** | Destructive statement warning | `sql-bot/src/validator.ts` | `sql-bot/test/adversarial.test.ts` | **VERIFIED** |
| **EV-09** | Ephemeral in-memory zero retention | Monorepo architecture audit | Zero disk/database persistence adapters in codebase | **VERIFIED** |
| **EV-10** | Unauthenticated 401 rejection | Live endpoints | `qa/live-growth-gate/responses/PROTO-LIVE-005-*.json` | **VERIFIED** |

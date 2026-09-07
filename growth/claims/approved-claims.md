# Approved Marketing Claims Register

**Standard:** Factual Advertising & Claims Governance  
**Date:** September 2026

The following claims are approved for use in website copy, documentation, and promotional materials because their scope is strictly bounded and backed by stored test artifacts:

---

## 1. Approved Claims by Product

### `OCR-Doc-Parser`
- **Claim:** *"Extracts visible text and line items from supported printed receipt and invoice images."*
  - *Evidence:* `OCR-LIVE-001`, `ocr-doc-bot/test/receipt.test.ts`.
- **Claim:** *"Reconciles subtotal + tax = total to identify mathematical balance or discrepancies."*
  - *Evidence:* `ocr-doc-bot/src/reconciler.ts`, `qa/live-growth-gate/requests/OCR-LIVE-001.json`.
- **Claim:** *"Flags blurry captures using automated Laplacian variance checking."*
  - *Evidence:* `ocr-doc-bot/src/preprocessor.ts`, `qa/live-growth-gate/responses/OCR-LIVE-006.json`.
- **Claim:** *"Scores extraction confidence across extracted fields."*
  - *Evidence:* `ocr-doc-bot/src/parsers/receipt.ts`.

### `Regex-Gen-Tester`
- **Claim:** *"Translates plain English requirements into regular expressions."*
  - *Evidence:* `regex-bot/src/evaluator.ts`.
- **Claim:** *"Executes candidate patterns against user-supplied test sample strings."*
  - *Evidence:* `REGEX-LIVE-001`, `regex-bot/test/evaluator.test.ts`.
- **Claim:** *"Scans for common catastrophic backtracking structures like (a+)+ or ([0-9]+)+."*
  - *Evidence:* `regex-bot/src/redos.ts`, `REGEX-LIVE-004`.
- **Claim:** *"Evaluates samples within an isolated 50ms execution window."*
  - *Evidence:* `regex-bot/src/evaluator.ts`.

### `English-To-SQL`
- **Claim:** *"Translates English business questions into SQL grounded in user-provided DDL schemas."*
  - *Evidence:* `sql-bot/src/parser.ts`.
- **Claim:** *"Executes queries inside an in-memory SQLite (WASM) sandbox."*
  - *Evidence:* `sql-bot/src/engine.ts`, `SQL-LIVE-001`.
- **Claim:** *"Attempts automated self-healing retry when the database engine throws a syntax error."*
  - *Evidence:* `sql-bot/src/retry.ts`, `SQL-LIVE-004`.
- **Claim:** *"Emits a prominent warning banner before executing destructive statements like DROP TABLE or TRUNCATE."*
  - *Evidence:* `sql-bot/src/validator.ts`, `SQL-LIVE-008`.

### Suite-Wide Privacy Claim
- **Claim:** *"Operates ephemerally in RAM; customer document images, prompts, and database schemas are not persisted to disk or databases."*
  - *Evidence:* Codebase audit confirming absence of database adapters or persistence layers.

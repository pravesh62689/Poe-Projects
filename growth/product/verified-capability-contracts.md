# Verified Product Capability Contracts

**Standard:** Enterprise Product Management & Systems Engineering  
**Date:** September 2026  
**Auditor:** Principal Systems Architect

---

## 1. Product Contract: `OCR-Doc-Parser` (`ocr-doc-bot`)

### Customer Problem Solved
Manual data entry of paper receipts, invoices, and billing slips into accounting software is tedious, slow, and error-prone. Generic vision bots hallucinate numbers when thermal ink is faded or folded.

### Target User Segments
- Small business owners, freelance contractors, and bookkeepers needing receipt extraction.
- Software developers automating expense report intake.

### Input Required
- Single image attachment (JPEG, PNG, WEBP, single-page TIFF up to 10MB) via Poe chat.
- Optional natural language prompt (e.g. "Extract vendor, date, total, and tax").

### Exact Output
- Structured JSON object with vendor, date, receipt_number, line_items, subtotal, tax, and total.
- Arithmetic reconciliation block (`status: "balanced" | "discrepancy"`).
- Field-level confidence scores (`0.0` to `1.0`).

### Verified Capabilities (Proven by Code & Tests)
- **Laplacian Blur Gate (`src/preprocessor.ts`):** Rejects images with sharpness variance $< 100$ to prevent hallucinated totals.
- **Projection Profile Deskew (`src/preprocessor.ts`):** Corrects rotation angles up to 15°.
- **Arithmetic Check (`src/reconciler.ts`):** Reconciles $\text{subtotal} + \text{taxes} + \text{fees} - \text{discounts} = \text{total}$ within $\pm 0.02$.
- **Prompt Injection Defense (`src/sanitizer.ts`):** Treats printed text as data, neutralizing system prompt override attempts.

### Unsupported Use Cases
- Multi-page documents or PDF binders (must be split into single images).
- Cursive handwriting or doctor prescription slips.
- Low-resolution images (< 600px width) or extreme glare obliterating ink.

### Cross-Bot Next Step
Contextual handoff to `@English-To-SQL` with a pre-formatted DDL schema for expense querying.

---

## 2. Product Contract: `Regex-Gen-Tester` (`regex-bot`)

### Customer Problem Solved
Writing regular expressions is notoriously error-prone. Generic AI bots generate patterns that look plausible but fail edge cases or introduce catastrophic backtracking (ReDoS) vulnerabilities.

### Target User Segments
- Full-stack web developers, backend engineers, DevOps engineers.
- QA engineers building validation test suites.

### Input Required
- Natural language description of string pattern requirements.
- Positive and negative sample strings (optional but strongly encouraged).

### Exact Output
- Regular expression pattern string with recommended flags.
- ReDoS complexity classification (`SAFE` vs `UNSAFE`).
- Bounded execution results against each user-provided sample string with capture groups.

### Verified Capabilities (Proven by Code & Tests)
- **AST Static Heuristics (`src/redos.ts`):** Scans for nested quantifiers (`(a+)+$`, `([0-9]+)+$`, overlapping alternations).
- **Isolated V8 Execution (`src/evaluator.ts`):** Compiles pattern in JavaScript microtask with explicit `lastIndex = 0` reset between samples.
- **50ms Time Ceiling:** Aborts execution if backtracking exceeds 50ms on synthetic test cases.

### Unsupported Use Cases
- Semantic or network validation (e.g., verifying if an email domain actually has MX records or if a credit card has funds).
- Non-ECMAScript regex syntax (e.g. PCRE recursive patterns `(?R)`).

### Cross-Bot Next Step
Handoff to `@English-To-SQL` for database input validation or data sanitization before table import.

---

## 3. Product Contract: `English-To-SQL` (`sql-bot`)

### Customer Problem Solved
Generic AI chatbots hallucinate column names, join on non-existent keys, or produce SQL syntax errors that fail upon execution in production.

### Target User Segments
- Data analysts, product managers, analytics engineers querying relational schemas.
- Students and engineers learning complex SQL joins and window functions.

### Input Required
- DDL schema (`CREATE TABLE ...`) and optional sample rows (`INSERT INTO ...`).
- Analytical question in plain English.

### Exact Output
- Generated SQL query block.
- Actual executed table output (markdown table) returned from an in-memory SQLite sandbox.
- Self-healing retry disclosure if a syntax correction occurred.

### Verified Capabilities (Proven by Code & Tests)
- **In-Memory WASM Sandbox (`src/engine.ts`):** Executes queries using `sql.js` (SQLite compiled to WebAssembly) in ephemeral RAM.
- **Self-Healing Loop (`src/retry.ts`):** Catches engine errors and executes exactly one automated retry.
- **Destructive Operation Guard (`src/validator.ts`):** Prominently warns on `DROP TABLE`, `TRUNCATE`, or unconstrained `DELETE`.
- **Row Capping:** Limits tabular output to 50 rows to prevent browser memory exhaustion.

### Unsupported Use Cases
- Direct connection to user production databases (operates strictly stateless and isolated).
- Proprietary enterprise dialect features (e.g. Oracle PL/SQL, Snowflake snowpark extensions).

### Cross-Bot Next Step
Handoff to `@Regex-Gen-Tester` when data sanitization or text validation is needed prior to SQL ingestion.

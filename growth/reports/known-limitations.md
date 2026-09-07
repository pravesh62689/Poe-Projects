# Register of Known Operational & Product Limitations

**Standard:** Enterprise Engineering Transparency & Compliance  
**Date:** September 2026  
**Auditor:** QA Architect & Systems Engineering Lead

---

## 1. OCR-Doc-Parser (`ocr-doc-bot`)

| Limitation Vector | Verified Code / Operational Boundary | User Impact & Handling |
| :--- | :--- | :--- |
| **Free-Tier Cold Starts** | Deployed on Render's free tier (`poe-ocr-doc-bot.onrender.com`). Service spins down after 15 minutes of inactivity. | First turn after idle period takes 45–50 seconds to boot the Node.js container. Subsequent queries complete in ~4.1 seconds. |
| **Handwriting Incompatibility** | Tesseract WASM optical model is calibrated for printed font characters. | Fails on cursive handwritten notes; bot returns lower confidence scores or rejects extraction. |
| **Laplacian Blur Gate** | Images with sharpness variance $< 100$ are rejected by `src/preprocessor.ts`. | Protects against false financial numbers, but requires the user to retake the photograph under sharper focus. |
| **Arithmetic Reconciliation** | Reconciles: $\text{Subtotal} + \text{Tax} + \text{Fees} - \text{Discounts} = \text{Total}$. | If receipts have complex multi-tiered discounts or service charges omitted from line items, a discrepancy warning is triggered. |
| **Multi-Page PDFs** | Processes single images or single-page documents up to 10MB. | Multi-page PDF splitting must be done before sending to the bot. |

---

## 2. Regex-Gen-Tester (`regex-bot`)

| Limitation Vector | Verified Code / Operational Boundary | User Impact & Handling |
| :--- | :--- | :--- |
| **Engine Dialect** | Evaluates patterns using ECMAScript (JavaScript V8) RegExp engine on Cloudflare Workers. | Features specific to PCRE or Python (`(?P<name>...)`, recursive patterns `(?R)`, possessive quantifiers `++`) are unsupported and require standard ECMAScript equivalents. |
| **Execution Timeout** | Evaluates test sample assertions inside a 50ms bounded execution window. | Complex backtracking patterns on very long strings are aborted to prevent edge worker CPU throttling. |
| **Structural vs. Semantic** | Pattern matching validates string format syntax only. | A valid email regex does not verify inbox existence or deliverability; a valid phone regex does not verify if the number is assigned. |

---

## 3. English-To-SQL (`sql-bot`)

| Limitation Vector | Verified Code / Operational Boundary | User Impact & Handling |
| :--- | :--- | :--- |
| **Engine Dialect** | Executes in-memory SQLite (WASM) via `sql.js`. | Dialect-specific keywords from Oracle, SQL Server, or Postgres (e.g. `RETURNING *` in older versions, `DATEADD()`) must be converted to SQLite syntax. |
| **Stateless Execution** | Database state is instantiated in RAM per query turn. | Data inserted in Turn 1 does not persist into Turn 2 unless the full DDL and insert script is supplied or maintained in context. |
| **Row Result Capping** | Output display is capped at 50 rows. | Queries returning thousands of rows are truncated with a pagination notice to prevent browser memory exhaustion. |
| **Destructive Commands** | Destructive queries (`DROP`, `TRUNCATE`, `DELETE`) execute in the temporary sandbox but display a warning banner. | Users must be aware that the sandbox does not protect external production databases if they copy-paste destructive queries outside Poe. |

---

## 4. Privacy & Telemetry Invariants

- Zero persistence of uploaded customer document images, raw OCR text, personal names, phone numbers, tax IDs, or SQL database rows in persistent logging or analytics.
- Structured telemetry records categorical metadata counters only (`outcome`, `latency_bucket`, `error_category`).

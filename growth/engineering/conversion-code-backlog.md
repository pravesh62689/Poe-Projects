# Product Conversion Code Backlog & Implementation Specifications

**Author:** Growth Engineering Lead & Senior Systems Architect  
**Scope:** Specific code modifications across `ocr-doc-bot`, `regex-bot`, `sql-bot`, and `shared/poe-protocol-core` to maximize user activation, error recovery, and retention.

---

## 1. Backlog Summary Table

| Task ID | Package | File Path | Priority | Current Behavior | Desired Behavior | Telemetry Event |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **PROD-001** | `ocr-doc-bot` | `ocr-doc-bot/src/server.ts` | **P0** | Hardcoded intro message in `server.ts:15`. | Load intro message based on `FEATURE_INTRO_VARIANT` env var with paperclip 📎 cues. | `bot_settings_loaded` |
| **PROD-002** | `ocr-doc-bot` | `ocr-doc-bot/src/server.ts` | **P0** | Static suggested replies emitted on success. | Emit state-aware suggested replies from `suggested-replies.json` + SQL cross-bot banner. | `suggested_reply_emitted` |
| **PROD-003** | `regex-bot` | `regex-bot/src/worker.ts` | **P0** | Fixed intro in `worker.ts:55`. | Load Variant B template with copyable blockquote format. | `bot_settings_loaded` |
| **PROD-004** | `sql-bot` | `sql-bot/src/worker.ts` | **P0** | Fixed intro in `worker.ts:150`. | Load Variant B template with copyable `CREATE TABLE orders...` starter. | `bot_settings_loaded` |
| **PROD-005** | `sql-bot` | `sql-bot/src/worker.ts` | **P1** | Emits plain text error when schema missing. | Emits copyable 4-line SQL schema starter directly in the recovery response. | `error_schema_missing` |
| **PROD-006** | `shared/poe-protocol-core` | `shared/poe-protocol-core/src/telemetry.ts` | **P0** | No structured telemetry emitted. | Emits privacy-safe JSON event logs with outcome, latency bucket, and route. | `bot_task_completed` |

---

## 2. Detailed Task Engineering Specifications

### PROD-001: Dynamic Introduction Variant Loading on OCR Bot
- **File Path:** `ocr-doc-bot/src/server.ts`
- **Current Behavior:** `const OCR_INTRO_MESSAGE = ...` hardcoded string with slash commands.
- **Desired Behavior:**
  ```typescript
  const introVariant = process.env['FEATURE_INTRO_VARIANT'] || 'B';
  const introMessage = introVariant === 'B' ? OCR_INTRO_VARIANT_B : OCR_INTRO_VARIANT_A;
  ```
- **Test Specification:** Unit test verifying `/settings` endpoint returns Variant B when `FEATURE_INTRO_VARIANT=B`.
- **Rollback Plan:** Set `FEATURE_INTRO_VARIANT=A` in Render environment tab without rebuilding code.

### PROD-002: State-Aware Suggested Replies on OCR Bot
- **File Path:** `ocr-doc-bot/src/server.ts`
- **Current Behavior:** Emits 3 static strings: `Extract the line items too`, `Return only the total and date`, `Explain the low-confidence fields`.
- **Desired Behavior:** Checks `parsedResult.documentType` (receipt vs statement vs id). If receipt, emits:
  1. `Extract line items with unit prices`
  2. `Verify subtotal and tax math`
  3. `Format as expense JSON`
  4. `Analyze in @English-To-SQL`
- **Test Specification:** Vitest integration test checking SSE stream contains new suggested reply chunks.
- **Rollback Plan:** Revert `server.ts` to static replies.

### PROD-005: Interactive Starter Schema on SQL Bot
- **File Path:** `sql-bot/src/worker.ts`
- **Current Behavior:** Returns `⚠️ No SQL Schema Detected \n Please provide at least one CREATE TABLE statement...`.
- **Desired Behavior:** Returns descriptive text AND immediate copyable schema blockquote:
  ```markdown
  ℹ️ **No Table Schema Detected**
  Try this starter schema to test immediately:
  ```sql
  CREATE TABLE orders (id INT, customer TEXT, amount DECIMAL);
  INSERT INTO orders VALUES (1, 'Alice', 49.99), (2, 'Bob', 120.00);
  -- Find total spend by customer:
  ```
  ```
- **Test Specification:** Integration test asserting no-schema query returns interactive starter schema.
- **Rollback Plan:** Revert commit in `sql-bot/src/worker.ts`.

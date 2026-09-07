# Growth Engineering & Code Implementation Backlog

**Author:** Growth Engineering Lead & Senior Systems Architect  
**Scope:** Engineering tasks across `ocr-doc-bot`, `regex-bot`, `sql-bot`, and `shared/poe-protocol-core` to enable privacy-safe telemetry, feature flags, contextual suggested replies, and landing page infrastructure.

---

## 1. Prioritized Engineering Backlog

| Task ID | Component | File Path | Description | Priority | Effort | Tests Required | Rollback Plan |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **ENG-001** | `shared/poe-protocol-core` | `shared/poe-protocol-core/src/sse.ts` | Add helper `sendContextualReplies(stream, replies[])` to batch emit suggested reply events. | **P0** | 1h | Unit test in `sse.test.ts` | Revert commit; falls back to single `sendSuggestedReply`. |
| **ENG-002** | `ocr-doc-bot` | `ocr-doc-bot/src/server.ts` | Integrate dynamic suggested replies and cross-bot handoff banner into successful OCR response stream. | **P0** | 2h | Vitest integration in `integration.test.ts` | Revert `server.ts` changes. |
| **ENG-003** | `sql-bot` | `sql-bot/src/worker.ts` | Enhance suggested replies emitted on valid query execution to include dialect translation and CTE refactoring. | **P0** | 1h | Worker mock test in `integration.test.ts` | Revert `worker.ts` changes. |
| **ENG-004** | `regex-bot` | `regex-bot/src/worker.ts` | Add structured suggested replies offering language exports (TS, Py, Go) upon successful pattern evaluation. | **P0** | 1h | Worker mock test in `integration.test.ts` | Revert `worker.ts` changes. |
| **ENG-005** | `shared/poe-protocol-core` | `shared/poe-protocol-core/src/telemetry.ts` [NEW] | Implement privacy-safe telemetry logger capturing execution outcomes without saving PII, keys, or raw text. | **P0** | 3h | Unit test verifying zero secret or raw input leakage | Set `ANALYTICS_ENABLED=false` via env flag. |
| **ENG-006** | `ocr-doc-bot` | `ocr-doc-bot/src/server.ts` | Add feature-flag evaluation module for introduction variants and error copy experimentation. | **P1** | 2h | Unit tests with mocked env variables | Set default fallback in code. |
| **ENG-007** | `sql-bot` & `regex-bot` | `sql-bot/src/worker.ts`, `regex-bot/src/worker.ts` | Support environment-controlled feature flags (`INTRO_VARIANT=B`) in Cloudflare Worker env bindings. | **P1** | 2h | Vitest worker env tests | Remove env variable in Wrangler. |
| **ENG-008** | Public Site | `site/` [NEW] | Create lightweight static landing site with Astro / pure HTML on Cloudflare Pages / GitHub Pages. | **P1** | 6h | Lighthouse score audit ($> 95$ across all Web Vitals) | Unpublish domain / rollback deployment. |

---

## 2. Detailed Task Specifications

### ENG-001: Contextual Suggested Replies Batch Emission
- **Exact File:** `shared/poe-protocol-core/src/sse.ts`
- **Acceptance Criteria:**
  - Emits multiple `suggested_reply` SSE blocks before the final `done` event.
  - Guarantees each reply is trimmed and non-empty.
  - Capped at 4 replies per turn to avoid overwhelming mobile viewports.
- **Verification:** Vitest test asserting stream output contains expected event chunks.

### ENG-005: Privacy-Safe Telemetry Logger
- **Exact File:** `shared/poe-protocol-core/src/telemetry.ts`
- **Acceptance Criteria:**
  - Emits JSON structured log events with randomized request UUID, bot name, outcome (`success|partial|failure`), latency bucket, and confidence bucket.
  - **Strict Redaction:** Strips all Authorization headers, attachment URLs, raw prompt text, OCR output, and sample strings.
  - Completely bypassed if `ANALYTICS_ENABLED=false`.
- **Verification:** Unit test passing sample requests with synthetic credit card and email strings, verifying that output JSON contains zero occurrences of the sensitive substrings.

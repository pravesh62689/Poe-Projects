# GitHub Issues Implementation Backlog

**Author:** Growth Engineering Lead  
**Scope:** Ready-to-file GitHub issues covering telemetry, suggested replies, introduction message tests, and SEO verification.

---

### Issue #1: [Core/Telemetry] Implement Zero-PII Structured Telemetry Logger
- **Labels:** `growth`, `privacy`, `backend`, `P0`
- **Description:**
  Implement privacy-safe telemetry logger in `shared/poe-protocol-core/src/telemetry.ts` adhering to `growth/engineering/event-schema.json`.
- **Requirements:**
  1. Emit JSON logs on query completion with outcome, latency bucket, and confidence tier.
  2. Strip all authorization tokens, attachment URLs, raw prompts, and extracted text.
  3. Controlled via `FEATURE_ANALYTICS_ENABLED` env flag.
- **Verification:** Vitest test asserting zero sensitive substrings in emitted logs.

---

### Issue #2: [Poe/UX] Ship Action-Oriented Introduction Message Variant B
- **Labels:** `growth`, `cro`, `onboarding`, `P0`
- **Description:**
  Update introduction messages in `ocr-doc-bot/src/server.ts`, `regex-bot/src/worker.ts`, and `sql-bot/src/worker.ts` to support Variant B.
- **Requirements:**
  1. Add paperclip 📎 cues for mobile image attachment.
  2. Provide 1-line copyable starter prompts for SQL and Regex.
  3. Toggleable via `FEATURE_INTRO_VARIANT` flag.
- **Verification:** Manual Poe UI inspection and settings endpoint assertion.

---

### Issue #3: [Protocol/SSE] Batch Emit Contextual Suggested Replies
- **Labels:** `growth`, `poe-protocol`, `ux`, `P1`
- **Description:**
  Update SSE streaming logic to emit state-aware suggested replies from `growth/poe/suggested-replies.json`.
- **Requirements:**
  1. Emit 3–4 suggested replies per turn based on success vs blur/syntax failure.
  2. Include cross-bot handoff reply on successful task completion.
- **Verification:** Integration test asserting `suggested_reply` events in SSE buffer.

---

### Issue #4: [Web/SEO] Build and Deploy Static Marketing Hub on Cloudflare Pages
- **Labels:** `growth`, `seo`, `frontend`, `P1`
- **Description:**
  Build static landing site matching `growth/engineering/seo-technical-checklist.md`.
- **Requirements:**
  1. Deploy routes `/receipt-ocr`, `/regex-tester`, `/english-to-sql`.
  2. Generate dynamic `sitemap.xml` and `robots.txt`.
  3. Achieve $> 95$ Google Lighthouse score.

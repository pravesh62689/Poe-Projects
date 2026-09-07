# Customer Journey & Conversion Friction Map

**Standard:** Enterprise Conversion Rate Optimization (CRO)  
**Date:** September 2026

---

## 1. Friction Points & Automated Mitigations

| Bot | Turn Stage | Observed Friction Point | Behavioral Impact | Implemented Mitigation | Verification Test |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **OCR** | Turn 1 (Onboarding) | User sends text greeting ("hi") without an image attachment. | User is confused about what the bot does; high abandonment. | Server immediately returns an actionable greeting: *"Please attach a receipt photo. Tip: Keep all 4 corners visible."* | `ocr-doc-bot/test/integration.test.ts` |
| **OCR** | Turn 1 (Upload) | User uploads a blurry photo or extreme glare. | Bot could hallucinate wrong financial total. | Laplacian blur filter catches low sharpness and returns specific camera tips: *"Image is blurry. Please retake under diffused light."* | `qa/live-growth-gate/requests/OCR-LIVE-006.json` |
| **OCR** | Turn 1 (Execution) | Render free container has spun down after 15 min of inactivity. | 45–50 second cold-start delay causes perceived bot freeze. | Cloudflare cron keep-warm ping runs every 10 minutes (`GET /health`) to keep container alive during peak hours. | `regex-bot/wrangler.toml` triggers |
| **Regex** | Turn 1 (Onboarding) | User asks for a pattern without providing sample test strings. | Generated pattern cannot be verified; user cannot confirm edge case handling. | Introductory prompt includes copy-paste template with sample strings: *"Test strings: - valid@domain.com (valid), - invalid (invalid)"*. | `growth/poe/final-introductions.md` |
| **Regex** | Turn 1 (Execution) | User inputs a catastrophic backtracking pattern (`(a+)+$`). | CPU lock or worker timeout. | Static AST ReDoS scanner detects nested quantifiers and outputs: *"UNSAFE (Catastrophic Backtracking Risk). Suggested safe alternative: ^a+$"*. | `regex-bot/test/evaluator.test.ts` |
| **SQL** | Turn 1 (Onboarding) | User asks a question ("Show top 5 sales reps") without supplying a schema. | AI has to guess columns; query fails on production database. | Server prompts: *"No schema detected. Please provide your table schema (or copy this sample template)."* | `sql-bot/src/worker.ts` |
| **SQL** | Turn 1 (Execution) | Generated SQL has a minor syntax error or misspelled column. | User sees raw database error and abandons. | Self-healing retry catches the SQLite error message, attempts one automatic correction, and logs the adjustment. | `sql-bot/test/retry.test.ts` |
| **All** | Turn 2 (Next Step) | User completes their initial task and exits without retention or expansion. | Single-use churn; zero cross-bot discovery. | Emits 3 contextual suggested replies on success, plus conditional cross-bot handoff banner. | `shared/poe-protocol-core/test/sse.test.ts` |

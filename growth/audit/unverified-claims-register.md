# Unverified Claims Register & Marketing Governance

**Audit Standard:** Strict Truthfulness Invariant  
**Auditor:** Head of Compliance & Product Marketing  
**Date:** September 2026

---

## 1. Claims Governance Taxonomy

Every marketing claim, feature bullet, and landing page statement must hold one of five formal statuses:
1. **`VERIFIED_BY_CODE`**: Directly confirmed by inspecting local source code algorithms and unit tests.
2. **`VERIFIED_BY_LIVE_TEST`**: Measured through an executed HTTP/SSE invocation against the live production endpoint.
3. **`VERIFIED_BY_PLATFORM_DOCUMENTATION`**: Directly backed by official Poe or search platform documentation.
4. **`UNVERIFIED`**: Plausible, but lacks measured empirical data. **Prohibited from public copy until measured.**
5. **`NOT_ALLOWED_TO_CLAIM`**: Misleading, unsubstantiated, superlative, or regulatory hazard. **Permanently banned.**

---

## 2. Complete Claims Audit Table

| # | Marketing Claim Candidate | Assigned Status | Evidence / Reason | Approved Truthful Alternative |
|---|---|:---:|---|---|
| 1 | *"Extracts receipts in 3 seconds."* | **UNVERIFIED** | Live OCR latency ranges from 1.5s to 4.5s depending on image size. Stating "in 3 seconds" is misleading on larger scans. | *"Fast extraction (typically 2–5 seconds depending on image resolution)."* |
| 2 | *"Zero hallucinations."* | **NOT_ALLOWED_TO_CLAIM** | All OCR engines (including Tesseract) experience character misrecognitions on low-contrast thermal paper. | *"Pre-OCR blur gating and arithmetic reconciliation ($Subtotal + Tax = Total$) to flag uncertain readings."* |
| 3 | *"100% accurate."* | **NOT_ALLOWED_TO_CLAIM** | Grossly deceptive. No OCR or AI system achieves 100% across all real-world lighting and camera conditions. | *"Tested against real cafe receipts with 100% accuracy on clean, flat samples; confidence flags on degraded scans."* |
| 4 | *"Guaranteed safe regex / 100% ReDoS proof."* | **NOT_ALLOWED_TO_CLAIM** | ReDoS detection in V8 is heuristic; halting on a 50ms timeout mitigates, but does not mathematically prove impossibility of backtracking on all grammars. | *"Catastrophic backtracking guard that detects nested quantifiers and halts runaway evaluations at 50ms."* |
| 5 | *"Verified SQL."* | **VERIFIED_BY_CODE** | In `sql-bot/src/engine.ts`, queries are actually executed in an ephemeral in-memory SQLite WASM database before being returned. | Approved as stated: *"SQL verified by real in-memory execution."* |
| 6 | *"No data is stored."* | **VERIFIED_BY_CODE** | Verified in `ocr.ts`, `worker.ts`, and `engine.ts` that buffers exist only in volatile RAM/isolates and are destroyed after request completion. | Approved as stated: *"Stateless, ephemeral in-memory processing with zero disk persistence."* |
| 7 | *"Supports bank statements."* | **VERIFIED_BY_CODE** | Router and parser in `ocr-doc-bot/src/parsers/statement.ts` extract transaction rows and balances. | Approved as stated: *"Extracts tabular transaction rows from single-page bank statement images."* |
| 8 | *"Works with all receipts."* | **NOT_ALLOWED_TO_CLAIM** | Crumpled thermal paper with severe fading or blur below Laplacian score 120 is rejected. | *"Extracts text from receipts with legible contrast; blurry photos are flagged for retake."* |
| 9 | *"MNC-grade / Enterprise-grade."* | **NOT_ALLOWED_TO_CLAIM** | Subjective puffery without an objective industry standard definition. | Replace with concrete facts: *"Zero-PII telemetry, automated regression test suites, and edge isolate sandboxing."* |
| 10 | *"Poe will recommend your bots."* | **NOT_ALLOWED_TO_CLAIM** | Platform recommendation algorithms are proprietary; claiming guaranteed platform recommendation violates truthfulness. | *"Optimized for Poe discovery through clear category alignment, searchable keywords, and high first-message completion rates."* |
| 11 | *"Guaranteed linear runtime for regex."* | **UNVERIFIED** | Linear runtime requires a DFA engine (e.g. RE2). V8 uses an NFA engine; heuristic checks reduce risk but do not transform V8 into RE2. | *"Analyzes patterns to eliminate obvious nested quantifier backtracking traps."* |
| 12 | *"Auto-corrects SQL syntax errors."* | **VERIFIED_BY_LIVE_TEST** | Verified in Vitest `retry.test.ts`: queries with syntax errors trigger exactly one retry with compiler feedback. | Approved as stated: *"Single-cycle automated self-correction loop when syntax errors occur."* |

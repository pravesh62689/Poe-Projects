# Marketing Claims & Truthfulness Baseline

**Standard:** Anti-Deception & Truth-in-Advertising Governance  
**Audit Date:** September 7, 2026

---

## 1. Regulated Vocabulary & Status Register

| Marketing Phrase | Historical Status | Current Code / Evidence Check | Approved Baseline Position |
| :--- | :--- | :--- | :--- |
| **"100% accurate"** | Prohibited | OCR engines make character errors on blur/glare; SQL depends on schema fidelity | **BANNED.** Replaced with: *"Field-level confidence scoring flags uncertain characters."* |
| **"Zero hallucinations"** | Prohibited | Generative LLMs inherently hallucinate when ungrounded | **BANNED.** Replaced with: *"Eliminates guessed column syntax by verifying queries against an in-memory SQLite sandbox."* |
| **"Guaranteed safe regex"** | Prohibited | Static analysis cannot mathematically guarantee polynomial time for all Turing-complete PCRE engines | **BANNED.** Replaced with: *"Scans for common catastrophic backtracking structures and bounds execution time."* |
| **"Instant 3-second OCR"** | Unverified | Render container cold start takes ~45s; warm execution is 4.12s | **BANNED.** Replaced with: *"Processes documents in approximately 4 seconds once warmed."* |
| **"MNC-grade" / "Enterprise-grade"** | Subjective Hype | Unverifiable promotional fluff | **BANNED.** Replaced with: *"Tested against empirical ground-truth test suites."* |
| **"Reconciled financial totals"** | Verified | Tested in `src/reconciler.ts` ($Subtotal + Tax = Total$) | **APPROVED.** Scoped to receipts with printed subtotal, tax, and total. |
| **"Runs in-memory SQLite sandbox"** | Verified | Tested in `sql-bot/src/engine.ts` using `sql.js` WASM | **APPROVED.** |
| **"Executes regex on sample strings"** | Verified | Tested in `regex-bot/src/evaluator.ts` | **APPROVED.** |
| **"Zero data retention"** | Verified | Code review confirms zero database or disk writes | **APPROVED.** Scoped to ephemeral in-memory processing. |

---

## 2. Claim Validation Governance

The claim validator script `scripts/growth/check-claims.js` runs as an automated blocking gate in both the local test suite and CI (`.github/workflows/quality.yml`). Any markdown or HTML file containing banned superlative phrases fails the build immediately.

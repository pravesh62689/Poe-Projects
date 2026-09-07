# Phased Growth Implementation Roadmap (Phases 0–5)

**Author:** Chief Growth Officer & Head of Engineering  
**Scope:** Phased execution strategy detailing task ownership, file paths, dependencies, acceptance criteria, test plans, rollback plans, and risk profiles.

---

## 1. Phase Overview

| Phase | Title | Focus Area | Duration | Target Outcome |
| :---: | :--- | :--- | :---: | :--- |
| **Phase 0** | Baseline, Evidence & Safety | Live OCR benchmarks, Zero-PII telemetry, baseline audit | Days 1–3 | Verified test evidence; 0 PII leakage. |
| **Phase 1** | Poe Listing & First-Use Conversion | Introduction message Variant B, suggested replies, cross-sell | Days 4–7 | +25% first-message conversion. |
| **Phase 2** | Public Site & Technical SEO | Static marketing site, Cloudflare Pages, canonical metadata | Week 2 | Core Web Vitals 100%; search indexation. |
| **Phase 3** | Original Content & Benchmark Assets | 4 pillar guides, live OCR benchmark hub, pattern cookbooks | Weeks 3–4 | High-intent ranking for long-tail queries. |
| **Phase 4** | Growth Experimentation & Iteration | A/B testing introduction copy, suggested replies, CTAs | Weeks 5–8 | +30% weekly successful tasks (WSTC). |
| **Phase 5** | Scaling & Ecosystem Compounding | Cross-bot pipeline compounding, community answers, open-source | Weeks 9–12 | Established multi-bot workflow dominance. |

---

## 2. Detailed Phase Specifications

### Phase 0: Baseline, Evidence & Safety (Days 1–3)
- **Task 0.1:** Human-verified ground-truth audit of real cafe receipt (`receipt_001_original.jpg`).
  - *Owner:* Principal QA Architect
  - *Exact File:* `qa/live-ocr/ground-truth/receipt_001_original.json`
  - *Acceptance Criteria:* Exact field-by-field verification ($14.70 + 0.74 = 15.44$).
  - *Test Plan:* `node qa/live-ocr/scripts/run-live-evaluation.js`.
  - *Rollback:* Revert to baseline commit.
- **Task 0.2:** Zero-PII Telemetry Architecture & Event Schema.
  - *Owner:* Analytics Lead
  - *Exact File:* `growth/engineering/event-schema.json`, `shared/poe-protocol-core/src/telemetry.ts`
  - *Acceptance Criteria:* Zero auth keys, raw document images, or customer prompts logged.

### Phase 1: Poe Listing & First-Use Conversion (Days 4–7)
- **Task 1.1:** Update bot introduction messages to Action-Oriented Variant B across all bots.
  - *Owner:* Head of Product Marketing
  - *Exact Files:* `ocr-doc-bot/src/server.ts`, `regex-bot/src/worker.ts`, `sql-bot/src/worker.ts`
  - *Acceptance Criteria:* Numbered action steps, copyable starter prompts, paperclip 📎 cues.
  - *Monitoring:* Ratio of first messages to profile views.
  - *Rollback:* Set `FEATURE_INTRO_VARIANT=A`.
- **Task 1.2:** Integrate contextual suggested reply trees and cross-bot handoffs into SSE stream.
  - *Owner:* Growth Engineer
  - *Exact Files:* `shared/poe-protocol-core/src/sse.ts`, `growth/poe/suggested-replies.json`
  - *Acceptance Criteria:* Contextual suggested replies emitted before `done` event.

### Phase 2: Public Site & Technical SEO (Week 2)
- **Task 2.1:** Deploy static marketing pages on Cloudflare Pages.
  - *Owner:* SEO Director
  - *Exact Paths:* `/receipt-ocr`, `/regex-tester`, `/english-to-sql`, `/sitemap.xml`, `/robots.txt`
  - *Acceptance Criteria:* Google Lighthouse performance score $> 95$; LCP $< 1.8\text{s}$.

### Phase 3: Original Content & Benchmark Assets (Weeks 3–4)
- **Task 3.1:** Publish 4 core pillar guides based on approved content briefs.
  - *Owner:* Content Lead
  - *Acceptance Criteria:* Must pass `node scripts/growth/validate-content.js` with 100% score.

### Phase 4: Growth Experimentation & Iteration (Weeks 5–8)
- **Task 4.1:** Execute 12-week experiment roadmap starting with EXP-01 and EXP-02.
  - *Owner:* CRO Lead
  - *Decision Rule:* Roll out challenger if lift $> 15\%$ with $p < 0.05$.

### Phase 5: Scaling & Ecosystem Compounding (Weeks 9–12)
- **Task 5.1:** Scale cross-bot workflow adoption and community Q&A engagement.
  - *Owner:* Head of Community
  - *Invariant:* Strict adherence to zero-spam guidelines.

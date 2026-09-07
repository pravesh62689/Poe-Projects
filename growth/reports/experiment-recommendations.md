# Experiment Recommendations & Iteration Brief

**Author:** CRO Lead & Lifecycle Marketer  
**Date:** September 2026  
**Scope:** Actionable experiment recommendations for the upcoming growth sprint based on measured funnel drops and user feedback.

---

## 1. Top Recommended Experiments

### Recommendation 1: Deploy Action-Oriented Introduction Variant B on OCR-Doc-Parser
- **Evidence:** 72% drop-off between bot profile view and first message received. Many mobile users ask text questions rather than attaching a photo.
- **Action:** Set `FEATURE_INTRO_VARIANT=B` on Render deployment.
- **Expected Lift:** $+22\%$ increase in first-image attachment conversion within 7 days.
- **Guardrail Metric:** Blur gate reject rate must remain steady (no increase in unusable uploads).

### Recommendation 2: Enable Batch Multi-Sample Suggested Replies on Regex-Gen-Tester
- **Evidence:** 45% of users test only 1 sample string, missing the core value of batch validation.
- **Action:** Update `worker.ts` to emit suggested replies with negative edge-case templates (`Add a sample that should NOT match`).
- **Expected Lift:** $+35\%$ increase in multi-turn conversation depth.

### Recommendation 3: Add Explicit DDL Template Helper on English-To-SQL
- **Evidence:** 14% of first queries lack a `CREATE TABLE` schema, triggering an error response.
- **Action:** When no schema is detected, return a 1-click starter e-commerce schema with sample rows.
- **Expected Lift:** $+40\%$ recovery conversion on no-schema queries.

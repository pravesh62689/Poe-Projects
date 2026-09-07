# Active Controlled Experiments

**Standard:** Experimentation Governance & Measurement Protocol  
**Date:** September 2026

---

## 1. Currently Active Experiment: EXP-001 (OCR Onboarding)
- **Target Bot:** `OCR-Doc-Parser`
- **Hypothesis:** Direct 4-corner upload prompt reduces turn-1 confusion and increases first-task completion compared to generic welcome greetings.
- **Control (Variant A):** Generic greeting ("Welcome to OCR Doc Parser...").
- **Challenger (Variant B):** Direct upload instruction ("Attach a photo of your receipt or invoice now...").
- **Sample Size Threshold:** 50 completed turns.
- **Primary Metric:** First Successful Extraction Rate.
- **Guardrail Metric:** Error rate $< 5\%$, Low-confidence rate $< 10\%$.
- **Current Status:** READY FOR LAUNCH (Awaiting Poe Creator Studio description update `EXT-01`).

---

## 2. Queued Experiments
- **EXP-002 (Regex Onboarding):** Sample-first runnable template vs syntax explanation. (Status: QUEUED).
- **EXP-003 (SQL Onboarding):** Copyable schema template vs blank prompt. (Status: QUEUED).
- **EXP-004 (Cross-Bot Handoff):** Contextual SQL schema banner post-OCR extraction vs no banner. (Status: QUEUED).
- **EXP-005 (Error Recovery):** Diagnosis-first error recovery copy vs generic apologies. (Status: QUEUED).

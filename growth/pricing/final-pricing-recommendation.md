# Final Evidence-Based Pricing Recommendation

**Standard:** Enterprise Pricing Strategy & Commercial Operations  
**Date:** September 2026

---

## 1. Executive Pricing Recommendation Table (Phased Rollout)

### Phase 1: Penetration / Launch Wave (Active Strategy)
*Objective: Maximize viewer reach, impressions, trial adoption, and rating volume by removing payment friction.*

| Bot Service | Active Launch Price | Per Query Cost | Strategic Rationale | Marginal Compute Cost | Contribution Margin |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Regex-Gen-Tester** | **$1.00 / 1,000 msgs** | $0.001 / task | Developer gateway bot; maximum reach and viral adoption. | $0.00 (CF Workers free tier) | **100%** |
| **English-To-SQL** | **$2.00 / 1,000 msgs** | $0.002 / task | Low barrier for data analysts testing schema verification. | $0.00 (CF Workers free tier) | **100%** |
| **OCR-Doc-Parser** | **$3.00 / 1,000 msgs** | $0.003 / task | Unlocks receipt/invoice extraction with minimal initial cost. | $0.00 (Render free tier) | **100%** |

### Phase 2: Mature Target Pricing (Escalation Milestone)
*Trigger: Cumulative 500+ active conversations and sustained >4.5 creator rating.*

| Bot Service | Target Mature Price | Per Query Cost | Strategic Rationale | Contribution Margin |
| :--- | :--- | :--- | :--- | :--- |
| **Regex-Gen-Tester** | **$4.00 / 1,000 msgs** | $0.004 / task | High-volume developer utility. | 87.5% |
| **English-To-SQL** | **$6.00 / 1,000 msgs** | $0.006 / task | Verified SQL generation with execution proofs. | 86.7% |
| **OCR-Doc-Parser** | **$10.00 / 1,000 msgs** | $0.010 / task | High-compute document intelligence & reconciliation. | 76.0% |

---

## 2. External Action Requirement

Because Poe Creator Studio does not offer an external REST API or webhook for creator pricing updates:
- This change is marked **BLOCKED_EXTERNAL_ACTION** in automated pipelines.
- Detailed step-by-step instructions to configure these values manually in `poe.com/edit_bot` are documented in [growth/operations/external-actions-required.md](file:///C:/Users/prave/DUMP/PROJECTS/poe-projects/growth/operations/external-actions-required.md).

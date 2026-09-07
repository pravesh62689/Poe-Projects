# Pricing Hypotheses & Evidence-Gated Strategy

**Standard:** Behavioral Economics & Pricing Governance  
**Date:** September 2026

---

## 1. Core Pricing Principles

1. **Price by Verified Value:** Price according to delivered utility (e.g. accounting receipt JSON vs simple regex pattern), not arbitrary token count.
2. **Never Underprice to Zero Permanently:** Free forever attracts low-intent traffic, saturates Render containers, and anchors users to zero value.
3. **No Price Shocks:** Increase prices only after proving task completion and customer retention.
4. **Single-Variable Testing:** Never test price and onboarding copy simultaneously on low-volume traffic.

---

## 2. Tested Hypotheses

### Hypothesis 1: Penetration / Learning Stage Pricing
- **Hypothesis:** Launching at an accessible entry fee ($5–$8 / 1k messages) maximizes first-turn activation and review collection without triggering the churn associated with later price hikes.
- **Test Metric:** First-task completion rate & 7-day retention.
- **Risk:** Anchoring users if prices are raised later. Mitigation: Keep initial price stable as the long-term baseline.

### Hypothesis 2: Value-Tiered Portfolio Pricing
- **Hypothesis:** Positioning OCR as the highest-tier ($10/1k), SQL as mid-tier ($6/1k), and Regex as low-friction entry ($4/1k) reflects perceived value and user willing-to-pay.
- **Test Metric:** Cross-bot conversion rate from Regex to SQL/OCR.
- **Risk:** Users stick to Regex without discovering higher-margin bots.

### Hypothesis 3: Evidence-Gated Increase Threshold
- **Hypothesis:** Price increases should only occur when:
  1. Bot completes $\ge 100$ qualified tasks with $\ge 85\%$ success rate.
  2. Zero unresolved P0/P1 defects exist.
  3. Positive feedback ratio is $\ge 4.5/5.0$.
  4. Unit economics show positive contribution margin.
- **Guardrail:** Rollback immediately if daily activation drops by $> 20\%$.

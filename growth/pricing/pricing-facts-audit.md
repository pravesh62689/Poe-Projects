# Poe Platform Pricing Facts & Mechanics Audit

**Document ID:** PRICE-AUDIT-01  
**Auditor:** Growth Engineering & Pricing Strategy  
**Date:** 2026-09-08  
**Standard:** Verified Platform Mechanics vs Empirical Assumptions.

---

## 1. Core Platform Pricing Mechanics

| Question / Dimension | Platform Fact / Verified Behavior | Evidence Source | Uncertainty / Assumption Status |
| :--- | :--- | :--- | :--- |
| **Pricing Unit** | Price is set per **1,000 messages** ($/1k msgs) in Poe Creator Studio. | Poe Creator Studio UI & Official Docs | **VERIFIED FACT** |
| **Customer-Facing Charge** | Poe users spend **Compute Points** per message based on the bot's base model + creator markup price. | Poe Help Center & Subscriber Pricing | **VERIFIED FACT** |
| **Creator Payout Share** | Creators receive a revenue-share payout for compute points spent by subscribers, calculated against Poe's point redemption rate. | Poe Creator Monetization Terms | **VERIFIED FACT** |
| **Individual Bot Pricing** | Pricing is configured **independently per bot** in each bot's Creator Studio settings. | Poe Creator Studio Edit Bot screen | **VERIFIED FACT** |
| **Platform Revenue Cut** | Poe deducts platform fees, payment processing costs, and base LLM inference costs (if using Poe-hosted models). For server bots, creator hosts the server, so base model inference is $0 from Poe. | Poe Developer Documentation | **VERIFIED FACT** |
| **Payout Minimums & Taxes** | Minimum payout threshold is typically $10.00 via Stripe Connect; applicable tax withholdings (W-8BEN / W-9) apply. | Stripe / Poe Creator Terms | **VERIFIED FACT** |
| **Follow / Subscription Events** | Follower count and total message charges are exposed in Creator Studio; subscriber identity is anonymized. | Poe Creator Dashboard UI | **VERIFIED FACT** |

---

## 2. Product-Specific Penetration Pricing Strategy

| Bot | Launch Confirmed Price (per 1k msgs) | Effective Cost to User per Query | Creator Net Payout Estimate | Hosting Cost to Serve | Contribution Margin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Regex-Gen-Tester** | **$1.00** | $0.001 | ~$0.70 – $0.85 | $0.00 (Cloudflare Free Tier) | ~100% |
| **English-To-SQL** | **$2.00** | $0.002 | ~$1.40 – $1.70 | $0.00 (Cloudflare Free Tier) | ~100% |
| **OCR-Doc-Parser** | **$3.00** | $0.003 | ~$2.10 – $2.55 | $0.00 (Render Free Tier) | ~100% |

---

## 3. Price Increase Evidence Gate

No automated price changes are permitted. A price transition from Phase 1 ($1/$2/$3) to Phase 2 ($2/$4/$6) requires satisfying ALL of the following empirical conditions:
1. Minimum 100 verified successful user tasks completed on each bot.
2. Stable task error rate (< 5% failure rate).
3. Positive user retention (repeat query rate >= 20%).
4. Zero unresolved high-severity bug tickets.
5. Defined rollback procedure documented in `growth/pricing/price-change-runbook.md`.

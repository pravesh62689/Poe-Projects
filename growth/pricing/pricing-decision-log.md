# Pricing Decision Log

**Standard:** Enterprise Pricing Committee Records  
**Date:** September 2026

---

## Decision Record 01: Rejection of $0.00 Permanent Free Pricing
- **Context:** Consideration was given to setting creator earnings to $0.00 across all bots to maximize raw message counts.
- **Decision:** **REJECTED.**
- **Rationale:** Permanent $0.00 attracts scraper bot traffic, saturates the Render free-tier container on OCR, and prevents measuring price elasticity. Furthermore, Poe users already pay a monthly platform subscription and are accustomed to spending points on utility bots.
- **Approved Strategy:** Set moderate initial fees ($4–$10 / 1k messages) that deliver 75%+ contribution margins while keeping user compute cost below 2x standard conversation.

---

## Decision Record 02: Mature Target Pricing Architecture
- **Context:** Modeling long-term steady-state pricing per 1,000 messages on Poe Creator Studio.
- **Decision:**
  - `OCR-Doc-Parser`: **$10.00 / 1,000 messages** ($0.01 / task)
  - `English-To-SQL`: **$6.00 / 1,000 messages** ($0.006 / task)
  - `Regex-Gen-Tester`: **$4.00 / 1,000 messages** ($0.004 / task)
- **Status:** Target steady-state pricing once user base and social proof compound.

---

## Decision Record 03: Phased Penetration Pricing Strategy ($1.00 / $2.00 / $3.00 Launch Wave)
- **Context:** To overcome the zero-user cold-start friction on Poe, the creator implemented aggressive penetration pricing to maximize discovery, impressions, viewer conversion, and early reviews.
- **Decision:** **APPROVED FOR IMMEDIATE LAUNCH.**
  - `Regex-Gen-Tester`: **$1.00 / 1,000 messages** ($0.001 / query)
  - `English-To-SQL`: **$2.00 / 1,000 messages** ($0.002 / query)
  - `OCR-Doc-Parser`: **$3.00 / 1,000 messages** ($0.003 / extraction)
- **Economic Feasibility:**
  - Zero-budget infrastructure invariant: Cloudflare Workers (free tier: 100,000 requests/day) and Render (free tier: 750 compute hours/month) incur $0.00 marginal compute costs during initial launch.
  - Gross contribution margin remains ~100% of creator earnings.
- **Escalation Trigger:**
  - Maintain $1.00 / $2.00 / $3.00 until reaching 500 cumulative active conversations and an average creator profile rating > 4.5.
  - Gradually escalate towards $4.00 / $6.00 / $10.00 as organic retention and search rankings harden.


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

## Decision Record 02: Launch Pricing Architecture
- **Context:** Setting initial launch price per 1,000 messages on Poe Creator Studio.
- **Decision:**
  - `OCR-Doc-Parser`: **$10.00 / 1,000 messages** ($0.01 / task)
  - `English-To-SQL`: **$6.00 / 1,000 messages** ($0.006 / task)
  - `Regex-Gen-Tester`: **$4.00 / 1,000 messages** ($0.004 / task)
- **Status:** APPROVED for initial 100-task baseline observation.

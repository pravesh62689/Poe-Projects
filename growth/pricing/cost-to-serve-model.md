# Cost-to-Serve & Unit Economics Model

**Standard:** Enterprise Financial Modeling & Pricing Governance  
**Date:** September 2026  
**Applicable Portfolio:** `OCR-Doc-Parser`, `Regex-Gen-Tester`, `English-To-SQL`

---

## 1. Contribution Margin Framework

The contribution margin per qualified task is governed by:

$$\text{Contribution Margin} = \text{Verified Revenue} - \text{Infrastructure Cost} - \text{Upstream Model Cost} - \text{Support/Ops} - \text{Failure/Risk Allocation}$$

---

## 2. Bot-Specific Unit Economics Breakdown

### A. `OCR-Doc-Parser` (`ocr-doc-bot`)
- **Hosting Tier:** Render Free Web Service ($0/month within 750 free instance hours limit). If scaled to Paid Starter: $7.00/month.
- **Compute Profile:** Node.js + Tesseract WASM + OpenCV image deskew. Memory: ~380MB peak. CPU: ~4.1 seconds single vCPU.
- **Upstream Model Dependency:** **None ($0.00)**. Runs local optical character recognition and regex heuristic parsing.
- **Variable Infrastructure Cost:**
  - On Free Tier: $0.0000 / query.
  - On $7/mo Paid Tier (assuming 5,000 queries/mo): $0.0014 / query.
- **Support & Failure Allocation:** $0.0010 / query (accounting for blurry upload retries and support).
- **Target Revenue (Poe Creator Fee):** $10.00 / 1,000 messages = **$0.0100 / message**.
- **Net Contribution Margin:**
  $$\text{Margin}_{\text{OCR}} = \$0.0100 - \$0.0014 - \$0.0000 - \$0.0010 = \mathbf{+\$0.0076 \text{ per query (76.0\% Margin)}}$$

### B. `Regex-Gen-Tester` (`regex-bot`)
- **Hosting Tier:** Cloudflare Workers Free Tier (100,000 requests/day, 10ms CPU limit).
- **Compute Profile:** V8 Edge isolate. In-memory RegExp execution: ~28ms wall-clock, <2ms CPU.
- **Upstream Model Dependency:** Claude-3.5-Sonnet on Poe (`server_bot_dependencies: { "Claude-3.5-Sonnet": 1 }`).
  - Note: On Poe, base model compute points (~300–380 pts/msg) are billed directly by Poe to the user's subscription balance. The bot creator does not pay Anthropic API tokens directly.
- **Variable Infrastructure Cost:** $0.0000 / query on Cloudflare Free Tier. (Overage cost on Workers Paid: $0.50 per 1,000,000 requests = $0.0000005/req).
- **Target Revenue (Poe Creator Fee):** $4.00 / 1,000 messages = **$0.0040 / message**.
- **Support & Failure Allocation:** $0.0005 / query.
- **Net Contribution Margin:**
  $$\text{Margin}_{\text{Regex}} = \$0.0040 - \$0.0000 - \$0.0000 - \$0.0005 = \mathbf{+\$0.0035 \text{ per query (87.5\% Margin)}}$$

### C. `English-To-SQL` (`sql-bot`)
- **Hosting Tier:** Cloudflare Workers Free Tier.
- **Compute Profile:** SQLite WASM (`sql.js`) initialized in RAM. Query execution: ~39ms.
- **Upstream Model Dependency:** Claude-3.5-Sonnet on Poe (Base points billed to user by platform).
- **Variable Infrastructure Cost:** $0.0000 / query on Cloudflare Free Tier.
- **Target Revenue (Poe Creator Fee):** $6.00 / 1,000 messages = **$0.0060 / message**.
- **Support & Failure Allocation:** $0.0008 / query.
- **Net Contribution Margin:**
  $$\text{Margin}_{\text{SQL}} = \$0.0060 - \$0.0000 - \$0.0000 - \$0.0008 = \mathbf{+\$0.0052 \text{ per query (86.7\% Margin)}}$$

---

## 3. Assumptions & Sensitivity Boundary

| Parameter | Value | Source / Basis | Status |
| :--- | :---: | :--- | :---: |
| **Poe Points Conversion** | $1 USD = 1,000 Points | Poe Creator Studio standard payout documentation | Platform Baseline |
| **Upstream Subrequest Cost** | Billed to user points | `server_bot_dependencies` protocol specification | Platform Invariant |
| **Free Tier Quota Limits** | Render: 750 hrs/mo, CF: 100k req/day | Official vendor pricing pages | Operational Reality |
| **User Churn Sensitivity** | Fee < 2x normal message is tolerated | Historical Poe subscriber analysis in `PRICING.md` | **Assumption** (Must be validated by experiment) |
| **7-Day Retention** | Estimated 15% | Standard developer utility benchmark | **Assumption** (Awaiting real cohort data) |

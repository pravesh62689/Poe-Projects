# Apex Forge Technology — KPI & Metrics Dictionary

**Document Version:** 1.0.0  
**Data Integrity Rule:** Only measure and report real data from verified public analytics, Search Console exports, or Poe Creator Studio. Never extrapolate or fabricate metrics.

---

## 1. Web Traffic & Funnel Conversion KPIs

### 1.1 Qualified Unique Visitors
- **Definition:** Total unique human visits to static website pages on `https://apex-forge-tools.pages.dev` measured via server-side logs or privacy-preserving analytics.
- **Source:** Cloudflare Pages Web Analytics (privacy-first, cookie-less).
- **Update Frequency:** Daily aggregate.

### 1.2 Outbound Poe CTA Rate (Click-Through Rate)
- **Formula:** `(Total Clicks on "Open on Poe" CTAs) ÷ (Total Unique Page Visits) * 100`
- **Target Baseline:** 8% - 15% across dedicated tool landing pages (`/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/`).
- **Source:** Client-side outbound click event telemetry.

### 1.3 Interactive Example Copy Rate
- **Formula:** `(Clicks on "Copy Prompt" or "Copy Schema") ÷ (Total Page Visits) * 100`
- **Signal:** Direct indicator of user intent and content utility before leaving for Poe.

---

## 2. Poe Creator Studio & Bot Performance KPIs

### 2.1 Bot Message Volume
- **Definition:** Total user messages processed across Apex Forge OCR (`OCR-Doc-Bot`), Apex Forge Regex (`Regex-Gen-Tester`), and Apex Forge SQL (`English-To-SQL`).
- **Source:** Official Poe Creator Studio export only.
- **Constraint:** Internal development and test requests must be flagged and segregated using `owner_test: true`.

### 2.2 First-Task Success Rate
- **Definition:** Percentage of initial user prompts that result in a valid structured output without an immediate syntax/schema/unsupported format error.
- **Formulation:** `(Successful First Turns) ÷ (Total First Turns) * 100`

### 2.3 Field-Confidence Index (OCR)
- **Definition:** Mean confidence percentage across extracted fields (merchant, date, total, tax) on processed receipts.

### 2.4 ReDoS Mitigation Rate (Regex)
- **Definition:** Percentage of generated/tested regular expressions evaluated as safe vs flagged for catastrophic backtracking vulnerabilities.

### 2.5 Sandbox Execution Pass Rate (SQL)
- **Definition:** Percentage of generated SQL queries that execute without runtime syntax errors in the temporary `:memory:` SQLite sandbox.

---

## 3. Financial & Revenue KPIs

### 3.1 Creator Points & Monitization Revenue
- **Definition:** Real payouts earned via Poe Creator Monetization (Per-message revenue and compute point remuneration).
- **Source:** Poe Creator Studio payout statement.
- **Reporting Invariant:** Zero revenue is assumed or forecasted until funds are verified in creator ledger.

# Creator Payout Evidence & Unit Economics Ledger

**Audit Scope:** Empirical creator earnings, payout records, platform fees, and infrastructure operating costs.  
**Baseline Date:** 2026-09-08  
**Operating Regime:** Free-Tier Zero-Recurring Infrastructure ($0.00 / mo).

---

## 1. Verified Payout & Earnings Status

| Bot Handle | Confirmed Platform Price | Total Messages Processed | Billed Charges | Net Creator Payout Received | Verification Source | Current Status |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| `OCR-Doc-Bot` | $3.00 / 1k | 0 | 0 | $0.00 | Poe Creator Studio | **PRE-LAUNCH BASELINE** |
| `Regex-Gen-Tester` | $1.00 / 1k | 0 | 0 | $0.00 | Poe Creator Studio | **PRE-LAUNCH BASELINE** |
| `English-To-SQL` | $2.00 / 1k | 0 | 0 | $0.00 | Poe Creator Studio | **PRE-LAUNCH BASELINE** |

*Notice:* Prior to external customer acquisition, zero earnings have been disbursed. All metrics reflect a verified baseline without artificial inflation.

---

## 2. Infrastructure Cost-to-Serve Ledger

| Infrastructure Service | Allocated Workload | Monthly Free Tier Allowance | Current Monthly Consumption | Monthly Out-of-Pocket Cost |
| :--- | :--- | :--- | :--- | :---: |
| **Cloudflare Workers** | `regex-bot`, `sql-bot` | 100,000 requests / day (3M / month) | < 500 requests | **$0.00** |
| **Cloudflare Pages** | `poe-developer-suite` static site | Unlimited bandwidth & requests | 18 requests | **$0.00** |
| **Render Web Services** | `ocr-doc-bot` container | 750 compute hours / month | ~20 hours | **$0.00** |
| **GitHub Actions** | CI/CD test, SEO, & report pipelines | 2,000 minutes / month | ~45 minutes | **$0.00** |
| **Total Monthly Cost** | Entire Suite Operations | — | — | **$0.00** |

---

## 3. Unit Margin Analysis (at Penetration Pricing)

- **Regex-Gen-Tester ($1.00 / 1,000 msgs):**  
  Revenue per query: $0.0010  
  Hosting cost per query: $0.0000 (Cloudflare edge isolate execution ~15ms)  
  *Gross Margin: 100%*

- **English-To-SQL ($2.00 / 1,000 msgs):**  
  Revenue per query: $0.0020  
  Hosting cost per query: $0.0000 (WASM SQLite in-memory isolate execution ~30ms)  
  *Gross Margin: 100%*

- **OCR-Doc-Parser ($3.00 / 1,000 msgs):**  
  Revenue per query: $0.0030  
  Hosting cost per query: $0.0000 (Render shared CPU container within 750hr free tier)  
  *Gross Margin: 100%*

Conclusion: The zero-recurring-budget invariant is strictly maintained across all three products.

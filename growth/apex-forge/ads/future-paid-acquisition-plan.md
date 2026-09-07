# Apex Forge Technology — Future Paid Acquisition Plan (Planning Only — ₹0 Active Spend)

**Document Version:** 1.0.0  
**Budget Status:** ₹0 Active Spend (Zero Recurring Budget Constraint Strictly Maintained)  
**Execution Condition:** Planning and architectural design only. No live campaigns, ad accounts, payment cards, or advertising spend may be initiated without prior written authorization from the project owner.

---

## 1. Acquisition Strategy & Channels Overview

### 1.1 Google Search Ads (High-Intent Search)
- **Targeting Thesis:** Target strictly high-intent, problem-focused queries where users have an immediate technical task (e.g. converting a receipt image to structured JSON, testing a regex against positive/negative strings, or querying a relational database schema in plain English).
- **Match Types:** Exact Match `[keyword]` and tight Phrase Match `"keyword"` only. Broad Match is strictly prohibited to prevent budget dilution.
- **Landing Page Mapping:** Direct 1-to-1 alignment between ad copy, search query, and product landing page (e.g. receipt ads go to `/receipt-ocr/`, NOT to `/`).

### 1.2 Community & Developer Platforms (Product Hunt, Reddit, Stack Overflow)
- **Community Policy:** Zero automated bot posting or artificial upvoting.
- **Launch Kit Preparedness:** Prepare factual, high-utility launch packages for platforms like Product Hunt displaying real technical architecture (Render FastAPI service, Cloudflare Workers, Poe protocol integration) and real limitations.

### 1.3 Remarketing / Retargeting Policy
- **Policy:** Strictly prohibited under current ₹0 zero-tracking regime. No tracking pixels (Facebook Pixel, Google Tag Manager, LinkedIn Insight Tag) shall be loaded on `site/` without a dedicated, legally compliant consent management platform (CMP) and explicit user opt-in.

---

## 2. Campaign Structure & Ad Groups

### Campaign 1: Search — Apex Forge OCR (High-Intent Document Extraction)
- **Ad Group 1.1:** Receipt OCR to JSON
  - Keywords: `[receipt ocr to json]`, `"extract receipt data json"`, `[receipt image to json]`
  - Headline 1: Extract Receipt Data to JSON
  - Headline 2: Apex Forge OCR on Poe
  - Description 1: Extract merchant, dates, line items, and totals from receipt photos with field confidence signals.
  - Final URL: `https://poe-developer-suite.pages.dev/receipt-ocr/`
- **Ad Group 1.2:** Invoice Field Extraction
  - Keywords: `[extract invoice fields]`, `"invoice field extraction"`, `[invoice data parser]`
  - Final URL: `https://poe-developer-suite.pages.dev/receipt-ocr/`

### Campaign 2: Search — Apex Forge Regex (Pattern Generation & Security)
- **Ad Group 2.1:** Regex Generator & Tester
  - Keywords: `[regex generator with test cases]`, `"test regex against examples"`, `[regex tester with capture groups]`
  - Headline 1: Test Regex with Sample Data
  - Headline 2: Apex Forge Regex on Poe
  - Description 1: Generate regular expressions from English, test against multiple sample strings, and inspect capture groups.
  - Final URL: `https://poe-developer-suite.pages.dev/regex-tester/`

### Campaign 3: Search — Apex Forge SQL (Schema to Query Sandbox)
- **Ad Group 3.1:** Natural Language to SQL
  - Keywords: `[english to sql with schema]`, `"generate sql and test it"`, `[sql query generator sample data]`
  - Headline 1: English to SQL with Schema
  - Headline 2: Apex Forge SQL on Poe
  - Description 1: Turn plain English questions into verified SQL executed in an isolated, in-memory SQLite sandbox.
  - Final URL: `https://poe-developer-suite.pages.dev/english-to-sql/`

---

## 3. Negative Keyword Safeguards
An extensive negative keyword list is maintained in `negative-keywords.csv` to filter out non-viable queries such as "free download cracked", "jobs", "certification", "salary", "homework answers", and unrelated hardware queries.

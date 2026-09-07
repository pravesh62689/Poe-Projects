# Apex Forge Technology — Analytics Dashboard Specification

**Document Version:** 1.0.0  
**Target Viewers:** Product Engineering, Growth Operations, Business Owner  
**Data Sources:** Cloudflare Web Analytics (Site), Google Search Console (SEO), Poe Creator Studio (Bot Engagement & Revenue).

---

## 1. Dashboard Layout & Widget Breakdown

### Row 1: Executive Snapshot (30-Day Trailing)
1. **Total Web Inbound Visits:** Aggregate unique visits across all 17 static pages.
2. **Poe Outbound Activations:** Total clicks initiating bot sessions on Poe.
3. **Poe Bot Total Messages:** Direct user queries handled across OCR, Regex, and SQL.
4. **Creator Points / Monetization:** Actual realized earnings from Creator Studio ledger.

### Row 2: Search Visibility & Organic Traffic (Google Search Console)
1. **Total Organic Clicks:** Verified search clicks.
2. **Total Organic Impressions:** Aggregate impressions for target keyword clusters.
3. **Top Performing Queries:** Table listing Query, Clicks, Impressions, CTR, and Average Position.
4. **Top Performing Pages:** Table listing Landing Page URL, Clicks, and Organic Rank.

### Row 3: Product Funnel & CTA Efficiency
1. **CTA Conversion by Product:**
   - Apex Forge OCR (`/receipt-ocr/` -> Poe Bot)
   - Apex Forge Regex (`/regex-tester/` -> Poe Bot)
   - Apex Forge SQL (`/english-to-sql/` -> Poe Bot)
2. **Interactive Utility Usage:** Volume of prompt and schema copy actions.
3. **Workflow Funnel:** Drop-off rates across Stage 1 (OCR) -> Stage 2 (Regex) -> Stage 3 (SQL).

### Row 4: Bot Reliability & Error Taxonomy
1. **Success vs Partial vs Error Ratio:** Stacked bar chart tracking outcome distribution.
2. **Error Category Breakdown:** Donut chart categorizing failure causes (`image_quality`, `ocr`, `parser`, `regex_safety`, `sql_schema`, `sql_execution`, `protocol`, `upstream`).
3. **Latency Distribution:** Histogram categorizing response times (`<1s`, `1-3s`, `3-10s`, `>10s`).

---

## 2. Refresh Cadence & Alert Thresholds
- **Site Traffic:** Updated every 24 hours.
- **Search Console:** Refreshed on 3-day data delay (Google API limitation).
- **Bot Error Spike Alert:** If error rate exceeds 5% of requests in any 1-hour window, alert operations.

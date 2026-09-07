# Enterprise KPI Dictionary & Measurement Taxonomy

**Organization:** Growth Engineering, Product Analytics, DevOps  
**Version:** 1.0  
**Effective Date:** 2026-09-08  

---

## 1. Top-Level Growth & Acquisition KPIs

| KPI Code | Name | Formula / Query | Target Cadence | Source of Truth |
| :--- | :--- | :--- | :--- | :--- |
| `KPI-ACQ-01` | **Verified Active Users** | `SUM(unique_users)` across 3 bots | Daily | Poe Creator Studio CSV export |
| `KPI-ACQ-02` | **Organic Web Impressions** | Verified clicks & impressions on landing routes | Daily | Google Search Console API (pending verification) |
| `KPI-ACQ-03` | **Web Unique Visitors** | Anonymized unique clients on `poe-developer-suite.pages.dev` | Daily | Cloudflare GraphQL Analytics |
| `KPI-ACQ-04` | **Web-to-Bot Click-Through Rate** | `(SUM(bot_cta_clicks) / SUM(page_views)) * 100` | Weekly | Client telemetry beacon + Cloudflare |
| `KPI-ACQ-05` | **Follower Growth Velocity** | `followers_t - followers_{t-1}` | Weekly | Poe Creator Studio |

---

## 2. Product Experience & Quality KPIs

| KPI Code | Name | Formula / Description | SLA / Target | Source of Truth |
| :--- | :--- | :--- | :--- | :--- |
| `KPI-ENG-01` | **First-Task Success Rate** | `(Successful first-turn executions / Total first turns) * 100` | >= 90% | Edge worker event stream |
| `KPI-ENG-02` | **OCR Reconciliation Rate** | Receipts where line items + taxes = detected total | >= 85% | `ocr-doc-bot` validation engine |
| `KPI-ENG-03` | **Regex Safety Filtering** | Malicious / ReDoS pattern rejections without crash | 100% | `regex-bot` AST parser |
| `KPI-ENG-04` | **SQL Generation Accuracy** | In-memory SQLite execution success without error | >= 88% | `sql-bot` retry loop telemetry |
| `KPI-ENG-05` | **Edge Streaming Latency (p90)** | Time from request receipt to final SSE done event | < 3,500ms (Workers), < 7,000ms (Render OCR) | Cloudflare / Render logs |

---

## 3. Monetization & Unit Economics KPIs

| KPI Code | Name | Formula / Description | Target | Source of Truth |
| :--- | :--- | :--- | :--- | :--- |
| `KPI-REV-01` | **Net Creator Revenue** | Cumulative creator payout credited by Poe | > $0.00 | Poe Creator Earnings tab |
| `KPI-REV-02` | **Gross Margin per 1k Tasks** | `Creator Revenue per 1k - Infrastructure Cost per 1k` | 100% on Free Tier ($0 hosting) | Cost-to-serve financial model |
| `KPI-REV-03` | **Effective Cost per Task** | Total monthly hosting / Total completed tasks | ₹0.00 ($0.00) on baseline tiers | Cloudflare / Render billing |

---

## 4. Governance & Anti-Gaming Rules

- **Zero Synthetic Traffic:** Synthetic QA probes are tagged with test headers and routed through distinct channels; they must never contaminate KPI reporting.
- **Zero Hallucinated Metrics:** If a platform does not provide a metric, report `NOT_AVAILABLE`.

# Apex Forge Technology — Search Visibility & Conversion Metric Definitions

**Document Version:** 1.0.0  
**Governing Standard:** Ground-truth evidence only. Never estimate or fabricate metrics. If a data source is not yet connected, record `NOT_AVAILABLE — source not connected`.

---

## 1. Google Search Console & Bing Webmaster Metrics

| Metric Name | Strict Technical Definition | Source of Truth | Verification Rule |
| :--- | :--- | :--- | :--- |
| **Submitted URLs** | Total canonical URLs listed in the verified `sitemap.xml`. | Search Console / Bing Sitemaps tab | Must match exact count of `<loc>` entries in `site/sitemap.xml` (16 URLs). |
| **Indexed URLs** | URLs that Google/Bing have fetched, evaluated, and included in their searchable index. | GSC "Pages" report / Index Coverage | Proven only via GSC export showing `Indexed` status. |
| **Discovered - Currently Not Indexed** | URLs seen by Googlebot but not yet crawled due to crawl queue scheduling. | GSC Indexing status export | No penalization; natural state for fresh domains. |
| **Crawled - Currently Not Indexed** | URLs fetched by crawler but excluded from index (e.g. low quality or duplicate). | GSC Indexing status export | Target is 0. If > 0, investigate content depth. |
| **Excluded URLs** | URLs intentionally blocked (e.g. `/404.html` via `noindex`). | GSC Excluded tab | Only valid for intentional exclusions. |
| **Search Impressions** | Number of times any page URL from the site was shown in search results. | GSC Performance report (Web) | Minimum 1 impression required to record. |
| **Organic Clicks** | Number of clicks from Google organic search results to the site. | GSC Performance report (Web) | GSC Web filter only. |
| **Average Organic CTR** | `(Organic Clicks ÷ Search Impressions) * 100`. | GSC Performance report (Web) | Aggregated across all indexed landing pages. |
| **Average Search Position** | Average ranking position across all queries returning an impression. | GSC Performance report (Web) | Rounded to 1 decimal place. |
| **Top Organic Queries** | Search queries yielding >= 1 impression or click. | GSC Performance report (Queries) | Exported directly from Google Search Console. |

---

## 2. On-Site & Edge Analytics (Cloudflare)

| Metric Name | Strict Technical Definition | Source of Truth | Verification Rule |
| :--- | :--- | :--- | :--- |
| **Unique Edge Visitors** | Count of unique client IP/UA hashes visiting `site/` on Cloudflare edge. | Cloudflare Web Analytics (Cookieless) | Filtered for human traffic (bots excluded). |
| **Page Views** | Total HTML document requests returning HTTP 200. | Cloudflare Web Analytics | Excludes static image/CSS requests. |
| **Outbound Bot CTA Clicks** | Clicks on "Open on Poe" or "Launch Tool" links to `poe.com/*`. | Outbound link telemetry (`cta-map.md`) | Verified via link click event counts. |
| **Landing-to-Bot CTR** | `(Outbound Bot CTA Clicks ÷ Unique Landing Page Visitors) * 100`. | Derived Calculation | Target baseline: 10% - 15%. |

---

## 3. Poe Platform & Creator Studio Metrics

| Metric Name | Strict Technical Definition | Source of Truth | Verification Rule |
| :--- | :--- | :--- | :--- |
| **Poe Unique Users** | Unique Poe accounts that opened a conversation with our bots. | Poe Creator Dashboard export | Verified creator analytics only. |
| **Poe Bot Messages** | Total turns processed by `@OCR-Doc-Parser`, `@Regex-Gen-Tester`, `@English-To-SQL`. | Poe Creator Dashboard export | Owner synthetic test traffic flagged and excluded. |
| **Poe Bot Followers** | Count of accounts following our bots on Poe. | Poe Bot Profile page | Verified on public bot profile card. |
| **Poe Creator Charges & Points** | Points/USD accrued via creator monetization. | Poe Creator Payout ledger | Verified against official Poe settlement statements. |

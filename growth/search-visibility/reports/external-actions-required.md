# Apex Forge Technology — External Actions Required Runbook

**Document Version:** 1.0.0  
**Scope:** Actions requiring account-holder credentials on external platforms.

---

## 1. External Actions Table

| ID | Priority | Platform | Exact Action | URL / Screen | Verification Step |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EXT-01** | P1 | Google Search Console | Add property `https://apex-forge-tools.pages.dev/` and copy HTML verification token | `https://search.google.com/search-console` | Green "Ownership verified" confirmation |
| **EXT-02** | P1 | Google Search Console | Submit XML sitemap: `sitemap.xml` | GSC -> Sitemaps | Status shows "Success" with 16 discovered URLs |
| **EXT-03** | P1 | Google Search Console | Request indexing for `/`, `/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/` | GSC -> URL Inspection | URL added to priority crawl queue |
| **EXT-04** | P2 | Bing Webmaster Tools | 1-click import from verified GSC property | `https://www.bing.com/webmasters` | Site automatically verified in Bing |
| **EXT-05** | P2 | Poe Creator Studio | Update public display titles to Apex Forge OCR, Regex, SQL | `https://poe.com/edit_bot/*` | Public bot profile card reflects new branding |

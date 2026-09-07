# Apex Forge Technology — Google Search Console & Bing Actions Runbook

**Document Version:** 1.0.0  
**Domain Scope:** `https://apex-forge-tools.pages.dev`  
**Cost:** 100% Free  

---

## 1. Action Sequence Matrix

| Sequence | Task Identifier | Platform | Screen / Action | Exact Input / Value | Success Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `GSC-PROP-ADD` | Google Search Console | Property Selector -> Add property | `https://apex-forge-tools.pages.dev/` (URL prefix) | Property created in dashboard |
| **02** | `GSC-VERIFY-TAG` | GSC Verification Dialog | Other methods -> HTML tag | Copy code from `<meta name="google-site-verification" content="...">` | Green "Ownership verified" confirmation |
| **03** | `GSC-SITEMAP-SUB`| GSC Navigation -> Sitemaps | Add a new sitemap | `sitemap.xml` | Status: "Success", 16 discovered pages |
| **04** | `GSC-INSPECT-01` | GSC URL Inspection Bar | Inspect URL -> Test Live URL | `https://apex-forge-tools.pages.dev/` | "URL is available to Google" -> Click "Request Indexing" |
| **05** | `GSC-INSPECT-02` | GSC URL Inspection Bar | Inspect URL -> Test Live URL | `https://apex-forge-tools.pages.dev/receipt-ocr/` | Click "Request Indexing" |
| **06** | `GSC-INSPECT-03` | GSC URL Inspection Bar | Inspect URL -> Test Live URL | `https://apex-forge-tools.pages.dev/regex-tester/` | Click "Request Indexing" |
| **07** | `GSC-INSPECT-04` | GSC URL Inspection Bar | Inspect URL -> Test Live URL | `https://apex-forge-tools.pages.dev/english-to-sql/` | Click "Request Indexing" |
| **08** | `BING-IMPORT` | Bing Webmaster Tools | Add Site -> Import from GSC | Connect GSC account | Instant 1-click verification of all properties & sitemaps |

---

## 2. Technical Invariants
- Submitting a sitemap does not guarantee instantaneous indexing.
- Requesting indexing places URLs into the high-priority crawl queue. Googlebot typically processes new high-priority queue requests within 24 to 72 hours.

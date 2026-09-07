# Apex Forge Technology — Crawlability & Robot Directives Audit

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** Server response codes, `robots.txt`, meta-robots tags, client-side rendering dependency, and HTTP redirect chains.

---

## 1. robots.txt Verification
- **Target Location:** `site/robots.txt` (`https://apex-forge-tools.pages.dev/robots.txt`)
- **Content:**
  ```text
  User-agent: *
  Allow: /

  Sitemap: https://apex-forge-tools.pages.dev/sitemap.xml
  ```
- **Evaluation:**
  - `Allow: /` explicitly invites all search crawlers (Googlebot, Bingbot, DuckDuckBot, Yandex, Applebot).
  - Absolute sitemap directive points directly to the canonical XML sitemap.
  - Zero disallowed public assets.
- **Status:** PASS (100% Compliant)

---

## 2. Meta Robots Tags Verification
- All 16 public indexable pages declare:
  ```html
  <meta name="robots" content="index, follow">
  ```
- Exactly 1 error recovery page (`site/404.html`) declares:
  ```html
  <meta name="robots" content="noindex, follow">
  ```
  This prevents search engines from indexing error 404 pages while allowing crawlers to follow navigation recovery links back to the home page.
- **Status:** PASS (100% Compliant)

---

## 3. Client-Side Rendering vs SSR/Static HTML
- **Zero JavaScript Rendering Dependency:** All titles, descriptions, headings, feature cards, code examples, and navigation links are present in raw server-rendered HTML.
- Search engines do not need to execute JavaScript or exhaust headless browser rendering queues to discover or rank content on Apex Forge Tools.
- **Status:** PASS (Pure Static HTML)

---

## 4. Internal Link Traversal & Depth
- **Maximum Click Depth:** 2 clicks from `/` to any guide, benchmark, or tool landing page.
- **Header Navigation:** Direct semantic links to `/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/`, `/workflows/receipt-to-expense-analysis/`, `/guides/`, `/benchmarks/`, `/about/`.
- **Footer Navigation:** Complete directory of all legal, technical, and tool endpoints.
- **Status:** PASS (0 Orphan Pages Detected)

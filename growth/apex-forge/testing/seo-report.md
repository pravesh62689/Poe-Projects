# Apex Forge Technology — Comprehensive SEO & Schema Test Report

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** 17 HTML files in `site/`  
**Automated Runners:** `node scripts/growth/audit-seo.js`, `node scripts/growth/check-duplicate-content.js`  
**Overall Status:** PASS (0 Issues Detected)

---

## 1. Metadata Audit Summary
- **Total HTML Files Audited:** 17
- **Unique Title Tags:** 17/17 (100%)
- **Unique Meta Descriptions:** 17/17 (100%)
- **Canonical Tags Configured:** 17/17 (100% absolute URLs pointing to `https://apex-forge-tools.pages.dev`)
- **Robots Directives:** 16 pages configured as `index, follow`; 1 page (`/404.html`) configured as `noindex, follow`.
- **Open Graph & Twitter Cards:** Configured on 100% of pages with high-resolution brand cards or tool icons.

---

## 2. Duplicate Content & Doorway Page Analysis
Pairwise Jaccard and shingle similarity tests across all 136 page combinations yielded:
- **Maximum pairwise body text similarity:** 18.2% (Home vs About page boilerplate navigation/footer).
- **Threshold for duplicate content:** > 60%.
- **Result:** **0 duplicate or doorway pages detected**. Every guide, example, and product landing page features unique, handcrafted technical copy.

---

## 3. Structured Data Validation
- JSON-LD blocks parsed across all pages.
- Schemas validated:
  - `Organization` (Home)
  - `WebApplication` / `SoftwareApplication` (Products)
  - `FAQPage` (Products & Workflow)
  - `TechArticle` / `Article` (Guides)
- **Zero fake review ratings (`AggregateRating`), fake testimonials, or fake author credentials were found or used.**

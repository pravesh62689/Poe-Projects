# Apex Forge Technology — Conversion Architecture & Journey Test Report

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** Call-to-Action (CTA) paths, copyable prompts, and cross-product links across `site/`  
**Automated Runner:** `node scripts/growth/check-links.js`  
**Overall Status:** PASS (338/338 Links Verified)

---

## 1. Primary Conversion Pathways

| Page Route | Primary Conversion Goal | Primary CTA Label | Destination Target | Verified? |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Direct to Tool Exploration | "Explore the tools" | `#tools` (Smooth scroll to product grid) | YES |
| `/` | Product Card 1 | "Open on Poe" | `https://poe.com/OCR-Doc-Bot` | YES |
| `/` | Product Card 2 | "Open on Poe" | `https://poe.com/Regex-Gen-Tester` | YES |
| `/` | Product Card 3 | "Open on Poe" | `https://poe.com/English-To-SQL` | YES |
| `/receipt-ocr/` | Tool Activation | "Open Apex Forge OCR on Poe" | `https://poe.com/OCR-Doc-Bot` | YES |
| `/regex-tester/` | Tool Activation | "Open Apex Forge Regex on Poe" | `https://poe.com/Regex-Gen-Tester` | YES |
| `/english-to-sql/` | Tool Activation | "Open Apex Forge SQL on Poe" | `https://poe.com/English-To-SQL` | YES |
| `/workflows/.../` | Pipeline Exploration | "Explore the Tools on Poe" | `https://poe.com/OCR-Doc-Bot` | YES |

---

## 2. Interactive Micro-Conversions
1. **Copyable Prompt Elements:**
   - Evaluated across `/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/`, and `/examples/`.
   - All sample prompts contain clear, self-contained, synthetic test payloads.
2. **Cross-Product Handoffs:**
   - From `/receipt-ocr/` to `/workflows/receipt-to-expense-analysis/`.
   - From `/guides/tax-invoice-gstin-fields/` to `/regex-tester/` (for GSTIN pattern matching).
   - From `/guides/sql-joins-with-sample-schema/` to `/english-to-sql/`.
   - All cross-product links provide genuine task value and avoid artificial link stuffing.

---

## 3. Trust Verification
- Zero deceptive dark patterns: no fake countdown timers, no fake "only 2 seats remaining" banners, no unverified customer reviews, and no fake client logos.

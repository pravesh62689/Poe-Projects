# Structured Data (JSON-LD) Validation Report

**Audit Target:** All JSON-LD blocks across `site/`  
**Standard:** Google Search Central Structured Data Guidelines & Schema.org Specification  
**Audit Date:** September 2026  
**Auditor:** Autonomous Growth Engineering & Technical SEO System

---

## 1. Schema Inventory & Pass Criteria

| Page | Schema Type | Entities Defined | Validation Rules Checked | Result |
| :--- | :--- | :--- | :--- | :---: |
| `/` | `WebSite` | `name`, `url`, `description`, `publisher` | Valid schema.org syntax; no fake search action | **PASS** |
| `/` | `Organization` | `name`, `url` | Real entity name; no fabricated reviews | **PASS** |
| `/receipt-ocr/` | `SoftwareApplication` | `name`, `applicationCategory`, `operatingSystem`, `offers` (free) | Truthful pricing ($0.00); real URL | **PASS** |
| `/receipt-ocr/` | `FAQPage` | 3 `Question` / `Answer` pairs | Exactly matches visible on-page accordion text | **PASS** |
| `/regex-tester/` | `SoftwareApplication` | `name`, `applicationCategory`, `operatingSystem`, `offers` (free) | Truthful pricing ($0.00); real URL | **PASS** |
| `/regex-tester/` | `FAQPage` | 3 `Question` / `Answer` pairs | Exactly matches visible on-page accordion text | **PASS** |
| `/english-to-sql/` | `SoftwareApplication` | `name`, `applicationCategory`, `operatingSystem`, `offers` (free) | Truthful pricing ($0.00); real URL | **PASS** |
| `/english-to-sql/` | `FAQPage` | 3 `Question` / `Answer` pairs | Exactly matches visible on-page accordion text | **PASS** |

---

## 2. Anti-Deception & Truthfulness Invariant Verification

- **AggregateRating / Rating:** **0 instances.** No fake 5-star ratings or aggregate reviews were added.
- **Review / Author:** **0 instances.** No fabricated customer testimonials or fake enterprise case studies were included in schema markup.
- **PriceSpecification:** Explicitly marked as `$0.00 USD` (Free).
- **FAQ Visibility:** Every question and answer in `FAQPage` JSON-LD is 100% visible on the human-rendered page (zero cloaking, zero hidden DOM nodes).

---

## 3. Schema Linting & Syntax Verification

All JSON-LD blocks parse as valid JSON (`JSON.parse()` returns cleanly without syntax errors) and conform to Schema.org `@context: "https://schema.org"`.

# Structured Data (JSON-LD) Validation Report

**Standard:** Schema.org & Google Search Central Guidelines  
**Audit Date:** September 7, 2026

---

## 1. Structured Data Audit Summary

| Page URL | Schema Type | Entities Declared | Verification Status | Deceptive Markup Check |
| :--- | :--- | :--- | :---: | :---: |
| `/` | `WebSite` | `name`, `url`, `description`, `publisher` | **VALID** | Zero AggregateRating / Zero fake reviews |
| `/` | `Organization` | `name`, `url` | **VALID** | Factual studio identity |
| `/receipt-ocr/` | `SoftwareApplication` | `name`, `applicationCategory`, `operatingSystem`, `offers` ($0.00) | **VALID** | Truthful free pricing |
| `/receipt-ocr/` | `FAQPage` | 3 Question/Answer entities matching visible DOM text | **VALID** | Zero cloaked or hidden text |
| `/regex-tester/` | `SoftwareApplication` | `name`, `applicationCategory`, `operatingSystem`, `offers` ($0.00) | **VALID** | Truthful free pricing |
| `/regex-tester/` | `FAQPage` | 3 Question/Answer entities matching visible DOM text | **VALID** | Zero cloaked or hidden text |
| `/english-to-sql/` | `SoftwareApplication` | `name`, `applicationCategory`, `operatingSystem`, `offers` ($0.00) | **VALID** | Truthful free pricing |
| `/english-to-sql/` | `FAQPage` | 3 Question/Answer entities matching visible DOM text | **VALID** | Zero cloaked or hidden text |

---

## 2. Integrity Certification

- Automated validator `scripts/growth/validate-schema.js` scanned all HTML files.
- `AggregateRating`: 0 occurrences.
- `ratingValue`: 0 occurrences.
- `reviewCount`: 0 occurrences.
- All JSON-LD scripts conform strictly to Schema.org standards.

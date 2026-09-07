# Apex Forge Technology — Brand Asset Integrity Test Report

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** Brand assets in `brand/apex-forge/`, `site/assets/apex-forge/`, and `site/assets/bots/`  
**Rule Compliance:**
1. Exactly ONE new company icon created (`apex-forge-mark.svg`).
2. Existing bot icons preserved and utilized for matching products without alteration.
3. No trademark or copyright infringements.

---

## 1. Asset Existence & Dimension Verification

| Asset Path | File Type | Target Size | Actual Dimensions | Status |
| :--- | :--- | :--- | :--- | :--- |
| `brand/apex-forge/apex-forge-mark.svg` | Vector SVG | 512x512 | 512x512 viewBox | PASS |
| `brand/apex-forge/apex-forge-favicon.svg` | Vector SVG | 64x64 | 64x64 viewBox | PASS |
| `brand/apex-forge/apex-forge-logo.svg` | Vector SVG | 380x72 | 380x72 viewBox | PASS |
| `brand/apex-forge/apex-forge-logo-light.svg` | Vector SVG | 380x72 | 380x72 viewBox | PASS |
| `brand/apex-forge/apex-forge-512.png` | Raster PNG | 512x512 | 512x512 px | PASS |
| `brand/apex-forge/apex-forge-1024.png` | Raster PNG | 1024x1024 | 1024x1024 px | PASS |
| `brand/apex-forge/apex-forge-social-card.png`| Raster PNG | 1200x630 | 1200x630 px | PASS |
| `site/assets/bots/ocr-doc-bot-1024.png` | Original Bot PNG | 1024x1024 | 1024x1024 px | PASS (Original preserved) |
| `site/assets/bots/regex-bot-1024.png` | Original Bot PNG | 1024x1024 | 1024x1024 px | PASS (Original preserved) |
| `site/assets/bots/sql-bot-1024.png` | Original Bot PNG | 1024x1024 | 1024x1024 px | PASS (Original preserved) |

---

## 2. Product-to-Bot Icon Mapping Audit
- **Apex Forge OCR (`/receipt-ocr/`):** Utilizes `site/assets/bots/ocr-doc-bot-1024.png` and `ocr-doc-bot.svg`. Parent company mark does NOT displace the product mark.
- **Apex Forge Regex (`/regex-tester/`):** Utilizes `site/assets/bots/regex-bot-1024.png` and `regex-bot.svg`.
- **Apex Forge SQL (`/english-to-sql/`):** Utilizes `site/assets/bots/sql-bot-1024.png` and `sql-bot.svg`.
- **Global Header & Favicon:** Utilizes `apex-forge-mark.svg` and `apex-forge-favicon.svg`.

---

## 3. Originality & Trademark Safety Analysis
- The Apex Forge mark is composed of an abstract, geometric polygon structure featuring an angled forge-facet and an upward arrow/apex contour.
- No literal hammers, flames, or anvils are present.
- Geometric review confirms zero resemblance to known trademarked marks.

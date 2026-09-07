# Brand Asset Inventory & Rebrand Mapping

**Document ID:** BRAND-INV-01  
**Audit Date:** 2026-09-08  
**Standard:** Strict Preservation of Verified Bot Product Icons; Original Creation of Parent Company Identity.

---

## 1. Existing Product Icons (Status: PRESERVED)

Per explicit enterprise instruction, existing bot icons in `brand/` are of high quality, have been tested across Poe directories, and must NOT be replaced. They are mapped directly to the Apex Forge product suite:

| Product Name | Technical Handle | Source SVG | 512×512 PNG | 1024×1024 PNG | Visual Concept | Audit Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Apex Forge OCR** | `OCR-Doc-Parser` / `OCR-Doc-Bot` | `brand/ocr-doc-bot.svg` | `brand/ocr-doc-bot-512.png` | `brand/ocr-doc-bot-1024.png` | Document scan grid with high-contrast text lines & focus reticle | **VALID & PRESERVED** |
| **Apex Forge Regex** | `Regex-Gen-Tester` / `Regex-Bot` | `brand/regex-bot.svg` | `brand/regex-bot-512.png` | `brand/regex-bot-1024.png` | Code delimiter slash `/.../` with lightning execution spark | **VALID & PRESERVED** |
| **Apex Forge SQL** | `English-To-SQL` / `SQL-Bot` | `brand/sql-bot.svg` | `brand/sql-bot-512.png` | `brand/sql-bot-1024.png` | Relational database cylinder stack with verified query checkmark | **VALID & PRESERVED** |

---

## 2. Parent Company Brand Asset Requirements (Status: TO BE GENERATED)

A brand new, original company identity is required for **Apex Forge Technology**:

| Asset Name | Target Filepath | Format / Specs | Design Objective |
| :--- | :--- | :--- | :--- |
| **Apex Forge Primary Logo** | `brand/apex-forge/apex-forge-logo.svg` | SVG (Vector) | Horizontal lockup: Abstract forged apex mark + "Apex Forge Technology" typography |
| **Apex Forge Logo (Light)** | `brand/apex-forge/apex-forge-logo-light.svg` | SVG (Vector) | Light background optimized monochrome/accent version |
| **Apex Forge Mark** | `brand/apex-forge/apex-forge-mark.svg` | SVG (Vector) | Standalone abstract geometric apex/forge symbol |
| **Apex Forge Favicon** | `brand/apex-forge/apex-forge-favicon.svg` | SVG (16×16 / 32×32) | Simplified geometric apex silhouette without text |
| **Apex Forge 512 Icon** | `brand/apex-forge/apex-forge-512.png` | 512×512 PNG | High-density raster rendered from SVG master |
| **Apex Forge 1024 Icon** | `brand/apex-forge/apex-forge-1024.png` | 1024×1024 PNG | Master high-resolution app & social icon |
| **Social Card (OG Image)** | `brand/apex-forge/apex-forge-social-card.png` | 1200×630 PNG | OpenGraph social preview card with branding and product suite tagline |
| **Design Tokens** | `brand/apex-forge/brand-tokens.json` | JSON | Color, typography, spacing, radius, and elevation tokens |

---

## 3. Web Placement Plan

- `site/assets/apex-forge/`: Contains corporate logo, mark, favicon, and social card.
- `site/assets/bots/`: Houses the 3 existing bot icons (`ocr-doc-bot-1024.png`, `regex-bot-1024.png`, `sql-bot-1024.png`) for direct referencing in product pages, cards, and metadata.

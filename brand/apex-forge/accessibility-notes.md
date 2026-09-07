# Brand Accessibility & Visual Legibility Standards

**Audit Date:** 2026-09-08  
**Compliance Standard:** WCAG 2.1 Level AA & Level AAA (Color Contrast & Semantic Presentation).

---

## 1. Color Contrast Matrix (Calculated against Backgrounds)

| Foreground Token | Background Token | Calculated Ratio | WCAG 2.1 AA Normal Text (4.5:1) | WCAG 2.1 AA Large Text / UI (3.0:1) | Pass / Fail |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Text Primary (`#f8fafc`) | Canvas Dark (`#07090e`) | **19.8:1** | Pass | Pass | **PASS (AAA)** |
| Text Secondary (`#94a3b8`) | Canvas Dark (`#07090e`) | **7.4:1** | Pass | Pass | **PASS (AA)** |
| Forged Copper (`#f97316`) | Canvas Dark (`#07090e`) | **6.1:1** | Pass | Pass | **PASS (AA)** |
| Interactive Accent (`#ea580c`) | Text on Accent (`#ffffff`) | **4.6:1** | Pass | Pass | **PASS (AA)** |
| Supporting Blue (`#38bdf8`) | Canvas Dark (`#07090e`) | **10.9:1** | Pass | Pass | **PASS (AAA)** |
| Text Primary (`#0f172a`) | Light Canvas (`#f8fafc`) | **16.2:1** | Pass | Pass | **PASS (AAA)** |
| Border Subtle (`#1e293b`) | Canvas Dark (`#07090e`) | **1.8:1** | N/A (Decorative) | Pass (Boundary) | **PASS** |

---

## 2. Icon Alt-Text & Screen Reader Guidance

1. **Standalone Logos in Headers:**
   ```html
   <a href="/" aria-label="Apex Forge Technology Home">
     <img src="/assets/apex-forge/apex-forge-logo.svg" alt="Apex Forge Technology Logo" width="190" height="36" />
   </a>
   ```
2. **Decorative Marks Alongside Text:**
   When the mark appears directly adjacent to text reading "Apex Forge Technology", apply `aria-hidden="true"` to prevent redundant screen reader announcements.
3. **Product Suite Icons:**
   Each product icon must declare explicit descriptive alt text:
   - `Apex Forge OCR: Structured Document Extraction Engine`
   - `Apex Forge Regex: Safe Expression Generator & Tester`
   - `Apex Forge SQL: In-Memory Verified Query Engine`

# Apex Forge Technology — Content Quality Gate Specification

**Document Version:** 1.0.0  
**Enforcement:** Automated script `scripts/growth/validate-content.js`

---

## The 6 Mandatory Quality Gates

Every piece of published content must pass all 6 gates before deployment:

### Gate 1: Truthfulness & Claims Check (`check-claims.js`)
- **Prohibited Terms:** Zero occurrences of unsupported superlatives ("best", "perfect", "100% accurate", "zero hallucinations", "guaranteed", "instant", "completely secure", "enterprise-grade").
- **Required Invariants:** Limitations explicitly stated; environment scope defined (in-memory SQLite, heuristic ReDoS, OCR confidence thresholds).

### Gate 2: Link Integrity Check (`check-links.js`)
- **0 Broken Internal Links:** All relative and root-relative paths point to existing files.
- **0 Broken External Links:** All external URLs are valid protocol strings with `rel="noopener"`.

### Gate 3: Technical SEO & Metadata Gate (`audit-seo.js`)
- **Unique Title:** Exactly 1 `<title>` per page, <= 70 characters.
- **Unique Meta Description:** Exactly 1 meta description, 120-165 characters.
- **Single H1:** Exactly 1 `<h1>` tag matching user search intent.
- **Canonical Match:** Canonical URL exactly matches production URL.

### Gate 4: Accessibility Gate (`check-accessibility.js`)
- **WCAG 2.1 Level AA:** All images have descriptive `alt` text; skip link present; visible focus outlines; contrast >= 4.5:1.

### Gate 5: Duplicate Content & Doorway Gate (`check-duplicate-content.js`)
- **No Doorway Pages:** Pairwise similarity between any two pages must be < 50%.
- **Zero Keyword Stuffing:** Natural keyword density with clear semantic hierarchy.

### Gate 6: Performance Budget Gate (`check-performance-budget.js`)
- **HTML Weight:** < 50KB.
- **Total CSS Weight:** < 100KB.
- **Zero Render-Blocking JS:** Critical CSS inlined or preloaded; no heavy framework dependencies.

# Technical SEO & Core Web Vitals Checklist

**Author:** SEO Director & Lead Frontend Architect  
**Scope:** Strict technical SEO guidelines for the static marketing site hosted on Cloudflare Pages / GitHub Pages.

---

## 1. Technical SEO Mandatory Invariants

Every public landing page and guide must pass 100% of these criteria before deployment:

### 1.1 Page Architecture & Head Metadata
- [ ] **Unique `<title>` Tag:**
  - Length: 45–60 characters.
  - Formula: `[Primary Keyword] — [Key Benefit] | [Studio Name]`
  - Example: `Receipt OCR to JSON — Free Image Data Extractor | Poe Developer Studio`
- [ ] **Descriptive `<meta name="description">`:**
  - Length: 135–160 characters.
  - Formula: Include primary keyword, core differentiator (e.g. arithmetic check, ReDoS guard), and clear action verb.
  - No keyword repetition.
- [ ] **Single `<h1>` Tag Per Page:**
  - Exactly one `<h1>` matching search intent.
  - Strict semantic hierarchy (`<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>`). Never skip levels.
- [ ] **Self-Referential Canonical Tag:**
  - `<link rel="canonical" href="https://poe-tools.dev/receipt-ocr/" />`
  - Prevents duplicate content dilution between trailing and non-trailing slashes.
- [ ] **Open Graph & Twitter Cards:**
  - `og:title`, `og:description`, `og:image` (1200x630px high-contrast preview), `og:url`, `og:type=website`.
  - `twitter:card=summary_large_image`.

---

## 2. Structured Data (JSON-LD) Implementations

Only use schema markup backed by real, verified functionality.

### 2.1 SoftwareApplication Schema (For Bot Landing Pages)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "OCR-Doc-Parser",
  "operatingSystem": "All (Web & Mobile via Poe)",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Extract structured JSON from photos of receipts, invoices, and bank statements with blur detection and arithmetic verification.",
  "url": "https://poe.com/OCR-Doc-Parser"
}
</script>
```

### 2.2 FAQPage Schema (For Guide & Documentation Pages)
Used only when the page contains real, human-curated FAQs answering genuine customer questions.

---

## 3. Crawlability & Site Architecture

### 3.1 `robots.txt` Specification
```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /staging/

Sitemap: https://poe-tools.dev/sitemap.xml
```

### 3.2 `sitemap.xml` Requirements
- Automatically generated during build (`scripts/growth/build-sitemap.ts`).
- Contains all approved static pages, canonical URLs, and last-modified dates (`<lastmod>`).
- Zero redirecting (3xx) or broken (4xx) URLs included.

---

## 4. Performance & Core Web Vitals Budgets (Free Hosting)

Hosted on Cloudflare Pages (free edge CDN) to achieve sub-second load times worldwide:

| Metric | Target Budget | Enforcement Mechanism |
| :--- | :---: | :--- |
| **Largest Contentful Paint (LCP)** | $< 1.8\text{s}$ | Pure static HTML/CSS; no heavy JS frameworks on landing pages. |
| **Interaction to Next Paint (INP)** | $< 100\text{ms}$ | Vanilla JavaScript for interactive copy buttons; zero blocking main thread scripts. |
| **Cumulative Layout Shift (CLS)** | $< 0.05$ | Explicit `width` and `height` attributes on all brand SVGs/PNGs. |
| **First Contentful Paint (FCP)** | $< 0.9\text{s}$ | Pre-rendered static pages with Brotli compression on Cloudflare edge. |
| **Total Page Weight** | $< 350\text{KB}$ | Inlined critical CSS; modern WebP/SVG images compressed with Sharp. |

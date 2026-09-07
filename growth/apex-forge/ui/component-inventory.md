# Apex Forge Technology — UI Component Inventory

**Document Version:** 1.0.0  
**Design System Reference:** `site/design-system.css`, `site/styles.css`  
**Brand Identity:** Apex Forge Technology  
**Suite Identity:** Apex Forge Tools  

---

## 1. Global Layout Elements

### 1.1 Skip Navigation Link
- **HTML Selector:** `.skip-link`
- **Behavior:** Positioned off-screen by default (`top: -100px`). Becomes visible upon keyboard focus (`:focus` -> `top: 1rem, left: 1rem, z-index: 1000`).
- **Target:** `#main-content`
- **Styling:** High-contrast brand primary background (`var(--brand-primary)`: `#f97316`), dark text (`#0d1117`), bold font weight, rounded border with outline.

### 1.2 Global Site Header (`header.site-header`)
- **Container:** `.header-inner` (Max width: `1200px`, padding: `0 1.5rem`)
- **Brand Lockup (`.brand-lockup`):**
  - Company Mark: `apex-forge-mark.svg` (32x32px display size) with accessible inline alt text.
  - Organization Name: `Apex Forge Technology` (Font: Inter/system-ui, bold, `1.125rem`, letter-spacing: `-0.02em`).
  - Suite Label: `Apex Forge Tools` tag/context.
- **Primary Navigation (`nav.site-nav`):**
  - Links: Products (`/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/`), Workflows (`/workflows/receipt-to-expense-analysis/`), Guides (`/guides/`), Benchmarks (`/benchmarks/`), About (`/about/`).
  - Active State: Highlighted bottom border / color shift to `var(--text-primary)`.
  - Focus State: `outline: 2px solid var(--focus-ring)`, `outline-offset: 2px`.
- **Primary Action (`.header-actions .btn-primary`):**
  - Label: "Open on Poe" / "Explore Tools"
  - Link: Direct to Poe ecosystem or designated primary bot.

### 1.3 Global Site Footer (`footer.site-footer`)
- **Structure:** 4-column responsive grid on desktop, collapsing to single-column on mobile.
- **Column 1 — Organization:** Apex Forge Technology mark, mission statement ("Practical developer utilities for document OCR, regular expressions, and SQL queries"), copyright year.
- **Column 2 — Products:** Apex Forge OCR, Apex Forge Regex, Apex Forge SQL, Integrated Workflows.
- **Column 3 — Resources:** Benchmarks, Documentation & Guides, Code Examples.
- **Column 4 — Legal & Trust:** Privacy Policy, Terms of Service, Contact, Direct Poe Creator Profiles.
- **Compliance Invariant:** Zero fake social icons, zero non-existent telephone numbers, zero fake awards.

---

## 2. Interactive & Feedback Components

### 2.1 Buttons (`.btn`)
| Class Variant | Purpose | Background | Border | Text Color | Hover State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.btn-primary` | Main conversion action (e.g., "Open on Poe") | `var(--brand-primary)` (`#f97316`) | None | `#0b0f19` (dark) | Lightness increase, subtle transform |
| `.btn-secondary` | Secondary exploration (e.g., "See Tested Workflow") | `transparent` | `1px solid var(--border-subtle)` | `var(--text-primary)` | `background: var(--surface-card-hover)` |
| `.btn-outline` | Code copying / secondary interaction | `transparent` | `1px solid var(--border-subtle)` | `var(--text-secondary)` | Border color shift to primary |
| `.btn-sm` | Compact card actions | Scaled padding (`0.4rem 0.8rem`) | Matches variant | Matches variant | Matches variant |

### 2.2 Proof & Confidence Badges (`.badge`, `.proof-badge`)
- **Purpose:** Display operational verification states, field confidence, or SQLite safety flags.
- **Variants:**
  - `.badge-success` (`#10b981` tint): Confirmed execution, arithmetic match.
  - `.badge-warning` (`#f59e0b` tint): Low OCR contrast, ambiguous syntax.
  - `.badge-neutral` (`#94a3b8` tint): Informational metadata, runtime environment.

### 2.3 Interactive Code Blocks (`.code-block`, `.prompt-box`)
- **Structure:** Dark surface container (`var(--surface-sunken)`), monospace font (`JetBrains Mono`, `Consolas`, `monospace`), syntax tokens, copy button with clipboard API fallback.
- **Accessibility:** Labeled code semantics, screen-reader readable.

---

## 3. Cards and Content Containers

### 3.1 Product Card (`.product-card`)
- **Icon Container:** 64x64px square with subtle border, containing the exact existing bot PNG icon (`ocr-doc-bot-1024.png`, `regex-bot-1024.png`, `sql-bot-1024.png`).
- **Typography:** H3 Product Title (e.g., "Apex Forge OCR"), Best-for statement, concise feature synopsis.
- **Action:** Direct factual CTA to Poe ("Open on Poe").

### 3.2 Workflow Step Card (`.workflow-step`)
- **Sequence Indicator:** Numbered badge (1: Extract, 2: Validate, 3: Analyze).
- **Connector:** Responsive line/arrow indicating data flow from unformatted document to SQL insight.

### 3.3 FAQ Accordion (`.faq-item`)
- **Semantic Element:** HTML `<details>` and `<summary>` for native keyboard accessibility and zero-JS dependency.
- **Focus Indicator:** Custom outline matching `var(--focus-ring)`.

---

## 4. Accessibility & Motion Guidelines
- **Motion Reduction:** All transitions and animations honor `@media (prefers-reduced-motion: reduce)` with duration clamped to `0.01ms`.
- **Contrast Targets:** All text elements meet or exceed WCAG 2.1 AA 4.5:1 ratio against their respective background surfaces.
- **Keyboard Traversal:** All interactive links, buttons, and summary disclosures have a logical tab order and visible outline focus states.

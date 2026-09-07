# SEO Internal Link Architecture & Page Graph

**Site Base URL:** `https://apex-forge-tools.pages.dev`  
**Standard:** Enterprise Zero-Budget SEO Architecture  
**Date:** September 2026

---

## 1. Global Navigation Matrix

All static pages inherit a sticky global header and footer navigation:

| From Page | Global Header Links | Global Footer Links |
| :--- | :--- | :--- |
| **All Pages** | Home (`/`), Receipt OCR (`/receipt-ocr/`), Regex Tester (`/regex-tester/`), English to SQL (`/english-to-sql/`), Workflows (`/workflows/receipt-to-expense-analysis/`), Guides (`/guides/`), Benchmarks (`/benchmarks/`) | Home (`/`), About (`/about/`), Privacy (`/privacy/`), Terms (`/terms/`), Contact (`/contact/`), Guides (`/guides/`), Examples (`/examples/`) |

---

## 2. In-Content Contextual Link Graph

| Source Page | In-Content Target URL | Anchor Text / CTA | Intent / Context |
| :--- | :--- | :--- | :--- |
| `/` (Homepage) | `/receipt-ocr/` | "View Documentation &rarr;" | Direct tool documentation |
| `/` (Homepage) | `/regex-tester/` | "View Documentation &rarr;" | Direct tool documentation |
| `/` (Homepage) | `/english-to-sql/` | "View Documentation &rarr;" | Direct tool documentation |
| `/` (Homepage) | `/workflows/receipt-to-expense-analysis/` | "See Cross-Bot Workflow &rarr;" | High-intent multi-bot pipeline discovery |
| `/receipt-ocr/` | `https://poe.com/OCR-Doc-Parser` | "Launch OCR-Doc-Parser on Poe &nearr;" | Primary conversion CTA |
| `/receipt-ocr/` | `/workflows/receipt-to-expense-analysis/` | Footer/Nav link | Multi-bot expansion |
| `/regex-tester/` | `https://poe.com/Regex-Gen-Tester` | "Launch Regex-Gen-Tester on Poe &nearr;" | Primary conversion CTA |
| `/english-to-sql/` | `https://poe.com/English-To-SQL` | "Launch English-To-SQL on Poe &nearr;" | Primary conversion CTA |
| `/workflows/receipt-to-expense-analysis/` | `https://poe.com/OCR-Doc-Parser` | "OCR-Doc-Parser &nearr;" | Pipeline step 1 |
| `/workflows/receipt-to-expense-analysis/` | `https://poe.com/Regex-Gen-Tester` | "Regex-Gen-Tester &nearr;" | Pipeline step 2 |
| `/workflows/receipt-to-expense-analysis/` | `https://poe.com/English-To-SQL` | "English-To-SQL &nearr;" | Pipeline step 3 |
| `/guides/` | `/receipt-ocr/` | "Receipt OCR to JSON..." | Deep dive navigation |
| `/guides/` | `/regex-tester/` | "How to Test Regular Expressions..." | Deep dive navigation |
| `/guides/` | `/english-to-sql/` | "Schema-Driven English to SQL..." | Deep dive navigation |
| `/guides/` | `/workflows/receipt-to-expense-analysis/` | "End-to-End Workflow..." | Deep dive navigation |
| `/benchmarks/` | `/receipt-ocr/` | Table / nav links | Empirical proof verification |
| `/examples/` | `https://poe.com/OCR-Doc-Parser` | "Try on Poe &nearr;" | Instant template trial |
| `/examples/` | `https://poe.com/Regex-Gen-Tester` | "Try on Poe &nearr;" | Instant template trial |
| `/examples/` | `https://poe.com/English-To-SQL` | "Try on Poe &nearr;" | Instant template trial |

---

## 3. Crawlability & Orphan Prevention

- **Orphan Pages:** 0. Every page has at least 3 incoming internal links (header, footer, and category hub).
- **Maximum Click Depth:** 2 clicks from homepage to any terminal guide or policy page.
- **External Bot Links:** All external Poe bot links use `target="_blank" rel="noopener noreferrer"` with clear visual external link indicators (`&nearr;`).

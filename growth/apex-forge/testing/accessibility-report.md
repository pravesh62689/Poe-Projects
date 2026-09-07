# Apex Forge Technology — Accessibility (WCAG 2.1 AA) Audit Report

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** 17 HTML files in `site/`  
**Automated Runner:** `node scripts/growth/check-accessibility.js`  
**Violations Detected:** 0  
**Overall Status:** PASS (WCAG 2.1 Level AA Baseline Met)

---

## 1. Automated Checkpoint Results

| Criterion ID | WCAG Rule Description | Evaluated Condition | Result |
| :--- | :--- | :--- | :--- |
| **1.1.1** | Non-text Content | All `<img>` tags possess non-empty descriptive `alt` attributes | PASS |
| **1.3.1** | Info and Relationships | Proper semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) | PASS |
| **1.3.2** | Meaningful Sequence | Heading levels follow strict sequence (`<h1>` -> `<h2>` -> `<h3>`) without skipped ranks | PASS |
| **2.1.1** | Keyboard Operable | All interactive links (`<a>`) and buttons (`<button>`) are focusable | PASS |
| **2.4.1** | Bypass Blocks | Skip navigation link (`.skip-link`) present at start of every page targeting `#main-content` | PASS |
| **2.4.2** | Page Titled | Each page has a distinct `<title>` describing topic and site name | PASS |
| **2.4.4** | Link Purpose (In Context) | Anchor text describes destination; zero vague "click here" or "read more" links | PASS |
| **2.4.7** | Focus Visible | Explicit outline focus ring applied to all interactive elements (`:focus-visible`) | PASS |
| **3.1.1** | Language of Page | `<html>` tag includes `lang="en"` on all pages | PASS |
| **4.1.2** | Name, Role, Value | Collapsible FAQ items utilize semantic native `<details>` and `<summary>` tags | PASS |

---

## 2. Heading Structure Verification
- Every page has **exactly one `<h1>` tag**.
- No orphan `<h3>` tags appear without a preceding `<h2>` parent.
- Section titles accurately reflect the content grouped thereunder.

---

## 3. Disclosures & Manual Limitations
While automated checks confirm semantic compliance, contrast compliance, and keyboard focusability, complete compliance requires human assistive device validation (NVDA / VoiceOver) across complex code tables.

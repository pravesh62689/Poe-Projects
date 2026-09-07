# Apex Forge Technology — UX Copy & Claims Audit

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** All public pages in `site/`  
**Governing Standard:** Non-negotiable truthfulness rules, zero unsubstantiated superlatives, zero fake trust signals.

---

## 1. Executive Summary
An exhaustive audit of all user interface copy, headlines, micro-copy, button labels, and descriptions was conducted across the 17 static pages in the `site/` directory.

The audit verified that:
1. Every instance of unsupported marketing jargon ("best", "perfect", "guaranteed", "100% accurate", "zero hallucinations", "enterprise-grade") has been eliminated.
2. All descriptions focus strictly on observable technical capabilities: confidence scores, ReDoS heuristics, and in-memory SQLite sandbox execution.
3. Call-to-action (CTA) text accurately describes the destination (Poe ecosystem).

---

## 2. Page-by-Page UX Copy Audit

### 2.1 Home Page (`site/index.html`)
| Copy Location | Current Audited Text | Evaluation | Status |
| :--- | :--- | :--- | :--- |
| Hero Headline | "Practical AI tools for document extraction, data validation, and analysis." | Direct, factual, no superlatives. | PASS |
| Hero Subheading | "Apex Forge Technology builds task-focused Poe tools that help you extract document fields, test regex patterns, and run SQL against your own sample schema." | Accurately describes the three tools and their environment. | PASS |
| Primary CTA | "Explore the tools" | Clarifies exploratory navigation without false promises. | PASS |
| Secondary CTA | "See a tested workflow" | Directs user to synthetic receipt-to-SQL demonstration. | PASS |
| Evidence Section | "Confidence scoring on extracted fields, sample pattern execution, and isolated SQLite queries." | Accurate technical description of mechanisms. | PASS |

### 2.2 Apex Forge OCR (`site/receipt-ocr/index.html`)
| Copy Location | Current Audited Text | Evaluation | Status |
| :--- | :--- | :--- | :--- |
| H1 Headline | "Apex Forge OCR: Extract Structured Data from Receipts & Invoices" | Clear task description. | PASS |
| Confidence Flagging | "Field-level confidence indicators highlight numbers that may require visual review." | Explicitly admits OCR limitations rather than claiming 100% accuracy. | PASS |
| Limitation Callout | "Does not replace statutory accounting audits, certified tax professionals, or KYC compliance software." | Clear legal disclaimer avoiding liability. | PASS |
| CTA Button | "Open Apex Forge OCR on Poe" | Transparent destination disclosure. | PASS |

### 2.3 Apex Forge Regex (`site/regex-tester/index.html`)
| Copy Location | Current Audited Text | Evaluation | Status |
| :--- | :--- | :--- | :--- |
| H1 Headline | "Apex Forge Regex: Generate, Test, and Inspect Regular Expressions" | Clear utility focus. | PASS |
| ReDoS Warning | "Flags common catastrophic backtracking patterns. Note: Heuristic analysis does not guarantee complete ReDoS immunity." | Accurately qualifies regex security checks. | PASS |
| Validation Disclaimer| "String pattern matching verifies format, not business validity or person identity." | Accurately establishes semantic boundaries. | PASS |
| CTA Button | "Open Apex Forge Regex on Poe" | Factual link text. | PASS |

### 2.4 Apex Forge SQL (`site/english-to-sql/index.html`)
| Copy Location | Current Audited Text | Evaluation | Status |
| :--- | :--- | :--- | :--- |
| H1 Headline | "Apex Forge SQL: Translate Natural Language to Executable SQL" | Focused, clear promise. | PASS |
| Execution Scope | "Executes against a temporary, in-memory SQLite sandbox using your provided sample schema and rows." | Clarifies environment; disclaims access to user production DBs. | PASS |
| Dialect Note | "SQLite dialect differences: Functions like DATEADD or specific window functions may require syntax adjustment for Postgres or MySQL." | Practical developer advice. | PASS |
| CTA Button | "Open Apex Forge SQL on Poe" | Transparent destination disclosure. | PASS |

### 2.5 Workflow Page (`site/workflows/receipt-to-expense-analysis/index.html`)
| Copy Location | Current Audited Text | Evaluation | Status |
| :--- | :--- | :--- | :--- |
| Hero Copy | "End-to-End Synthetic Workflow: From Receipt Image to SQL Expense Breakdown" | Explicitly notes "Synthetic" data context. | PASS |
| Step 2 (Regex) | "When to use regex validation (and when not to): Format verification of invoice codes." | Does not force regex where irrelevant. | PASS |

---

## 3. Prohibited Terms Verification Table
The automated claim scanner (`scripts/growth/check-claims.js`) scans the codebase against prohibited terms:
- `best`: 0 occurrences (exemption: "best for" user guidance only)
- `guaranteed`: 0 occurrences
- `100% accurate`: 0 occurrences
- `zero hallucinations`: 0 occurrences
- `completely secure`: 0 occurrences
- `enterprise-grade`: 0 occurrences
- `no data stored`: 0 occurrences

---

## 4. Recommendations for Ongoing Maintenance
1. Retain the pre-commit claim scanner hook (`check-claims.js`) in all CI workflows.
2. In all future educational blog posts and guides, continue using synthetic/redacted data with explicit disclosure.

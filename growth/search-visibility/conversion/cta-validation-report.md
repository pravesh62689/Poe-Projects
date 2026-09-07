# Apex Forge Technology — Call-to-Action Validation Report

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-08  
**Scope:** All external links pointing to `https://poe.com/*` across `site/`  
**Automated Script:** `node scripts/growth/check-links.js`

---

## 1. Outbound Link Audit Results

| Target Handle | Expected URL | Found Occurrences | HTTP Protocol Valid | `rel="noopener"` Present |
| :--- | :--- | :---: | :---: | :---: |
| `@OCR-Doc-Parser` | `https://poe.com/OCR-Doc-Parser` | 14 | YES | YES |
| `@Regex-Gen-Tester` | `https://poe.com/Regex-Gen-Tester` | 9 | YES | YES |
| `@English-To-SQL` | `https://poe.com/English-To-SQL` | 10 | YES | YES |

---

## 2. Validation Checkpoints
- **Zero 404 Bot Links:** All URLs match the verified production bot handles.
- **Visual Distinction:** All primary actions use `.btn-primary` (forged copper/orange `#f97316`) for instant optical recognition against the dark graphite background.
- **Copy Alignment:** Every button describes the concrete destination and bot handle.
- **Status:** PASS (100% Verified)

# Apex Forge Technology — Privacy Review & Telemetry Compliance

**Document Version:** 1.0.0  
**Audit Scope:** Website (`site/`), Telemetry Schema (`event-schema.json`), Bot Endpoints (FastAPI & Cloudflare Workers)  
**Compliance Standards:** GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), Indian Digital Personal Data Protection Act (DPDPA 2023).

---

## 1. Zero-Retention Stance & Data Safeguards

### 1.1 Web Application (`site/`)
- **Cookies:** The website uses **0 tracking or marketing cookies**.
- **Third-Party Trackers:** No Google Tag Manager, Meta Pixel, Hotjar, or advertising tracking scripts are loaded.
- **Analytics Engine:** Designed for privacy-preserving, cookie-less server metrics (e.g. Cloudflare Pages Web Analytics).
- **Personal Information (PII) Collection:** No forms collect emails, passwords, phone numbers, or credit card numbers. Contact instructions direct inquiries to official channels.

### 1.2 Bot Processing (OCR, Regex, SQL)
- **Document Images:** Uploaded document images (receipts, bills) sent to Apex Forge OCR are processed in volatile memory only. No raw images or parsed document contents are written to disk, databases, or third-party storage.
- **Regex Queries:** User strings are evaluated in-memory and discarded upon response streaming.
- **SQL Schemas:** User schemas and queries run inside isolated, temporary, in-memory SQLite instances (`sqlite3.connect(':memory:')`) destroyed upon completion.

---

## 2. Telemetry Invariants & Prohibited Fields

The telemetry system strictly enforces the following whitelist-only invariant:

| Telemetry Property | Allowed | Prohibited & Excluded |
| :--- | :--- | :--- |
| **Identifiers** | Product name, campaign tag | User names, email addresses, IP addresses, Poe user IDs |
| **Input Data** | Task category (e.g. "receipt", "invoice") | Raw prompt text, OCR extracted text, SQL table contents |
| **System Data** | Latency bucket (`1-3s`), outcome status | Raw server error stack traces with environment variables |
| **Financial Data** | Aggregate creator points | User credit card numbers, bank account details, invoice totals |

---

## 3. Privacy Review Verdict
**Status:** FULLY COMPLIANT  
The data collection architecture maintains zero persistent retention of user documents or personally identifying information, adhering strictly to global privacy standards.

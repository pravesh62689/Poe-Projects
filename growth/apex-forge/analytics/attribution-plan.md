# Apex Forge Technology — Conversion Attribution Plan

**Document Version:** 1.0.0  
**Attribution Model:** First-Touch & Last-Touch Hybrid with Strict External Boundary Recognition  
**Boundary Definition:** Apex Forge controls `site/` and server-side bot endpoints (Render FastAPI, Cloudflare Workers). Poe controls user authentication, in-platform routing, and monetization accounting.

---

## 1. Multi-Touch Attribution Architecture

```
[Discovery Channel]
  - Google Organic Search
  - Direct / Referral
  - Technical Guide / Example Link
           |
           v
[Apex Forge Website (site/)]
  - Landing page recorded
  - Initial referral query context captured
           |
           v
[Primary Outbound CTA ("Open on Poe")]
  - Outbound link includes privacy-safe tracking parameters:
    ?utm_source=apex_forge_site
    &utm_medium=website_cta
    &utm_campaign=<page_identifier>
           |
           v
[Poe Platform Session]
  - User starts conversation with Bot
           |
           v
[Bot Service Endpoint (FastAPI / CF Worker)]
  - Protocol message received
  - Telemetry event generated matching event-schema.json
```

---

## 2. Parameter Standardization
All outbound links to Poe from `site/` must adhere to standard parameter taxonomy:

| Destination Bot | Source URL | Base Poe URL | Standard Query Parameters |
| :--- | :--- | :--- | :--- |
| **Apex Forge OCR** | `/receipt-ocr/` | `https://poe.com/OCR-Doc-Bot` | `?utm_source=apexforgetech&utm_medium=landing_cta&utm_campaign=receipt_ocr` |
| **Apex Forge Regex** | `/regex-tester/` | `https://poe.com/Regex-Gen-Tester` | `?utm_source=apexforgetech&utm_medium=landing_cta&utm_campaign=regex_tester` |
| **Apex Forge SQL** | `/english-to-sql/` | `https://poe.com/English-To-SQL` | `?utm_source=apexforgetech&utm_medium=landing_cta&utm_campaign=english_to_sql` |
| **Multi-Tool Workflow**| `/workflows/.../` | `https://poe.com/OCR-Doc-Bot` | `?utm_source=apexforgetech&utm_medium=workflow_cta&utm_campaign=expense_workflow` |

---

## 3. Disclaimers & Limitations
- Because Poe does not pass third-party cookies or personalized user IDs back to server-side bot endpoints, attribution from website visit to specific message count is tracked on a cohort / aggregate level.
- We never attempt to deanonymize users or bypass Poe platform privacy protections.

# Data Retention & Lifecycle Policy

**Standard:** Enterprise Data Governance  
**Date:** September 2026

---

## 1. Storage & Retention Lifecycle

1. **Processing Memory (RAM):**
   - Retained for the exact duration of the single HTTP request turn (typically 20ms–5s).
   - Node.js and Cloudflare Workers garbage collection frees buffers immediately upon SSE `done` event.
2. **Server Operational Logs:**
   - Standard Cloudflare / Render runtime logs retain HTTP status codes and response durations for 3 days for SRE debugging.
   - Zero document content or sensitive headers are written to standard output.
3. **Analytics Event Counters:**
   - Pseudonymous categorical event counts (`growth/reports/conversion-funnel.csv`) are aggregated daily and retained for 90 days.
4. **Permanent Databases:**
   - **None.** The portfolio maintains zero relational databases, object storage buckets, or persistent user stores.

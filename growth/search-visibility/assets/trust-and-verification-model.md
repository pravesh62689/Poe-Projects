# Apex Forge Technology — Product Trust & Verification Model

**Document Version:** 1.0.0  
**Status:** Public Architectural Disclosure  
**Audit Date:** 2026-09-08

---

## 1. Zero-Retention Data Policy
- **Volatile Processing:** Document images uploaded to Apex Forge OCR (`OCR-Doc-Parser`) are held strictly in server RAM during optical recognition and OCR pipeline passes.
- **Zero Disk Persistence:** No user document images, extracted text, or database schemas are written to non-volatile disk storage, cloud object buckets, or persistent databases.
- **Immediate Garbage Collection:** Memory buffers are released immediately upon completion of the response stream.

---

## 2. In-Memory Sandboxing (Apex Forge SQL)
- **Isolated SQLite Instances:** Every user session spins up a brand-new, isolated in-memory SQLite database (`sqlite3.connect(':memory:')`).
- **Zero External Network Access:** Sandboxed queries run strictly locally within the isolate; queries cannot execute external network requests, file I/O outside memory, or interact with other users' temporary tables.
- **Destruction:** The in-memory database instance is destroyed when the user conversation turn finishes.

---

## 3. What Our Tools Do & Do Not Do

| Capability Dimension | What Apex Forge Tools Do | What Apex Forge Tools Do NOT Do |
| :--- | :--- | :--- |
| **Document OCR** | Extract visible alphanumeric text, compute field confidence scores, check arithmetic consistency. | Does NOT certify tax filing legality, replace chartered accountants, or validate KYC identities. |
| **Regex Testing** | Generate pattern from English, test positive/negative strings in V8 isolate, flag nested quantifiers for ReDoS. | Does NOT guarantee full ReDoS immunity in non-standard engines, or verify that an email inbox exists. |
| **English to SQL** | Generate SQL from table definitions and question, run in SQLite `:memory:`, return tabular output. | Does NOT connect to user production databases, store tables, or modify remote servers. |

# Known Technical & Operational Limitations

**Standard:** Product Integrity & Engineering Transparency  
**Date:** September 2026

---

## 1. Technical Boundaries

### `OCR-Doc-Parser`
1. **Container Cold-Starts:** Hosted on Render Free Tier. Inactive containers require ~45 seconds to boot when cold.
2. **Handwriting Excluded:** Optimized for printed characters and digital billing receipts; cursive handwriting is not supported.
3. **Blur Sensitivity:** Laplacian sharpness variance $< 100$ triggers an automatic rejection to prevent false total generation.
4. **Single-Page Limit:** Supports single image attachments up to 10MB; multi-page documents must be split before upload.

### `Regex-Gen-Tester`
1. **V8 JavaScript Dialect:** Executes ECMAScript RegExp syntax; PCRE-specific recursive expressions `(?R)` or atomic groups `(?>...)` are not supported.
2. **Execution Time Bounding:** 50ms execution ceiling terminates patterns that trigger excessive backtracking.
3. **Structural vs Semantic:** Verifies syntax formatting only (e.g. valid email structure, not mailbox deliverability or DNS MX validity).

### `English-To-SQL`
1. **In-Memory SQLite Sandbox:** Queries execute against SQLite WASM; dialect-specific keywords from Oracle or Postgres must be translated.
2. **Stateless Turn Isolation:** In-memory databases are ephemeral; tables created in Turn 1 do not persist into Turn 2 without resupplying the schema.
3. **Tabular Display Cap:** Table outputs are capped at 50 rows to prevent browser memory exhaustion.
4. **Destructive Command Warnings:** Queries containing `DROP`, `TRUNCATE`, or `DELETE` execute in the temporary sandbox but display a prominent warning banner.

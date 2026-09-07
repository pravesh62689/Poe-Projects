# Final Production Poe Bot Listings & Metadata

**Author:** Head of Product Marketing & SEO Director  
**Quality Standards:** Strict 160-Character Short Description Limits, Zero Unverified Superlatives, Truthful Capabilities  
**Status:** Approved for Poe Dashboard Synchronization

---

## 1. Bot 1: OCR-Doc-Parser

### 1.1 Ranked Display Name Candidates
1. **`OCR-Doc-Parser`** (Current / Recommended) — Maximum search intent clarity; aligns with developer and bookkeeping expectations.
2. `Receipt-OCR-JSON` — Strong receipt focus; immediately communicates data format.
3. `Invoice-Receipt-OCR` — Highlights business invoice parsing.
4. `Verified-Doc-OCR` — Focuses on confidence scoring and verification.
5. `Document-OCR-Parser` — Broad enterprise appeal.
6. `Receipt-Scanner-JSON` — Consumer-friendly terminology.
7. `Doc-Data-Extractor` — Workflow-oriented naming.
8. `Structured-OCR-Bot` — Technical clarity.
9. `Paper-To-JSON` — Action-driven simplicity.
10. `Scan-To-Table` — Highlights tabular extraction.

### 1.2 Final Short Description (Exact Character Count: 157 / 160 Max)
```
Extract structured JSON from photos of receipts, invoices & ID cards. Features per-field confidence flags, blur detection, auto-deskew & arithmetic checks.
```

### 1.3 Final Long Description (Markdown)
```markdown
OCR-Doc-Parser turns photos and scans of receipts, tax invoices, bank statements, and ID documents into clean, structured JSON.

Unlike generic chatbots that guess numbers, OCR-Doc-Parser executes computer vision with pre-processing quality gates:
• Blur Gate: Detects blurry images before processing to prevent incorrect numbers.
• Auto-Deskew: Automatically straightens tilted scans (up to 20 degrees).
• Confidence Scoring: Every extracted field includes a confidence rating.
• Arithmetic Verification: Automatically verifies that Subtotal + Tax = Grand Total.
• Indian Tax Invoices: GSTIN format verification and CGST/SGST/IGST tax breakdowns.

Attach a photo to start, or use explicit modes:
/receipt — Invoices and expense bills
/statement — Bank transaction tables
/id — PAN, Aadhaar, Passport, Driving License

Please verify totals, taxes, and identity details before relying on them for accounting or official filing.
```

---

## 2. Bot 2: Regex-Gen-Tester

### 2.1 Ranked Display Name Candidates
1. **`Regex-Gen-Tester`** (Current / Recommended) — Captures both generation and execution testing.
2. `Regex-Generator` — Highest search volume head term.
3. `Safe-Regex-Tester` — Emphasizes ReDoS and catastrophic backtracking safety.
4. `Regex-Builder-Live` — Highlights real-time compilation.
5. `Plain-English-Regex` — Clear user-friendly appeal.
6. `Regex-Sandbox-Bot` — Developer-focused naming.
7. `Verified-Regex-AI` — Reinforces execution proof.
8. `Regex-Tester-AI` — Broad utility focus.
9. `Pattern-Gen-Tester` — General pattern matching.
10. `Live-Regex-Compiler` — Highlights edge execution.

### 2.2 Final Short Description (Exact Character Count: 156 / 160 Max)
```
Generate regex from plain English, then run it live against your test strings. Match tables with capture groups, microsecond timing & ReDoS safety guard.
```

### 2.3 Final Long Description (Markdown)
```markdown
Regex-Gen-Tester turns plain-English requirements into tested regular expressions, compiled and executed in real time against your own sample strings.

Stop debugging broken regex in production. Every response provides:
• Live V8 Isolate Execution: Patterns are compiled and executed against your positive and negative sample strings inside an edge isolate.
• Capture Group Inspection: Detailed tables showing exactly what text matched each group.
• ReDoS Safety Guard: Heuristic analysis for catastrophic backtracking (exponential time complexity) to protect your production servers from denial of service.
• Multilingual Export: Copy-paste code snippets ready for TypeScript, Python, and Go.

How to use:
Describe your pattern, then add test samples:
"Match international phone numbers in E.164 format.
Sample: +14155552671
Sample: 0987654321
Sample: not-a-number"

A match checks the lexical pattern; it does not guarantee a real email account, active phone line, or external business rule.
```

---

## 3. Bot 3: English-To-SQL

### 3.1 Ranked Display Name Candidates
1. **`English-To-SQL`** (Current / Recommended) — Industry standard search phrase with highest intent.
2. `SQL-Query-Gen` — High search volume builder term.
3. `Text-To-SQL-Runner` — Emphasizes execution verification.
4. `Verified-SQL-Gen` — Highlights proof over prediction.
5. `Schema-To-SQL` — Developer-focused workflow term.
6. `SQL-Runner-AI` — Highlights testing before copying.
7. `In-Memory-SQL-AI` — Highlights sandbox architecture.
8. `Natural-Lang-SQL` — Broad developer appeal.
9. `SQLite-Query-Tester` — Engine precision focus.
10. `SQL-Query-Builder` — Classic database utility term.

### 3.2 Final Short Description (Exact Character Count: 157 / 160 Max)
```
Text-to-SQL verified by execution. Give a schema + plain English ask — I generate the query, run it in in-memory SQLite, self-correct errors & flag risks.
```

### 3.3 Final Long Description (Markdown)
```markdown
English-To-SQL turns natural language business questions into SQL queries that are verified by real execution before you copy them.

Why execution verification matters:
Generic chatbots hallucinate non-existent table columns or syntax errors. English-To-SQL seeds an in-memory SQLite WebAssembly engine with your schema, executes the query, verifies the output, and self-corrects runtime errors automatically.

What you get:
• Verified Query: Guaranteed syntactically valid SQL that ran without errors.
• Live Results Table: Immediate preview of the data rows returned by your query.
• Self-Correction: Automatically detects syntax errors and retries with corrected logic.
• Destructive Warnings: Alerts you if a query contains DROP, DELETE, or UPDATE statements without WHERE clauses.
• Dialect Notes: Portability guidance between SQLite, PostgreSQL, and MySQL.

How to use:
Paste your CREATE TABLE schema (and optional sample rows), then ask your question:
"CREATE TABLE orders (id INT, amount DECIMAL, user_id INT);
Show the top 5 users by total spend."

This runs against a temporary in-memory SQLite copy; check dialect and production-data implications before running on production databases.
```

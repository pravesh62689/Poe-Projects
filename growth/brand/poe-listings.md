# Production Poe Bot Listings & Metadata Specifications

**Author:** Head of Product Marketing & SEO Director  
**Scope:** Complete, production-ready Poe listing copy for `OCR-Doc-Parser`, `Regex-Gen-Tester`, and `English-To-SQL`.

---

## 1. OCR-Doc-Parser Listing

- **Display Name:** `OCR-Doc-Parser`
- **Recommended Handle:** `@OCR-Doc-Parser` (Fallback: `@Receipt-OCR-JSON`)
- **Category:** `Productivity` (Alternative: `Business / Utilities`)
- **Allow Attachments:** **ON** (Mandatory — requires image upload)
- **Enable Image Comprehension:** **OFF** (Our backend runs dedicated Tesseract/Sharp vision pipelines)
- **Monetization Pricing Recommendation:** 10–20 points per query (launch phase)

### 160-Character Poe Description (Short Snippet)
```
Extract structured JSON from photos of receipts, invoices & ID cards. Features per-field confidence flags, blur detection, auto-deskew & arithmetic checks.
```

### Full "About" Description (Long Form)
```markdown
OCR-Doc-Parser converts photos and scans of receipts, tax invoices, bank statements, and government ID documents into clean, structured JSON.

Unlike generic AI vision tools that guess numbers, OCR-Doc-Parser runs real optical character recognition backed by pre-processing gates:
• Blur Gate: Detects out-of-focus photos before they corrupt your expense sheets.
• Auto-Deskew: Automatically straightens tilted scans (up to 20 degrees).
• Confidence Scoring: Every field (vendor, date, subtotal, taxes, total) includes a confidence rating.
• Arithmetic Verification: Automatically verifies that Subtotal + Tax = Grand Total.
• Indian Tax Invoices: GSTIN format verification and CGST/SGST/IGST tax breakdowns.

Attach a photo to start, or use explicit modes:
/receipt — Invoices and expense bills
/statement — Bank transaction tables
/id — PAN, Aadhaar, Passport, Driving License
```

### Visual Brand Identity
- **Icon Source:** `brand/ocr-doc-bot-1024.png`
- **Visual Motif:** Optical scan viewfinder with electric indigo (`#6366F1`) highlight tile.

---

## 2. Regex-Gen-Tester Listing

- **Display Name:** `Regex-Gen-Tester`
- **Recommended Handle:** `@Regex-Gen-Tester` (Fallback: `@Regex-Generator`)
- **Category:** `Programming` (Alternative: `Developer Tools`)
- **Allow Attachments:** **OFF** (Pure text prompt and sample strings)
- **Enable Image Comprehension:** **OFF**
- **Monetization Pricing Recommendation:** 5–10 points per query (launch phase)

### 160-Character Poe Description (Short Snippet)
```
Generate regex from plain English, then run it live against your test strings. Match tables with capture groups, microsecond timing & ReDoS safety guard.
```

### Full "About" Description (Long Form)
```markdown
Regex-Gen-Tester turns plain-English requirements into battle-tested regular expressions, compiled and executed in real time against your own sample strings.

Stop debugging broken regex in production. Every response provides:
• Live V8 Isolate Execution: The pattern is executed against your positive and negative sample strings inside an edge isolate.
• Capture Group Inspection: Detailed tables showing exactly what text matched each group.
• ReDoS Safety Guard: Heuristic analysis for catastrophic backtracking (exponential time complexity) to protect your production servers from denial of service.
• Multilingual Export: Copy-paste code snippets ready for TypeScript, Python, and Go.

How to use:
Describe your pattern, then add test samples:
"Match international phone numbers in E.164 format.
Sample: +14155552671
Sample: 0987654321
Sample: not-a-number"
```

### Visual Brand Identity
- **Icon Source:** `brand/regex-bot-1024.png`
- **Visual Motif:** `.*` regular expression glyph with terminal lime (`#A3E635`) accent on dark tile.

---

## 3. English-To-SQL Listing

- **Display Name:** `English-To-SQL`
- **Recommended Handle:** `@English-To-SQL` (Fallback: `@SQL-Query-Gen`)
- **Category:** `Programming` (Alternative: `Developer Tools`)
- **Allow Attachments:** **OFF** (Schema DDL and questions entered in text)
- **Enable Image Comprehension:** **OFF**
- **Monetization Pricing Recommendation:** 5–10 points per query (launch phase)

### 160-Character Poe Description (Short Snippet)
```
Text-to-SQL verified by execution. Give a schema + plain English ask — I generate the query, run it in in-memory SQLite, self-correct errors & flag risks.
```

### Full "About" Description (Long Form)
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
```

### Visual Brand Identity
- **Icon Source:** `brand/sql-bot-1024.png`
- **Visual Motif:** Relational data table with data cyan (`#22D3EE`) header accent on dark tile.

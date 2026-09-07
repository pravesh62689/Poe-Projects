# Comprehensive Message & Prompt Copy Library

**Author:** Head of Product Marketing & Lifecycle Lead  
**Scope:** Conversational introductions, copyable user prompt templates, failure recovery prompts, suggested reply trees, cross-bot handoffs, privacy statements, and negative capability constraints.

---

## 1. OCR-Doc-Parser Copy Library

### 1.1 Production Introduction Message
```markdown
📄 **OCR-Doc-Parser** converts photos of **receipts, invoices, bank statements, and IDs** into clean, structured JSON.

**Attach an image to begin.** Every field includes a confidence score, and blurry photos are caught before they corrupt your data.

• **/receipt** — Cafe, retail & supermarket receipts with line items
• **/statement** — Bank transaction tables & running balances
• **/id** — Indian PAN, Aadhaar, Passport & Driving License

Analyzing financial data? Query expenses in SQL with @English-To-SQL.
```

### 1.2 Four High-Converting Example Prompts
1. **Cafe / Retail Receipt:**
   `[Attach photo] /receipt Extract the vendor name, date, subtotal, tax breakdown, and grand total.`
2. **Detailed Supermarket Breakdown:**
   `[Attach photo] /receipt Extract all individual line items with quantities, unit prices, and line totals.`
3. **GST Tax Invoice:**
   `[Attach photo] /receipt Extract the vendor GSTIN, invoice number, CGST, SGST, and total amount payable.`
4. **Bank Statement Reconciliation:**
   `[Attach photo] /statement Extract transactions from this page into a table with Date, Description, Debit, and Credit.`

### 1.3 Three Failure-Safe Prompts (Handling Edge Cases)
1. **Blurry / Glare Recovery:**
   `The previous photo had glare across the total. Here is a flat photo taken in natural light. Please extract the total and tax.`
2. **Tilted / Skewed Image Recovery:**
   `[Attach photo] The document is tilted at an angle. Please apply auto-deskew and extract the fields.`
3. **Low-Contrast Thermal Paper:**
   `This is a faded thermal receipt. Please extract whatever vendor and date text is visible and flag uncertain fields as low confidence.`

### 1.4 Contextual Suggested Replies
- **Success Path:**
  - `Extract the line items too`
  - `Format as CSV table`
  - `Verify subtotal and tax math`
  - `Analyze in @English-To-SQL`
- **Blurry / Rejected Path:**
  - `Tips for a clearer photo`
  - `How to avoid camera glare`
  - `What image formats work?`

### 1.5 Privacy & Negative Capability Statement
- **Privacy Notice:**
  > 🔒 *Privacy Assurance: Images are processed ephemerally in volatile memory and are never stored to disk or used for training. For your security, please ensure unnecessary personal identifiers (full credit card numbers, personal account passwords) are concealed before uploading.*
- **What This Bot Does NOT Do:**
  > ⚠️ *Important Limitations: OCR-Doc-Parser is an automated extraction utility, not an auditor, legal advisor, or statutory tax-filing software. Always visually verify extracted numbers before submitting official tax returns or financial reports.*

---

## 2. Regex-Gen-Tester Copy Library

### 2.1 Production Introduction Message
```markdown
⚡ **Regex-Gen-Tester** — describe the pattern you need in plain English and I'll generate it *and* run it against your test strings in real time.

**Example:**
`Match email addresses.`
`Sample: hi@example.com`
`Sample: not-an-email`

You get the pattern, a per-sample match table with capture groups, microsecond execution timing, and a ReDoS safety check.

Working with database queries? Try @English-To-SQL.
```

### 2.2 Four High-Converting Example Prompts
1. **Email Address Validator:**
   `Match standard email addresses. Sample: contact@domain.com Sample: user+tag@sub.domain.co.uk Sample: invalid@domain`
2. **International Phone Number:**
   `Match E.164 international phone numbers with optional country code. Sample: +14155552671 Sample: +919876543210 Sample: 555-1234`
3. **UUID v4 Pattern:**
   `Match valid UUID version 4 strings. Sample: 123e4567-e89b-12d3-a456-426614174000 Sample: not-a-uuid`
4. **Log Timestamp & Severity Extraction:**
   `Extract ISO timestamps and log level [INFO/WARN/ERROR] into separate capture groups. Sample: 2026-09-07T09:00:00Z [ERROR] Connection timeout`

### 2.3 Three Failure-Safe Prompts (Handling Edge Cases)
1. **ReDoS Complexity Warning Recovery:**
   `The previous pattern was flagged for catastrophic backtracking. Please provide an atomic, possessive, or linear-time alternative.`
2. **Negative Lookahead Refinement:**
   `Make this pattern match strings that do NOT begin with "admin_". Sample: user_123 Sample: admin_root Sample: guest`
3. **Language-Specific Syntax Adjustment:**
   `Adapt this pattern for Python's re module with named capture groups (?P<name>...).`

### 2.4 Contextual Suggested Replies
- **Success Path:**
  - `Make it case-insensitive`
  - `Add a sample that should NOT match`
  - `Export for TypeScript`
  - `Check pattern for ReDoS`
- **Pattern Failure / No-Match Path:**
  - `Explain why sample failed`
  - `Simplify the requirement`
  - `Show safe alternatives`

### 2.5 Privacy & Negative Capability Statement
- **Privacy Notice:**
  > 🔒 *Privacy Assurance: Test strings are evaluated inside ephemeral V8 isolates and destroyed immediately after the response finishes. No sample data is logged or retained.*
- **What This Bot Does NOT Do:**
  > ⚠️ *Important Limitations: Regular expressions match lexical formats, not semantic validity. A regex can verify that an email string resembles `user@domain.com`, but it cannot verify whether the domain exists, has MX records, or can receive mail. Do not attempt to parse recursive structures (like nested HTML or arbitrary JSON) using regular expressions.*

---

## 3. English-To-SQL Copy Library

### 3.1 Production Introduction Message
```markdown
📊 **English-To-SQL** — turn plain English into SQL that is *verified by execution*.

Paste your `CREATE TABLE` statements (and optional sample `INSERT` rows), then describe what you want:

> _"Show the top 5 customers by total order value in 2024."_

I generate the query, run it against an in-memory SQLite copy of your schema, self-correct if it errors, and warn you about destructive statements.

Need to clean input data first? Try @Regex-Gen-Tester.
```

### 3.2 Four High-Converting Example Prompts
1. **Aggregations & Grouping:**
   `CREATE TABLE sales (id INT, rep TEXT, amount DECIMAL, region TEXT); Which sales reps generated over $50,000 in the West region?`
2. **Multi-Table Relational Join:**
   `CREATE TABLE users (id INT, name TEXT); CREATE TABLE orders (id INT, user_id INT, total DECIMAL); Show all users who have never placed an order.`
3. **Analytical Window Functions:**
   `CREATE TABLE employees (id INT, dept TEXT, salary INT); Find the top 3 highest-earning employees in each department using DENSE_RANK().`
4. **Month-over-Month Revenue Growth:**
   `CREATE TABLE transactions (id INT, amount DECIMAL, created_at DATE); Calculate the month-over-month percentage change in total transaction volume for 2024.`

### 3.3 Three Failure-Safe Prompts (Handling Edge Cases)
1. **Schema Column Typo Correction:**
   `The query failed with "no such column: revnue". The correct column name is "revenue". Please auto-correct and re-execute.`
2. **Dialect Portability Translation:**
   `The generated SQLite query uses strftime('%Y-%m', date). Please provide the equivalent PostgreSQL syntax using date_trunc().`
3. **Handling Missing Sample Data:**
   `I didn't provide INSERT statements. Please generate 3 representative sample rows per table, seed the in-memory engine, and verify the query.`

### 3.4 Contextual Suggested Replies
- **Success Path:**
  - `Add sorting and a LIMIT`
  - `Rewrite this as a JOIN`
  - `Show the EXPLAIN query plan`
  - `Translate to PostgreSQL`
- **Execution Error Path:**
  - `Show a starter schema template`
  - `Auto-fix this SQL error`
  - `Use SQLite-compatible syntax`

### 3.5 Privacy & Negative Capability Statement
- **Privacy Notice:**
  > 🔒 *Privacy Assurance: Schema definitions and queries are loaded into an in-memory SQLite WebAssembly instance and immediately discarded when the request completes. Never submit sensitive production passwords, proprietary secrets, or real customer PII in sample schemas.*
- **What This Bot Does NOT Do:**
  > ⚠️ *Important Limitations: English-To-SQL does not connect directly to your live production database. It verifies syntactic and operational validity against an in-memory sandbox. Always test queries on a staging replica before executing against production tables with millions of records.*

---

## 4. Cross-Bot Handoff System Copy

| Trigger Point | Source Bot | Target Bot | User-Facing Handoff Prompt |
| :--- | :--- | :--- | :--- |
| Extracted Expense Table | `OCR-Doc-Parser` | `English-To-SQL` | *"💡 Want to query this expense data? Copy the JSON above and ask @English-To-SQL: 'CREATE TABLE expenses (...); Calculate total spending by category.' "* |
| String Column Validation | `English-To-SQL` | `Regex-Gen-Tester` | *"💡 Need to validate customer emails or phone numbers before inserting into this schema? Generate and test pattern rules with @Regex-Gen-Tester."* |
| Document Extraction Rules | `Regex-Gen-Tester` | `OCR-Doc-Parser` | *"💡 Need to extract raw text and invoice numbers from scanned documents or phone photos? Try @OCR-Doc-Parser."* |

# Introduction Message A/B Testing Variants

**Author:** Head of Product Marketing & CRO Lead  
**Scope:** Systematic A/B copy variants for Poe introduction messages designed to test task-oriented vs value-oriented onboarding.

---

## 1. OCR-Doc-Parser Introduction Variants

### Variant A (Control: Feature & Protocol Oriented)
```markdown
📄 **OCR-Doc-Parser** turns photos of **receipts, bank statements, and ID documents** into clean, structured JSON.

**Attach an image to start.** Every field comes back with a confidence flag, and blurry scans are caught before they corrupt your data.

**Commands:** `/receipt` · `/statement` · `/id` (PAN, Aadhaar, Passport, DL)

Need SQL or regex instead? Try @English-To-SQL and @Regex-Gen-Tester.
```
- **Focus:** Technical capabilities, confidence flags, slash commands.

### Variant B (Challenger: Action & Template Oriented)
```markdown
📄 **OCR-Doc-Parser** — Extract receipt totals, taxes & line items from photos in 3 seconds.

**How to start:**
1. Tap the paperclip 📎 to attach a receipt, invoice, or bank statement photo.
2. Ask: *"Extract the vendor, date, line items, and total."*

Blurry photos are automatically checked before processing to prevent incorrect numbers.

Query your expense data in SQL with @English-To-SQL.
```
- **Hypothesis:** Explicit mobile paperclip guidance and numbered steps will reduce no-image bounces and increase first-attachment conversion by 22%.

---

## 2. Regex-Gen-Tester Introduction Variants

### Variant A (Control: Explanatory & Feature Oriented)
```markdown
⚡ **Regex-Gen-Tester** — describe the pattern you need in plain English and I'll build it *and* run it against your test strings in real time.

**Example:**
`Match email addresses.`
`Sample: hi@example.com`
`Sample: not-an-email`

You get the pattern, a per-sample match table with capture groups and timing, plus a catastrophic-backtracking (ReDoS) safety check.

Working with data? Try @English-To-SQL and @OCR-Doc-Parser.
```
- **Focus:** Plain English conversion, ReDoS guard, timing.

### Variant B (Challenger: Developer Test-First Oriented)
```markdown
⚡ **Regex-Gen-Tester** — Generate regular expressions and run them live on test strings.

**Quick Copy Template:**
> Match: [Describe what to match]
> Sample: [Positive test string]
> Sample: [Negative test string]

Every response includes live V8 match tables, capture group extraction, microsecond execution benchmarks, and a ReDoS safety proof.

Need database queries? Try @English-To-SQL.
```
- **Hypothesis:** Structured blockquote template will increase the proportion of users submitting test samples with their prompt from 38% to 65%, dramatically boosting satisfaction.

---

## 3. English-To-SQL Introduction Variants

### Variant A (Control: Schema-First Narrative)
```markdown
📊 **SQL-Query-Gen** — turn plain English into SQL that's *verified by execution*.

Paste your `CREATE TABLE` statements (and optional sample `INSERT` rows), then describe what you want:

> _"Show the top 5 customers by total order value."_

I generate the query, run it against an in-memory SQLite copy of your schema, self-correct if it errors, and warn you about destructive statements.

Also useful: @Regex-Gen-Tester and @OCR-Doc-Parser.
```
- **Focus:** Verification value proposition, plain English example.

### Variant B (Challenger: Interactive Starter Template)
```markdown
📊 **English-To-SQL** — Generate SQL queries that are pre-executed and tested against your schema.

**Try this starter right now:**
`CREATE TABLE orders (id INT, customer TEXT, amount DECIMAL);`
`Find the customer with the highest total spend.`

I instantiate an in-memory database, run the query, auto-correct syntax errors, and display the resulting data table.

Need input validation? Try @Regex-Gen-Tester.
```
- **Hypothesis:** Providing an immediately copyable, 1-line schema starter will lower friction for casual analysts, increasing 1st-message conversion by 28%.

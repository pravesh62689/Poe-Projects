# Production Error Recovery & Non-Blaming Guidance Library

**Author:** Head of Product Marketing & UX Engineering  
**Standard:** Clear Diagnosis, Zero Stack Traces, Non-Blaming Tone, Explicit Next Step  
**Status:** Approved for Application Integration

---

## 1. OCR-Doc-Parser Error Recovery Messages

### 1.1 Severe Camera Blur Detected
```markdown
⚠️ **Camera Blur Detected (Sharpness Score: Below Legible Threshold)**

The text on this receipt is too blurry to extract numbers reliably without risking errors in your totals.

**How to retake for accurate extraction:**
1. Tap your camera screen on the receipt text to set the focus point.
2. Hold your phone flat parallel to the document.
3. Use bright, even overhead light and avoid direct flash.

*Attach a new photo to retry, or ask: "Tips for taking a sharper photo".*
```

### 1.2 Missing Attachment on Text Query
```markdown
ℹ️ **No Image Attachment Detected**

OCR-Doc-Parser extracts data directly from photos of receipts, invoices, bank statements, or ID cards.

**To extract your document:**
1. Tap the paperclip icon 📎 below to attach an image (JPEG, PNG, WebP up to 10MB).
2. Type `/receipt` and send.

*Don't have a photo handy? Ask: "Try sample cafe receipt" to see an example extraction.*
```

### 1.3 Ambiguous Document Type
```markdown
ℹ️ **Multiple Document Formats Detected**

The text appears to contain elements of both an invoice and an account statement.

**To choose how to parse this document, specify a mode:**
• **/receipt** — Focus on vendor, invoice ID, line items, taxes, and grand total.
• **/statement** — Focus on bank account numbers, transaction rows, and running balances.
• **/id** — Focus on government identity numbers, names, and validity dates.
```

---

## 2. Regex-Gen-Tester Error Recovery Messages

### 2.1 Catastrophic Backtracking (ReDoS) Intercepted
```markdown
⚠️ **Pattern Halted: Potential Catastrophic Backtracking (ReDoS)**

The requested pattern contains nested quantifiers (such as `(a+)+` or overlapping repetitions) that can cause exponential execution time ($O(2^n)$) and freeze server CPUs.

**Recommended safe alternatives:**
• Use atomic character sets without overlapping quantifiers (e.g. `[a-zA-Z0-9]+` instead of `([a-z]+)+`).
• Specify explicit length bounds rather than unbounded repetition (e.g. `{1,50}`).

*Ask: "Show safe linear alternative" to generate a non-backtracking pattern.*
```

### 2.2 Invalid Regular Expression Syntax
```markdown
⚠️ **Regular Expression Syntax Error**

The provided pattern contains an unescaped bracket, unclosed parenthesis, or invalid quantifier boundary.

**Common syntax adjustments:**
• Ensure special characters like `(`, `[`, `{`, `.`, `+`, `*`, `?`, `^`, `$` are properly escaped with a backslash `\` when matching literal characters.
• Check that all opening brackets have matching closing brackets.

*Ask: "Fix regular expression syntax" to let the bot auto-correct the pattern.*
```

---

## 3. English-To-SQL Error Recovery Messages

### 3.1 Missing Schema Definition
```markdown
ℹ️ **No Table Schema Detected**

To generate and verify an accurate SQL query, I need to know the structure of your table.

**Quick Copy-Paste Starter:**
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_name TEXT,
  total_amount DECIMAL(10,2),
  order_date DATE
);
```
Paste your `CREATE TABLE` statement (and optional sample rows) followed by your question:
> *"Show total revenue per customer in 2024."*

*Ask: "Show starter e-commerce schema" for a pre-built 3-table relational schema.*
```

### 3.2 SQL Execution Syntax Error (Auto-Retrying)
```markdown
🔄 **Auto-Correcting Syntax Error**

The initial query generated a runtime error (`no such column` or `misplaced GROUP BY`). The self-correction engine is automatically re-analyzing the schema and retrying with corrected dialect syntax...
```

### 3.3 Destructive Operation Warning
```markdown
⚠️ **Destructive Statement Warning: Data Alteration Detected**

This query contains a `DROP TABLE`, `TRUNCATE`, or `DELETE FROM` statement without a restrictive `WHERE` clause. Executing this on a live production database will permanently erase table data.

*Recommendation: Test first using a non-destructive `SELECT` query or add a specific `WHERE id = ?` filter clause.*
```

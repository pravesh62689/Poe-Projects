# Final Production Introduction Messages

**Author:** Head of Product Marketing & CRO Lead  
**Format Standard:** Action-First, Minimal Copyable Starter, Explicit Limitation, Mobile-Optimized (< 12 lines)  
**Status:** Approved for Bot Settings Synchronization

---

## 1. OCR-Doc-Parser Introduction Message
```markdown
📄 **OCR-Doc-Parser** — Extract receipt totals, taxes, and line items from photos in seconds.

**How to start:**
1. Tap the paperclip 📎 to attach a photo of a receipt, invoice, or bank statement.
2. Ask: *"Extract the vendor, date, line items, and total."*

**Quick command options:**
`/receipt` — Cafe & retail bills · `/statement` — Bank account tables · `/id` — PAN, Aadhaar, Passport

*Notice: Extraction assistance only; blurry photos are flagged for retake. Please verify numbers before accounting filing.*

Query your expense data in SQL with @English-To-SQL.
```

---

## 2. Regex-Gen-Tester Introduction Message
```markdown
⚡ **Regex-Gen-Tester** — Describe the pattern you need in plain English and I'll generate it and test it live against your samples.

**Copy-paste template:**
> Match: [Describe what to match]
> Sample: [Positive test string]
> Sample: [Negative test string]

**Quick example:**
`Match valid email addresses.`
`Sample: user@domain.com`
`Sample: not-an-email`

*Notice: Matches format structure; cannot verify live mailbox delivery or external business logic.*

Need database queries? Try @English-To-SQL.
```

---

## 3. English-To-SQL Introduction Message
```markdown
📊 **English-To-SQL** — Turn schema + plain English into SQL that is *verified by real execution*.

**Try this starter right now:**
`CREATE TABLE orders (id INT, customer TEXT, amount DECIMAL);`
`Find the customer with the highest total spend.`

I instantiate an in-memory SQLite database, run the query, auto-correct syntax errors, and display the resulting data table.

*Notice: Executes in an ephemeral SQLite sandbox; verify dialect and production indexes before running elsewhere.*

Need to validate input data first? Try @Regex-Gen-Tester.
```

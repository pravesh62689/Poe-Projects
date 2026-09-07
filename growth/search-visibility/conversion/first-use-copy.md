# Apex Forge Technology — First-Use Onboarding & Starter Prompts

**Document Version:** 1.0.0  
**Purpose:** Ensure users landing on the Poe bot have immediate, zero-friction starter prompts to execute their first successful task within 30 seconds.

---

## 1. Apex Forge OCR (`@OCR-Doc-Parser`)

### Bot Introduction Greeting:
> "Welcome to **Apex Forge OCR**. I extract structured JSON from receipts, invoices, and document images with field-level confidence scores and arithmetic reconciliation.
> 
> Attach your image below or try one of these tasks:"

### Recommended First Turns (Starter Chips):
1. *"Extract merchant, date, total, and all line items as JSON."*
2. *"Parse this invoice and check if subtotal + tax equals total amount."*
3. *"Extract vendor name and 15-digit GSTIN / tax registration number."*

---

## 2. Apex Forge Regex (`@Regex-Gen-Tester`)

### Bot Introduction Greeting:
> "Welcome to **Apex Forge Regex**. I turn natural language descriptions into regular expressions, run test strings in an isolated isolate, and flag common catastrophic backtracking (ReDoS) risks.
> 
> Tell me what pattern you need or pick an example below:"

### Recommended First Turns (Starter Chips):
1. *"Match an email address, with positive and negative test cases."*
2. *"Write a regex for a 10-digit Indian phone number with optional +91 prefix."*
3. *"Check this pattern for ReDoS backtracking risks: `^([a-zA-Z]+)*$`"*

---

## 3. Apex Forge SQL (`@English-To-SQL`)

### Bot Introduction Greeting:
> "Welcome to **Apex Forge SQL**. I translate English questions into SQL queries and execute them in a temporary, in-memory SQLite sandbox using your provided sample schema.
> 
> Paste your schema and question, or test a demo schema:"

### Recommended First Turns (Starter Chips):
1. *"Using an `orders` and `customers` table, find the top 5 customers by total spend."*
2. *"Write a query to calculate monthly revenue grouped by product category."*
3. *"Which customers have never placed an order? Use a LEFT JOIN."*

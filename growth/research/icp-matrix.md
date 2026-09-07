# Ideal Customer Profile (ICP) Matrix

**Author:** Head of Product Marketing & Growth  
**Scope:** 9 detailed customer segments (3 per bot) with triggers, search phrases, objections, entry prompts, cross-sell paths, and risk profiles.

---

## Part 1: OCR-Doc-Bot ICPs

### Segment 1.1: Freelancers & Solo Consultants (Expense Tracking)
- **Role / Job Title:** Freelance Software Engineer, Designer, Marketing Consultant
- **Company Size:** Self-employed / 1–3 person micro-agencies
- **Day-to-Day Pain Point:** Stacks of crumpled paper receipts and digital screenshots from client lunches, travel, hardware, and SaaS subscriptions. Manually typing dates, vendors, tax amounts, and totals into spreadsheets wastes hours each tax season.
- **Trigger Event:** End-of-quarter tax filing or client invoice reimbursement deadline. Needs to extract 20 receipts in under 15 minutes.
- **Exact Search Phrases:**
  - "extract receipt details from image free"
  - "receipt ocr to json"
  - "scan receipt get tax and total"
  - "quick receipt parser for expense sheet"
- **Technical Skill Level:** Moderate (comfortable with spreadsheets, Notion, or simple JSON).
- **Objections / Hesitations:**
  - "Will it misread handwritten tips or faded thermal paper?"
  - "Is it going to charge me per page or lock my data behind a paywall?"
- **Desired Outcome:** Accurate receipt vendor, date, line items, and grand total extracted without manual typing.
- **Best Bot Entry Prompt:**
  `[Attaches photo of cafe receipt] /receipt Extract the vendor, date, subtotal, and tax.`
- **Best Follow-Up Prompt:**
  `Format this as a CSV row I can paste into Google Sheets.`
- **Cross-Sell Path:** $\rightarrow$ `English-To-SQL`: *"Want to query your yearly expenses? Paste your expense table into English-To-SQL to aggregate spending by vendor."*
- **Value Metric:** Hours saved per month on manual expense entry (2–4 hours).
- **Risk / Safety Concerns:** Ensuring personal payment card numbers or personal addresses are masked/redacted.

---

### Segment 1.2: Small Business Bookkeepers & Accountants
- **Role / Job Title:** In-house Bookkeeper, Accounting Clerk, Fractional CFO
- **Company Size:** 5–50 employees (Retail, Hospitality, Professional Services)
- **Day-to-Day Pain Point:** Ingesting paper invoices and vendor bills containing GSTIN/tax IDs. Arithmetic errors in manual transcription cause reconciliation mismatches.
- **Trigger Event:** Monthly GST/VAT filing deadline or bank reconciliation cycle.
- **Exact Search Phrases:**
  - "GST invoice OCR scanner"
  - "invoice data extraction example json"
  - "automated receipt total reconciliation tool"
  - "verify invoice tax rate ocr"
- **Technical Skill Level:** Low to Moderate (Accounting software like QuickBooks, Xero, Tally).
- **Objections / Hesitations:**
  - "If the OCR makes a mistake, will I get audited?"
  - "Does it check if the math actually adds up?"
- **Desired Outcome:** Verified extraction with explicit confidence indicators and arithmetic reconciliation flags ($Subtotal + Tax == Total$).
- **Best Bot Entry Prompt:**
  `[Attaches invoice image] Extract invoice number, GSTIN, line items, CGST, SGST, and grand total.`
- **Best Follow-Up Prompt:**
  `Verify whether the printed subtotal and tax amounts equal the total.`
- **Cross-Sell Path:** $\rightarrow$ `English-To-SQL`: *"Have multiple invoice records? Use English-To-SQL to detect duplicate billing or tax variance."*
- **Value Metric:** Zero bookkeeping discrepancies; faster audit prep.
- **Risk / Safety Concerns:** Financial accuracy liability; compliance with local tax invoice rules.

---

### Segment 1.3: Operations & Logistics Leads (Reconciliation)
- **Role / Job Title:** Operations Specialist, Supply Chain Coordinator, FinOps Analyst
- **Company Size:** 50–500 employees (E-commerce, Delivery, Manufacturing)
- **Day-to-Day Pain Point:** Reconciling physical delivery receipts, fuel bills, and vendor statements against ERP purchase orders.
- **Trigger Event:** Audit flag, vendor payment dispute, or supplier statement mismatch.
- **Exact Search Phrases:**
  - "bank statement table extraction ocr"
  - "reconcile receipt line items with po"
  - "convert paper statement to structured table"
  - "high confidence document ocr"
- **Technical Skill Level:** Moderate to High (ERP systems, Python scripts, SQL databases).
- **Objections / Hesitations:**
  - "Most OCR tools hallucinate line items on blurry phone photos taken by drivers in the field."
- **Desired Outcome:** Blurry photos rejected upfront; clear line items, quantities, and unit prices cleanly parsed into JSON.
- **Best Bot Entry Prompt:**
  `[Attaches bill image] /statement Extract transaction rows with date, description, debit, credit, and running balance.`
- **Best Follow-Up Prompt:**
  `Flag any rows where the confidence score is below 90%.`
- **Cross-Sell Path:** $\rightarrow$ `Regex-Gen-Tester`: *"Need to validate tracking numbers and vendor codes? Generate regex filters with Regex-Gen-Tester."*
- **Value Metric:** Days Sales Outstanding (DSO) reduction and supplier dispute resolution speed.
- **Risk / Safety Concerns:** Confidential supplier pricing exposure.

---

## Part 2: Regex-Gen-Tester ICPs

### Segment 2.1: Full-Stack & Frontend Software Developers
- **Role / Job Title:** Software Engineer, Web Developer, Frontend Engineer
- **Company Size:** All sizes (Freelance to Enterprise)
- **Day-to-Day Pain Point:** Writing regular expressions for form validation (custom phone numbers, postal codes, password policies, slugs). Developers waste 30–45 minutes battling escaping rules, lookaheads, and edge-case bugs.
- **Trigger Event:** Building a new sign-up flow or data import pipeline and discovering edge-case validation bugs.
- **Exact Search Phrases:**
  - "regex generator with test cases online"
  - "safe regex generator plain english"
  - "email regex tester with capture groups"
  - "regex for international phone numbers"
- **Technical Skill Level:** High (JavaScript/TypeScript, Python, Go).
- **Objections / Hesitations:**
  - "AI-generated regex usually breaks on edge cases or introduces catastrophic backtracking."
- **Desired Outcome:** Immediate regex pattern with proof of live execution on positive and negative samples, plus capture group breakdown.
- **Best Bot Entry Prompt:**
  `Match international E.164 phone numbers with optional country code. Sample: +14155552671 Sample: 0987654321 Sample: invalid-phone`
- **Best Follow-Up Prompt:**
  `Show this pattern in TypeScript with named capture groups.`
- **Cross-Sell Path:** $\rightarrow$ `English-To-SQL`: *"Validating data before writing to your database? Use English-To-SQL to write your migration and schema constraints."*
- **Value Metric:** Engineering time saved (30 minutes per regex task); zero production validation outages.
- **Risk / Safety Concerns:** ReDoS attacks causing CPU freeze in Node.js/browser environments.

---

### Segment 2.2: QA Engineers & Test Automation Specialists
- **Role / Job Title:** SDET, QA Automation Engineer, Test Lead
- **Company Size:** 20–1000 employees
- **Day-to-Day Pain Point:** Creating assertion patterns for test data generators, verifying API response payloads, and validating regex assertions in Cypress, Playwright, or Postman.
- **Trigger Event:** Writing regression test suites for newly launched microservices.
- **Exact Search Phrases:**
  - "regex tester with sample table"
  - "test regex against multiple strings online"
  - "regex pattern assertion generator for test automation"
  - "regex negative lookahead example tester"
- **Technical Skill Level:** Moderate to High (Automation scripting, CI/CD).
- **Objections / Hesitations:**
  - "Online testers require me to copy-paste one sample at a time."
- **Desired Outcome:** Batch validation of 5–10 sample strings simultaneously with pass/fail indicators and microsecond execution benchmarks.
- **Best Bot Entry Prompt:**
  `Match UUID v4 strings. Sample: c9bf9e57-1685-4c89-bafb-ff5af830be8a Sample: not-a-uuid Sample: 12345`
- **Best Follow-Up Prompt:**
  `Add 3 edge-case samples that test invalid hex characters.`
- **Cross-Sell Path:** $\rightarrow$ `OCR-Doc-Bot`: *"Testing document intake pipelines? Check OCR-Doc-Bot to inspect raw layout confidence scoring."*
- **Value Metric:** Test coverage percentage and bug escape reduction.
- **Risk / Safety Concerns:** Flaky test assertions failing CI builds.

---

### Segment 2.3: Security Analysts & DevOps / SREs
- **Role / Job Title:** Security Engineer, DevSecOps Analyst, Site Reliability Engineer
- **Company Size:** 50–5000+ employees
- **Day-to-Day Pain Point:** Parsing massive log streams in Datadog, CloudWatch, or Splunk; crafting detection rules for API key leaks, JWT tokens, AWS ARN IDs, and SQL injection probes without crashing log parsers via ReDoS.
- **Trigger Event:** Log ingestion bottleneck, SIEM alert rule creation, or security audit remediating regex DoS vulnerabilities.
- **Exact Search Phrases:**
  - "regex catastrophic backtracking checker"
  - "safe regex for aws arn extraction"
  - "regex to detect api keys in logs"
  - "linear time regex validator"
- **Technical Skill Level:** High (Systems, networking, security engineering).
- **Objections / Hesitations:**
  - "If I put an unverified regex in our log pipeline, it will cause 100% CPU lockups on high-throughput ingress."
- **Desired Outcome:** Provably safe, non-backtracking regular expressions with guaranteed linear evaluation time.
- **Best Bot Entry Prompt:**
  `Extract bearer tokens from Authorization headers safely. Sample: Bearer eyJhbGciOi... Sample: Basic dXNlcjpwYXNz`
- **Best Follow-Up Prompt:**
  `Analyze this pattern for catastrophic backtracking risks.`
- **Cross-Sell Path:** $\rightarrow$ `English-To-SQL`: *"Querying security audit logs stored in an analytical warehouse? Use English-To-SQL to filter threat patterns."*
- **Value Metric:** Zero log ingest downtime; 100% detection of malformed requests.
- **Risk / Safety Concerns:** Denial of Service caused by unconstrained regex execution.

---

## Part 3: English-To-SQL ICPs

### Segment 3.1: Data Analysts & Business Intelligence Specialists
- **Role / Job Title:** BI Analyst, Product Analyst, Revenue Operations Analyst
- **Company Size:** 10–500 employees
- **Day-to-Day Pain Point:** Stakeholders demand ad-hoc reports involving complex window functions, multi-table joins, and cohort aggregations. Writing and debugging syntax errors in unfamiliar dialects consumes entire afternoons.
- **Trigger Event:** Executive request for monthly recurring revenue (MRR) retention, churn cohorts, or multi-touch attribution.
- **Exact Search Phrases:**
  - "english to sql with schema online"
  - "sql query generator and runner"
  - "convert natural language to sql with test data"
  - "generate sql join query from create table"
- **Technical Skill Level:** Moderate (Familiar with SQL concepts, struggling with complex window functions or CTEs).
- **Objections / Hesitations:**
  - "ChatGPT gives me SQL queries that look right but fail immediately in Postgres or Snowflake because of missing GROUP BY columns or dialect differences."
- **Desired Outcome:** Syntactically verified SQL that has already executed against an in-memory database and returned correct sample results.
- **Best Bot Entry Prompt:**
  `CREATE TABLE orders (id INT, user_id INT, amount DECIMAL, created_at DATE); CREATE TABLE users (id INT, plan VARCHAR); Show the average order value per plan for orders placed in 2024.`
- **Best Follow-Up Prompt:**
  `Rewrite this using a Common Table Expression (CTE) and add window ranking.`
- **Cross-Sell Path:** $\rightarrow$ `Regex-Gen-Tester`: *"Cleaning messy user input columns before SQL import? Use Regex-Gen-Tester to build sanitization rules."*
- **Value Metric:** Faster ad-hoc reporting turnaround (from 4 hours to 15 minutes).
- **Risk / Safety Concerns:** Query performance on production tables; accidental table locks.

---

### Segment 3.2: Non-Technical Founders & Product Managers
- **Role / Job Title:** Early-stage Startup Founder, Technical Product Manager, Growth Lead
- **Company Size:** 2–20 employees
- **Day-to-Day Pain Point:** Has access to a database replica or CSV export, but does not know SQL syntax well enough to answer critical business questions without bothering an engineer.
- **Trigger Event:** Board meeting preparation, investor pitch deck metrics, or evaluating a feature launch.
- **Exact Search Phrases:**
  - "write sql query for me from plain english"
  - "sql generator for non programmers"
  - "how to query database without knowing sql"
  - "ai sql query builder free"
- **Technical Skill Level:** Low (Basic logic, spreadsheet formulas).
- **Objections / Hesitations:**
  - "I don't know if the generated query is giving me the right numbers or if it's double-counting rows."
  - "I don't want to accidentally delete or alter data."
- **Desired Outcome:** Simple, plain-English question answering with a visual confirmation table proving the query worked, plus clear destructive warnings.
- **Best Bot Entry Prompt:**
  `CREATE TABLE signups (id INT, email TEXT, created_at DATE, converted BOOLEAN); What percentage of signups converted each month?`
- **Best Follow-Up Prompt:**
  `Explain what each line of this SQL query does in simple terms.`
- **Cross-Sell Path:** $\rightarrow$ `OCR-Doc-Bot`: *"Scanning paper receipts for your startup expenses? Use OCR-Doc-Bot to generate the table data."*
- **Value Metric:** Self-serve data independence; zero developer interruptions.
- **Risk / Safety Concerns:** Accidentally running a destructive `DELETE` or `UPDATE` statement.

---

### Segment 3.3: Computer Science Students & Junior Developers
- **Role / Job Title:** CS Student, Bootcamp Graduate, Junior Backend Developer
- **Company Size:** Individual / Junior entry-level
- **Day-to-Day Pain Point:** Learning relational algebra, mastering complex `LEFT JOIN` vs `INNER JOIN` logic, and preparing for technical database interviews.
- **Trigger Event:** Homework assignment, leetcode database problem, or preparing for an upcoming engineering interview.
- **Exact Search Phrases:**
  - "learn sql with real execution"
  - "sql query validator online free"
  - "debug sql query online sqlite"
  - "sql join visual examples with test table"
- **Technical Skill Level:** Beginner to Intermediate.
- **Objections / Hesitations:**
  - "Standard AI chat tools don't let me run the code to see if it actually works."
- **Desired Outcome:** Immediate execution feedback loop showing table states before and after the query, with detailed explanations.
- **Best Bot Entry Prompt:**
  `CREATE TABLE employees (id INT, name TEXT, salary INT, dept_id INT); Find the second highest salary without using LIMIT.`
- **Best Follow-Up Prompt:**
  `Show the query plan and explain why this subquery works.`
- **Cross-Sell Path:** $\rightarrow$ `Regex-Gen-Tester`: *"Preparing for coding interviews? Practice regex pattern matching with Regex-Gen-Tester."*
- **Value Metric:** Rapid conceptual mastery and interview readiness.
- **Risk / Safety Concerns:** Over-reliance on tools without understanding fundamentals.

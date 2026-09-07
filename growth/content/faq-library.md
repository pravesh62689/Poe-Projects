# Factual FAQ Library for Web Pages & Bot Descriptions

**Author:** Head of Product Marketing & Data Protection Officer  
**Scope:** Canonical questions and answers answering real user inquiries regarding technology, privacy, pricing, and limitations.

---

## 1. General & Studio FAQs

### Q1.1: Are these bots free to use?
**Answer:** Yes. You can use all three bots directly on Poe. Basic daily usage is supported under free Poe accounts. Subscribers with Poe points can execute high-volume queries with priority edge execution. There are no hidden software license fees or credit card requirements.

### Q1.2: Do your bots store my document images, code, or database schemas?
**Answer:** No. All three bots operate using ephemeral, stateless in-memory execution architectures:
- **OCR:** Image buffers are fetched into volatile server memory, processed through Tesseract and Sharp, and discarded immediately after response streaming.
- **Regex:** Patterns and test strings exist only inside a sandboxed V8 isolate for milliseconds during execution.
- **SQL:** Schemas and queries are compiled inside an ephemeral SQLite WebAssembly instance that is completely destroyed when the request completes.
No customer documents, test samples, or database rows are ever written to disk or used for AI model training.

### Q1.3: How do these bots differ from standard ChatGPT or Claude?
**Answer:** Standard LLMs predict answers based on statistical patterns; when presented with blurry receipts or complex code, they often hallucinate numbers or generate syntactically broken queries. Our bots combine language models with **real deterministic execution engines**:
- OCR-Doc-Parser runs real computer vision with blur gating and arithmetic verification.
- Regex-Gen-Tester actually compiles and runs the regex against your sample strings in real time.
- English-To-SQL seeds a live in-memory SQLite database, runs the query, verifies the results table, and auto-corrects runtime errors.

---

## 2. OCR-Doc-Parser FAQs

### Q2.1: What image formats and sizes are supported?
**Answer:** We support JPEG, PNG, WebP, and TIFF image formats up to 10MB in file size. Multi-page PDFs are not currently supported; we recommend taking a direct phone photograph or screenshot of each individual page.

### Q2.2: Why was my image rejected for "Laplacian blur"?
**Answer:** To protect the integrity of your accounting records, our system includes a pre-OCR sharpness gate. If an image has severe camera motion blur or lens defocus ($s < 120$), character recognition accuracy plummets. Rather than returning hallucinated numbers, the bot alerts you immediately so you can retake a crisp photo.

### Q2.3: Does the bot support Indian tax invoices with GSTIN?
**Answer:** Yes. OCR-Doc-Parser includes dedicated regex parsers for 15-character Indian GSTIN identifiers, complete with state code validation, as well as line-item breakdowns for CGST, SGST, and IGST.

---

## 3. Regex-Gen-Tester FAQs

### Q3.1: What is a ReDoS vulnerability and how does the bot detect it?
**Answer:** Regular Expression Denial of Service (ReDoS) occurs when a pattern containing nested quantifiers (e.g. `(a+)+$`) evaluates a non-matching string. The regular expression engine enters catastrophic backtracking, consuming 100% of the CPU. Regex-Gen-Tester runs a heuristic AST analysis to detect nested repetition loops and halts execution if evaluation takes longer than 50ms.

### Q3.2: Can I export generated regex patterns into my programming language?
**Answer:** Yes. Every pattern response includes tested copy-paste snippets for TypeScript/JavaScript, Python (`re` module), and Go (`regexp` package), including necessary flag adjustments.

---

## 4. English-To-SQL FAQs

### Q4.1: Can English-To-SQL connect directly to my live production PostgreSQL/MySQL database?
**Answer:** No. For security and privacy reasons, English-To-SQL does not make outbound network connections to private databases. Instead, you paste your table schema (`CREATE TABLE ...`) and optional sample rows into the chat. The bot creates an identical in-memory SQLite sandbox, verifies that the query works, and gives you the tested SQL to run in your own environment.

### Q4.2: What happens if the generated SQL has a syntax error?
**Answer:** The bot includes an automated self-correction loop. If SQLite throws a syntax or column error during execution, the error message is fed back into the engine, which automatically retries with corrected logic before presenting the final verified query.

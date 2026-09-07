# 48-Hour Controlled Experimentation Plan

**Standard:** Enterprise Growth & Experimentation Governance  
**Duration:** 48 Hours Post-Launch  
**Target:** Maximize Qualified Successful Tasks Completed (QSTC) across OCR, Regex, and SQL bots.

---

## 1. Experimentation Governance & Ethical Guardrails

In strict accordance with enterprise truthfulness rules:
1. **Zero Misrepresentation:** No experiment may promise unsupported capabilities, fabricate benchmarks, or hide product limitations.
2. **Zero Safety Degradation:** No variant may remove ReDoS warnings, disable Laplacian blur rejection, or silence SQL destructive-query alerts.
3. **Zero Organic Manipulation:** No fake accounts, simulated traffic, or synthetic bot messages may be used to inflate metrics.
4. **Automated Rollback:** If any test variant causes an error rate increase $> 20\%$ or a latency increase $> 15\%$, it is immediately aborted and reverted to Control.

---

## 2. The 5 Targeted 48-Hour Experiments

### Experiment 1: OCR Onboarding — Generic Greeting vs. Direct Upload Instruction
- **Target Bot:** `OCR-Doc-Parser`
- **Hypothesis:** Direct, action-oriented onboarding prompt ("Attach receipt image...") reduces turn-1 confusion and increases first-task completion compared to a generic welcome greeting.
- **Control (Variant A):** "Welcome to OCR Doc Parser. I can extract text and tables from your receipts and invoices. What would you like to process?"
- **Variant B (Direct Action):** "Attach a photo of your receipt or invoice now. Tip: Keep all 4 corners visible and avoid flashlight glare for accurate totals."
- **Primary Metric:** First Successful Extraction Rate ($\text{Successful Extractions} / \text{First Turns}$).
- **Guardrails:** Error rate $< 5\%$, Low-confidence field rate $< 10\%$, P95 latency $< 5\text{s}$.

### Experiment 2: Regex Onboarding — Explanation-First vs. Tested-Result-First
- **Target Bot:** `Regex-Gen-Tester`
- **Hypothesis:** Presenting an immediate runnable test pattern and execution table increases the rate of users providing structured test strings by $> 30\%$.
- **Control (Variant A):** Describes regex capabilities, flags, and engine syntax in paragraphs before asking for requirements.
- **Variant B (Result-First):** Shows a copy-paste prompt template with test strings (`alex@domain.com (valid)`, `invalid (invalid)`) followed immediately by execution results.
- **Primary Metric:** First Valid Sample Submission Rate ($\text{Turns with test strings} / \text{Total turns}$).
- **Guardrails:** Unsafe pattern submissions, user syntax error rate $< 8\%$.

### Experiment 3: SQL Onboarding — Blank Prompt vs. Copyable Schema Template
- **Target Bot:** `English-To-SQL`
- **Hypothesis:** Providing an immediately runnable `CREATE TABLE` and `INSERT` snippet in turn 1 prevents "missing schema" errors and increases query success on the first turn.
- **Control (Variant A):** "Ask me any SQL question. Please provide your schema if you have one."
- **Variant B (Template-First):** Provides a 3-line pre-populated `CREATE TABLE employees (...)` block with a copyable analytical question.
- **Primary Metric:** Schema-Provided First-Message Rate ($\% \text{ of 1st turns containing valid DDL}$).
- **Guardrails:** SQLite syntax retry rate $< 10\%$.

### Experiment 4: Cross-Bot Workflow Handoff — Conditional Banner vs. No Handoff
- **Target Portfolio:** All 3 Bots
- **Hypothesis:** When a user completes an OCR receipt task, displaying a contextual handoff banner ("Want to query this expense in SQL? Copy this schema into @English-To-SQL") increases cross-bot adoption without annoying single-task users.
- **Control (Variant A):** Standard completion with no cross-bot promotion.
- **Variant B (Contextual Handoff):** Emits a single markdown code block with pre-formatted SQL DDL matching the extracted receipt fields, pointing to `@English-To-SQL`.
- **Primary Metric:** Cross-Bot Adoption Rate ($\% \text{ of users querying Bot B within 30 min of Bot A}$).
- **Guardrails:** Thumbs-down rating rate must not increase; user task completion must remain $\ge 90\%$.

### Experiment 5: Error Recovery Copy — Diagnosis-First vs. Generic Apology
- **Target Portfolio:** All 3 Bots
- **Hypothesis:** Providing an exact technical diagnosis (e.g. "Image was too blurry to read invoice total") with a specific remedy ("Take photo from 12 inches away under bright light") improves retry success over a generic "Sorry, I couldn't read that" message.
- **Control (Variant A):** "I encountered an error processing your request. Please try again."
- **Variant B (Diagnosis + Remedy):** "Extraction Error: The total was obscured by camera blur. Next action: Retake photo from directly above on a flat surface."
- **Primary Metric:** Successful Retry Rate after Initial Error ($\% \text{ of error sessions that achieve success within 2 turns}$).
- **Guardrails:** Multi-turn abandonment rate $< 25\%$.

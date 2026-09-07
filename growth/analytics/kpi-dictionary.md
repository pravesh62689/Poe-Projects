# Enterprise Growth KPI Dictionary & Metric Governance

**Author:** Head of Analytics & Performance Marketing  
**Scope:** Canonical definitions, mathematical formulas, data sources, and targets for all growth, conversion, and reliability metrics.

---

## 1. Primary & North-Star Metrics

### Weekly Successful Tasks Completed (WSTC) — North-Star Metric
- **Definition:** The total count of verified, non-error query responses delivered to unique user accounts within a rolling 7-day window.
- **Formula:**
  $$\text{WSTC} = \sum_{\text{day}=1}^{7} \text{Count}(\text{UniqueUsers with } \text{outcome} == \text{'success'})$$
- **Target:** $> 1,500$ WSTC across the three bots.
- **Source:** Privacy-safe telemetry aggregations.

---

## 2. Funnel Conversion Metrics

### First-Message Conversion Rate (FMCR)
- **Definition:** Percentage of users who view a bot's listing profile and initiate their first conversational turn.
- **Formula:**
  $$\text{FMCR} = \frac{\text{Unique Sessions with } \ge 1 \text{ User Message}}{\text{Total Bot Profile Page Views}} \times 100$$
- **Baseline:** 28.0% | **Target:** $> 35.0\%$

### Task Completion Rate (TCR)
- **Definition:** Percentage of submitted queries that result in a verified, usable structured output (not rejected by blur or syntax errors).
- **Formula:**
  $$\text{TCR} = \frac{\text{Queries with } \text{outcome} == \text{'success'}}{\text{Total Queries Submitted}} \times 100$$
- **Baseline:** 74.0% | **Target:** $> 85.0\%$

### Cross-Bot Handoff Rate (CBHR)
- **Definition:** Percentage of sessions where a user clicks or follows an emitted cross-bot recommendation link to a sibling bot within 30 minutes.
- **Formula:**
  $$\text{CBHR} = \frac{\text{Sessions Engaging } \ge 2 \text{ Studio Bots}}{\text{Total Active User Sessions}} \times 100$$
- **Baseline:** 8.5% | **Target:** $> 15.0\%$

---

## 3. Reliability & Operational KPIs

### Blur Gate Accuracy (BGA)
- **Definition:** Percentage of illegible or out-of-focus photographs ($s < 120$) correctly intercepted before entering OCR processing.
- **Formula:** 100% on test pack suite.

### ReDoS Prevention Rate (RPR)
- **Definition:** Percentage of exponential backtracking regex queries safely flagged or halted before exceeding Cloudflare Worker CPU limits.
- **Formula:** 100% on test pack suite.

### SQL Self-Correction Success Rate (SCSR)
- **Definition:** Percentage of queries with initial syntax errors that are successfully auto-corrected by the in-memory SQLite WASM retry loop.
- **Formula:**
  $$\text{SCSR} = \frac{\text{Queries Recovered on 2nd Attempt}}{\text{Queries Failing Initial Execution}} \times 100$$
- **Baseline:** 82.0% | **Target:** $> 90.0\%$

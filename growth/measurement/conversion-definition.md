# Conversion Event Definition & Measurement Framework

**Author:** Head of Analytics & Conversion Rate Optimization (CRO) Lead  
**Document Status:** Approved Enterprise Standard  
**Last Updated:** September 2026  
**Applicable Services:** `OCR-Doc-Parser` (`ocr-doc-bot`), `Regex-Gen-Tester` (`regex-bot`), `English-To-SQL` (`sql-bot`)

---

## 1. Governance & Truthfulness Invariant

In accordance with strict enterprise analytics governance:
1. **Zero Deceptive Metrics:** We do not label arbitrary chat messages or prompt hits as "conversions".
2. **Platform Evidence Requirement:** We do not claim "subscriptions" unless the Poe Creator Dashboard or Stripe payout API provides an explicit, measurable subscription/follower event.
3. **Privacy Invariant:** Conversion tracking measures aggregate, pseudonymous event counters. We strictly prohibit collecting or logging customer document images, raw OCR text, access keys, payment card details, bank account numbers, or national ID numbers.

---

## 2. Primary 48-Hour Conversion Metric

### **Metric Name:** Qualified Successful Tasks Completed (QSTC)

- **Exact Definition:** A single conversational turn wherein a unique user provides a valid task input (a decodable document image for OCR, an instruction with sample strings for Regex, or a valid SQL schema with an analytical question for SQL) and the bot successfully returns verified, usable structured output (HTTP 200, valid SSE event stream, no unhandled exceptions, and verified extraction or execution).
- **Why this is the North-Star:** On the Poe platform, user retention, follows, thumbs-up ratings, and point-monetization revenue derive directly from whether the bot reliably solved the user's immediate job-to-be-done on turn 1.
- **Formula:**
  $$\text{QSTC} = \sum_{u \in \text{UniqueUsers}} \mathbb{I}(\text{QueryOutcome}(u) == \text{'success'} \land \text{TaskValid}(u) == \text{true})$$
- **Data Source:** Server-side structured telemetry events (`event_name: bot_task_completed`, `outcome: success`) cross-validated with Poe Creator Dashboard message counters.
- **Collection Frequency:** Real-time event emission; aggregated hourly and daily.
- **Privacy Treatment:** Stored as categorical counters (`outcome`, `route`, `latency_bucket`). Zero prompt text or image payload persistence.
- **Automation Status:** Automated server-side emission.
- **Baseline Value:** 0 (Pre-campaign launch).
- **48-Hour Target Value:** 10–20 Qualified Successful Tasks Completed across the portfolio.
- **Confidence Level:** High (Deterministic server telemetry).

---

## 3. Secondary Conversion Metrics

| Metric Name | Exact Definition | Data Source | Frequency | Automation Status | Formula | Baseline | Target |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **Listing View to 1st Message (FMCR)** | Unique users who open the bot profile and send at least one message. | Poe Creator Analytics / Web Logs | Daily | Semi-Automated (Requires Poe dashboard export) | $\frac{\text{1st Messages}}{\text{Profile Views}} \times 100$ | Unmeasured | $> 30\%$ |
| **1st Message to QSTC Rate** | Ratio of first messages that yield a verified successful output without fatal errors. | Server Telemetry | Hourly | Fully Automated | $\frac{\text{QSTC}}{\text{1st Messages Received}} \times 100$ | 74.0% (Test Pack) | $> 80\%$ |
| **Poe Follower Acquisition** | Unique users clicking the "Follow" button on the bot profile. | Poe Creator Dashboard (`poe.com/creator`) | Daily | Manual / Dashboard Inspection | $\Delta \text{Followers}_{48\text{h}}$ | Unmeasured | 5–10 per bot |
| **Suggested Reply Adoption** | Percentage of completed responses where the user clicks an emitted suggested reply. | Poe Protocol Query Sequence Logs | Hourly | Fully Automated | $\frac{\text{Turns initiated via suggested reply}}{\text{Total completed turns}} \times 100$ | 0% (Newly wired) | $> 25\%$ |
| **Cross-Bot Handoff Rate** | Sessions where a user engages with Bot A, receives a handoff banner, and queries Bot B within 30 min. | Co-usage session telemetry | Daily | Fully Automated | $\frac{\text{Sessions with } \ge 2 \text{ Studio Bots}}{\text{Total Active User Sessions}} \times 100$ | 0% (Pre-launch) | $> 10\%$ |
| **7-Day User Retention** | Percentage of unique users returning to initiate a task 7 days after first interaction. | Poe Creator Cohort Data | Weekly | Semi-Automated | $\frac{\text{Active Users}_{t=7\text{d}}}{\text{Cohort Size}_{t=0}} \times 100$ | Unmeasured | $> 15\%$ |
| **Error / Rejection Rate** | Queries resulting in unhandled 5xx errors, blur gate rejections, or syntax errors. | Server Telemetry | Real-Time | Fully Automated | $\frac{\text{Failed Queries}}{\text{Total Queries Submitted}} \times 100$ | 0% (Clean tests) | $< 5\%$ |
| **P95 Latency** | 95th percentile response latency from request arrival to final SSE `done` event. | Edge Worker / Render Metrics | Real-Time | Fully Automated | P95($t_{\text{done}} - t_{\text{start}}$) | OCR: 4.36s, Reg: 35ms, SQL: 48ms | $< 5\text{s}$ (OCR), $< 100\text{ms}$ (Reg/SQL) |

---

## 4. Measurement Invariants & Human-Action Boundary

1. **Automated Collection:** All `bot_task_completed`, latency, and error metrics are emitted directly by the application runtime into structured logs.
2. **Human-Action Required:** Poe subscriber counts, follower counts, and monetization points must be verified manually via the Poe Creator Dashboard (`https://poe.com/creator`) as Poe does not provide an external webhook or API endpoint for creator financial data.

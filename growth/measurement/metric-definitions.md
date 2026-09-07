# Growth & Product Metric Definitions

**Classification:** MEASUREMENT FRAMEWORK  
**Scope:** Poe Platform Analytics, Public Website Metrics, Product Runtime Telemetry.  
**Strict Policy:** Never invent metrics (such as "viewers" or "impressions") that are not directly reported by underlying platform APIs or dashboard exports. Never infer followers or subscriptions without explicit platform signals.

---

## 1. Poe Platform Metrics

These metrics originate exclusively from the Poe Creator Studio dashboard or official CSV export:

| Metric Name | Dimension | Unit | Description | Data Collection Method |
| :--- | :--- | :--- | :--- | :--- |
| `unique_users` | Bot-level, Daily | Integer | Number of distinct human user accounts that initiated at least one conversation turn with the bot in the period. | Poe Creator Studio dashboard / CSV export |
| `messages` | Bot-level, Daily | Integer | Total query messages received by the bot from users. Excludes owner test messages. | Poe Creator Studio dashboard / CSV export |
| `followers` | Bot-level, Cumulative | Integer | Number of Poe user accounts that have clicked "Follow" or added the bot to their sidebar. | Poe Creator Studio profile / dashboard |
| `charges` | Bot-level, Daily | Integer | Count of billable message transactions triggered under Poe's compute points / revenue-sharing mechanism. | Poe Creator Studio earnings tab |
| `estimated_earnings` | Bot-level, Daily | USD ($) | Estimated creator payout calculated by Poe based on compute points, paywall settings, or subscription revenue share. | Poe Creator Studio earnings tab |

*Note on "Viewers":* The Poe platform does not currently expose profile viewer counts or impressions. Any report claiming viewer metrics is considered fraudulent or speculative.

---

## 2. Public Website Metrics

These metrics originate from Cloudflare Pages Web Analytics and client-side privacy-safe Beacon telemetry on `https://apex-forge-tools.pages.dev`:

| Metric Name | Dimension | Unit | Description | Collection Method |
| :--- | :--- | :--- | :--- | :--- |
| `page_views` | Page-level, Daily | Integer | Total HTTP page requests served to human visitors (excluding search crawler bots). | Cloudflare GraphQL Analytics API |
| `unique_visitors` | Site-level, Daily | Integer | Estimated distinct client IP/UA combinations over a 24-hour window (anonymized at Cloudflare edge). | Cloudflare GraphQL Analytics API |
| `top_referrers` | Domain-level | List | Inbound referrer headers (e.g. `google.com`, `github.com`, `reddit.com`). | Cloudflare Web Analytics |
| `bot_cta_clicks` | Outbound CTA | Integer | Clicks on links targeting `poe.com/OCR-Doc-Bot`, `poe.com/Regex-Gen-Tester`, or `poe.com/English-To-SQL`. | Client beacon event (`cta_click`) |
| `page_to_poe_ctr` | Page-level | Percentage | `(bot_cta_clicks / page_views) * 100`. Measures conversion efficiency from informational guide to Poe bot activation. | Calculated daily |

---

## 3. Product Runtime & Trust Metrics

These metrics are collected statelessly at the edge worker / container runtime:

| Metric Name | Category | Unit | Description |
| :--- | :--- | :--- | :--- |
| `task_completion_rate` | Quality | Percentage | Percentage of queries that stream a valid output ending in SSE `done` event without error. |
| `arithmetic_reconciled_rate` | Quality (OCR) | Percentage | Percentage of receipt parses where `subtotal + tax = total` (within rounding tolerance). |
| `redos_rejection_rate` | Safety (Regex) | Percentage | Frequency of user-submitted regex patterns rejected by `safe-regex` AST validation. |
| `sql_retry_rate` | Reliability (SQL) | Percentage | Frequency of English-to-SQL generation queries requiring in-memory execution self-correction. |
| `latency_p90` | Performance | Milliseconds | 90th percentile end-to-end response streaming duration. |
| `cross_bot_handoff_shown` | Discovery | Integer | Count of responses where a contextual, non-intrusive handoff prompt was appended. |

---

## 4. Exclusion & Integrity Rules

1. **Owner Testing Filter:** Any test query executed by development or QA accounts (tagged via test headers or known test session IDs) must be marked `OWNER_TEST` and strictly excluded from customer acquisition metrics.
2. **Missing Data Transparency:** If creator metrics are unexported for a given date, the field must explicitly show `NOT_AVAILABLE` rather than `0` or interpolated numbers.

# Operational & Growth Alerting Specification

**Document:** `growth/analytics/alerts.md`  
**Standard:** Enterprise SRE & Growth Quality  
**Status:** Active Production Policy

---

## 1. Alerting Tiers & Thresholds

| Alert ID | Metric | Condition | Evaluation Window | Severity | Escalation / Automated Action |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **ALERT-P0-01** | OCR Total Discrepancy Rate | Unreconciled total discrepancy $> 10\%$ of tasks | 1 hour | **P0 (Critical)** | Halt promotional distribution; notify engineering lead; check OCR deskew pipeline |
| **ALERT-P0-02** | Live Endpoint Availability | Any bot `/health` returns non-200 or connection timeout | 3 consecutive probes (3 min) | **P0 (Critical)** | SRE incident trigger; check Render worker / Cloudflare Worker routing |
| **ALERT-P0-03** | Auth & Protocol Failure | SSE protocol error rate $> 5\%$ | 15 min | **P0 (Critical)** | Verify Poe access key secret rotation status |
| **ALERT-P1-01** | Latency Degradation | OCR P95 $> 8\text{s}$ OR Regex/SQL P95 $> 200\text{ms}$ | 30 min | **P1 (High)** | Check Render resource saturation or Cloudflare Worker CPU limits |
| **ALERT-P1-02** | Cold Start Spikes | OCR startup latency $> 30\text{s}$ | 1 hour | **P1 (High)** | Run keep-alive ping script to prevent container idle sleep |
| **ALERT-P2-01** | Conversion Dip | Hourly Qualified Successful Tasks completed drops $> 50\%$ vs 7-day trailing baseline | 4 hours | **P2 (Medium)** | Review experiment variant performance; check if prompt copy caused user drop-off |
| **ALERT-P2-02** | High Suggested Reply Abandonment | Suggested reply click rate $< 10\%$ | 24 hours | **P2 (Medium)** | Refresh contextual suggested reply options in `final-suggested-replies.json` |

---

## 2. Notification Channels (Zero Budget)

1. **GitHub Issues / Actions:** Automated daily smoke tests and health checks dispatch GitHub issues on failure.
2. **Discord / Slack Webhook:** Critical P0 alerts dispatch a lightweight JSON payload to an operations webhook.
3. **Automated Safe Rollback:** If any experiment variant causes error rates to double, the experiment flag automatically reverts to `control`.

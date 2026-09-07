# Price Change Operational Runbook

**Standard:** Commercial Operations & Change Management  
**Date:** September 2026

---

## 1. Pre-Change Verification Checklist (Must All Be TRUE)
- [ ] Bot has completed at least 100 qualified tasks under the current price setting.
- [ ] First-turn task success rate is $\ge 85\%$ over the trailing 7 days.
- [ ] No unresolved P0 or P1 customer-facing defects exist in `qa/live-growth-gate/reports/defects.md`.
- [ ] Thumbs-up / Thumbs-down rating ratio is $\ge 4.5 / 5.0$ in Poe Studio.
- [ ] Current contribution margin is positive or strategically justified.
- [ ] Pricing committee has approved the single variable change in `growth/pricing/pricing-decision-log.md`.

---

## 2. Step-by-Step Price Modification Execution

1. **Notify Team & Log Baseline:**
   - Record baseline 7-day daily message volume and QSTC rate in `growth/reports/conversion-funnel.csv`.
2. **Access Poe Creator Studio:**
   - Log into `https://poe.com/edit_bot?bot=<BotHandle>`.
3. **Update Monetization Field:**
   - Locate the form field: *"Earnings (USD per 1,000 messages)"*.
   - Enter the approved challenger price (e.g. from `$10.00` to `$12.00`).
   - Click **Save Changes**.
4. **Post-Change Verification:**
   - Open the bot profile in an incognito window and verify the updated compute points charge per message.
   - Send one test task to confirm message delivery and response streaming.

---

## 3. Mandatory Rollback Procedure

### Rollback Trigger Conditions (Any of the following within 48 hours):
- Daily task completion volume drops by $> 20\%$ compared to the trailing 7-day average.
- Negative feedback (thumbs-down) increases by $> 15\%$.
- Any customer reports billing/points deduction anomalies.

### Rollback Execution:
1. Re-open `https://poe.com/edit_bot?bot=<BotHandle>`.
2. Revert *"Earnings (USD per 1,000 messages)"* to the control value.
3. Click **Save Changes**.
4. Log the rollback event and post-mortem in `growth/pricing/pricing-decision-log.md`.

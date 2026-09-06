# PRICING.md — Monetization strategy for the 3 Poe bots

The form field is **"Earnings (USD per 1,000 messages)"** — the number you enter is literally
what you earn per 1,000 messages sent to the bot. Poe charges the sender the equivalent in
points, on top of any base model cost.

---

## 1. What the sender actually pays

`total points per message = base model cost + your fee`

| Bot | Base model cost (server_bot_dependencies) | So your fee is… |
|---|---|---|
| ocr-doc-bot | **~0** — pure on-server OCR, no upstream model | the entire price the user sees |
| regex-bot | Claude-3.5-Sonnet (~300–380 pts/msg) | a surcharge on top |
| sql-bot | Claude-3.5-Sonnet (~300–380 pts/msg) | a surcharge on top |

**The "doesn't feel expensive" ceiling:** Poe users are used to ~300–400 points per normal
message. Keep `base + fee` under roughly **2× a normal message** and engagement is unaffected.
That puts the fee ceiling around **$10–12 per 1,000 messages** for the Claude-backed bots, and
higher for the OCR bot since it has no base cost.

---

## 2. Competitor landscape on Poe

| Segment | Typical price (USD / 1,000 msgs) | Notes |
|---|---|---|
| Official / model-wrapper bots (Assistant, GPT-4o, Claude) | $0 or = compute cost | Poe rewards them via subscription economics, not per-message |
| Free utility bots (search, summarizers, simple tools) | **$0** | Volume play — monetise via the Creator Program bonus + brand |
| Indie text/utility bots that *do* charge | **$5–15** | The band successful niche bots sit in |
| Specialised expert bots (coding, legal, niche assistants) | $20–100 | Loyal narrow audience, low volume |
| Image / video generation wrappers | $100–2,000 | Each call is genuinely expensive |

Top solo creators reportedly earn $10k–30k/month — always either **huge volume at a low price**
or **dozens of bots**, rarely high price alone.

**Your bots are "indie utility bots that charge" → the $5–15 band, priced at the low end for
launch.**

---

## 3. The two strategies, and which one fits you

| | Volume play ($0–3) | Margin play ($20+) |
|---|---|---|
| Best when | no distribution, need ranking, broad appeal | established audience, narrow expert niche |
| Earning source | Creator Program bonus + later price | per-message fee |
| Risk | leaving money on the table | never getting enough volume to matter |

You have **zero users and zero distribution**, so you need volume to rank. But your audience is
**Poe subscribers** (already paying $20/mo, not sensitive to a sub-cent fee), and Poe's own tip
warns against *raising* prices later. So the right move is a **low price you can hold forever** —
not $0-then-raise (that raise is the exact churn trigger Poe warns about), and not $20 (kills
the volume you need).

---

## 4. Recommended prices (USD per 1,000 messages)

| Bot | **Launch — set and hold ≥6 months** | Ceiling (still feels cheap) | Floor — drop here only if 30-day viewer→first-message conversion < ~15% |
|---|---|---|---|
| **regex-bot** | **$6** | $10 | $3 |
| **sql-bot** | **$9** | $12 | $5 |
| **ocr-doc-bot** | **$7** | $14 | $4 |

**Why these:**
- **regex-bot $6** — burst usage (a user needs a few patterns then leaves), so earn per use;
  Claude cost already stacked under it, keep the surcharge light (~15–20% on top).
- **sql-bot $9** — highest repeat use and highest time-saved value (writing many queries against
  a real schema); analyst/dev audience is the least price-sensitive. Still only ~$0.009/message.
- **ocr-doc-bot $7** — no base model cost, so $7/1,000 (~$0.007/msg) is the *whole* price and
  still reads as cheap; OCR replaces tedious manual data entry, which is high-value. Priced a
  touch above regex because there's no Claude cost competing for the user's points.

To a Poe subscriber, all three are a rounding error. To you, they're real revenue from message 1.

---

## 5. Revenue math (realistic, label = estimate)

At the launch prices, per bot:

| Daily messages | Monthly revenue (that bot) |
|---|---|
| 50 (typical un-promoted bot) | $9–14 |
| 300 (ranked niche bot, steady promotion) | $54–81 |
| 1,500 (well-ranked, active promotion) | $270–405 |
| 10,000 (top-50 in its niche) | $1,800–2,700 |

**Realistic 6-month target if you execute the launch plan (SEO.md §5):** one bot doing ~500/day
+ two doing ~150/day ≈ **$250–450/month combined.** A breakout on any one bot adds $1–3k/month.
Poe's **Creator Program bonus** (paid on subscriber engagement your bots drive) stacks on top of
all of this and is not reflected in the table.

---

## 6. Rules

- **Never raise the price on an existing bot.** If you later want higher margin, publish a
  separate **"… Pro"** bot at the higher price with extra capability, and keep the original as
  the free-to-cheap funnel.
- **Lowering is safe** — do it if the conversion floor in §4 is hit.
- **Payouts:** Poe pays monthly above a minimum threshold (~$100 historically), via Stripe.
  India is Stripe-supported — but confirm creator payout eligibility in your Poe account
  settings before counting on it.
- **Review cadence:** check Poe creator analytics at day 30 and day 90. Only signal that should
  move a price is a weak viewer→first-message conversion (people see the bot, the price scares
  them off before trying). Volume alone is not a reason to change.

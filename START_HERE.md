# START HERE — the full execution guide

One document, in order. Do the phases top to bottom. Every value you need to type is in here.
Deep-dive detail lives in `POE_SETUP.md`, `SEO.md`, `PRICING.md`, `BRAND.md` — you only need
those if a step is unclear.

---

## How this works (read once, 60 seconds)

- You have **3 bots**: `ocr-doc-bot` (reads receipts/IDs → JSON), `regex-bot` (English → regex),
  `sql-bot` (English → verified SQL).
- The **servers are already live** on Cloudflare and Render. The code, the SEO text inside the
  bots, and the icons are all done.
- **What's left:** register the 3 bots on Poe, connect their keys, set a price, and promote them.
- **How you earn:** Poe charges the person messaging your bot; you get paid per 1,000 messages.
  More users → more messages → more money. Poe also pushes popular bots to new people
  automatically, so early growth compounds.

---

## Phase 0 — Confirm the starting point ✅ (already done, nothing to do)

| Thing | Status |
|---|---|
| 3 servers deployed + health-checked | ✅ live |
| SEO-optimised intro text inside each bot | ✅ shipped |
| Icons (`brand/*-1024.png`) | ✅ made |
| Keep-warm cron (stops the OCR bot going to sleep) | ✅ running |

Live URLs (you'll paste these into Poe in Phase 1):

```
ocr-doc-bot : https://poe-ocr-doc-bot.onrender.com
regex-bot   : https://poe-regex-bot.rathore-pravesh2002.workers.dev
sql-bot     : https://poe-sql-bot.rathore-pravesh2002.workers.dev
```

---

## Phase 1 — Create the 3 bots on Poe (you, ~20 min)

**Why:** until the bot exists on Poe, no one can find or message it.

Go to **[poe.com/create_bot](https://poe.com/create_bot)**. Do this **once per bot**, fully,
before starting the next one.

### Fill the form like this

| Field on the form | What to do |
|---|---|
| **Type** | `Server bot` |
| **Update image** | Upload the matching file from `brand/` (see table below) |
| **Name** | Type the first handle from the list below. If Poe says it's taken, try the next one. **This name is permanent.** |
| **Description** | Copy the whole block below for that bot and paste it |
| **Server URL** | Paste the URL for that bot (no slash at the end) |
| **Access key** | **Leave it. Don't touch Regenerate.** You will copy it after publishing. |
| **Check reachability / Run check** | Skip for now |
| **Access** | `Everyone` |
| **Related recommendations** | Leave **ON** (this is free promotion — Poe shows your bot on other bots' pages) |
| **Monetization → Earnings (USD per 1,000 messages)** | Type the price from the table below |
| **Publish** | Click it |

After you click Publish: open the bot's **edit page**, find the **Access key**, and copy it.
Write it down next to the bot name.

### Bot 1 — ocr-doc-bot

- **Image:** `brand/ocr-doc-bot-1024.png`
- **Name (try in order):** `OCR-Doc-Parser` → `Doc-OCR-Extract` → `Receipt-OCR-JSON` → `OCRDocParser`
- **Server URL:** `https://poe-ocr-doc-bot.onrender.com`
- **Price:** `7.00`
- **Description (paste):**

```
Extract clean, structured JSON from photos and scans of receipts, bank statements, and identity documents — with a confidence flag on every field so you always know what to trust.

WHAT IT DOES
Upload a photo or scan and OCR-Doc-Parser reads it, detects the document type, and returns the fields as JSON: vendor, date, tax, totals and line items for receipts; account holder, statement period and transactions for bank statements; name, number, date of birth and document type for IDs. Every value comes back with a "confidence": "high" or "low" marker, and low-clarity or handwritten text is flagged rather than silently guessed.

HOW TO USE
Attach an image and send. To force a specific parser, start your message with /receipt, /statement, or /id. Example: send "/receipt" with a photo of a shop bill and you get back the vendor name, date, tax and grand total as JSON.

BUILT-IN SAFEGUARDS
- Blur detection: images too blurry for reliable extraction are rejected with guidance to retake, instead of returning corrupted numbers.
- Auto-deskew: tilted or rotated scans are straightened before reading.
- Handwriting notice: the OCR engine is not tuned for handwriting, so handwritten values are returned with low confidence and a warning to verify manually.

DOCUMENTS SUPPORTED
Receipts and invoices (with GSTIN auto-correction for Indian tax IDs), bank and card statements, and Indian identity documents: PAN, Aadhaar, Passport, and Driving Licence.

GOOD FOR
Expense tracking and reimbursement, bookkeeping and GST data entry, digitising paper records, pulling transactions out of photo or PDF statements, KYC field capture, and any workflow where you currently retype numbers off a document by hand.

NOTES
Extraction quality depends on image quality — good lighting, flat framing and sharp focus give the best results. Always verify fields marked "low" confidence against the source document before relying on them.
```

### Bot 2 — regex-bot

- **Image:** `brand/regex-bot-1024.png`
- **Name (try in order):** `Regex-Generator` → `Regex-Gen-Tester` → `Regex-Builder-AI` → `RegexGenerator`
- **Server URL:** `https://poe-regex-bot.rathore-pravesh2002.workers.dev`
- **Price:** `6.00`
- **Description (paste):**

```
Describe the pattern you need in plain English and get a working regular expression — then see it actually run against your own test strings, with a full match report and a safety check for catastrophic backtracking (ReDoS).

WHAT IT DOES
Regex-Generator turns a description like "match email addresses" or "capture the date from a log line" into a regex, then executes that regex against every sample string you provide. You get back the pattern, a plain-English explanation of what it does, and a table showing, per sample: matched or not, the capture groups, and the execution time. No copy-paste-and-hope — you see the real result before you use it.

HOW TO USE
Write what you want to match, then add one "Sample:" line per test string. Example:

Match a URL with an optional http or https scheme.
Sample: https://example.com/path
Sample: example.com
Sample: not a url

You get the pattern plus a row for each sample showing exactly what it captured.

SAFETY
Every generated pattern is checked for catastrophic backtracking. If a pattern could hang on a malicious or unlucky input (the classic ReDoS problem, e.g. nested quantifiers like (a+)+), execution is halted on your samples and you get a warning explaining why — so you never ship a pattern that can freeze your service.

GOOD FOR
Validation rules for emails, phone numbers, URLs, dates, IP addresses and postcodes; extracting fields from logs and CSVs; search-and-replace patterns for your editor; cleaning or parsing text; and learning regex by seeing a described pattern built and explained.

NOTES
Patterns use JavaScript regex syntax. If you do not provide samples the pattern is still generated, but with a clear "not verified" disclaimer — always add samples so the bot can prove the pattern works.
```

### Bot 3 — sql-bot

- **Image:** `brand/sql-bot-1024.png`
- **Name (try in order):** `SQL-Query-Gen` → `Text-To-SQL` → `English-To-SQL` → `SQLQueryGen`
- **Server URL:** `https://poe-sql-bot.rathore-pravesh2002.workers.dev`
- **Price:** `9.00`
- **Description (paste):**

```
Give SQL-Query-Gen your table definitions and a question in plain English, and it writes the query, runs it against an in-memory SQLite database built from your schema, and only returns the query once it has actually executed successfully.

WHAT IT DOES
Paste your CREATE TABLE statements (and optional sample INSERT rows), then ask for what you want — "top 5 customers by total spend", "users who signed up last month but never ordered", "monthly revenue by category". The bot generates a candidate query, executes it against a real copy of your schema, and if it errors it reads the database error and self-corrects once before answering. You get the verified SQL, the result table, and the execution time.

HOW TO USE
Include your schema in the message. Example:

CREATE TABLE orders (id INT, customer TEXT, amount REAL, created_at TEXT);
INSERT INTO orders VALUES (1, 'Alice', 120.0, '2024-01-05');
INSERT INTO orders VALUES (2, 'Bob', 80.0, '2024-02-11');
Show total amount per customer, highest first.

SAFEGUARDS
- Verified by execution: a query that will not run is never presented as an answer; failures are reported honestly with the database error instead of a plausible-looking guess.
- Destructive-statement warnings: queries containing DROP TABLE or an unconditional DELETE / UPDATE are flagged before you run them anywhere real.
- Dialect note: queries are validated against SQLite semantics; a reminder is included when you may need to adjust date, string or window functions for PostgreSQL, MySQL or SQL Server.

GOOD FOR
Turning reporting questions into SQL, learning SQL by example, drafting queries against an unfamiliar schema, checking that a JOIN or GROUP BY does what you expect, and generating queries you can paste into your real database with confidence.

NOTES
The verification database is in-memory SQLite seeded only from the schema you provide, so results reflect your sample rows, not your production data. Provide representative CREATE TABLE statements for the best output.
```

### Done when

You have a note like this:

```
ocr-doc-bot | OCR-Doc-Parser  | key: ____________________
regex-bot   | Regex-Generator | key: ____________________
sql-bot     | SQL-Query-Gen   | key: ____________________
```

---

## Phase 2 — Connect the keys (Antigravity, ~5 min)

**Why:** Poe made its own key for each bot. The servers currently expect different keys. This
step makes them match.

Paste this to Antigravity, filling in your 3 rows from Phase 1:

```
Connect the Poe access keys to the deployments.

ocr-doc-bot | handle: <HANDLE> | key: <KEY>
regex-bot   | handle: <HANDLE> | key: <KEY>
sql-bot     | handle: <HANDLE> | key: <KEY>

1. Set POE_ACCESS_KEY to the key above for each deployment:
   - ocr-doc-bot: Render env var on service srv-dae79mgn74is73cm1050, then redeploy.
   - regex-bot: cd regex-bot && printf '%s' '<KEY>' | npx wrangler secret put POE_ACCESS_KEY
   - sql-bot:   cd sql-bot   && printf '%s' '<KEY>' | npx wrangler secret put POE_ACCESS_KEY
2. If any handle is NOT Regex-Generator / SQL-Query-Gen / OCR-Doc-Parser, update the @mention
   cross-links in all three introduction_message strings to the real handles, run `npm test`,
   commit, push, and redeploy.
3. For each bot run: curl -X POST https://api.poe.com/bot/fetch_settings/<HANDLE>/<KEY>
4. Then GET each /health and POST each / with {"type":"settings","version":"1.0"} and the
   Authorization: Bearer <KEY> header. Paste all results.
```

### Done when

Antigravity reports `/health` = 200 and the settings handshake returns the intro text for all 3.

---

## Phase 3 — Verify on Poe (you, ~10 min)

**Why:** confirm real users will get working replies.

1. For each bot: edit page → **Run check** (reachability) → must pass now.
2. Send each bot a real test message in Poe:
   - **OCR-Doc-Parser:** attach a photo of any receipt → expect a JSON block with confidence
     flags. Then attach a blurry photo → expect a "too blurry" warning.
   - **Regex-Generator:** send exactly:
     ```
     Match email addresses.
     Sample: test@example.com
     Sample: not-an-email
     ```
     → expect a pattern + a table showing one match, one no-match.
   - **SQL-Query-Gen:** send:
     ```
     CREATE TABLE users (id INT, name TEXT);
     INSERT INTO users VALUES (1, 'Alice');
     Show all users.
     ```
     → expect a verified query + a result table with Alice.
3. Check that follow-up suggestion chips appear after a successful answer.

### Done when

All 3 bots pass Run check and give a correct answer to their test message.

---

## Phase 4 — Polish (you, ~10 min)

**Why:** this is what makes people click and trust the bot.

- [ ] Each bot has its icon (not the default grey face)
- [ ] Each description reads well on the card at `poe.com/<handle>`
- [ ] Access = Everyone, Related recommendations = ON — on all 3
- [ ] Complete your **Poe creator profile**: profile photo, one-line bio
      (`Developer tools on Poe — verified SQL, regex, and document OCR.`), a link
- [ ] **Payouts:** account settings → enable monetization payouts → confirm India is eligible
      (it is via Stripe, but confirm in your account)

**Do not change the prices from here on.** Poe penalises price changes with lost users. The
$6 / $7 / $9 are set to hold. (Full reasoning: `PRICING.md`.)

---

## Phase 5 — Security (you, 2 min)

Rotate the three secrets you pasted in chat earlier — they may be in logs:

- GitHub: Settings → Developer settings → the token → **Regenerate** (or delete + make a new one)
- Render: Account Settings → API Keys → delete `rnd_…`, create a new one
- Cloudflare: My Profile → API Tokens → **Roll** the token

The 3 Poe access keys stay as they are.

**✅ At this point the bots are 100% LIVE. Everything below is growth.**

---

## Phase 6 — Launch (you, first 14 days — this decides if the bots grow or die)

**Why:** Poe's algorithm promotes bots that already have activity. It will not promote a bot
with zero messages. Your job for 2 weeks is to create the first wave of real usage by hand.
After that, the algorithm can take over.

**The one rule:** never fake messages or upvotes. Poe detects it and buries the bot.

### Day 1 — cross-use your own bots

Open Poe and have a real back-and-forth with **all three** bots in one session (use the test
messages from Phase 3, then keep going with follow-ups). Do this from any accounts of friends
who'll help too. **Why:** "people who used bot A also used bot B" is the exact signal that makes
Poe recommend your bots to each other's visitors.

### Day 1–3 — answer real questions (highest return, lowest spam risk)

Find **existing unanswered questions** and give a genuinely useful answer, then mention the bot
at the end. These posts keep pulling Google traffic for years.

- regex-bot → search Reddit `r/regex`, `r/learnprogramming` for "regex help" / "regex for";
  also Stack Overflow `[regex]` unanswered.
- sql-bot → `r/SQL`, `r/PostgreSQL`, `r/dataengineering` — "how do I write a query".
- ocr-doc-bot → `r/india`, `r/IndiaTax`, `r/smallbusiness` — "extract data from receipts /
  bank statement".

Reply template (paste, then edit to fit the question):

```
Here's how I'd approach it: [give the actual answer in 2–4 sentences].

If you do this often, I built a free Poe bot that does exactly this — [Bot-Handle] on Poe.
You describe what you want in plain English and it [one-line benefit]. Full disclosure, it's mine.
```

### Day 2–4 — one "I built this" post per bot

Post in a subreddit that **allows** project sharing (check its rules / weekly thread):
`r/SideProject`, `r/SaaS` (share-your-product thread), `r/InternetIsBeautiful` (only if it feels
polished).

Post template:

```
Title: I built a Poe bot that turns plain English into [regex / verified SQL / receipt JSON]

I kept [doing X manually / fighting with Y], so I built [Bot-Handle] on Poe.

- What it does: [one sentence]
- What's different: [the verification / safety feature — e.g. "it actually runs the SQL against
  your schema before answering" / "it executes the regex against your test strings" / "it flags
  low-confidence OCR fields instead of guessing"]
- Cost: a fraction of a cent per message on Poe.

Link: poe.com/[Bot-Handle]

Feedback welcome — it's early.
```

### Day 1–7 — free directory listings

Submit each bot (name, one-line description, link `poe.com/<handle>`, the icon):

- <https://theresanaiforthat.com/submit/>
- <https://www.futuretools.io/submit-a-tool>
- <https://aitoolhunt.com/submit>
- any "best Poe bots" list you can find (search that phrase)

### Day 5–9 — one bundled launch post

**Show HN** (<https://news.ycombinator.com/submit>) or a LinkedIn/X post:

```
Show HN: Three Poe bots for developers — regex, SQL, and document OCR, all self-verifying

Each one checks its own output before answering: the regex bot runs the pattern against your
samples, the SQL bot executes the query against an in-memory copy of your schema, the OCR bot
flags low-confidence fields. Links: poe.com/Regex-Generator · poe.com/SQL-Query-Gen ·
poe.com/OCR-Doc-Parser
```

### Day 7–14 — keep going

- Post a 15-second screen-recording of each bot working (X, LinkedIn, `r/SideProject`).
- Answer 3–5 more real questions per bot.

### Done when

Each bot has had **real conversations with 10+ different people** and a few thumbs-up. That's
the threshold where Poe's own discovery starts adding traffic on top of yours.

---

## Phase 7 — The growth loop (ongoing, ~30 min/week — this is the compounding part)

Do this every week. It's small, but it's what turns a flat line into an exponential one.

1. **Ship one visible improvement** to any bot (better wording, an extra example, a small
   feature). Redeploy, then re-run `fetch_settings`. **Why:** Poe rewards "recently updated".
2. **Answer 3–5 more real questions** across the communities. **Why:** steady backlink drip
   beats one big spike, and it compounds on Google.
3. **Check Poe creator analytics.** Look at *views → first message* for each bot.
   - Lots of views, few messages → the description isn't convincing. Rewrite the first line.
   - Steady messages → leave it alone and promote it more.
4. **Whichever bot is growing fastest, push it harder** — more posts, more answers in its
   niche. Let the other two ride the recommendation engine.

Why it compounds: more messages → higher search rank → more views → more messages. More users
of one bot → more recommendations for the other two → more users. Reviews pile up → higher
trust → higher conversion. Every week of effort feeds the next week.

---

## How long until real revenue? (realistic, honest)

This is a slow build. It is **not** passive income in month 1, and most bots that skip Phase 6–7
plateau under $50/month.

| Time | What's realistically happening | Revenue that month |
|---|---|---|
| **Week 1** | You create the bots and seed the first 50–100 messages by hand | **$0** |
| **Weeks 2–4** | Launch posts + directories bring a first trickle; you're still the main driver | **$0 – $15** |
| **Month 2** | If you kept up Phase 7, Poe's recommendations start adding organic users; ~200–1,000 messages/week across the 3 | **$10 – $60** |
| **Month 3–4** | One bot usually pulls ahead. First payout threshold (~$100 total earned) is typically crossed somewhere here — **your first actual payout** | **$40 – $150** |
| **Months 4–6** | If a bot has real traction (1,000–5,000 messages/week) and you're still promoting weekly | **$80 – $400** |
| **Months 6–12** | Compounding if effort continued; flat if you stopped at month 2. A bot that gets featured or goes mildly viral | **$200 – $800** typical; **$1,000 – $3,000** if one breaks out |

**What decides which end of the range you land on:**
1. **Bot quality** — do the answers actually save people time? (These three are solid.)
2. **Consistency** — 8+ weeks of the weekly loop, not a 2-week burst then silence. This is the
   #1 reason bots fail.
3. **Hitting the discovery threshold** in Phase 6 — 10+ real users per bot with good ratings.

**First payout: realistically 2–4 months out. Meaningful side income ($200+/month): 4–8 months
of steady weekly effort.** Poe also runs a separate Creator Program that pays based on how much
subscriber activity your bots drive — that can stack on top, but treat it as a bonus, not the plan.

---

## Quick reference — the order

```
Phase 1  Create 3 bots on Poe            you        20 min
Phase 2  Connect keys                    Antigravity  5 min
Phase 3  Verify + test on Poe            you        10 min
Phase 4  Polish + profile + payouts      you        10 min
Phase 5  Rotate secrets                  you         2 min   ← bots are LIVE
Phase 6  Launch (seed real usage)        you        14 days
Phase 7  Weekly growth loop              you        30 min/week, ongoing
```

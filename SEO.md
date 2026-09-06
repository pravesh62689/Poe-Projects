# SEO.md — Discoverability, Ranking & Earnings for the Poe Bots

Source of truth for bot names, descriptions, categories, intro copy, and the ranking
strategy. The deployment agent applies §3–§4 in code. You apply §3 in the Poe UI and run
§6–§9 yourself.

Bots: **ocr-doc-bot**, **regex-bot**, **sql-bot** — Poe server bots, upstream model reached
via `server_bot_dependencies: { "Claude-3.5-Sonnet": 1 }` (billed to the end user, not you).

---

## 1. How discovery turns into earnings on Poe

Money path: **Explore/search rank → conversations → active users → creator revenue.**

- Poe pays creators through the **Creator Monetization Program**: you set a per-message price
  in points; when Poe subscribers message your bot you earn a share. Revenue ≈
  `monthly active users × messages per user × your price share`.
- Every lever in this doc exists to raise one of those three multipliers.
- Upstream Claude cost is passed to the user automatically; your price is the margin you add.
- Enable monetization + payout in Poe creator settings (§9). Confirm your country is
  payout-eligible.

---

## 2. Two search surfaces

| | Poe internal (Explore + search bar) | External web (Google / Bing) |
|---|---|---|
| What it indexes | Handle, description, category, usage metrics | `poe.com/<Handle>` public page |
| Page title source | — | the bot handle |
| Snippet source | description | description |
| Body text | — | the **introduction message** renders here |
| Your control | handle, description, category, avatar, + all engagement metrics | handle, description, intro message, **backlinks only** — no meta-tag control |

Both surfaces reward the same core keyword in the handle. Optimise once, win twice.

---

## 3. Per-bot identity (apply verbatim)

Handle rules: letters, numbers, hyphens; no spaces; unique platform-wide; ~4–20 chars;
**permanent**. Try the candidates in order, claim the first free one, and tell the agent
which you took so it can fix the cross-links.

### 3.1 ocr-doc-bot

**Intent keywords:** receipt OCR · extract data from receipt · bank statement to JSON ·
bank statement parser · ID card / passport / Aadhaar / PAN OCR · document data extraction ·
OCR to JSON · invoice OCR · scanned document to structured data.

**Handle:** `OCR-Doc-Parser` → `Doc-OCR-Extract` → `Receipt-OCR-JSON` → `OCRDocParser` → `StructuredOCR`

**Category:** Productivity (fallback: Business / Utilities)

**Description** (~170 chars):
```
Extract structured JSON from photos of receipts, bank statements & ID cards (PAN, Aadhaar, passport, DL). Per-field confidence flags, blur detection and auto-deskew built in.
```

**"About" / long details** (if the form has the field):
```
OCR-Doc-Parser converts photos and scans of receipts, bank statements, and government ID
documents into clean, structured JSON. Every field carries a confidence flag so you know what
to trust; blurry images are rejected before they corrupt your data; tilted scans are
auto-deskewed. Indian documents supported: PAN, Aadhaar, Passport, Driving Licence, plus GSTIN
auto-correction on receipts. Attach a photo to start, or use /receipt, /statement, /id.
```

**Introduction message** (code — §4):
```
📄 **OCR-Doc-Parser** turns photos of **receipts, bank statements, and ID documents** into clean, structured JSON.

**Attach an image to start.** Every field comes back with a confidence flag, and blurry scans are caught before they corrupt your data.

**Commands:** `/receipt` · `/statement` · `/id` (PAN, Aadhaar, Passport, DL)

Need SQL or regex instead? Try @SQL-Query-Gen and @Regex-Generator.
```

**Suggested replies** (success path only):
`Extract the line items too` · `Return only the total and date` · `Explain the low-confidence fields`

### 3.2 regex-bot

**Intent keywords:** regex generator · regex builder · regex from english ·
natural language to regex · plain english regex · regex tester · regex explainer · AI regex ·
regex for email / phone / url / date.

**Handle:** `Regex-Generator` → `Regex-Gen-Tester` → `Regex-Builder-AI` → `RegexGenerator` → `Plain-English-Regex`

**Category:** Programming (fallback: Developer Tools)

**Description** (~175 chars):
```
Generate regex from plain English, then test it live against your samples. Match-report table with capture groups, execution timing, and a ReDoS catastrophic-backtracking guard.
```

**"About":**
```
Regex-Generator builds a regular expression from your plain-English description and then
actually runs it against the sample strings you give it — no guessing. You get the pattern, a
per-sample match table with capture groups and execution time, and a catastrophic-backtracking
(ReDoS) safety check that halts unsafe patterns. Try:  Match email addresses.  Sample:
hi@example.com  Sample: not-an-email
```

**Introduction message** (code):
```
⚡ **Regex-Generator** — describe the pattern you need in plain English and I'll build it *and* run it against your test strings in real time.

**Example:**
`Match email addresses.`
`Sample: hi@example.com`
`Sample: not-an-email`

You get the pattern, a per-sample match table with capture groups and timing, plus a catastrophic-backtracking (ReDoS) safety check.

Working with data? Try @SQL-Query-Gen and @OCR-Doc-Parser.
```

**Suggested replies** (success path only):
`Make it case-insensitive` · `Explain each part of this pattern` · `Add a sample that should NOT match`

### 3.3 sql-bot

**Intent keywords:** text to sql · english to sql · natural language to sql · sql generator ·
sql query generator · sql query builder · ai sql · write sql query for me · sql from schema.

**Handle:** `SQL-Query-Gen` → `Text-To-SQL` → `English-To-SQL` → `SQLQueryGen` → `Verified-SQL-Gen`

**Category:** Programming (fallback: Developer Tools)

**Description** (~200 chars):
```
Text-to-SQL that verifies itself. Give a schema + plain-English ask — I generate the query, run it against in-memory SQLite to confirm it works, auto-correct errors, and flag destructive statements.
```

**"About":**
```
SQL-Query-Gen turns plain English into SQL that is verified by execution. Paste your CREATE
TABLE statements (and optional sample INSERT rows), describe what you want, and the bot
generates the query, runs it against an in-memory SQLite copy of your schema, self-corrects
once if it errors, and warns about destructive statements (DROP TABLE, unconditional DELETE).
Results come back as a table with execution time and a dialect-portability note.
```

**Introduction message** (code):
```
📊 **SQL-Query-Gen** — turn plain English into SQL that's *verified by execution*.

Paste your `CREATE TABLE` statements (and optional sample `INSERT` rows), then describe what you want:

> _"Show the top 5 customers by total order value."_

I generate the query, run it against an in-memory SQLite copy of your schema, self-correct if it errors, and warn you about destructive statements.

Also useful: @Regex-Generator and @OCR-Doc-Parser.
```

**Suggested replies** (success path only):
`Add sorting and a LIMIT` · `Rewrite this as a JOIN` · `Show the EXPLAIN query plan`

---

## 4. Complete ranking-signal map

### 4.1 Poe internal ranking — every known signal, and your lever

| Signal | Weight | Your lever | Where set |
|---|---|---|---|
| Handle keyword match (exact > partial) | ★★★★★ | §3 handles | Poe `create_bot` (permanent) |
| Description keyword match | ★★★★ | §3 descriptions | Poe form (editable) |
| Category fit | ★★ | §3 categories | Poe form |
| All-time message volume | ★★★★ | usage — driven by everything below | — |
| Trailing 7/30-day active users | ★★★★★ | launch + backlinks (§6) | external |
| Messages per conversation (depth) | ★★★★ | suggested replies + intro that invites a follow-up | code (§4.2) |
| Return-user retention | ★★★★ | bot actually being useful + fast | code + §8 |
| Thumbs-up / feedback ratio | ★★★ | response quality; bot already ACKs `report_feedback` 200 | code |
| Follows / saves | ★★ | ask early users; good avatar | Poe + §6 |
| Link shares | ★★ | make output easy to share; cross-link bots | code (§3 intros) |
| Recency (creation) | ★★★ (decays ~2 wks) | spend the launch window deliberately (§6) | timing |
| Freshness (last updated) | ★★ | ship visible updates + re-Sync settings (§7) | ongoing |
| Response latency / error rate | ★★★★ (negative) | keep-warm cron; already-handled error paths | §8 |
| Creator profile completeness + reputation | ★★ | fill bio, avatar, link; ship all 3 bots well | Poe creator settings |
| @-mention / multi-bot usage | ★ | bots cross-reference each other | §3 intros |
| Editorial featuring | ★★★ (jackpot) | polished icon + copy → email Poe to be featured | manual |
| Spam / duplicate / keyword-stuffing | ★★★★★ (negative) | keep handle & copy readable; one bot per purpose | §3 |

### 4.2 Code levers (the deployment agent applies these — mechanics only here)

- **Introduction message** — set in `buildSettingsResponse({ introductionMessage })`:
  - ocr-doc-bot: [ocr-doc-bot/src/server.ts:42-44](ocr-doc-bot/src/server.ts#L42-L44) (GET) **and**
    [ocr-doc-bot/src/server.ts:65-67](ocr-doc-bot/src/server.ts#L65-L67) (POST — the one Poe reads).
    They currently disagree; set both to §3.1.
  - regex-bot: [regex-bot/src/worker.ts:60-61](regex-bot/src/worker.ts#L60-L61) → §3.2
  - sql-bot: [sql-bot/src/worker.ts:85-86](sql-bot/src/worker.ts#L85-L86) → §3.3
- **Suggested replies** — helper exists at [shared/poe-protocol-core/src/sse.ts:113](shared/poe-protocol-core/src/sse.ts#L113)
  (`sendSuggestedReply`) / [:31](shared/poe-protocol-core/src/sse.ts#L31) (`formatSuggestedReplyEvent`); **no bot uses
  it today.** Emit the 3 §3 values on the **successful** response path only (not on the
  "no image" / "no schema" / error paths), before the `done` event.
- After any intro-message change: redeploy **and** re-Sync on Poe (§10) — redeploy alone does
  not refresh what Poe shows.

### 4.3 External / Google ranking

| Signal | Action |
|---|---|
| Page title + snippet | = handle + description (§3) — already optimised |
| Indexed body text | = intro message (§3) — lead with the keyword |
| Inbound links (count + authority + anchor text) | §6 backlink list |
| Your own landing page ranking for the head term | build one page per bot, "Try on Poe →" CTA |
| Third-party mentions | genuine answers on Reddit / StackOverflow / Quora linking the bot |
| Brand queries | people googling the exact handle after hearing of it → keep handle memorable |

### 4.4 Poe's recommendation engine — "Related bots" (your biggest channel once it kicks in)

Separate from search. This is what surfaces your bot to people who never looked for it — the
"Related bots", "you might like", and on-other-bots'-pages placements. It is the compounding
channel; search just gets you the first users.

Primary signal: **co-usage** — *users who messaged bot A also messaged bot B* → B shows on A's
page and to A's users. Secondary: the **Related recommendations** toggle (must be ON — it's in
the create form), shared **category**, bot rating, recency.

Levers you control:

- **Related recommendations = ON** on all 3 (set at creation — POE_SETUP §A).
- **Cross-link the 3 bots in every intro message** (already in the code, §3) — this seeds
  co-usage *among your own bots* from day one, so they recommend each other before any outside
  traffic exists.
- **regex-bot + sql-bot in the same category** (Programming) — category adjacency.
- **First ~100 seeded conversations (§5): have each tester try 2–3 of your bots in one
  session** — that is a direct co-usage signal, not just volume.
- **Keep ratings high** — fast, error-free, useful responses. Low-rated bots are dropped from
  the recommendation pool entirely.

Net effect: ship the three as a set and cross-linked, and once *one* ranks, the recommender
pulls the other two up with it.

---

## 5. Launch protocol — first 14 days (this is what triggers the surge)

The recency boost + early active-user count decide whether the bot ever escapes page 5.

- **Day 0:** create all 3 bots; verify §10; enable monetization (§9) at a low price.
- **Day 0–1, seed real usage** (Poe detects fake traffic — do not bot it):
  - regex-bot → r/regex, r/learnprogramming, r/webdev "I built a tool that writes + tests regex from English"
  - sql-bot → r/SQL, r/PostgreSQL, r/dataengineering, r/Database
  - ocr-doc-bot → r/india + r/IndiaTax (GST/receipts), r/smallbusiness, r/datacurator, r/Accounting
  - Answer 3–5 *existing* unanswered questions in those subs / on StackOverflow genuinely, then mention the bot.
- **Day 1–3:** get ~10 people to hold a real multi-turn conversation with each bot and thumbs-up + follow.
- **Day 1:** submit to directories — theresanaiforthat.com, aitools directories, any "best Poe bots" lists.
- **Day 3–7:** one "Show HN" / Product Hunt post for the trio as a bundle ("3 developer bots on Poe").
- **Day 7:** publish the landing page(s); link each `poe.com/<Handle>` from the repo README and each bot's own README.
- **Day 7–14:** post a short demo GIF/video (Twitter/X, LinkedIn, r/SideProject).

---

## 6. Surge-maintenance protocol — ongoing

- **Ship a visible update every 1–2 weeks** and re-Sync settings → resets the freshness signal.
  Put a one-line "What's new" at the top of the intro message.
- Watch Poe creator analytics (views → first-message conversion). Pour launch effort into the
  bot that converts best; fix the description of the one that gets views but no messages.
- Add timely keywords to the description when relevant (e.g. "GST filing season" for the OCR bot).
- Keep every response fast and error-free — latency and errors are the fastest way to get
  demoted (§8).
- Keep the 3 bots cross-linked; every new bot you add should @-mention the others.
- Re-post genuinely helpful answers in communities monthly — steady backlink drip beats one spike.

---

## 7. Latency & reliability (ranking-critical, automated in deploy)

- **regex-bot / sql-bot** (Cloudflare Workers): no cold start. Nothing to do.
- **ocr-doc-bot** (Render free tier): spins down after 15 min idle; cold start ~50 s, which can
  trip Poe's response timeout and produce a failed first message — a severe first-impression
  and ranking hit.
  - The deploy adds a **Cloudflare Cron Trigger** on the regex-bot worker
    (`crons = ["*/10 * * * *"]`) that pings the Render `/health` endpoint every 10 minutes,
    keeping it warm 24/7 for free.
  - This consumes essentially all of one service's 750 free instance-hours/month — do **not**
    run a second always-on free Render service on the same account.
  - Fallback if the cron is removed: a free cron-job.org monitor hitting the same `/health` URL.

---

## 8. Monetization setup (you, in Poe)

1. Poe → Settings → **Monetization / Creator** → enable, complete payout details, confirm
   country eligibility.
2. For each bot set a **per-message price** in points. Start low (e.g. the smallest non-zero
   tier) — during launch, adoption > margin. Raise it once the bot has steady daily users.
3. The upstream Claude cost is added on top automatically and shown to the user; your price is
   your margin.
4. Revisit pricing monthly against active-user retention.

---

## 9. Connect / sync / verify

1. Deploy agent ships code + infra and hands you 3 live URLs + 3 access keys.
2. `poe.com/create_bot` → for each bot enter: handle (§3), description (§3), category (§3),
   avatar, **Server URL** (from the agent), **access key** (from the agent — the agent
   generated it; paste the matching one). Set "Allow attachments" **ON for ocr-doc-bot**, OFF
   for the other two. Create.
3. For each bot: `poe.com/<Handle>` → **Edit bot → Update / Sync** → confirms the
   `type: settings` handshake and pulls in the intro message + `server_bot_dependencies`.
4. Run the DEPLOY.md §4 functional smoke tests (image upload, regex execution, SQL execution).
5. A few days after launch: Google `site:poe.com <Handle>` and confirm title + snippet match.

---

## 10. Do-not list

- Don't keyword-stuff the handle or description past readability — Poe demotes/removes spammy bots.
- Don't create near-duplicate bots to cover more keywords — splits usage, triggers spam heuristics.
- Don't fake conversations or upvotes — detectable, and a removal risk.
- Don't change the handle after launch — it's permanent and every link/mention breaks.

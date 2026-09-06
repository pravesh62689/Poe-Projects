# POE_SETUP.md — Create the 3 bots on Poe (to 100% ready)

## Status

- Servers: **live and verified** (health 200 on all 3; settings handshake serves the SEO copy).
- Poe bots: **not created**. ~35 min of your work + one short Antigravity round-trip.

## Two facts about the form

1. **Access key** — the form pre-fills a 32-char key with a **Regenerate** button, but a key is
   only locked in when you click **Publish**. So: publish first, then copy the key from the
   bot's edit page, then put it on the server. (Antigravity does the server side in Step 2.)
2. **Check reachability → "Run check"** will fail until the server has the matching key. That's
   expected; Publish anyway, fix the key, then re-run the check.

---

## A. Every field on `poe.com/create_bot`

Fill these top to bottom, per bot. Per-bot values are in the tables further down.

| Field | What to do |
|---|---|
| **Type** * | `Server bot` |
| **Image** ("Update image") | Upload a 1024×1024 PNG icon — see §C. Do this; the default grey face kills click-through. |
| **Name** * | The handle. Try the candidates in order until one is free. Permanent. |
| **Description** (max 4000) | Paste the full block from the per-bot table below. First line = the hook; Google indexes this and the card shows the first ~150 chars, so keep the keyword first. |
| **Server URL** * | The per-bot URL below. **No trailing slash.** |
| **Access key** * | Leave the pre-filled value. **Do not Regenerate.** You'll copy the final key from the edit page after publishing. |
| **Check reachability** ("Run check") | Skip for now. Run it in Step 2 after the server has the key. |
| **Access** | `Everyone` (leave as-is — this makes it public and profile-listed). |
| **Related recommendations** | **Leave ON.** This makes your bot eligible to show on other bots' pages — free distribution, keep it. |
| **Monetization → Earnings (USD per 1,000 messages)** | regex-bot **$6**, sql-bot **$9**, ocr-doc-bot **$7**. Full analysis + revenue math in [PRICING.md](PRICING.md). Set it once and hold — Poe's tip warns that changing prices costs you users. |
| **Publish** | Click. The bot is created even if "Run check" would fail. |

### 1. ocr-doc-bot

| | |
|---|---|
| Name (try in order) | `OCR-Doc-Parser` → `Doc-OCR-Extract` → `Receipt-OCR-JSON` → `OCRDocParser` → `StructuredOCR` |
| Server URL | `https://poe-ocr-doc-bot.onrender.com` |
| Icon | 📄 on a solid indigo background |
| Description | *(paste)* |

```
Extract structured JSON from photos of receipts, bank statements, and ID documents. Upload an image and get parsed fields with per-field confidence flags.

OCR-Doc-Parser turns phone photos and scans into clean structured data. Every field carries a confidence flag so you know what to trust. Blurry images are detected and rejected before they corrupt your output, and tilted scans are auto-deskewed. Indian documents supported — PAN, Aadhaar, Passport, Driving Licence — plus GSTIN auto-correction on receipts.

How to use: attach a photo and send. Or force a parser with /receipt, /statement, or /id.
```

### 2. regex-bot

| | |
|---|---|
| Name (try in order) | `Regex-Generator` → `Regex-Gen-Tester` → `Regex-Builder-AI` → `RegexGenerator` → `Plain-English-Regex` |
| Server URL | `https://poe-regex-bot.rathore-pravesh2002.workers.dev` |
| Icon | ⚡ or `.*` on a solid amber/black background |
| Description | *(paste)* |

```
Generate regex from plain English and test it live against your own sample strings. Get the pattern, a match-report table with capture groups and timing, and a ReDoS safety check.

Regex-Generator writes a regular expression from your description, then actually executes it against the samples you provide — no guessing. Catastrophic-backtracking (ReDoS) patterns are detected and halted. Works for emails, phone numbers, URLs, dates, log lines, and more.

How to use: describe the match you want, then add samples like "Sample: test@example.com" on their own lines.
```

### 3. sql-bot

| | |
|---|---|
| Name (try in order) | `SQL-Query-Gen` → `Text-To-SQL` → `English-To-SQL` → `SQLQueryGen` → `Verified-SQL-Gen` |
| Server URL | `https://poe-sql-bot.rathore-pravesh2002.workers.dev` |
| Icon | 📊 on a solid green/black background |
| Description | *(paste)* |

```
Text-to-SQL that verifies itself. Give a schema plus a plain-English question and get a SQL query that has been executed against an in-memory SQLite database to confirm it works.

SQL-Query-Gen generates the query, runs it against an in-memory copy of your schema, self-corrects once if it errors, and warns you about destructive statements like DROP TABLE or an unconditional DELETE. Results come back as a table with execution time and a dialect-portability note.

How to use: paste your CREATE TABLE statements (and optional sample INSERT rows), then ask for the query you want in plain English.
```

---

## B. Execution plan → 100% ready

### Step 1 — Publish all 3 bots (you, ~15 min)

For each bot: fill §A top to bottom → **Publish**. Then open the bot's **edit page**, copy the
**Access key** shown there. Record a 3-row note:

```
bot           | final handle        | access key (from edit page)
ocr-doc-bot   | <handle you got>    | <key>
regex-bot     | <handle you got>    | <key>
sql-bot       | <handle you got>    | <key>
```

### Step 2 — One Antigravity round-trip (~5 min)

Paste that table to Antigravity plus:

> For each bot set its deployment's `POE_ACCESS_KEY` to the Poe key above — ocr-doc-bot: Render
> env var on service `srv-dae79mgn74is73cm1050` then trigger a redeploy; regex-bot and sql-bot:
> `printf '%s' '<key>' | npx wrangler secret put POE_ACCESS_KEY` in each bot dir. If any handle
> differs from `Regex-Generator` / `SQL-Query-Gen` / `OCR-Doc-Parser`, patch the `@mention`
> cross-links in all three `introduction_message` strings to the real handles, `npm test`,
> commit, push, redeploy. Then for each bot:
> `curl -X POST https://api.poe.com/bot/fetch_settings/<handle>/<key>` and paste the response.
> Then hit each `/health` and each `POST /` settings handshake and paste the results.

### Step 3 — In Poe, per bot (you, ~5 min)

- Edit page → **Check reachability → Run check** → must succeed now.
- Confirm the intro message and, for regex/sql, the `Claude-3.5-Sonnet` dependency show up.

### Step 4 — Functional test (you, ~10 min) — DEPLOY.md §4

- **OCR:** real receipt photo → JSON + confidence flags. Blurry photo → quality warning.
  `/id` + an ID photo → ID parser.
- **Regex:** `Match email addresses. Sample: a@b.com Sample: nope` → pattern + match table.
  No samples → "NOT been verified" disclaimer.
- **SQL:** a `CREATE TABLE` + a question → verified query + result table. No schema →
  "No SQL Schema Detected".

### Step 5 — Polish (you, ~10 min) — the "100%" checklist

- [ ] Icon on each bot (not the default face)
- [ ] Description reads well on the card at `poe.com/<handle>` (first line has the keyword)
- [ ] Access = Everyone, Related recommendations = ON, on all 3
- [ ] Intro message renders; `@mentions` resolve to your other two bots
- [ ] Suggested-reply chips appear after a successful answer
- [ ] Monetization price set (and left alone from here)
- [ ] Poe creator profile: photo, one-line bio ("developer tools — OCR, SQL, regex"), a link
- [ ] Payouts enabled in account settings; country confirmed payout-eligible

### Step 6 — Security (you, 2 min)

Rotate `GITHUB_TOKEN`, `RENDER_API_KEY`, `CLOUDFLARE_API_TOKEN` (pasted in chat earlier). The
3 Poe access keys stay.

### Step 7 — Confirm keep-warm (you, next day)

Cloudflare dash → Workers & Pages → `poe-regex-bot` → **Settings → Trigger Events / Cron** →
confirm a run about every 10 min (pings the OCR bot so it never cold-starts for a real user).

---

## C. Icons — direct download links

Poe crops to a circle. These are 512–618px PNGs, transparent background, free, no attribution
needed (Noto = Apache-2.0/OFL, OpenMoji = CC BY-SA 4.0).

| Bot | Pick | Direct download (right-click → Save) | Alternative style |
|---|---|---|---|
| ocr-doc-bot | 🧾 receipt | `https://fonts.gstatic.com/s/e/notoemoji/latest/1f9fe/512.png` | `https://openmoji.org/data/color/618x618/1F9FE.png` |
| regex-bot | ⚡ high voltage | `https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.png` | `https://openmoji.org/data/color/618x618/1F3AF.png` (🎯) |
| sql-bot | 📊 bar chart | `https://fonts.gstatic.com/s/e/notoemoji/latest/1f4ca/512.png` | `https://openmoji.org/data/color/618x618/1F9EE.png` (🧮) |

- **Want a solid-colour background** (reads better in Poe's dark UI): go to
  <https://favicon.io/emoji-favicons/> → search the emoji name → it renders the glyph large on
  a background you can recolour → download the 512px PNG.
- **Want polished flat vector icons instead:** <https://www.svgrepo.com/vectors/receipt/> ,
  `/regular-expression/` , `/database/` — CC0, download PNG/SVG.
- **Design rule:** one bold symbol, ≤2 colours, no small text (renders ~32px in lists). Keep
  the three in one visual style so they read as a set on your creator profile.

---

## Definition of "100% ready"

All Step 5 boxes ticked · Step 4 functional tests passed on all 3 · `fetch_settings` +
"Run check" green on all 3 · secrets rotated.

---

## Next: SEO (when you say go)

One Antigravity prompt that pushes discoverability with **no website and no existing users** —
Poe-internal ranking levers, the free Google-indexed `poe.com/<handle>` pages, a zero-cost
GitHub Pages one-pager per bot served from your existing repo, keyword-tuned README,
directory-submission text, and ready-to-post launch copy per community.

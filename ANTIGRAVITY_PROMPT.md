# ANTIGRAVITY_PROMPT.md

Full automated deployment. **Part A** = you do it once (5 min, browser). **Part B** = paste
into Antigravity. **Part C** = you do it after the agent stops (create Poe bots + launch).

---

## PART A — Prerequisites (you, before running the agent)

1. **GitHub repo** — create an **empty** repo at <https://github.com/new>:
   name `Poe-Projects`, owner `pravesh62689`, **no** README / .gitignore / license.
   - **Visibility:** *Public* recommended — the access keys are NOT in the repo, and Render
     deploys a public repo with zero extra setup. If you keep it *Private*, you must also go
     to <https://dashboard.render.com> → New → Web Service → connect GitHub → install the
     Render app on this repo (one-time OAuth) before the agent runs Phase 7.

2. **Cloudflare workers.dev subdomain** — <https://dash.cloudflare.com> → **Workers & Pages**.
   If it asks you to choose a subdomain, do it now. Note the value (e.g. `pravesh`) — your
   bots will live at `poe-regex-bot.<subdomain>.workers.dev`.

3. **GitHub token scope** — the PAT you generated needs **Repository permissions → Contents:
   Read and write** on `Poe-Projects`. (No "Workflows" scope needed — keep-warm runs on
   Cloudflare, not GitHub Actions.)

4. **Set these as secrets / env vars in Antigravity** (never commit them):

   | Name | Value |
   |---|---|
   | `GITHUB_TOKEN` | your `github_pat_…` |
   | `RENDER_API_KEY` | your `rnd_…` |
   | `CLOUDFLARE_API_TOKEN` | your `cfut_…` |
   | `CLOUDFLARE_ACCOUNT_ID` | `bb7b95717a0226b38f8c2da6163bd9dd` |
   | `CLOUDFLARE_WORKERS_SUBDOMAIN` | from step 2 |

5. **After the deployment succeeds, rotate all four secrets above** — they were pasted into a
   chat. The 3 Poe access keys the agent generates were never exposed; keep those.

---

## PART B — Paste this to Antigravity

```
ROLE: Senior release engineer. Deploy this npm-workspaces monorepo (3 Poe server bots) end
to end on branch `main`. STOP at Phase 9 and print the report — do NOT create Poe bots.

READ FIRST (repo root): AGENTS.md, SEO.md, DEPLOY.md, TESTING.md.

SECRETS (already in env — never print except the final key report, never commit):
GITHUB_TOKEN, RENDER_API_KEY, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID,
CLOUDFLARE_WORKERS_SUBDOMAIN.
GitHub repo: https://github.com/pravesh62689/Poe-Projects (empty).

GATE after every phase: `npm run typecheck && npm test` — all green before continuing.
Never weaken or skip a test to pass a gate; fix the root cause. `npm run lint` is not
configured at root — skip it.

PHASE 0 — Preflight
- `npm install`
- Run the gate. Inspect the pre-existing working-tree edits in
  regex-bot/test/adversarial.test.ts and sql-bot/test/adversarial.test.ts — keep if green,
  fix if not.

PHASE 1 — Repo hygiene (CRITICAL: compiled .js is committed inside regex-bot/src and
sql-bot/src and will shadow the .ts sources in the Cloudflare bundle)
- In regex-bot/src and sql-bot/src delete every file that has a sibling .ts: *.js, *.js.map,
  *.d.ts. Keep only *.ts.
- `git rm --cached` the tracked ones.
- Append to .gitignore:  **/src/**/*.js  and  **/src/**/*.js.map  and  **/src/**/*.d.ts
- Run the gate — proves TypeScript compiles cleanly without the stale JS.

PHASE 2 — SEO code changes (exact strings = SEO.md §3; rules = SEO.md §4.2)
- ocr-doc-bot/src/server.ts: set BOTH intro messages (GET /settings AND POST type:settings) to
  SEO.md §3.1. Import formatSuggestedReplyEvent; on the SUCCESS path only, before
  formatDoneEvent(), write the 3 §3.1 suggested replies. Do not touch the "no image" / error
  paths.
- regex-bot/src/worker.ts: intro = §3.2. On the SUCCESS path only, before stream.close(),
  stream.sendSuggestedReply() x3 (§3.2 values).
- sql-bot/src/worker.ts: intro = §3.3. On the SUCCESS path only (not the "No SQL Schema" /
  schema-error / fail paths), before stream.close(), stream.sendSuggestedReply() x3 (§3.3).
- In each bot's test/integration.test.ts, extend the settings-handshake test to assert
  introduction_message contains the bot's handle name.
- Run the gate.

PHASE 3 — Cloudflare config + keep-warm
- regex-bot/wrangler.toml AND sql-bot/wrangler.toml: DELETE the `[vars]` POE_ACCESS_KEY line
  (collides with the secret).
- regex-bot/wrangler.toml: add
      [triggers]
      crons = ["*/10 * * * *"]
      [vars]
      KEEPWARM_URL = "https://poe-ocr-doc-bot.onrender.com/health"
- regex-bot/src/index.ts: add a `scheduled` export alongside `fetch`:
  extend the env type locally with `KEEPWARM_URL?: string`; body:
  `if (env.KEEPWARM_URL) ctx.waitUntil(fetch(env.KEEPWARM_URL).catch(() => {}));`
  Use @cloudflare/workers-types (already a devDep) for ScheduledController / ExecutionContext.
- Run the gate.

PHASE 4 — Access keys
- Generate 3 URL-safe keys: node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"
- Label them POE_ACCESS_KEY_OCR, POE_ACCESS_KEY_REGEX, POE_ACCESS_KEY_SQL. Print only in the
  Phase 9 report.

PHASE 5 — Commit & push
- git add -A && git commit -m "chore: deploy prep — SEO copy, suggested replies, keep-warm, artifact cleanup

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
- git branch -M main
- git remote add origin https://x-access-token:${GITHUB_TOKEN}@github.com/pravesh62689/Poe-Projects.git
  (if origin exists: git remote set-url origin <same>)
- git push -u origin main

PHASE 6 — Deploy Cloudflare (regex-bot, sql-bot). env: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
- cd regex-bot && npx wrangler deploy
- printf '%s' "$POE_ACCESS_KEY_REGEX" | npx wrangler secret put POE_ACCESS_KEY
- cd ../sql-bot && npx wrangler deploy
- printf '%s' "$POE_ACCESS_KEY_SQL" | npx wrangler secret put POE_ACCESS_KEY
- Record URLs:
  https://poe-regex-bot.${CLOUDFLARE_WORKERS_SUBDOMAIN}.workers.dev
  https://poe-sql-bot.${CLOUDFLARE_WORKERS_SUBDOMAIN}.workers.dev
- Confirm each responds (Phase 9).

PHASE 7 — Deploy Render (ocr-doc-bot) via REST API. Bearer RENDER_API_KEY.
- The Render API create-service schema has changed across versions — fetch
  https://api-docs.render.com/reference/create-service and match the CURRENT field names.
- ownerId: GET https://api.render.com/v1/owners
- Create a web service:
    name: poe-ocr-doc-bot
    ownerId: <from above>
    repo: https://github.com/pravesh62689/Poe-Projects   branch: main   autoDeploy: yes
    runtime/env: node    plan: free    region: singapore
    buildCommand: npm install && npm run build --workspace=@poe-projects/poe-protocol-core && npm run build --workspace=@poe-projects/ocr-doc-bot
    startCommand: node ocr-doc-bot/dist/index.js
    envVars: NODE_ENV=production, PORT=10000, POE_ACCESS_KEY=<POE_ACCESS_KEY_OCR>
- If the API rejects repo access: the repo is private and not connected — STOP, tell the user
  to connect the Render GitHub app, then resume.
- Poll GET /v1/services/{id}/deploys until status == "live" (abort after ~15 min, report logs
  on failure). Capture the real service URL from GET /v1/services/{id}.

PHASE 8 — Reconcile keep-warm
- If the Render URL != https://poe-ocr-doc-bot.onrender.com : update KEEPWARM_URL in
  regex-bot/wrangler.toml, commit, push, then `cd regex-bot && npx wrangler deploy`.

PHASE 9 — Automated smoke tests. Print a pass/fail table. For each of the 3 base URLs:
- GET /health  → 200, body {"status":"ok"}
- POST /  headers: Authorization: Bearer <that bot's key>, Content-Type: application/json
  body: {"type":"settings","version":"1.0"}
  → 200; JSON has non-empty introduction_message; for regex-bot & sql-bot
    server_bot_dependencies["Claude-3.5-Sonnet"] == 1; ocr-doc-bot allow_attachments == true
- POST /  with Authorization: Bearer wrong-key  → 401
- ocr-doc-bot only: POST / (correct key) body
  {"type":"query","version":"1.0","query":[{"role":"user","content":"hi"}],
   "user_id":"u","conversation_id":"c","message_id":"m"}
  → SSE body contains the "No image attachment detected" prompt text

PHASE 9 REPORT — then STOP:
1. Table: bot | live URL | /health | settings handshake | 401 check
2. The 3 access keys, each next to its bot and server URL
3. Copy of SEO.md §3 identity blocks + §9 steps as the user's remaining manual work
Do not create Poe bots. Do not proceed past this point.
```

---

## PART C — After the agent stops (you)

1. **Create the 3 bots** at <https://poe.com/create_bot> ("Server bot"). For each, from the
   agent's report + SEO.md §3:

   | Field | ocr-doc-bot | regex-bot | sql-bot |
   |---|---|---|---|
   | Handle | SEO.md §3.1 | SEO.md §3.2 | SEO.md §3.3 |
   | Description / Category | §3.1 | §3.2 | §3.3 |
   | Server URL | agent report | agent report | agent report |
   | Access key | `POE_ACCESS_KEY_OCR` | `POE_ACCESS_KEY_REGEX` | `POE_ACCESS_KEY_SQL` |
   | Allow attachments | **ON** | OFF | OFF |

2. **Tell the agent which handles you claimed** (some candidates may be taken) so it can fix
   the `@mention` cross-links in the intro messages, recommit, and redeploy.

3. For each bot: `poe.com/<Handle>` → **Edit bot → Update / Sync**.

4. Run the **DEPLOY.md §4** functional smoke tests (image upload, regex run, SQL run).

5. **Enable monetization** — SEO.md §8. Set a low per-message price during launch.

6. **Launch** — follow SEO.md §5 (the 14-day protocol) and §6 (ongoing).

7. **Rotate** the GitHub / Render / Cloudflare secrets (Part A step 5).

# AGENTS.md — Poe Projects

Drop this file at the repo root (`poe-projects/AGENTS.md`). Antigravity reads it automatically (also honored by Cursor and Claude Code, so it doesn't fork if you switch tools later). Paste it as your first message in a new Antigravity workspace pointed at an empty `poe-projects` folder and let it scaffold from here.

## Mission

Build three independent Poe server bots, fully tested, ready to deploy on free-tier hosting. Zero paid dependencies anywhere. Correctness over speed — brute-force test every parsing path before considering any bot done.

## Fixed context — do not re-derive, do not question

- Budget: ₹0 recurring. Free-tier hosting only. No paid API keys, ever.
- Stack: Node.js + TypeScript. No Python.
- Protocol: Poe server-bot protocol — plain HTTP + Server-Sent Events. Spec: https://creator.poe.com/docs/poe-protocol-specification. Do not use the `fastapi_poe` Python library; implement the protocol directly.
- Each bot needs: a `settings` response (declares `allow_attachments` where relevant), Bearer-token auth check against `POE_ACCESS_KEY`, and streamed `text` / `error` / `file` SSE events per the spec.

## Project structure

```
poe-projects/
├── AGENTS.md                  (this file)
├── shared/
│   └── poe-protocol-core/     # shared TS package: SSE writer, auth middleware,
│                               # settings-response helper, request/attachment types
├── ocr-doc-bot/                # Render deployment — receipt/statement/ID routing
├── regex-bot/                  # Cloudflare Workers deployment
└── sql-bot/                    # Cloudflare Workers deployment
```

Four packages total: one shared library, three deployable bots. `ocr-doc-bot`, `regex-bot`, and `sql-bot` each depend on `shared/poe-protocol-core` — implement the protocol handshake once, not three times.

## shared/poe-protocol-core — build first

- SSE response writer: `text`, `error`, `file` events per spec, correct `event:`/`data:` framing.
- `settings` request handler: takes bot-specific options (e.g. `allow_attachments`), returns a valid `SettingsResponse`.
- Auth middleware: validates `Authorization: Bearer <POE_ACCESS_KEY>`, rejects with 401 on mismatch. Key read from env var, never hardcoded.
- Shared types for `QueryRequest`, `ProtocolMessage`, attachment objects.
- Unit tests for every exported function. No bot package should have to reimplement any of this.

## ocr-doc-bot (deploys to Render)

Purpose: extract structured data from receipt / bank-statement / ID-document images into JSON, with routing by document type.

- Runtime: Node/Express, imports `poe-protocol-core`.
- OCR: `tesseract.js`, self-hosted, no external API, no API key.
- Attachment handling: `allow_attachments: true`, `enable_image_comprehension: false` — fetch the attachment URL yourself, run it through Tesseract, do not let Poe's built-in vision path touch it.
- Three parsing modules, one per document type, each independently testable:
  - `parseReceipt(ocrText) -> { vendor, date, amount, gstin? }`
  - `parseBankStatement(ocrText) -> { transactions: [{date, description, amount, balance}] }`
  - `parseIdDocument(ocrText) -> { docType, name, idNumber, dateOfBirth? }`
- Route selection: explicit user command (`/receipt`, `/statement`, `/id`) or auto-detect from OCR text shape — build auto-detect, but let the user override.
- Uncertain fields: return them flagged (`{ value: "...", confidence: "low" }`), never silently guess. This is the entire competitive edge of this bot — do not compromise it for cleaner output.
- Test with real photographed receipts (not clean scans) before calling this bot done — Tesseract.js accuracy on skewed/low-light phone photos is the known risk; measure it, don't assume it.
- Deploy target: Render free web service. Include a `render.yaml` at the package root. Document the cold-start behavior (sleeps after 15 min idle) in the package README.

## regex-bot (deploys to Cloudflare Workers)

Purpose: generate a regex from a plain-English description, then actually execute it against user-supplied sample strings and show real matches — not just a generated pattern.

- Runtime: Cloudflare Workers — Web-standard `fetch`/`Request`/`Response`, not Express. Different server skeleton from the Render bots; still imports `poe-protocol-core` (must be runtime-agnostic — no Node-only APIs in the shared package).
- Core logic: parse the user's natural-language ask, generate a candidate pattern (via an LLM call — see "LLM assist" below), then run it with Node's/JS's native `RegExp` against every sample string the user provided. Return match/no-match per sample, not just the pattern.
- Handle pathological patterns defensively — reject or timeout-guard anything that risks catastrophic backtracking before it can hang the Worker.
- CPU budget: 10ms per request on the free tier. Keep the regex-execution path itself trivial; if pattern generation needs an LLM call, that's an outbound `fetch` (not counted against CPU time), not compute.
- Test cases: valid pattern + matching samples, valid pattern + non-matching samples, deliberately ambiguous asks, adversarial input designed to cause backtracking blowup.

## sql-bot (deploys to Cloudflare Workers)

Purpose: generate SQL from a schema + plain-English ask, then actually execute it against an in-memory copy of that schema before returning it.

- Runtime: Cloudflare Workers, same shared package as regex-bot.
- Core logic: user supplies `CREATE TABLE` statements (+ optionally sample rows). Generate SQL via LLM assist, then execute it against an in-memory engine (`sql.js`, pure WASM/JS, no external DB) seeded with the user's schema. If it errors, retry generation once with the error message as feedback; if it still fails, return the failure honestly rather than a query you haven't verified.
- CPU budget: same 10ms/request free-tier ceiling. Benchmark `sql.js` init + query time against a schema with 10+ tables and flag it if it's tight — this is the one bot where the free-tier limit is a real risk, not a theoretical one.
- Test cases: valid schema + valid ask, ambiguous ask (multiple reasonable interpretations), schema with foreign keys, intentionally broken schema input.

## LLM assist (regex-bot and sql-bot only)

Both bots need natural-language understanding before their deterministic step. Use Poe's own Bot Query API (`server_bot_dependencies`) to call another Poe-hosted model for that step — billed to the requesting user's Poe points, not to you. Do not call an external LLM API with your own key; that reintroduces a per-request cost you don't have budget for.

## Testing standard — applies to all four packages

- Framework: Vitest (zero cost, TypeScript-native).
- Every exported parsing/logic function gets unit tests covering: the happy path, empty input, malformed input, and at least one adversarial/edge case specific to that function.
- Each bot gets one integration test that simulates a real Poe protocol request end-to-end (settings handshake → authenticated query → correct SSE event sequence) using a mocked HTTP client — not just unit tests of the internals in isolation.
- Do not mark a package done with failing or skipped tests. No `.skip`, no `TODO` left in test files at hand-off.

## Engineering standards (cross-project — equivalent of house style)

- TypeScript strict mode on, no `any` without a comment justifying it.
- ESLint + Prettier, one shared config at the repo root, all four packages inherit it.
- Conventional commits (`feat:`, `fix:`, `test:`, `docs:`).
- Secrets (`POE_ACCESS_KEY` per bot) live in `.env` / platform env vars only — never committed, never logged, never hardcoded even in test fixtures.
- Every package ships its own `README.md`: what it does, env vars required, how to run tests locally, how to deploy.
- Keep files under ~300 lines and functions under ~10 cyclomatic complexity — split before that, don't refactor after.
- No new dependency without checking it has no paid tier requirement and no telemetry phoning home.

## Build order

1. `shared/poe-protocol-core` — fully tested first, since everything else depends on it.
2. `ocr-doc-bot` — highest priority to reach "ready to publish," per prior evaluation. Build and test to completion before moving on.
3. `regex-bot` and `sql-bot` — can be built in parallel once the shared package is stable.

## Explicit guardrails

- Do not deploy anything automatically. Scaffold, build, and test — stop before the actual `wrangler deploy` / Render push and hand control back for review of real credentials.
- Do not add a database, Redis, or any stateful store anywhere — none of these three bots need one (Poe sends full conversation history per request).
- Do not silently drop the "flag uncertain fields" behavior in ocr-doc-bot, or the "actually execute before returning" behavior in regex-bot/sql-bot, for the sake of simpler code. That behavior is the entire reason these ideas beat existing Poe bots — treat it as a hard requirement, not a nice-to-have.

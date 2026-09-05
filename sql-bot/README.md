# SQL Bot (`sql-bot`)

Generates SQL queries from a schema definition and plain-English intent, then executes the generated SQL against an in-memory SQLite WASM database (`sql.js`) to verify correctness and return real tabular data.

## Features
- **In-Memory SQL Execution & Verification**: Queries are executed against an in-memory `sql.js` instance populated with the user's `CREATE TABLE` and `INSERT` statements before being returned.
- **Single-Turn Self-Correction Loop**: If SQL execution throws a syntax error or constraint error, it automatically feeds the error diagnostic back to the LLM for a one-time repair retry. If it fails again, it honestly reports the error rather than returning unverified hallucinations.
- **Zero-Cost LLM Assist**: Uses Poe's `server_bot_dependencies` to query upstream models without maintaining external API keys or recurring subscriptions.
- **Cloudflare Workers Free Tier Compatible**: Pure WASM/JS SQLite engine requiring no external database infrastructure.

## Free Tier CPU Budget & Benchmark Findings
Cloudflare Workers Free Tier enforces a **10ms CPU execution ceiling**:
- In-memory `sql.js` initialization takes **~3–5ms** on modern V8 runtimes.
- Executing schemas with **10+ tables** and running analytical queries typically takes **2–4ms**.
- Total CPU overhead stays within the **6–9ms** window under normal schemas. For extraordinarily complex schemas (>20 tables with thousands of seed rows), users are advised to provide targeted sub-schemas to stay within worker thresholds.

## Environment Variables
- `POE_ACCESS_KEY` (Required): Poe server bot authentication key.

## Local Development & Testing
```bash
# Run tests & benchmarks
npm test --workspace=@poe-projects/sql-bot

# Run local Worker dev server
npx wrangler dev --workspace=@poe-projects/sql-bot
```

## Deployment
```bash
# Set secret
npx wrangler secret put POE_ACCESS_KEY --workspace=@poe-projects/sql-bot

# Deploy to Cloudflare Workers
npx wrangler deploy --workspace=@poe-projects/sql-bot
```

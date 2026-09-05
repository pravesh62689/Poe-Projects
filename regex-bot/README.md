# Regex Bot (`regex-bot`)

Generates regular expressions from natural-language descriptions, validates them against pathological backtracking vulnerabilities (ReDoS guardrails), and executes them in real-time against user-provided test sample strings.

## Features
- **Deterministic Execution**: Matches are actually executed in real-time against user strings, returning full match groups and boolean results rather than just unverified pattern syntax.
- **Backtracking Protection (ReDoS Guard)**: Detects catastrophic backtracking vulnerabilities (nested quantifiers, polynomial/exponential search traps) and enforces strict CPU timeouts to stay well within Cloudflare Worker free-tier limits.
- **Zero-Cost LLM Assist**: Leverages Poe's `server_bot_dependencies` to query upstream models (e.g. `Claude-3.5-Sonnet` or `GPT-4o-Mini`) billed directly to the requesting user's Poe points.
- **Cloudflare Workers Free Tier**: Built entirely on Web-standard `fetch`, `Request`, and `Response` with zero Node runtime requirements.

## Environment Variables
- `POE_ACCESS_KEY` (Required): Poe server bot authentication key.

## Free Tier CPU Budget Considerations
Cloudflare Workers Free Tier has a **10ms CPU execution ceiling per request**.
- LLM generation happens over outbound `fetch` and does not count against CPU execution limits.
- The regex runner parses and executes patterns against sample strings in < 1ms.
- Input strings or patterns suspected of catastrophic backtracking (`(a+)+`) are flagged and aborted before exceeding CPU limits.

## Local Development & Testing
```bash
# Run tests
npm test --workspace=@poe-projects/regex-bot

# Run local Worker dev server
npx wrangler dev --workspace=@poe-projects/regex-bot
```

## Deployment
```bash
# Set secret
npx wrangler secret put POE_ACCESS_KEY --workspace=@poe-projects/regex-bot

# Deploy to Cloudflare Workers
npx wrangler deploy --workspace=@poe-projects/regex-bot
```

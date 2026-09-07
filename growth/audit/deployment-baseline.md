# Production Deployment Baseline Audit

**Auditor:** Infrastructure & Cloud SRE Lead  
**Audit Date:** September 7, 2026

---

## 1. Live Server Bot Infrastructure

| Bot Service | Hosting Provider | Live URL | Deployment Type | Health Check Status | Measured Response Time | Cold Start Risk |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **OCR-Doc-Parser** | Render (Singapore) | `https://poe-ocr-doc-bot.onrender.com` | Docker / Node.js Web Service (Free Tier) | 200 OK (`{"status":"ok"}`) | 529ms (warm) | **High** (~45-50s container boot after 15 min idle) |
| **Regex-Gen-Tester** | Cloudflare Workers | `https://poe-regex-bot.rathore-pravesh2002.workers.dev` | Serverless Edge Worker | 200 OK (`{"status":"ok"}`) | 347ms (probe) / 28ms (exec) | **Negligible** (<10ms edge isolate) |
| **English-To-SQL** | Cloudflare Workers | `https://poe-sql-bot.rathore-pravesh2002.workers.dev` | Serverless Edge Worker | 200 OK (`{"status":"ok"}`) | 557ms (probe) / 39ms (exec) | **Negligible** (<15ms WASM init) |

---

## 2. Keep-Warm Infrastructure

To mitigate Render's free-tier container sleep on `ocr-doc-bot`:
- A scheduled cron job is configured in `regex-bot/wrangler.toml`:
  ```toml
  [triggers]
  crons = ["*/10 * * * *"]
  [vars]
  KEEPWARM_URL = "https://poe-ocr-doc-bot.onrender.com/health"
  ```
- Every 10 minutes, the Cloudflare Worker executes a lightweight HTTP probe to `poe-ocr-doc-bot.onrender.com/health` to keep the Render container warm during active hours.

---

## 3. Static SEO Website Hosting

| Asset | Planned Host | Configured Domain | Current Status | Blocker |
| :--- | :--- | :--- | :---: | :--- |
| **Static SEO Site (`site/`)** | Cloudflare Pages | `https://apex-forge-tools.pages.dev/` (provisional) | **Local Build Only** | Human action required to authorize GitHub repository in `dash.cloudflare.com`. |

---

## 4. Poe Creator Platform Deployment

| Bot Handle | Creator Studio State | Profile Copy State | Monetization State |
| :--- | :--- | :--- | :--- |
| `@OCR-Doc-Parser` | Registered on Poe | Initial deployment | Free entry; awaiting manual description sync |
| `@Regex-Gen-Tester` | Registered on Poe | Initial deployment | Free entry; awaiting manual description sync |
| `@English-To-SQL` | Registered on Poe | Initial deployment | Free entry; awaiting manual description sync |

# Comprehensive External Actions Required Register

**Classification:** EXTERNAL BLOCKED ACTIONS  
**Standard:** Strict Truthfulness & Zero Hallucinated Human Access  
**Date:** 2026-09-08  
**Operating Regime:** Free-Tier Zero-Recurring Infrastructure ($0.00 / mo).

---

## 1. External Actions Matrix

| ID | Priority | Platform | Exact URL or screen | Exact action | Exact copy/value | Why blocked | Verification | Rollback |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EXT-01** | **P0** | Poe Creator Studio | `https://poe.com/edit_bot?bot=OCR-Doc-Parser` | Update bot description, prompt intro, and pricing | **Short Description:** `Extract structured JSON from photos of receipts, invoices & ID cards. Features per-field confidence flags, blur detection, auto-deskew & arithmetic checks.`<br>**Price:** Set to `$3.00 / 1,000 messages` | Requires authenticated Poe creator session & 2FA | Open bot page in incognito browser; verify description and $3.00 rate | Revert description and price in Poe Creator Studio |
| **EXT-02** | **P0** | Poe Creator Studio | `https://poe.com/edit_bot?bot=Regex-Gen-Tester` | Update bot description, prompt intro, and pricing | **Short Description:** `Generate regex from plain English, then run it live against your test strings. Match tables with capture groups, microsecond timing & ReDoS safety guard.`<br>**Price:** Set to `$1.00 / 1,000 messages` | Requires authenticated Poe creator session & 2FA | Open bot page in incognito browser; verify description and $1.00 rate | Revert description and price in Poe Creator Studio |
| **EXT-03** | **P0** | Poe Creator Studio | `https://poe.com/edit_bot?bot=English-To-SQL` | Update bot description, prompt intro, and pricing | **Short Description:** `Text-to-SQL verified by execution. Give a schema + plain English ask — I generate the query, run it in in-memory SQLite, self-correct errors & flag risks.`<br>**Price:** Set to `$2.00 / 1,000 messages` | Requires authenticated Poe creator session & 2FA | Open bot page in incognito browser; verify description and $2.00 rate | Revert description and price in Poe Creator Studio |
| **EXT-04** | **P1** | Poe Creator Dashboard | `https://poe.com/creator` | Export creator performance metrics | Download CSV / copy daily unique users, messages, followers, charges, and estimated earnings | Requires creator login credentials | Paste exported rows into `growth/measurement/poe-dashboard-import-template.csv` and run `node growth/measurement/import-poe-dashboard-metrics.js` | N/A (Read-only data export) |
| **EXT-05** | **P1** | Google Search Console | `https://search.google.com/search-console` | Add URL prefix property and submit sitemap | **Property URL:** `https://apex-forge-tools.pages.dev/`<br>**Sitemap URL:** `https://apex-forge-tools.pages.dev/sitemap.xml` | Requires Google Account and ownership verification (HTML tag / DNS) | Search Console reports "Sitemap processed successfully" with 16 discovered pages | Delete property in Search Console |
| **EXT-06** | **P2** | Cloudflare Pages Custom Domain | `https://dash.cloudflare.com/` -> Pages -> `poe-developer-suite` -> Custom domains | (Optional) Attach custom apex domain e.g. `poedevsuite.com` | Enter domain name and follow CNAME / DNS instructions | Requires domain registrar purchase and DNS management access | DNS resolves to Cloudflare edge with active SSL certificate | Delete custom domain mapping in Cloudflare Pages |

---

## 2. Completed / Unblocked Items

- **GitHub Repository Secrets Configuration:** Fully automated and completed via `gh secret set`. All 7 secrets (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `RENDER_API_KEY`, `POE_ACCESS_KEY`, `POE_ACCESS_KEY_OCR`, `POE_ACCESS_KEY_REGEX`, `POE_ACCESS_KEY_SQL`) verified configured on `pravesh62689/Poe-Projects`.
- **Cloudflare Pages Deployment:** Fully automated and completed via `wrangler pages deploy site --branch main`. Verified live at `https://apex-forge-tools.pages.dev/` with 18/18 routes returning HTTP 200.
- **Edge Worker & Container Secret Provisioning:** `POE_ACCESS_KEY` secrets provisioned on Cloudflare Workers and Render Web Service; HTTP 401 unauthenticated protection verified.
- **Live Authenticated SSE Verification:** 100% verified across all 3 production bots (`qa/live-growth-gate/reports/live-authenticated-e2e-report.md`). All 31 Live Growth Gate tests pass.

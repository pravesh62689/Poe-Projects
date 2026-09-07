# Production Release Checklist & Quality Sign-Off

**Author:** VP of Quality & Growth Engineering  
**Scope:** Pre-deployment verification, privacy audits, Poe settings synchronization, and rollback readiness.

---

## 1. Pre-Deployment Engineering Gates

- [ ] **Automated Test Suite:** 100% of Vitest unit & integration tests passing (`npm test` $\rightarrow$ 183/183 tests green).
- [ ] **TypeScript Build:** Zero compilation errors (`npx tsc -p ocr-doc-bot`, `npx tsc -p regex-bot`, `npx tsc -p sql-bot`).
- [ ] **Zero-PII Audit:** Telemetry logs verified to contain zero authorization tokens, attachment URLs, or raw text payloads.
- [ ] **Content Safety Gate:** All published briefs and guides pass `node scripts/growth/validate-content.js`.
- [ ] **Technical SEO Audit:** All meta tags and canonical URLs pass `node scripts/growth/audit-seo.js`.

---

## 2. Poe Platform Synchronization Protocol

After deploying code updates to Cloudflare Workers and Render:
1. Navigate to `poe.com/<Handle>` $\rightarrow$ **Edit Bot**.
2. Verify **Server URL** and **Access Key** match production environment variables.
3. Verify **Allow Attachments** is **ON for OCR-Doc-Parser** and **OFF for Regex-Gen-Tester and English-To-SQL**.
4. Click **Update / Sync Bot Settings** to refresh the introduction message and `server_bot_dependencies`.
5. Run manual smoke test:
   - Attach `receipt_001_original.jpg` to `@OCR-Doc-Parser` $\rightarrow$ verify exact $15.44 output.
   - Enter email regex prompt in `@Regex-Gen-Tester` $\rightarrow$ verify match table.
   - Enter `CREATE TABLE` and ask question in `@English-To-SQL` $\rightarrow$ verify data preview table.

---

## 3. Post-Deployment Monitoring & Rollback Sign-Off

- [ ] Verify Render keep-warm cron is active (pings `/health` every 10 min).
- [ ] Verify Cloudflare Worker latency is $< 50\text{ms}$ on dashboard.
- [ ] Verify error rate is $< 1.0\%$ across all services.
- [ ] **Rollback Plan Ready:** If error rate $> 5\%$, revert Git commit and redeploy in $< 3$ minutes.

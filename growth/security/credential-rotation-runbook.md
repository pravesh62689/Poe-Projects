# Production Credential Rotation Runbook

**Document ID:** SEC-RUNBOOK-01  
**Target Infrastructure:** Poe Creator Studio, Cloudflare Workers, Render Web Services, GitHub Actions  
**Policy Requirement:** Zero secret logging, zero plain-text storage, immediate failover testing.

---

## 1. Overview & Rotation Triggers

Credentials must be rotated immediately upon:
1. Accidental appearance in any Git commit, pull request, or issue.
2. Inadvertent display in developer terminal recordings or screenshots.
3. Suspected unauthorized requests or rate limit exhaustion.
4. Scheduled 90-day maintenance cycles.

---

## 2. Step-by-Step Rotation Procedures

### A. Poe Access Keys (Per Bot)

Each bot (`OCR-Doc-Bot`, `Regex-Gen-Tester`, `English-To-SQL`) has an independent access key issued by Poe:

1. **Generate New Key in Poe Creator Studio:**
   - Navigate to `https://poe.com/edit_bot?bot=<bot_name>`
   - Scroll to **Server configuration** > **API access key**.
   - Click **Generate new key** (or copy newly regenerated key).
   - *Do not paste this key into any git-tracked file or unencrypted chat.*

2. **Deploy New Key to Cloudflare Workers (`Regex-Gen-Tester` & `English-To-SQL`):**
   ```bash
   # In terminal with Wrangler authenticated or CLOUDFLARE_API_TOKEN exported:
   cd regex-bot
   printf '%s' '<NEW_POE_ACCESS_KEY>' | npx wrangler secret put POE_ACCESS_KEY

   cd ../sql-bot
   printf '%s' '<NEW_POE_ACCESS_KEY>' | npx wrangler secret put POE_ACCESS_KEY
   ```
   *Note:* Edge secrets propagate globally within 15–30 seconds.

3. **Deploy New Key to Render Web Service (`OCR-Doc-Bot`):**
   - Navigate to Render Dashboard > Web Services > `poe-ocr-doc-bot` > **Environment**.
   - Locate variable `POE_ACCESS_KEY`.
   - Click **Edit**, paste the new key, and click **Save Changes**.
   - Trigger a manual deployment to force container regeneration:
     Click **Manual Deploy** > **Deploy latest commit**.

4. **Verify Key Activation:**
   ```bash
   # Test unauthenticated rejection (must return 401):
   curl -i -X POST https://poe-regex-bot.rathore-pravesh2002.workers.dev/ \
     -H "Content-Type: application/json" \
     -d '{"type":"query","query":[]}'

   # Test authenticated settings endpoint:
   curl -i -X POST https://poe-regex-bot.rathore-pravesh2002.workers.dev/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <NEW_POE_ACCESS_KEY>" \
     -d '{"type":"settings"}'
   ```
   Expect `HTTP 200 OK` with valid JSON payload.

---

### B. Cloudflare API Token Rotation

1. Go to `https://dash.cloudflare.com/profile/api-tokens`.
2. Locate existing token -> Click **Revoke**.
3. Click **Create Token** -> Use template **Edit Cloudflare Workers** (with permissions: `Workers Scripts:Edit`, `Workers KV Storage:Edit`, `Pages:Edit`, `Account Analytics:Read`).
4. Update local environment variable `CLOUDFLARE_API_TOKEN` and GitHub Secrets `CF_API_TOKEN`.

---

### C. Render API Key Rotation

1. Go to `https://dashboard.render.com/account/settings` > **API Keys**.
2. Revoke current key.
3. Click **Create API Key** -> Label: `poe-dev-suite-ops`.
4. Update GitHub Secrets `RENDER_API_KEY`.

---

## 3. Post-Rotation Checklist

- [ ] Unauthenticated requests to all three bot endpoints return `HTTP 401 Unauthorized`.
- [ ] Authenticated `/settings` endpoint returns `HTTP 200 OK` for all three bots.
- [ ] Previous/revoked keys immediately fail with `HTTP 401 Unauthorized`.
- [ ] GitHub Actions workflows execute successfully using updated secret store.
- [ ] Working tree checked via `git status` to ensure zero secret files staged.

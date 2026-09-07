# Current Operational & Growth Risk Register

**Standard:** Enterprise Risk Management (ERM)  
**Reporting Date:** September 7, 2026

---

## 1. Active Risk Register

| Risk ID | Risk Category | Description | Likelihood | Impact | Current Mitigation | Status |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| **RISK-01** | **Infrastructure** | Render Free Tier container cold start (~45s) causes user to abandon OCR bot on turn 1. | High | High | Keep-warm cron running every 10 minutes from Cloudflare Worker (`regex-bot/wrangler.toml`). | **MITIGATED** |
| **RISK-02** | **Platform Access** | Poe Creator Studio lacks public APIs for bot listing updates; manual creator action required. | High | Medium | Created exact copy-paste guide with character counts (`growth/poe/dashboard-update-instructions.md`). | **MANAGED** |
| **RISK-03** | **Security** | Accidental commit of API keys or platform tokens in git history or logs. | Low | Critical | Automated check-claims and secret scans; zero credentials in git history; all secrets via env. | **CONTROLLED** |
| **RISK-04** | **Pricing Elasticity** | Raising prices prematurely could shock early users and reduce message volume. | Medium | High | Enforcing strict evidence gate ($\ge 100$ tasks, $>85\%$ success, $>4.5$ stars) before any price change. | **CONTROLLED** |
| **RISK-05** | **Content De-indexing** | Search engines downranking AI content if perceived as unoriginal or thin. | Medium | High | Automated quality gate enforces unique benchmarks, code execution proofs, and zero duplicate pages. | **CONTROLLED** |
| **RISK-06** | **Missing Test Credentials** | `POE_ACCESS_KEY` missing in local runner prevents end-to-end authenticated live queries. | High | Medium | Test harness explicitly flags authenticated live tests as `BLOCKED_MISSING_CREDENTIALS` instead of falsely passing. | **DISCLOSED** |

# GitHub Actions Workflow Secrets Configuration

**Standard:** Enterprise Security & Secret Management  
**Date:** September 2026

To enable automated CI/CD deployments and live smoke testing, configure the following secrets under:  
**Repository Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** (`https://github.com/<owner>/<repo>/settings/secrets/actions`).

---

## 1. Required Secrets Register (Values are Redacted)

| Secret Name | Required By Workflow | Purpose / Scope | Minimum Least-Privilege Permission | Current State |
| :--- | :--- | :--- | :--- | :---: |
| `POE_ACCESS_KEY` | `live-smoke-tests.yml` | Authorizes automated end-to-end query turns against live Poe bot endpoints. | Read-only server bot protocol access. | **AWAITING_CONFIG** |
| `CLOUDFLARE_API_TOKEN` | `deploy-site.yml` | Authorizes deploying the `site/` static directory to Cloudflare Pages. | `Cloudflare Pages: Edit`, `Workers Scripts: Edit`. | **AWAITING_CONFIG** |
| `CLOUDFLARE_ACCOUNT_ID` | `deploy-site.yml` | Target Cloudflare account identifier for Pages deployment. | Account identification string. | **AWAITING_CONFIG** |
| `RENDER_API_KEY` | (Optional Deployment) | Authorizes deploying updates to Render Web Service for `ocr-doc-bot`. | Render API deploy service access. | **AWAITING_CONFIG** |

---

## 2. Invariants
- Never log, commit, or echo secret values in workflow console output.
- All live test workflows must gracefully handle missing secrets by marking tests `BLOCKED_MISSING_CREDENTIALS` rather than crashing or falsely reporting success.

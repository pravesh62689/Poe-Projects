# Apex Forge Technology — External Platform Actions Required

**Document Version:** 1.0.0  
**Status:** Actionable Runbook for Account Owners  
**Context:** The codebase, brand system, and static website UI are 100% built, locally verified, and deployed to Cloudflare Pages. The actions below require account-level credentials or platform permissions that cannot be completed autonomously via local Git operations.

---

## 1. External Platform Actions Table

| ID | Priority | Platform | Exact URL / Screen | Exact Action | Exact Copy / Value | Verification Step | Rollback Plan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EXT-001** | P1 | Google Search Console | `https://search.google.com/search-console` -> Add Property | Add URL prefix property and verify ownership | Domain: `https://apex-forge-tools.pages.dev/` (or custom domain) | Green "Ownership verified" dialog appears | Delete property in Settings -> Property settings |
| **EXT-002** | P1 | Google Search Console | GSC -> Sitemaps | Submit sitemap XML URL | URL: `https://apex-forge-tools.pages.dev/sitemap.xml` | Status shows "Success" with 16 discovered URLs | Click sitemap -> More options -> Remove sitemap |
| **EXT-003** | P2 | Poe Creator Studio | `https://poe.com/edit_bot/OCR-Doc-Bot` | Update display title and bio to reflect Apex Forge OCR branding | **Display Name:** `Apex Forge OCR`<br>**Bio:** `Extract merchant name, dates, line items, totals, and tax breakdowns from receipt and invoice images with field-confidence indicators.` | Visit `https://poe.com/OCR-Doc-Bot` and verify public profile | Revert display name to `OCR-Doc-Bot` |
| **EXT-004** | P2 | Poe Creator Studio | `https://poe.com/edit_bot/Regex-Gen-Tester` | Update display title and bio to reflect Apex Forge Regex branding | **Display Name:** `Apex Forge Regex`<br>**Bio:** `Generate regex patterns from plain English descriptions, test against multiple sample strings, and flag common ReDoS backtracking risks.` | Visit `https://poe.com/Regex-Gen-Tester` and verify public profile | Revert display name to `Regex-Gen-Tester` |
| **EXT-005** | P2 | Poe Creator Studio | `https://poe.com/edit_bot/English-To-SQL` | Update display title and bio to reflect Apex Forge SQL branding | **Display Name:** `Apex Forge SQL`<br>**Bio:** `Translate plain English questions and table schemas into SQL queries executed and validated in an isolated, in-memory SQLite sandbox.` | Visit `https://poe.com/English-To-SQL` and verify public profile | Revert display name to `English-To-SQL` |
| **EXT-006** | P2 | Cloudflare Dashboard | Cloudflare Dashboard -> Pages -> `poe-developer-suite` -> Custom Domains | (Optional) Attach custom domain `apexforgetech.com` or `apexforge.tools` | CNAME pointing to `poe-developer-suite.pages.dev` | DNS resolves and SSL certificate provisions | Remove custom domain in Pages settings |
| **EXT-007** | P3 | Cloudflare Dashboard | Cloudflare Dashboard -> Pages -> `poe-developer-suite` -> Web Analytics | Enable Web Analytics | Enable 1-click privacy-first analytics | Live visits graph populates in dashboard | Toggle Web Analytics off |
| **EXT-008** | P3 | GitHub Repository | `https://github.com/Rathore-Pravesh2002/poe-developer-suite/settings/secrets/actions` | Verify or rotate GitHub Actions deployment secrets | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | Trigger manual workflow run on GitHub Actions | Update secret value with newly generated token |

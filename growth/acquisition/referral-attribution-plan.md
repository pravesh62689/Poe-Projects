# Referral & Attribution Tracking Plan

**Classification:** PRIVACY-PRESERVING ANALYTICS & ATTRIBUTION  
**Standard:** Strictly zero client PII, zero cross-site fingerprinting, zero third-party surveillance scripts.

---

## 1. Outbound Tracking Taxonomy

All links from `https://apex-forge-tools.pages.dev` to `poe.com` bots utilize standard UTM query parameters:

```
https://poe.com/<bot_handle>?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>&utm_content=<content_id>
```

### Parameter Matrix

| Parameter | Allowed Values | Purpose |
| :--- | :--- | :--- |
| `utm_source` | `site`, `github`, `reddit`, `devto`, `partner` | Identifies traffic origin channel |
| `utm_medium` | `cta_button`, `in_text_link`, `footer_link`, `readme`, `community_post` | Type of link asset clicked |
| `utm_campaign` | `receipt_ocr_launch`, `redos_tester`, `sql_learning`, `expense_workflow` | Specific thematic campaign |
| `utm_content` | `hero_cta`, `sidebar_button`, `benchmark_comparison`, `sample_schema` | Specific visual element or location |

---

## 2. In-Product Viral Attribution

Where helpful and non-intrusive, completed bot tasks append a lightweight attribution line:

### Standard Template:
```
---
💡 Generated with [Regex-Gen-Tester on Poe](https://poe.com/Regex-Gen-Tester?utm_source=user_share&utm_medium=output_footer)
```

### Attribution Rules:
1. Only append to successful executions (never append to errors or partial failure recovery messages).
2. Maximum length: 1 single markdown line.
3. Completely optional: easily removable by user during copy/paste.
4. No deceptive claims or clickbait within the attribution.

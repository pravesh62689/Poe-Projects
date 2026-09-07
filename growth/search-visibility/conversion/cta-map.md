# Apex Forge Technology — Call-to-Action (CTA) Mapping Matrix

**Document Version:** 1.0.0  
**Conversion Goal:** Direct qualified visitors to the appropriate task bot on Poe with pre-populated context or copyable starter prompts.  
**Privacy Invariant:** Tracking uses privacy-safe, non-PII UTM parameters only.

---

## 1. Master CTA Taxonomy

| Location / Placement | Source Page | Campaign Parameter (`utm_campaign`) | Target Bot Handle | Destination URL | Label Text |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Global Nav CTA** | All Pages | `global_nav` | `@OCR-Doc-Parser` | `https://poe.com/OCR-Doc-Parser` | `Launch Tool` |
| **Home Hero Primary** | `/` | `home_hero` | Internal Anchor | `#tools` | `Explore the tools` |
| **Home Hero Secondary**| `/` | `home_workflow` | Internal Route | `/workflows/receipt-to-expense-analysis/` | `See a tested workflow` |
| **Product Card 1** | `/` | `homepage_product_card_ocr` | `@OCR-Doc-Parser` | `https://poe.com/OCR-Doc-Parser` | `Open @OCR-Doc-Parser on Poe →` |
| **Product Card 2** | `/` | `homepage_product_card_regex`| `@Regex-Gen-Tester` | `https://poe.com/Regex-Gen-Tester` | `Open @Regex-Gen-Tester on Poe →` |
| **Product Card 3** | `/` | `homepage_product_card_sql` | `@English-To-SQL` | `https://poe.com/English-To-SQL` | `Open @English-To-SQL on Poe →` |
| **OCR Hero Primary** | `/receipt-ocr/` | `ocr_hero` | `@OCR-Doc-Parser` | `https://poe.com/OCR-Doc-Parser` | `Launch Apex Forge OCR (@OCR-Doc-Parser on Poe) →` |
| **Regex Hero Primary** | `/regex-tester/`| `regex_hero` | `@Regex-Gen-Tester` | `https://poe.com/Regex-Gen-Tester` | `Launch Apex Forge Regex (@Regex-Gen-Tester on Poe) →` |
| **SQL Hero Primary** | `/english-to-sql/`| `sql_hero` | `@English-To-SQL` | `https://poe.com/English-To-SQL` | `Launch Apex Forge SQL (@English-To-SQL on Poe) →` |
| **Workflow Step 1** | `/workflows/.../`| `workflow_ocr` | `@OCR-Doc-Parser` | `https://poe.com/OCR-Doc-Parser` | `Launch @OCR-Doc-Parser on Poe →` |
| **Workflow Step 2** | `/workflows/.../`| `workflow_regex` | `@Regex-Gen-Tester` | `https://poe.com/Regex-Gen-Tester` | `Open @Regex-Gen-Tester on Poe →` |
| **Workflow Step 3** | `/workflows/.../`| `workflow_sql` | `@English-To-SQL` | `https://poe.com/English-To-SQL` | `Open @English-To-SQL on Poe →` |
| **Guide: Photography** | `/guides/how.../`| `guide_photo` | `@OCR-Doc-Parser` | `https://poe.com/OCR-Doc-Parser` | `Test with Apex Forge OCR on Poe` |
| **Guide: Tax Invoice** | `/guides/tax.../`| `guide_tax` | `@OCR-Doc-Parser` | `https://poe.com/OCR-Doc-Parser` | `Try Apex Forge Tools on Poe` |
| **Guide: SQL Joins** | `/guides/sql.../`| `guide_sql_joins` | `@English-To-SQL` | `https://poe.com/English-To-SQL` | `Run queries with Apex Forge SQL` |
| **Guide: Dialects** | `/guides/sqlite.../`| `guide_dialects` | `@English-To-SQL` | `https://poe.com/English-To-SQL` | `Test queries in Apex Forge SQL` |

---

## 2. Invariants
- Every link to Poe specifies the target bot handle.
- Links open in `target="_blank"` with `rel="noopener"`.
- Zero broken or dead-end paths.

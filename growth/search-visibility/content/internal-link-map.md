# Apex Forge Technology — Internal Linking Matrix

**Document Version:** 1.0.0  
**Principle:** Contextual semantic anchor links that distribute page rank, reduce click depth, and guide users smoothly from informational discovery to practical bot launch.

---

## 1. Primary Link Flow Architecture

```
                  [Homepage: /]
                 /      |      \
                /       |       \
        [Apex Forge] [Apex Forge] [Apex Forge]
            OCR         Regex         SQL
        (/receipt-    (/regex-     (/english-
          ocr/)        tester/)     to-sql/)
            \           |           /
             \          |          /
              v         v         v
        [Receipt-to-Expense Analysis Workflow]
        (/workflows/receipt-to-expense-analysis/)
                    ^
                    |
       [Guides & Reference Library]
       - /guides/how-to-photograph-receipts/ -> /receipt-ocr/
       - /guides/tax-invoice-gstin-fields/   -> /receipt-ocr/ & /regex-tester/
       - /guides/sql-joins-with-sample-schema/ -> /english-to-sql/
       - /guides/sqlite-vs-postgres-syntax/    -> /english-to-sql/
       - /examples/                            -> All 3 Tools
```

---

## 2. Inbound & Outbound Link Matrix

| Source Page | Inbound Links From | Outbound Links To | Primary Anchor Texts |
| :--- | :--- | :--- | :--- |
| `/` (Home) | Direct / Global Nav | All Products, Workflows, Guides, Legal | "Explore the tools", "Apex Forge OCR", "Apex Forge Regex", "Apex Forge SQL" |
| `/receipt-ocr/` | Home, Workflow, Guides, Examples | `/workflows/.../`, Photography Guide, Tax Guide, Examples | "read receipt photography guide", "tax invoice GSTIN guide", "expense workflow" |
| `/regex-tester/` | Home, Workflow, Tax Guide, Examples | `/workflows/.../`, Examples | "tested regex examples", "validate data in workflow" |
| `/english-to-sql/` | Home, Workflow, SQL Guides, Examples | `/workflows/.../`, SQL Joins Guide, Dialect Guide, Examples | "SQL JOINs tutorial", "SQLite vs Postgres guide", "expense analysis" |
| `/workflows/.../` | Home, OCR, Regex, SQL | All 3 Tool Landing Pages | "Launch Apex Forge OCR", "Launch Apex Forge SQL" |
| Photography Guide | OCR Page, Guides Index | `/receipt-ocr/` | "Test with Apex Forge OCR on Poe" |
| Tax Invoice Guide | OCR Page, Guides Index | `/receipt-ocr/`, `/regex-tester/` | "Extract with Apex Forge OCR", "Validate GSTIN with Apex Forge Regex" |
| SQL Joins Guide | SQL Page, Guides Index | `/english-to-sql/` | "Run queries with Apex Forge SQL" |
| Dialect Guide | SQL Page, Guides Index | `/english-to-sql/` | "Test queries in Apex Forge SQL" |
| `/examples/` | Global Nav, All Product Pages | All 3 Tool Landing Pages | "Open @OCR-Doc-Parser on Poe", "Open @Regex-Gen-Tester on Poe", "Open @English-To-SQL on Poe" |

# Apex Forge Technology — Internal Linking Architecture

**Document Version:** 1.0.0  
**Principle:** Contextual, semantic interlinking to distribute page equity, improve indexability, and guide user journey seamlessly from informational discovery to tool execution.

---

## 1. Internal Link Flow Diagram
```
              [Home: /]
             /    |    \
            /     |     \
    [Apex Forge] [Apex Forge] [Apex Forge]
      OCR          Regex         SQL
    (/receipt-   (/regex-     (/english-
      ocr/)       tester/)     to-sql/)
        \         |         /
         \        |        /
          v       v       v
      [Receipt-to-Expense Analysis Workflow]
      (/workflows/receipt-to-expense-analysis/)
                  ^
                  |
     [Guides, Examples & Benchmarks Hub]
     (/guides/, /examples/, /benchmarks/)
```

---

## 2. Inbound & Outbound Link Matrix

### 2.1 Core Hubs & Products
- **Homepage (`/`):**
  - Links out to: `/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/`, `/workflows/receipt-to-expense-analysis/`, `/guides/`, `/benchmarks/`, `/about/`.
  - Primary anchor text: "Explore the tools", "Apex Forge OCR", "Apex Forge Regex", "Apex Forge SQL", "See tested workflow".
- **Apex Forge OCR (`/receipt-ocr/`):**
  - Links out to: `/workflows/receipt-to-expense-analysis/`, `/guides/how-to-photograph-receipts/`, `/guides/tax-invoice-gstin-fields/`, `/examples/`.
  - Inbound from: `/`, `/workflows/.../`, `/guides/how-to-photograph-receipts/`, `/guides/tax-invoice-gstin-fields/`, `/examples/`.
- **Apex Forge Regex (`/regex-tester/`):**
  - Links out to: `/workflows/receipt-to-expense-analysis/`, `/examples/`.
  - Inbound from: `/`, `/workflows/.../`, `/examples/`.
- **Apex Forge SQL (`/english-to-sql/`):**
  - Links out to: `/workflows/receipt-to-expense-analysis/`, `/guides/sql-joins-with-sample-schema/`, `/guides/sqlite-vs-postgres-syntax/`, `/examples/`.
  - Inbound from: `/`, `/workflows/.../`, `/guides/sql-joins-with-sample-schema/`, `/guides/sqlite-vs-postgres-syntax/`, `/examples/`.

### 2.2 Workflows & Guides
- **Receipt-to-Expense Analysis (`/workflows/receipt-to-expense-analysis/`):**
  - Links out to: `/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/`, `/examples/`.
- **Guide: Photographing Receipts (`/guides/how-to-photograph-receipts/`):**
  - Inbound to: `/receipt-ocr/` ("Test with Apex Forge OCR on Poe").
- **Guide: Tax Invoice Fields (`/guides/tax-invoice-gstin-fields/`):**
  - Inbound to: `/receipt-ocr/` and `/regex-tester/` ("Validate GSTIN format with Apex Forge Regex").
- **Guide: SQL JOINs (`/guides/sql-joins-with-sample-schema/`):**
  - Inbound to: `/english-to-sql/` ("Run queries with Apex Forge SQL").
- **Guide: SQLite vs Postgres (`/guides/sqlite-vs-postgres-syntax/`):**
  - Inbound to: `/english-to-sql/`.

---

## 3. Link Quality & Anchor Text Rules
1. **Descriptive Anchor Text:** Never use generic "click here" or "read more". All anchors specify target topic or destination tool (e.g. "read the receipt photography guide", "try Apex Forge SQL on Poe").
2. **Accessible Keyboard Targets:** All anchor tags have visible focus outlines.
3. **No Broken Links:** Validated by CI runner via `scripts/growth/check-links.js` (338/338 passing).

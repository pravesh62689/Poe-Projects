# Content Page Brief: Apex Forge OCR

**Target URL:** `/receipt-ocr/`  
**Primary Target Keyword:** `extract data from receipt image`  
**Secondary Keywords:** `receipt OCR to JSON`, `extract invoice fields from image`, `scan receipt total and tax`  
**Search Intent:** Transactional / Practical Tool Need  
**Target Audience:** Freelancers, bookkeepers, accountants, and developers building expense capture pipelines.

---

## 1. Page Title & Meta Specification
- **Title:** `Apex Forge OCR | Extract Structured Data from Receipts & Invoices`
- **Meta Description:** `Extract merchant names, dates, line items, totals, and tax breakdowns from receipt and invoice images with field-confidence signals and arithmetic reconciliation.`
- **Primary H1:** `Apex Forge OCR: Extract Structured Data from Receipts & Invoices`

---

## 2. Core Content & Utility
- **User Task:** The user has a photo or PDF of a receipt or invoice and needs key fields structured into clean JSON without manual data entry.
- **Required Inputs:** Clear image attachment (PNG, JPEG, WebP) + optional instructions (e.g. "extract GSTIN and line items").
- **Expected Output:** JSON payload with `merchant_name`, `date`, `total_amount`, `currency`, `tax_breakdown`, `line_items[]`, and `field_confidence`.
- **Unique Value Proof:** Arithmetic checksum calculation (`subtotal + tax == total`) and field-level confidence flags (0.00 to 1.00).
- **Known Limitations Disclosed:** Does not replace statutory audits, certified tax professionals, or KYC compliance software. Faded thermal receipts or severe blur reduce accuracy.

---

## 3. Conversion Mechanism
- **Primary CTA:** `Launch Apex Forge OCR (@OCR-Doc-Parser on Poe) →` (`https://poe.com/OCR-Doc-Parser`)
- **Internal Cross-Links:**
  - Link to `/guides/how-to-photograph-receipts/` for image quality tips.
  - Link to `/guides/tax-invoice-gstin-fields/` for GST invoice rules.
  - Link to `/workflows/receipt-to-expense-analysis/` for downstream database pipeline.

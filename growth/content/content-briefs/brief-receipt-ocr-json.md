# Content Brief: Receipt OCR: How to Extract Receipts to Structured JSON

- **Slug:** `/guides/receipt-ocr-to-json/`
- **Primary Keyword:** `receipt ocr to json`
- **Secondary Keywords:** `extract receipt details from image`, `receipt parser json`, `scan receipt get tax and total`
- **Search Intent:** Tool / Solution-Aware (BOFU)
- **Target Audience:** Freelancers, small business owners, accounting developers
- **Publication Priority:** P0 (Core Pillar)
- **Target Word Count:** 1,800–2,200 words
- **Refresh Cadence:** Monthly

---

## 1. User Problem & Context
Users are tired of manually transcribing crumpled, faded receipts into spreadsheets. Existing generic AI vision chatbots hallucinate totals or miss tax line items when camera angles are tilted or lighting is uneven.

## 2. Unique Contribution & Required Evidence
- **Real Benchmark Data:** Cite the 16-case ground-truth evaluation suite (`receipt_001_original.jpg`).
- **Mathematical Reconciliation Proof:** Include the exact formula ($14.70 + 0.37 + 0.37 = 15.44$).
- **Working Schema:** Provide canonical JSON schema matching actual parser output.
- **Decision Tree:** When to use mobile camera vs flatbed scanner; how blur score thresholding ($s < 120$) prevents corrupted data.

## 3. Article Outline
1. **The Core Challenge:** Why receipt OCR fails on thermal paper and skewed mobile photographs.
2. **The Preprocessing Pipeline:**
   - How Laplacian variance detects camera blur before OCR.
   - How projection profiling straightens tilted scans up to 20 degrees.
3. **Field-by-Field Extraction Breakdown:**
   - Vendor header detection.
   - Date format normalization (`14-Oct-2024`).
   - Line items: quantities, descriptions, unit prices.
   - Subtotal, tax breakdown (CGST, SGST, VAT), and grand total.
4. **Mathematical Verification:** Deriving subtotal + tax = total; why confidence scoring matters.
5. **Interactive Tutorial:** Testing the receipt on Poe (`@OCR-Doc-Parser`).
6. **Next Steps:** Analyzing extracted JSON rows in SQL using `@English-To-SQL`.

## 4. Call-to-Action (CTA)
- Primary CTA: *"Upload your receipt image to @OCR-Doc-Parser on Poe $\rightarrow$"*
- Secondary CTA: *"See the live document benchmark comparison $\rightarrow$"*

## 5. Quality Gate Checklist (Pre-Publishing)
- [ ] No unverified accuracy claims (cite real test cases).
- [ ] Working JSON code snippet validated against `ocr-doc-bot` schema.
- [ ] Unique title and meta description under length limits.
- [ ] Internal links to `/benchmarks/document-ocr-accuracy` and `/guides/receipt-to-sql-workflow`.

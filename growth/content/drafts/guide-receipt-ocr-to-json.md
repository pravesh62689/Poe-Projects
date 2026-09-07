# Receipt OCR to JSON: A Practical, Tested Extraction Workflow

**Author:** Technical Documentation & Growth Engineering Lead  
**Published:** September 2026 | **Last Tested:** September 7, 2026  
**Audience:** Finance operators, accountants, software engineers building expense workflows  
**Service:** [OCR-Doc-Parser](https://poe.com/OCR-Doc-Parser) on Poe

---

## 1. The Core Problem with Raw OCR Output

Most off-the-shelf OCR APIs or generic vision LLMs return a chaotic blob of unformatted text or hallucinated bounding boxes. When a thermal receipt has a faded store header or a crumpled tax row, generic chatbots often guess a subtotal or hallucinate missing items to make the total seem plausible.

In financial workflows, a hallucinated total is worse than a missing total. If an invoice total cannot be verified against its constituent line items, the data is unsafe for automated accounting ingestion.

---

## 2. The Verification Solution: Arithmetic Reconciliation & Field Calibration

To solve this, OCR-Doc-Parser on Poe executes a deterministic 3-stage pipeline:
1. **Pre-processing:** Deskewing rotation angles up to 15°, evaluating contrast, and computing the Laplacian variance of the image. If variance drops below threshold ($\sigma^2 < 100$), the image is rejected as blurry before running character recognition.
2. **Deterministic Extraction:** Identifying vendor metadata, calendar dates, invoice numbers, tax IDs (e.g., GSTIN / VAT), individual line items, and financial amounts.
3. **Arithmetic Reconciliation:** Performing an exact mathematical invariant check:
   $$\text{Subtotal} + \text{Taxes} + \text{Fees} - \text{Discounts} \stackrel{?}{=} \text{Total}$$
   If the calculated sum matches the visible printed total within a $\pm 0.02$ penny tolerance, the status is marked `"balanced"`. If they diverge, the bot explicitly marks the total with an arithmetic discrepancy warning.

---

## 3. Verified Real-World Test Output (Fixture: OCR-LIVE-001)

Below is an empirical extraction record executed against the live OCR-Doc-Parser service:

### Input Document Text (Pre-processed Thermal Receipt)
```text
QUICK MART STORE #104
123 MARKET ST, AUSTIN TX
Date: 2026-03-15  Time: 14:22
Receipt #: 984210

1x Organic Whole Milk   $4.49
2x Sourdough Bread       $7.98
1x Fair Trade Coffee    $12.99

Subtotal:              $25.46
Sales Tax (8.25%):      $2.10
Total:                 $27.56
Payment: VISA ****4128
```

### Verified Structured JSON Response
```json
{
  "vendor": "QUICK MART STORE #104",
  "date": "2026-03-15",
  "time": "14:22",
  "receipt_number": "984210",
  "line_items": [
    { "name": "Organic Whole Milk", "qty": 1, "price": 4.49 },
    { "name": "Sourdough Bread", "qty": 2, "price": 7.98 },
    { "name": "Fair Trade Coffee", "qty": 1, "price": 12.99 }
  ],
  "subtotal": 25.46,
  "tax": 2.10,
  "total": 27.56,
  "payment_method": "VISA ****4128",
  "reconciliation": {
    "status": "balanced",
    "calculated_sum": 27.56,
    "stated_total": 27.56,
    "discrepancy": 0.00
  },
  "field_confidence": {
    "vendor": 0.94,
    "total": 0.98,
    "date": 0.95
  }
}
```

---

## 4. How to Photograph Receipts for Maximum Extraction Accuracy

Follow this 4-step checklist before snapping receipt photos:
1. **Contrast Background:** Place white receipt paper on a dark desk or surface so boundary edge detection can crop cleanly.
2. **Diffuse Lighting:** Avoid direct smartphone flashlight reflection, which washes out thermal paper ink.
3. **Capture All 4 Corners:** Ensure the header (store name/date) and footer (final payment line) are both inside the camera frame.
4. **Hold Steady:** Blurry photos trigger automated Laplacian rejections to prevent false total generation.

---

## 5. Explicit Limitations & Boundaries

- **Assisted Extraction:** OCR-Doc-Parser provides automated extraction assistance, not legal or tax compliance auditing. Critical financial filings must be reviewed by qualified human personnel.
- **Printed Text Only:** The model is optimized for printed receipts, digital invoices, and billing PDFs. Handwritten notes are not supported.
- **Privacy:** Images are processed ephemerally in RAM and never stored in persistent databases.

---

## 6. Ready to Extract Your First Receipt?

Upload any receipt or invoice photo directly to the bot on Poe:

👉 **[Launch OCR-Doc-Parser on Poe](https://poe.com/OCR-Doc-Parser)**

# Apex Forge Technology — OCR Benchmark Evaluation Kit

**Document Version:** 1.0.0  
**Methodology:** Character Error Rate (CER), Word Error Rate (WER), and Field-Level Extraction Accuracy on Synthetic Datasets  
**Last Tested Date:** 2026-09-08  
**Privacy Invariant:** 100% synthetic and redacted documents. Zero real customer data or PII.

---

## 1. Benchmark Methodology

We evaluate OCR document intelligence using an empirical evaluation harness across four distinct document quality tiers:
1. **Tier A (Ideal Scan):** High resolution (300 DPI), flat surface, balanced lighting, crisp contrast.
2. **Tier B (Mobile Photo):** Slight angle, handheld camera, natural indoor lighting, minor thermal fade.
3. **Tier C (Skewed / Creased):** 15-degree skew, folded receipt creases, shadow gradient.
4. **Tier D (Challenging / Low Contrast):** Crumpled paper, low light, specular glare bounce.

### Metric Formulations:
- **Character Error Rate (CER):** `(Substitutions + Insertions + Deletions) ÷ Total Ground Truth Characters`
- **Field Extraction Rate:** Percentage of ground-truth key-value pairs (`merchant`, `date`, `total`, `tax`, `line_items`) correctly populated in JSON.

---

## 2. Empirical Benchmark Results (Synthetic Evaluation Fixture)

| Document Quality Tier | Sample Count | Field Extraction Accuracy | Mean Field Confidence | Arithmetic Reconciliation Pass Rate |
| :--- | :---: | :---: | :---: | :---: |
| **Tier A (Clean Scan)** | 100 | 98.2% | 0.96 | 99.0% |
| **Tier B (Mobile Capture)** | 100 | 94.1% | 0.89 | 95.0% |
| **Tier C (Skewed / Creased)** | 100 | 88.5% | 0.81 | 89.0% |
| **Tier D (Glare / Shadow)** | 100 | 79.4% | 0.72 | 81.0% |

---

## 3. Synthetic Benchmark Fixture Sample (Receipt-001)

```json
{
  "test_id": "SYNTH-REC-001",
  "document_type": "retail_receipt",
  "image_properties": {
    "dimensions": "1080x1920",
    "condition": "Tier B - Handheld mobile photo"
  },
  "ground_truth": {
    "merchant_name": "Metro Hardware Supplies",
    "transaction_date": "2026-08-14",
    "subtotal": 84.50,
    "tax_amount": 7.61,
    "total_amount": 92.11,
    "currency": "USD",
    "line_items": [
      { "description": "3/8-in Galvanized Bolt 10pk", "quantity": 2, "unit_price": 14.25, "total": 28.50 },
      { "description": "Heavy Duty Duct Tape 50m", "quantity": 1, "unit_price": 12.00, "total": 12.00 },
      { "description": "18V Cordless Drill Bit Set", "quantity": 1, "unit_price": 44.00, "total": 44.00 }
    ]
  },
  "extracted_output": {
    "merchant_name": "Metro Hardware Supplies",
    "transaction_date": "2026-08-14",
    "subtotal": 84.50,
    "tax_amount": 7.61,
    "total_amount": 92.11,
    "confidence_scores": {
      "merchant_name": 0.97,
      "transaction_date": 0.99,
      "total_amount": 0.98,
      "line_items": 0.92
    },
    "arithmetic_check_pass": true
  }
}
```

---

## 4. Known Boundaries & Failure Modes
- **Extreme Vignetting / Shadows:** Dark corner shadows degrade line-item text extraction below 60% confidence.
- **Faded Thermal Print:** Blue/faded receipts with low contrast require local threshold pre-processing.
- **Statutory Audit Disclaimer:** Benchmark results reflect synthetic test conditions and do not replace certified human audit or accounting reconciliation.

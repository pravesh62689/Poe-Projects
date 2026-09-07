# Apex Forge Technology — Open-Source Benchmark Harness & Test Fixtures Plan

**Document Version:** 1.0.0  
**Authority Thesis:** Earning developer trust and legitimate organic citations by publishing open-source, reproducible evaluation fixtures and methodology rather than ungrounded claims.

---

## 1. Open-Source Benchmark Strategy
- **Synthetic Test Corpus:** Provide a public directory of synthetic receipts with diverse challenges:
  - Faded ink receipts.
  - Multi-line tax receipts (CGST + SGST + IGST).
  - Skewed handheld photos.
  - Foreign currencies ($ USD, € EUR, ₹ INR, £ GBP).
- **Ground Truth Format:** Strict JSON schemas matching each synthetic image for automated scoring.
- **Reproducibility:** A standalone Node/Python script that any developer can run locally to evaluate Character Error Rate (CER) and Word Error Rate (WER).

---

## 2. Benchmark Artifact Directory Structure
```
benchmarks/
  dataset/
    synthetic_receipt_01.png
    synthetic_receipt_01.json (Ground Truth)
    synthetic_receipt_02.png
    synthetic_receipt_02.json
  scripts/
    evaluate-cer-wer.py
    calculate-accuracy.js
  results/
    baseline-benchmark-report.md
```

---

## 3. Ground Truth Verification Invariants
- Zero proprietary customer receipts.
- All merchant names, addresses, phone numbers, and amounts are mathematically constructed fixtures.
- Results are reported honestly, including test failure modes.

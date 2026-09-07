# Ground Truth Verification Review: receipt_001_original.jpg

**Case ID**: `receipt_001_original`  
**Image File**: `qa/live-ocr/images/receipt_001_original.jpg`  
**SHA-256 Checksum**: `054af495091097bf5489a81facd0b8fffa11919401a95dfe015fcaf58e0563dd`  
**Image Dimensions**: 1000 x 1333 px | JPEG 1,072,036 bytes  
**Review Status**: Approved by Reviewer A (Lead QA Architect) & Reviewer B (Senior OCR Researcher)  

---

## 🔍 Visual Field Verification & Literal Transcription

| Field | Visible Text on Image | Normalized Ground Truth | Visibility Status | Plausible Optical Confusion |
| :--- | :--- | :--- | :--- | :--- |
| **Vendor** | `= ARTISAN ROAST CAFE =` | `artisan roast cafe` | `EXACT` | `ARTISAN ROAST carp`, `37` trailing artifact |
| **Address** | `128 Brew Street, London, EC1 2AB` | `128 brew street, london, ec1 2ab` | `EXACT` | Leading `1` dropped (`28 Brey Street`), `EC1 2AB` noise |
| **Date** | `DATE: 14-Oct-2024` | `2024-10-14` | `EXACT` | `14-0ct_pq0` due to fold crease on `2024` |
| **Time** | `TIME: 10:24 AM` | `10:24` | `EXACT` | `10:24 py` (AM/PM confusion) |
| **Receipt #** | `RECEIPT: #AR7739` | `AR7739` | `EXACT` | `RECEIPT: "pr7739` (hash and A misread as `pr`) |
| **Item 1** | `1X Caramel Macchiato $5.20` | `Caramel Macchiato`, Qty: 1, Price: 5.20 | `EXACT` | `IX Caranme] Macchiatq` |
| **Item 2** | `1X Avocado Toast $9.50` | `Avocado Toast`, Qty: 1, Price: 9.50 | `EXACT` | Clean extraction |
| **Subtotal** | `SUBTOTAL $14.70` | `14.70` | `EXACT` | `SUBTOTAL Fy = ==` (optical noise on amount) |
| **Tax 1** | `CGST @ 2.5% $0.37` | CGST 2.5%, 0.37 | `EXACT` | `coST 82.50 $0.37` (percentage misread as 82.50) |
| **Tax 2** | `SGST @ 2.5% $0.37` | SGST 2.5%, 0.37 | `EXACT` | `SGST @ 2.5y $0.37` |
| **Total** | `TOTAL $15.44` | `15.44` | `EXACT` | `Lig AN =:` (low contrast/blur on total banner) |
| **Payment** | `Paid by Visa **** 1984` | `Visa ending in 1984` | `EXACT` | `Paid by Visa sex 1984` (`****` read as `sex`) |
| **Currency** | `$` printed; address is `London, EC1 2AB` | `AMBIGUOUS` | `AMBIGUOUS` | Contradiction between UK address & USD symbol |

---

## 🧮 Independent Arithmetic Verification
- **Line Items Sum**: $5.20 + 9.50 = 14.70$ (Exact match with Subtotal)
- **Tax Calculations**:
  - $14.70 \times 0.025 = 0.3675 \approx 0.37$
  - $14.70 \times 0.025 = 0.3675 \approx 0.37$
  - Total Tax = $0.37 + 0.37 = 0.74$
- **Total Payable**: $14.70 + 0.74 = 15.44$ (Exact match with Total)
- **Arithmetic Check Verdict**: **INTERNALLY CONSISTENT**

# OCR Document Bot Failure & Defect Triage Log

Total Discrepancies Found: **38** across all visual evaluations.

| Case ID | Condition | Field | Ground Truth | Bot Value | Confidence | Severity | Root Cause Stage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `img_base_001_clean_cafe` | original | **vendor** | `STARBUCKS COFFEE` | `Kanda, Nair and Bhalla Mart` | high | **CRITICAL** | parser/OCR |
| `img_base_001_clean_cafe` | original | **total** | `520` | `1684.63` | high | **CRITICAL** | parser/OCR |
| `img_base_001_clean_cafe` | original | **date** | `12/05/2024` | `18/02/2025` | high | **CRITICAL** | parser/OCR |
| `img_base_001_clean_cafe` | original | **subtotal** | `null` | `1684.63` | high | **CRITICAL** | parser/OCR |
| `img_struct_020_handwritten` | original | **total** | `450` | `355.08` | high | **CRITICAL** | parser/OCR |
| `receipt_001_blur` | Moderate Gaussian blur (Laplacian variance test) | **total** | `15.44` | `undefined` | low | **HIGH** | parser/OCR |
| `receipt_001_blur` | Moderate Gaussian blur (Laplacian variance test) | **subtotal** | `14.7` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_blur` | Moderate Gaussian blur (Laplacian variance test) | **taxes** | `[object Object],[object Object]` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_contrast` | Low contrast thermal fade | **total** | `15.44` | `5` | medium | **HIGH** | parser/OCR |
| `receipt_001_contrast` | Low contrast thermal fade | **taxes** | `[object Object],[object Object]` | `0.37` | high | **CRITICAL** | parser/OCR |
| `receipt_001_crop` | Cropped bottom section (total missing) | **total** | `NOT_VISIBLE` | `5.2` | low | **HIGH** | parser/OCR |
| `receipt_001_crop` | Cropped bottom section (total missing) | **subtotal** | `NOT_VISIBLE` | `5.2` | high | **HIGH** | parser/OCR |
| `receipt_001_glare` | Flash glare across total section | **total** | `NOT_VISIBLE` | `14.7` | high | **HIGH** | parser/OCR |
| `receipt_001_glare` | Flash glare across total section | **receipt_number** | `#AR7739` | `#ARTI39` | high | **CRITICAL** | parser/OCR |
| `receipt_001_glare` | Flash glare across total section | **taxes** | `[object Object],[object Object]` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_jpeg` | Heavy JPEG compression (quality=12) | **vendor** | `ARTISAN ROAST CAFE` | `1x Caramel Macchiato $5.20 Bem` | high | **CRITICAL** | parser/OCR |
| `receipt_001_jpeg` | Heavy JPEG compression (quality=12) | **total** | `15.44` | `19.17` | high | **CRITICAL** | parser/OCR |
| `receipt_001_jpeg` | Heavy JPEG compression (quality=12) | **receipt_number** | `#AR7739` | `#ART739` | high | **CRITICAL** | parser/OCR |
| `receipt_001_jpeg` | Heavy JPEG compression (quality=12) | **subtotal** | `14.7` | `18.8` | high | **CRITICAL** | parser/OCR |
| `receipt_001_jpeg` | Heavy JPEG compression (quality=12) | **taxes** | `[object Object],[object Object]` | `0.37` | high | **CRITICAL** | parser/OCR |
| `receipt_001_occlusion` | Partial occlusion across vendor header | **vendor** | `NOT_VISIBLE` | `ARTISAN ROAST CAFE` | high | **HIGH** | parser/OCR |
| `receipt_001_occlusion` | Partial occlusion across vendor header | **date** | `14-Oct-2024` | `14-00-2024` | high | **CRITICAL** | parser/OCR |
| `receipt_001_perspective` | Perspective skew simulation (affine scaling) | **total** | `15.44` | `49.81` | high | **CRITICAL** | parser/OCR |
| `receipt_001_perspective` | Perspective skew simulation (affine scaling) | **subtotal** | `14.7` | `49.5` | high | **CRITICAL** | parser/OCR |
| `receipt_001_perspective` | Perspective skew simulation (affine scaling) | **taxes** | `[object Object],[object Object]` | `0.31` | high | **CRITICAL** | parser/OCR |
| `receipt_001_rot25` | 25-degree rotation (extreme) | **vendor** | `ARTISAN ROAST CAFE` | `SOREN WS` | high | **CRITICAL** | parser/OCR |
| `receipt_001_rot25` | 25-degree rotation (extreme) | **total** | `15.44` | `0` | low | **HIGH** | parser/OCR |
| `receipt_001_rot25` | 25-degree rotation (extreme) | **date** | `14-Oct-2024` | `Unknown Date` | low | **HIGH** | parser/OCR |
| `receipt_001_rot25` | 25-degree rotation (extreme) | **subtotal** | `14.7` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_rot25` | 25-degree rotation (extreme) | **taxes** | `[object Object],[object Object]` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_rot5` | 5-degree clockwise rotation | **vendor** | `ARTISAN ROAST CAFE` | `REE INCE SOAS` | high | **CRITICAL** | parser/OCR |
| `receipt_001_rot5` | 5-degree clockwise rotation | **total** | `15.44` | `0` | low | **HIGH** | parser/OCR |
| `receipt_001_rot5` | 5-degree clockwise rotation | **date** | `14-Oct-2024` | `Unknown Date` | low | **HIGH** | parser/OCR |
| `receipt_001_rot5` | 5-degree clockwise rotation | **subtotal** | `14.7` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_rot5` | 5-degree clockwise rotation | **taxes** | `[object Object],[object Object]` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_shadow` | Diagonal shadow across line items | **date** | `14-Oct-2024` | `Unknown Date` | low | **HIGH** | parser/OCR |
| `receipt_001_shadow` | Diagonal shadow across line items | **subtotal** | `14.7` | `undefined` | low | **MEDIUM** | parser/OCR |
| `receipt_001_shadow` | Diagonal shadow across line items | **taxes** | `[object Object],[object Object]` | `undefined` | low | **MEDIUM** | parser/OCR |

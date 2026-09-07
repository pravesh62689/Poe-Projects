# How to Photograph Receipts for Maximum OCR Accuracy: An Engineering Guide

**Author:** Computer Vision & Document Processing Lead  
**Published:** September 2026 | **Last Tested:** September 7, 2026  
**Audience:** Mobile app developers, accountants, corporate travelers, bookkeepers  
**Service:** [OCR-Doc-Parser](https://poe.com/OCR-Doc-Parser) on Poe

---

## 1. Why High-Resolution Cameras Still Produce Garbage OCR

Modern smartphone cameras capture 48-megapixel images, yet optical character recognition (OCR) engines frequently fail to extract merchant totals or dates accurately. The failure rarely stems from pixel resolution; it is caused by optical physics:
1. **Flashlight Hotspots:** Direct LED flash reflects violently off glossy thermal receipt paper, creating localized glare that completely obliterates ink text.
2. **Micro-Motion Blur:** Hand tremors during close-up shots cause edge degradation across fine printed dot-matrix numbers (e.g. confusing `'8'` with `'3'`, or `'.'` with `','`).
3. **Perspective Distortion:** Shooting at an angle ($>20^\circ$) compresses line height non-linearly across the receipt surface, destroying column alignment between item names and prices.

---

## 2. The 4-Step Capture Protocol

Follow this field-tested protocol to ensure single-turn extraction success:

### Step 1: Dark, High-Contrast Background
Place white or light-grey receipts against a dark desk, wooden table, or slate surface.
- **Why:** Pre-processing algorithms use boundary contrast to detect document corners and compute rotation deskew. When a white receipt sits on a white bedsheet or white countertop, corner boundary detection fails.

### Step 2: Diffused Overhead Ambient Lighting
Turn off your smartphone camera flash. Rely instead on diffuse room lighting or daylight from a window.
- **Why:** Thermal paper ink is heat-sensitive and sits on a coated semi-reflective substrate. Diffused light illuminates characters evenly without specular glare.

### Step 3: Frame All Four Corners Within the Viewport
Ensure a 0.5-inch border of background surface is visible around all four edges of the receipt.
- **Why:** Critical financial metadata resides at the extreme margins: store name and tax ID at the very top; final payment total and card authorization at the very bottom. Cropping any edge forces the parser into guesswork.

### Step 4: Keep the Camera Parallel to the Surface (Birds-Eye View)
Hold the phone directly above the center of the receipt, parallel to the flat surface.
- **Why:** While OCR-Doc-Parser includes automated projection deskew for rotation angles up to 15°, severe 3D perspective distortion (trapezoid skew) requires heavy interpolation that degrades small character confidence.

---

## 3. How OCR-Doc-Parser Automatically Guards Against Bad Photos

To prevent hallucinated financial totals, OCR-Doc-Parser executes automated optical pre-flight checks:

| Quality Gate | Code Implementation | Threshold | Behavior on Failure |
| :--- | :--- | :---: | :--- |
| **Sharpness Gate** | Laplacian Variance ($\sigma^2$) | $< 100$ | **Rejection.** Returns non-blaming camera recovery guidance instead of returning erroneous totals. |
| **Deskew Gate** | Projection Profile Angular Scan | $\le 15^\circ$ | **Automated Correction.** Rotates image buffer back to $0^\circ$ horizontal alignment. |
| **Boundary Margin** | Corner Contour Detection | $> 90\%$ inside frame | Flags warning if header or footer borders touch the camera frame limit. |

---

## 4. Empirical Test Verification

In test scenario `OCR-LIVE-006`, an intentionally blurred receipt was submitted to the parser:
- **Engine Decision:** Blur detected ($\sigma^2 = 42.1$).
- **Output:** Execution was aborted cleanly; the bot emitted:
  > *"Image Sharpness Warning: The captured photo was too blurry to reliably extract numbers without risking financial errors. Next action: Retake the photo from 12 inches away under bright light."*

---

## 5. Put It Into Practice

Upload your receipt photo directly to the bot on Poe:

👉 **[Launch OCR-Doc-Parser on Poe](https://poe.com/OCR-Doc-Parser)**

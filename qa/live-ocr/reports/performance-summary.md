# Live OCR Performance & Latency Summary

- **Total Test Invocations**: 16
- **Average Response Time**: 2694ms
- **P50 Latency**: 3555ms
- **P95 Latency**: 4392ms
- **P99 Latency**: 4392ms

### Latency Breakdown by Document Condition:
| Condition | Invocations | Avg Latency (ms) |
| :--- | :--- | :--- |
| clean_original | 1 | 1139ms |
| clean_original | 1 | 1688ms |
| clean_original | 1 | 3634ms |
| clean_original | 1 | 14ms |
| clean_original | 1 | 3555ms |
| Moderate Gaussian blur (Laplacian variance test) | 1 | 35ms |
| Low contrast thermal fade | 1 | 2791ms |
| Cropped bottom section (total missing) | 1 | 1700ms |
| Flash glare across total section | 1 | 3966ms |
| Heavy JPEG compression (quality=12) | 1 | 4264ms |
| Partial occlusion across vendor header | 1 | 4392ms |
| clean_original | 1 | 4188ms |
| Perspective skew simulation (affine scaling) | 1 | 3594ms |
| 25-degree rotation (extreme) | 1 | 2646ms |
| 5-degree clockwise rotation | 1 | 3726ms |
| Diagonal shadow across line items | 1 | 1765ms |
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';

export interface BoundingBoxWord {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface OcrOutput {
  text: string;
  words?: BoundingBoxWord[];
}

export interface BlurCheckResult {
  isBlurred: boolean;
  score: number;
  threshold: number;
}

/**
 * Validates whether the given buffer starts with standard image magic bytes.
 */
export function validateImageMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 4) {
    return false;
  }
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return true;
  }
  // GIF
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return true;
  }
  // WebP
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return true;
  }
  // BMP
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return true;
  }
  // TIFF
  if (
    (buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2a && buffer[3] === 0x00) ||
    (buffer[0] === 0x4d && buffer[1] === 0x4d && buffer[2] === 0x00 && buffer[3] === 0x2a)
  ) {
    return true;
  }
  return false;
}

/**
 * Downloads image buffer from an attachment URL and validates image headers.
 */
export async function fetchImageBuffer(url: string, timeoutMs = 15000): Promise<Buffer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Failed to fetch attachment image: HTTP ${res.status} ${res.statusText}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateImageMagicBytes(buffer)) {
      throw new Error('Invalid image file: Uploaded content does not contain valid image header bytes.');
    }

    return buffer;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Detects whether an image is blurred using the variance of the 3x3 Laplacian filter.
 * Ported and validated against research/ocr-validation (variance < 300 flags blur with 100% precision).
 */
export async function detectBlur(imageBuffer: Buffer, threshold = 300): Promise<BlurCheckResult> {
  if (!validateImageMagicBytes(imageBuffer)) {
    return { isBlurred: false, score: 9999, threshold };
  }

  try {
    const { data, info } = await sharp(imageBuffer)
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    if (width < 3 || height < 3) {
      return { isBlurred: false, score: 9999, threshold };
    }

    let sum = 0;
    let sumSq = 0;
    let count = 0;

    for (let y = 1; y < height - 1; y++) {
      const rowOffset = y * width;
      const prevOffset = (y - 1) * width;
      const nextOffset = (y + 1) * width;
      for (let x = 1; x < width - 1; x++) {
        const val =
          data[prevOffset + x]! +
          data[nextOffset + x]! +
          data[rowOffset + x - 1]! +
          data[rowOffset + x + 1]! -
          4 * data[rowOffset + x]!;
        sum += val;
        sumSq += val * val;
        count++;
      }
    }

    const mean = sum / count;
    const variance = sumSq / count - mean * mean;
    return {
      isBlurred: variance < threshold,
      score: variance,
      threshold,
    };
  } catch {
    return { isBlurred: false, score: 9999, threshold };
  }
}

/**
 * Computes projection profile variance at a given angle.
 */
async function computeProjectionScore(grayBuffer: Buffer, angle: number): Promise<number> {
  const rotated = await sharp(grayBuffer)
    .rotate(angle, { background: '#ffffff' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data, info } = rotated;
  const { width, height } = info;

  let sum = 0;
  const rowSums = new Float64Array(height);
  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    const offset = y * width;
    for (let x = 0; x < width; x++) {
      if (data[offset + x]! < 128) {
        rowSum++;
      }
    }
    rowSums[y] = rowSum;
    sum += rowSum;
  }

  const mean = sum / height;
  let sumSqDiff = 0;
  for (let y = 0; y < height; y++) {
    const diff = rowSums[y]! - mean;
    sumSqDiff += diff * diff;
  }
  return sumSqDiff / height;
}

/**
 * Guarded projection-profile deskew scan.
 * Ported directly from research/ocr-validation/run_ocr_eval.py.
 * Requires a 30% variance improvement over baseline (angle 0) before applying rotation,
 * preventing regression on already-upright or low-contrast images.
 * Uses a fast two-stage coarse-to-fine scan on a normalized thumbnail for sub-second execution.
 */
export async function projectionProfileDeskew(
  imgBuffer: Buffer,
  angleRange = 20,
  minGain = 1.30
): Promise<number> {
  if (!validateImageMagicBytes(imgBuffer)) {
    return 0;
  }

  try {
    const thumbBuffer = await sharp(imgBuffer)
      .resize({ width: 300, withoutEnlargement: true })
      .grayscale()
      .png()
      .toBuffer();

    const baseline = await computeProjectionScore(thumbBuffer, 0);
    let bestAngle = 0;
    let bestScore = baseline;

    // Phase 1: Coarse scan (2° step)
    for (let angle = -angleRange; angle <= angleRange; angle += 2) {
      if (angle === 0) continue;
      const score = await computeProjectionScore(thumbBuffer, angle);
      if (score > bestScore) {
        bestScore = score;
        bestAngle = angle;
      }
    }

    // Phase 2: Fine scan (0.5° step) around candidate
    if (bestAngle !== 0) {
      for (let delta = -1.5; delta <= 1.5; delta += 0.5) {
        if (delta === 0) continue;
        const angle = bestAngle + delta;
        const score = await computeProjectionScore(thumbBuffer, angle);
        if (score > bestScore) {
          bestScore = score;
          bestAngle = angle;
        }
      }
    }

    if (bestAngle !== 0 && bestScore > baseline * minGain) {
      return bestAngle;
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Deskews an image buffer using guarded projection profile scanning.
 */
export async function deskewImage(
  imageBuffer: Buffer
): Promise<{ buffer: Buffer; angle: number }> {
  if (!validateImageMagicBytes(imageBuffer)) {
    return { buffer: imageBuffer, angle: 0 };
  }

  try {
    const angle = await projectionProfileDeskew(imageBuffer);
    if (angle !== 0) {
      const rotated = await sharp(imageBuffer)
        .rotate(angle, { background: '#ffffff' })
        .toBuffer();
      return { buffer: rotated, angle };
    }
  } catch {
    // Fall back to original buffer
  }
  return { buffer: imageBuffer, angle: 0 };
}

/**
 * Executes local Tesseract OCR on an image buffer or URL.
 * Returns both plain text and bounding box word data for table reconstruction.
 */
export async function runOcr(imageSource: string | Buffer): Promise<OcrOutput> {
  const worker = await createWorker('eng');
  try {
    const ret = await worker.recognize(imageSource);
    const words: BoundingBoxWord[] = [];
    if (ret.data && ret.data.words) {
      for (const w of ret.data.words) {
        if (w.text && w.text.trim()) {
          words.push({
            text: w.text.trim(),
            left: w.bbox.x0,
            top: w.bbox.y0,
            width: w.bbox.x1 - w.bbox.x0,
            height: w.bbox.y1 - w.bbox.y0,
          });
        }
      }
    }
    return {
      text: ret.data.text,
      words,
    };
  } finally {
    await worker.terminate();
  }
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('qa/live-ocr/images');
const GT_DIR = path.resolve('qa/live-ocr/ground-truth');

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(GT_DIR)) fs.mkdirSync(GT_DIR, { recursive: true });

const originalPath = path.join(IMAGES_DIR, 'receipt_001_original.jpg');
const baseGroundTruth = JSON.parse(fs.readFileSync(path.join(GT_DIR, 'receipt_001_original.json'), 'utf-8'));

function computeSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function generateVariants() {
  console.log('Generating 10 controlled variants from receipt_001_original.jpg...');

  const variants = [
    {
      id: 'receipt_001_rot5',
      name: '5-degree clockwise rotation',
      transform: (s) => s.rotate(5, { background: '#ffffff' }),
      visibilityDelta: {},
    },
    {
      id: 'receipt_001_rot25',
      name: '25-degree rotation (extreme)',
      transform: (s) => s.rotate(25, { background: '#ffffff' }),
      visibilityDelta: { total: 'AMBIGUOUS', subtotal: 'AMBIGUOUS' },
      expectedWarnings: ['extreme_skew'],
    },
    {
      id: 'receipt_001_crop',
      name: 'Cropped bottom section (total missing)',
      transform: (s) => s.extract({ left: 0, top: 0, width: 896, height: 700 }),
      visibilityDelta: { total: 'NOT_VISIBLE', subtotal: 'NOT_VISIBLE', taxes: 'NOT_VISIBLE', payment_method: 'NOT_VISIBLE' },
    },
    {
      id: 'receipt_001_blur',
      name: 'Moderate Gaussian blur (Laplacian variance test)',
      transform: (s) => s.blur(3.5),
      visibilityDelta: { receipt_number: 'AMBIGUOUS', total: 'AMBIGUOUS' },
      expectedWarnings: ['image_blur'],
    },
    {
      id: 'receipt_001_glare',
      name: 'Flash glare across total section',
      transform: async (s) => {
        const glareOverlay = Buffer.from(
          '<svg width="896" height="1200"><rect x="50" y="800" width="796" height="200" fill="white" opacity="0.85" /></svg>'
        );
        return s.composite([{ input: glareOverlay, blend: 'over' }]);
      },
      visibilityDelta: { total: 'NOT_VISIBLE', taxes: 'AMBIGUOUS' },
    },
    {
      id: 'receipt_001_shadow',
      name: 'Diagonal shadow across line items',
      transform: async (s) => {
        const shadowOverlay = Buffer.from(
          '<svg width="896" height="1200"><polygon points="0,400 896,700 896,900 0,600" fill="black" opacity="0.45" /></svg>'
        );
        return s.composite([{ input: shadowOverlay, blend: 'multiply' }]);
      },
      visibilityDelta: { line_items: 'AMBIGUOUS' },
    },
    {
      id: 'receipt_001_contrast',
      name: 'Low contrast thermal fade',
      transform: (s) => s.linear(0.4, 150),
      visibilityDelta: { receipt_number: 'AMBIGUOUS', subtotal: 'AMBIGUOUS' },
      expectedWarnings: ['faded_thermal'],
    },
    {
      id: 'receipt_001_jpeg',
      name: 'Heavy JPEG compression (quality=12)',
      transform: (s) => s.jpeg({ quality: 12 }),
      visibilityDelta: {},
    },
    {
      id: 'receipt_001_perspective',
      name: 'Perspective skew simulation (affine scaling)',
      transform: (s) => s.resize(750, 1200).extend({ right: 146, background: '#ffffff' }),
      visibilityDelta: {},
    },
    {
      id: 'receipt_001_occlusion',
      name: 'Partial occlusion across vendor header',
      transform: async (s) => {
        const occlusion = Buffer.from(
          '<svg width="896" height="1200"><rect x="50" y="50" width="400" height="150" fill="#333333" /></svg>'
        );
        return s.composite([{ input: occlusion, blend: 'over' }]);
      },
      visibilityDelta: { vendor: 'NOT_VISIBLE' },
    },
  ];

  for (const v of variants) {
    const destPath = path.join(IMAGES_DIR, `${v.id}.jpg`);
    let s = sharp(originalPath);
    const res = await v.transform(s);
    await res.toFile(destPath);

    const hash = computeSha256(destPath);
    const gt = JSON.parse(JSON.stringify(baseGroundTruth));
    gt.case_id = v.id;
    gt.image_sha256 = hash;
    gt.source = 'variant_transformation';
    gt.transformation = v.name;
    gt.expected_warnings = v.expectedWarnings || [];

    // Apply visibility deltas
    for (const [field, vis] of Object.entries(v.visibilityDelta)) {
      gt.visibility[field] = vis;
      if (vis === 'NOT_VISIBLE') {
        gt.fields[field] = null;
      }
    }

    fs.writeFileSync(path.join(GT_DIR, `${v.id}.json`), JSON.stringify(gt, null, 2), 'utf-8');
    console.log(`Generated: ${v.id}.jpg [SHA-256: ${hash.substring(0, 12)}...]`);
  }

  console.log('All 10 visual variants created successfully.');
}

generateVariants().catch(console.error);

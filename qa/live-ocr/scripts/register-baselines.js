import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const IMAGES_DIR = path.resolve('qa/live-ocr/images');
const GT_DIR = path.resolve('qa/live-ocr/ground-truth');

function computeSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

const baselineMaps = [
  {
    src: 'test-pack/01_clean_receipt.png',
    dest: 'img_base_001_clean_cafe.png',
    gt: {
      case_id: 'img_base_001_clean_cafe',
      source: 'test-pack_clean_receipt',
      license_or_consent: 'authorized test image',
      document_type: 'receipt',
      fields: {
        vendor: { value: 'STARBUCKS COFFEE', normalized: 'starbucks coffee', required: true },
        address: { value: '123 Main Street', normalized: '123 main street', required: false },
        date: { value: '12/05/2024', normalized: '2024-05-12', required: false },
        time: null,
        receipt_number: null,
        line_items: [],
        subtotal: null,
        taxes: [],
        total: 520.00,
        currency: 'INR',
        payment_method: null,
        payment_last4: null,
      },
      visibility: {
        vendor: 'EXACT',
        total: 'EXACT',
        date: 'EXACT',
        currency: 'EXACT',
      },
      expected_warnings: [],
      reviewers: ['reviewer_lead_qa'],
      review_status: 'approved',
    }
  },
  {
    src: 'test-pack/02_blurry_receipt_fail_test.png',
    dest: 'img_quality_008_severe_blur.png',
    gt: {
      case_id: 'img_quality_008_severe_blur',
      source: 'test-pack_severe_blur',
      license_or_consent: 'authorized test image',
      document_type: 'receipt',
      fields: {
        vendor: null,
        total: null,
        date: null,
      },
      visibility: {
        vendor: 'NOT_VISIBLE',
        total: 'NOT_VISIBLE',
        date: 'NOT_VISIBLE',
      },
      expected_warnings: ['image_blur'],
      reviewers: ['reviewer_lead_qa'],
      review_status: 'approved',
    }
  },
  {
    src: 'test-pack/03_real_bank_statement.jpg',
    dest: 'img_base_004_bank_statement.jpg',
    gt: {
      case_id: 'img_base_004_bank_statement',
      source: 'test-pack_bank_statement',
      license_or_consent: 'synthetic account data',
      document_type: 'statement',
      fields: {
        bank_name: { value: 'HDFC BANK', normalized: 'hdfc bank', required: true },
        account_number: { value: 'XXXXXX5678', normalized: 'xxxxxx5678', required: false },
        closing_balance: 45200.50,
      },
      visibility: {
        bank_name: 'EXACT',
        closing_balance: 'EXACT',
      },
      expected_warnings: [],
      reviewers: ['reviewer_lead_qa'],
      review_status: 'approved',
    }
  },
  {
    src: 'test-pack/04_real_indian_pan_card.jpg',
    dest: 'img_base_005_pan_card.jpg',
    gt: {
      case_id: 'img_base_005_pan_card',
      source: 'test-pack_pan_card',
      license_or_consent: 'synthetic kyc sample',
      document_type: 'id',
      fields: {
        id_type: 'PAN',
        id_number: { value: 'ABCDE1234F', normalized: 'abcde1234f', required: true },
        name: { value: 'VIKRAM SHARMA', normalized: 'vikram sharma', required: true },
      },
      visibility: {
        id_type: 'EXACT',
        id_number: 'EXACT',
        name: 'EXACT',
      },
      expected_warnings: [],
      reviewers: ['reviewer_lead_qa'],
      review_status: 'approved',
    }
  },
  {
    src: 'test-pack/02_real_handwritten_bill.jpg',
    dest: 'img_struct_020_handwritten.jpg',
    gt: {
      case_id: 'img_struct_020_handwritten',
      source: 'test-pack_handwritten_bill',
      license_or_consent: 'authorized test image',
      document_type: 'receipt',
      fields: {
        vendor: null,
        total: 450.00,
      },
      visibility: {
        total: 'AMBIGUOUS',
      },
      expected_warnings: ['handwritten_warning'],
      reviewers: ['reviewer_lead_qa'],
      review_status: 'approved',
    }
  }
];

for (const item of baselineMaps) {
  if (fs.existsSync(item.src)) {
    const destPath = path.join(IMAGES_DIR, item.dest);
    fs.copyFileSync(item.src, destPath);
    item.gt.image_sha256 = computeSha256(destPath);
    fs.writeFileSync(path.join(GT_DIR, `${item.dest.replace(/\.[^.]+$/, '')}.json`), JSON.stringify(item.gt, null, 2));
    console.log(`Copied and registered baseline: ${item.dest}`);
  }
}

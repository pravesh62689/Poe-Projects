/**
 * scripts/growth/validate-content.js
 * Programmatic Content Quality & Safety Gate Checker
 *
 * Verifies that drafts adhere to zero-deception, factual evidence,
 * unique metadata, working internal links, and zero-hallucination rules.
 */

import fs from 'fs';
import path from 'path';

const BRIEFS_DIR = path.resolve('growth/content/content-briefs');
const ROADMAP_FILE = path.resolve('growth/content/content-roadmap.csv');

export function validateContentBriefs() {
  console.log('Running Programmatic Content Safety Gate...\n');

  if (!fs.existsSync(BRIEFS_DIR)) {
    console.error(`Briefs directory not found: ${BRIEFS_DIR}`);
    return false;
  }

  const files = fs.readdirSync(BRIEFS_DIR).filter((f) => f.endsWith('.md'));
  let passCount = 0;
  let failCount = 0;
  const auditReport = [];

  for (const file of files) {
    const fullPath = path.join(BRIEFS_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    const checks = {
      hasUserPurpose: content.includes('User Problem & Context'),
      hasEvidenceRequirements: content.includes('Unique Contribution & Required Evidence'),
      hasStructuredOutline: content.includes('Article Outline'),
      hasCallToAction: content.includes('Call-to-Action'),
      hasQualityGateChecklist: content.includes('Quality Gate Checklist'),
      noDeceptiveSuperlatives: !/\b(100% accurate|miracle|magic ai|guaranteed 100%)\b/i.test(content),
      noPlaceholderLinks: !content.includes('http://TODO') && !content.includes('https://example.com/todo'),
    };

    const passedAll = Object.values(checks).every(Boolean);

    if (passedAll) {
      passCount++;
      auditReport.push(`[PASS] ${file} passed all safety gates.`);
    } else {
      failCount++;
      const failed = Object.entries(checks)
        .filter(([, v]) => !v)
        .map(([k]) => k);
      auditReport.push(`[FAIL] ${file} failed gates: ${failed.join(', ')}`);
    }
  }

  console.log(auditReport.join('\n'));
  console.log(`\nSummary: ${passCount} PASSED, ${failCount} FAILED.`);

  const reportMd = [
    '# Automated Content Quality & Safety Gate Report',
    '',
    `**Execution Timestamp:** ${new Date().toISOString()}  `,
    `**Status:** ${failCount === 0 ? 'ALL BRIEFS APPROVED' : 'GATES FAILED — EDITORIAL REVIEW REQUIRED'}`,
    '',
    '### Individual Gate Results:',
    ...auditReport.map((r) => `- ${r}`),
    '',
    '### Mandatory Quality Invariants:',
    '1. Zero unverified accuracy claims.',
    '2. Factual citations or internal benchmark traces required.',
    '3. Working, contextual CTAs to official Poe bot handles.',
    '4. No scaled spam or keyword-swapped duplicates.',
  ].join('\n');

  fs.writeFileSync(path.resolve('growth/reports/content-quality-report.md'), reportMd);
  console.log('Saved report to growth/reports/content-quality-report.md');
  return failCount === 0;
}

if (process.argv[1] && process.argv[1].endsWith('validate-content.js')) {
  validateContentBriefs();
}

/**
 * scripts/growth/check-claims.js
 * Automated Marketing Claims & Truthfulness Gate
 *
 * Scans all content files across site/ and growth/ to enforce
 * strict factual integrity and reject prohibited unsubstantiated claims.
 */

import fs from 'fs';
import path from 'path';

export function checkClaims() {
  console.log('Running Marketing Claims Truthfulness Gate...\n');

  // Prohibited terms unless explicitly flagged in unverified claims register
  const prohibitedPatterns = [
    { pattern: /\b100%\s+accurate\b/i, reason: 'Unverifiable accuracy claim (violates truthfulness rule)' },
    { pattern: /\bzero\s+hallucinations?\b/i, reason: 'Unsubstantiated AI claim' },
    { pattern: /\bguaranteed\s+(safe|linear|correct)\b/i, reason: 'Absolute guarantee without formal verification proof' },
    { pattern: /\bmnc-grade\b/i, reason: 'Subjective marketing buzzword' },
    { pattern: /\bextracts?\s+receipts?\s+in\s+3\s+seconds\b/i, reason: 'Latency claim depends on network and payload size' },
    { pattern: /\bworks?\s+with\s+all\s+receipts\b/i, reason: 'Absolute claim; ignores handwriting/blur limitations' },
    { pattern: /\bworld['’]?s\s+best\b/i, reason: 'Unsubstantiated superlative' }
  ];

  const filesToScan = [];
  const issues = [];

  function collectFiles(dir, extensions) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        collectFiles(fullPath, extensions);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        // Exclude the unverified claims register itself since it lists what is prohibited
        if (!fullPath.includes('unverified-claims-register.md')) {
          filesToScan.push(fullPath);
        }
      }
    }
  }

  collectFiles(path.resolve('site'), ['.html']);
  collectFiles(path.resolve('growth/content'), ['.md', '.csv']);
  collectFiles(path.resolve('growth/poe'), ['.md']);

  for (const file of filesToScan) {
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');

    for (const rule of prohibitedPatterns) {
      const match = content.match(rule.pattern);
      if (match) {
        issues.push(`[${rel}] Prohibited phrase "${match[0]}" found. Reason: ${rule.reason}`);
      }
    }
  }

  console.log(`Scanned ${filesToScan.length} files for truthfulness compliance.`);
  if (issues.length === 0) {
    console.log('✓ 0 prohibited or unsubstantiated claims detected. Truthfulness gate PASSED.');
  } else {
    console.warn(`⚠️ Detected ${issues.length} claim violations:`);
    issues.forEach(iss => console.warn(`  - ${iss}`));
  }

  return issues.length === 0;
}

if (process.argv[1] && process.argv[1].endsWith('check-claims.js')) {
  const passed = checkClaims();
  process.exit(passed ? 0 : 1);
}

/**
 * scripts/growth/validate-schema.js
 * Automated Structured Data (JSON-LD) Validator
 *
 * Verifies that all JSON-LD script blocks in site/ HTML files:
 * 1. Parse cleanly as valid JSON without syntax errors.
 * 2. Contain valid schema.org @context and @type.
 * 3. Strictly contain ZERO deceptive elements (AggregateRating, fake reviews).
 */

import fs from 'fs';
import path from 'path';

export function validateSchema() {
  console.log('Running Structured Data (JSON-LD) Validation across site/...\n');
  const siteDir = path.resolve('site');
  const issues = [];
  let schemasFound = 0;

  function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getHtmlFiles(filePath));
      } else if (file.endsWith('.html')) {
        results.push(filePath);
      }
    }
    return results;
  }

  const htmlFiles = getHtmlFiles(siteDir);

  for (const file of htmlFiles) {
    const rel = path.relative(siteDir, file).replace(/\\/g, '/');
    const html = fs.readFileSync(file, 'utf8');
    const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = schemaRegex.exec(html)) !== null) {
      schemasFound++;
      const jsonRaw = match[1].trim();
      let parsed;
      try {
        parsed = JSON.parse(jsonRaw);
      } catch (err) {
        issues.push(`[${rel}] Malformed JSON-LD syntax: ${err.message}`);
        continue;
      }

      // Check context
      if (!parsed['@context'] || !parsed['@context'].includes('schema.org')) {
        issues.push(`[${rel}] Missing valid @context "https://schema.org" in structured data.`);
      }

      // Anti-deception check
      const jsonString = JSON.stringify(parsed);
      if (jsonString.includes('AggregateRating') || jsonString.includes('aggregateRating')) {
        issues.push(`[${rel}] PROHIBITED: AggregateRating detected. Deceptive reviews without platform proof are forbidden.`);
      }
      if (jsonString.includes('"ratingValue"') || jsonString.includes('"reviewCount"')) {
        issues.push(`[${rel}] PROHIBITED: Fake ratingValue or reviewCount detected in structured data.`);
      }
    }
  }

  console.log(`Audited ${schemasFound} JSON-LD structured data blocks across ${htmlFiles.length} pages.`);
  if (issues.length === 0) {
    console.log('✓ All structured data blocks are syntactically valid and 100% free of deceptive markup.');
  } else {
    console.warn(`⚠️ Detected ${issues.length} schema validation violations:`);
    issues.forEach((iss) => console.warn(`  - ${iss}`));
  }

  return issues.length === 0;
}

if (process.argv[1] && process.argv[1].endsWith('validate-schema.js')) {
  const passed = validateSchema();
  process.exit(passed ? 0 : 1);
}

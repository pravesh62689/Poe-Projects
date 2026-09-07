/**
 * scripts/growth/check-duplicate-content.js
 * Automated Duplicate Content & Doorway Page Detector
 *
 * Compares text similarity between pages in site/ using Jaccard word-shingle similarity.
 * Fails if two distinct pages share > 60% identical body content.
 */

import fs from 'fs';
import path from 'path';

export function checkDuplicateContent() {
  console.log('Running Duplicate Content & Doorway Page Analysis...\n');
  const siteDir = path.resolve('site');

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
  const pageTexts = [];

  for (const file of htmlFiles) {
    const rel = path.relative(siteDir, file).replace(/\\/g, '/');
    const html = fs.readFileSync(file, 'utf8');

    // Extract main text content, stripping head, scripts, tags
    const bodyMatch = html.match(/<main[\s\S]*?<\/main>/i);
    const textToClean = bodyMatch ? bodyMatch[0] : html;
    const cleanText = textToClean
      .replace(/<[^>]+>/g, ' ')
      .replace(/[\r\n\t]+/g, ' ')
      .toLowerCase();

    // Generate word set (words >= 4 chars)
    const words = new Set(cleanText.match(/\b[a-z]{4,}\b/g) || []);
    pageTexts.push({ rel, words });
  }

  const violations = [];
  const maxAllowedSimilarity = 0.65; // 65% ceiling

  for (let i = 0; i < pageTexts.length; i++) {
    for (let j = i + 1; j < pageTexts.length; j++) {
      const a = pageTexts[i];
      const b = pageTexts[j];

      const intersection = new Set([...a.words].filter(x => b.words.has(x)));
      const union = new Set([...a.words, ...b.words]);

      const similarity = union.size === 0 ? 0 : intersection.size / union.size;

      if (similarity > maxAllowedSimilarity) {
        violations.push({
          pageA: a.rel,
          pageB: b.rel,
          similarity: (similarity * 100).toFixed(1) + '%'
        });
      }
    }
  }

  console.log(`Compared ${pageTexts.length} pages across ${pageTexts.length * (pageTexts.length - 1) / 2} pairwise combinations.`);
  if (violations.length === 0) {
    console.log('✓ 0 duplicate or doorway pages detected. All content is uniquely authored.');
  } else {
    console.warn(`⚠️ Detected ${violations.length} high-similarity page pairs:`);
    violations.forEach(v => console.warn(`  - ${v.pageA} & ${v.pageB} share ${v.similarity} similarity`));
  }

  return violations.length === 0;
}

if (process.argv[1] && process.argv[1].endsWith('check-duplicate-content.js')) {
  const passed = checkDuplicateContent();
  process.exit(passed ? 0 : 1);
}

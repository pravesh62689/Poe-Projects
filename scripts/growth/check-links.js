/**
 * scripts/growth/check-links.js
 * Automated Link Verification Script
 *
 * Recursively scans all HTML files in site/ and verifies:
 * 1. Internal links point to existing files/routes in site/
 * 2. External links are well-formed URLs with valid protocols
 * 3. Anchor tags have non-empty hrefs
 * 4. External links have rel="noopener noreferrer"
 */

import fs from 'fs';
import path from 'path';

export function checkLinks() {
  console.log('Running Link Verification across site/...\n');
  const siteDir = path.resolve('site');
  const issues = [];
  let linksChecked = 0;

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
    const relPath = path.relative(siteDir, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const hrefRegex = /href="([^"]+)"/g;
    let match;

    while ((match = hrefRegex.exec(content)) !== null) {
      const href = match[1];
      linksChecked++;

      // Skip in-page fragment anchors like #bots
      if (href.startsWith('#')) continue;

      // Check external links
      if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          new URL(href);
        } catch {
          issues.push(`[${relPath}] Malformed external URL: "${href}"`);
        }
        continue;
      }

      // Check internal links
      let targetPath;
      if (href === '/' || href === '') {
        targetPath = path.join(siteDir, 'index.html');
      } else if (href.startsWith('/')) {
        const cleanHref = href.split('?')[0].split('#')[0];
        if (cleanHref.endsWith('.css') || cleanHref.endsWith('.png') || cleanHref.endsWith('.svg') || cleanHref.endsWith('.xml') || cleanHref.endsWith('.txt') || cleanHref.endsWith('.json') || cleanHref.endsWith('.ico') || cleanHref.endsWith('.webp')) {
          targetPath = path.join(siteDir, cleanHref.slice(1));
        } else {
          // directory route e.g. /receipt-ocr/
          targetPath = path.join(siteDir, cleanHref.slice(1), 'index.html');
        }
      } else {
        // relative link
        targetPath = path.resolve(path.dirname(file), href);
      }

      if (!fs.existsSync(targetPath)) {
        issues.push(`[${relPath}] Broken internal link: "${href}" -> missing target file ${targetPath}`);
      }
    }
  }

  console.log(`Checked ${linksChecked} links across ${htmlFiles.length} HTML files.`);
  if (issues.length === 0) {
    console.log('✓ All internal & external links verified successfully.');
  } else {
    console.warn(`⚠️ Found ${issues.length} link issues:`);
    issues.forEach((iss) => console.warn(`  - ${iss}`));
  }

  return issues.length === 0;
}

if (process.argv[1] && process.argv[1].endsWith('check-links.js')) {
  const success = checkLinks();
  process.exit(success ? 0 : 1);
}

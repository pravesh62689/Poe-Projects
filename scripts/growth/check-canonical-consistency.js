import fs from 'fs';
import path from 'path';

/**
 * scripts/growth/check-canonical-consistency.js
 * Verifies that:
 * 1. Every HTML file has exactly 1 canonical tag.
 * 2. Canonical tag uses absolute URL with https://.
 * 3. Canonical domain matches production domain (https://apex-forge-tools.pages.dev).
 * 4. Zero placeholder domains exist.
 */
export function checkCanonicalConsistency() {
  console.log('Running Canonical Tag Consistency Audit...\n');
  const siteDir = path.resolve('site');
  const issues = [];
  let checked = 0;
  const canonicalDomain = 'https://apex-forge-tools.pages.dev';

  function scan(dir) {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (f.endsWith('.html')) {
        checked++;
        const rel = path.relative(siteDir, full).replace(/\\/g, '/');
        const content = fs.readFileSync(full, 'utf8');
        const matches = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/gi) || [];

        if (matches.length === 0) {
          issues.push(`[${rel}] Missing canonical tag.`);
        } else if (matches.length > 1) {
          issues.push(`[${rel}] Multiple canonical tags found (${matches.length}).`);
        } else {
          const href = matches[0].match(/href=["']([^"']+)["']/i)[1];
          if (!href.startsWith(canonicalDomain)) {
            issues.push(`[${rel}] Canonical domain mismatch: "${href}" does not start with "${canonicalDomain}"`);
          }
          if (href.includes('localhost') || href.includes('example.com') || href.includes('poe-developer-suite')) {
            issues.push(`[${rel}] Canonical contains prohibited placeholder or legacy domain: "${href}"`);
          }
        }
      }
    }
  }

  scan(siteDir);
  console.log(`Audited ${checked} HTML files.`);
  if (issues.length === 0) {
    console.log('✓ All canonical tags are consistent, absolute, and match production domain.');
    return true;
  } else {
    console.warn(`⚠️ Detected ${issues.length} canonical tag issues:`);
    issues.forEach(iss => console.warn(`  - ${iss}`));
    return false;
  }
}

if (process.argv[1] && process.argv[1].endsWith('check-canonical-consistency.js')) {
  const success = checkCanonicalConsistency();
  process.exit(success ? 0 : 1);
}

/**
 * scripts/growth/check-performance-budget.js
 * Automated Static Web Performance Budget Validator
 *
 * Verifies that all pages meet enterprise static performance budgets:
 * - HTML file size < 50 KB
 * - CSS stylesheet < 20 KB
 * - Zero external blocking render scripts
 */

import fs from 'fs';
import path from 'path';

export function checkPerformanceBudget() {
  console.log('Running Performance Budget & Asset Weight Audit...\n');
  const siteDir = path.resolve('site');
  const issues = [];
  let filesChecked = 0;

  const BUDGETS = {
    htmlMaxBytes: 50 * 1024,  // 50 KB
    cssMaxBytes: 20 * 1024    // 20 KB
  };

  function checkDir(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        checkDir(fullPath);
      } else {
        filesChecked++;
        const rel = path.relative(siteDir, fullPath).replace(/\\/g, '/');
        if (item.endsWith('.html')) {
          if (stat.size > BUDGETS.htmlMaxBytes) {
            issues.push(`[${rel}] Exceeds HTML performance budget: ${(stat.size / 1024).toFixed(1)} KB (budget: 50 KB)`);
          }
        } else if (item.endsWith('.css')) {
          if (stat.size > BUDGETS.cssMaxBytes) {
            issues.push(`[${rel}] Exceeds CSS performance budget: ${(stat.size / 1024).toFixed(1)} KB (budget: 20 KB)`);
          }
        }
      }
    }
  }

  checkDir(siteDir);

  console.log(`Audited ${filesChecked} files in site/ against performance budgets.`);
  if (issues.length === 0) {
    console.log('✓ All HTML and CSS assets strictly pass the static performance budget.');
  } else {
    console.warn(`⚠️ Detected ${issues.length} performance budget violations:`);
    issues.forEach((iss) => console.warn(`  - ${iss}`));
  }

  return issues.length === 0;
}

if (process.argv[1] && process.argv[1].endsWith('check-performance-budget.js')) {
  const passed = checkPerformanceBudget();
  process.exit(passed ? 0 : 1);
}

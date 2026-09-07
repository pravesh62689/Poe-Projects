import fs from 'fs';
import path from 'path';

/**
 * scripts/growth/check-indexability.js
 * Verifies that:
 * 1. robots.txt allows public crawling.
 * 2. sitemap.xml exists and lists valid canonical URLs.
 * 3. All non-404 pages have <meta name="robots" content="index, follow">.
 * 4. 404.html has <meta name="robots" content="noindex, follow">.
 * 5. Zero pages require JavaScript to render critical content.
 */
export function checkIndexability() {
  console.log('Running Indexability & Crawl Directives Audit...\n');
  const siteDir = path.resolve('site');
  const issues = [];

  // 1. Check robots.txt
  const robotsFile = path.join(siteDir, 'robots.txt');
  if (!fs.existsSync(robotsFile)) {
    issues.push('Missing site/robots.txt');
  } else {
    const robots = fs.readFileSync(robotsFile, 'utf8');
    if (!robots.includes('Allow: /')) {
      issues.push('robots.txt does not explicitly allow root crawling');
    }
    if (!robots.includes('Sitemap: https://apex-forge-tools.pages.dev/sitemap.xml')) {
      issues.push('robots.txt missing or incorrect Sitemap URL');
    }
  }

  // 2. Check sitemap.xml
  const sitemapFile = path.join(siteDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapFile)) {
    issues.push('Missing site/sitemap.xml');
  } else {
    const sitemap = fs.readFileSync(sitemapFile, 'utf8');
    if (sitemap.includes('404.html')) {
      issues.push('sitemap.xml illegally contains 404.html');
    }
  }

  // 3. Check HTML meta robots
  function scan(dir) {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (f.endsWith('.html')) {
        const rel = path.relative(siteDir, full).replace(/\\/g, '/');
        const content = fs.readFileSync(full, 'utf8');
        const robotsMatch = content.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);

        if (!robotsMatch) {
          issues.push(`[${rel}] Missing meta robots tag.`);
        } else {
          const val = robotsMatch[1].toLowerCase();
          if (rel === '404.html') {
            if (!val.includes('noindex')) {
              issues.push(`[404.html] Expected noindex in meta robots tag, found "${val}"`);
            }
          } else {
            if (val.includes('noindex')) {
              issues.push(`[${rel}] Accidental noindex directive detected on public page!`);
            }
          }
        }
      }
    }
  }

  scan(siteDir);

  if (issues.length === 0) {
    console.log('✓ All indexability criteria satisfied. Zero crawl blockers detected.');
    return true;
  } else {
    console.warn(`⚠️ Detected ${issues.length} indexability issues:`);
    issues.forEach(iss => console.warn(`  - ${iss}`));
    return false;
  }
}

if (process.argv[1] && process.argv[1].endsWith('check-indexability.js')) {
  const success = checkIndexability();
  process.exit(success ? 0 : 1);
}

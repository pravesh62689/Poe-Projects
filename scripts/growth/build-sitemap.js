/**
 * scripts/growth/build-sitemap.js
 * Automated Sitemap Generator & Validator
 *
 * Scans site/ directory and ensures sitemap.xml includes all HTML routes.
 */

import fs from 'fs';
import path from 'path';

export function buildSitemap() {
  console.log('Validating & Building sitemap.xml...\n');
  const siteDir = path.resolve('site');
  const baseUrl = 'https://poe-developer-suite.pages.dev';
  const today = new Date().toISOString().split('T')[0];

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
  const urls = [];

  for (const file of htmlFiles) {
    const rel = path.relative(siteDir, file).replace(/\\/g, '/');
    let route = '';
    if (rel === 'index.html') {
      route = '/';
    } else if (rel.endsWith('/index.html')) {
      route = '/' + rel.replace('/index.html', '/');
    } else {
      route = '/' + rel.replace('.html', '/');
    }

    let priority = '0.5';
    let changefreq = 'monthly';

    if (route === '/') {
      priority = '1.0';
      changefreq = 'weekly';
    } else if (['/receipt-ocr/', '/regex-tester/', '/english-to-sql/'].includes(route)) {
      priority = '0.9';
      changefreq = 'weekly';
    } else if (route.startsWith('/workflows/')) {
      priority = '0.8';
      changefreq = 'weekly';
    } else if (['/guides/', '/examples/'].includes(route)) {
      priority = '0.7';
      changefreq = 'weekly';
    } else if (route === '/benchmarks/') {
      priority = '0.6';
      changefreq = 'monthly';
    }

    urls.push({
      loc: `${baseUrl}${route}`,
      lastmod: today,
      changefreq,
      priority
    });
  }

  // Sort URLs by priority descending
  urls.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));

  const xmlContent = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`),
    '</urlset>',
    ''
  ].join('\n');

  const sitemapPath = path.join(siteDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent);
  console.log(`Generated sitemap.xml with ${urls.length} URLs at ${sitemapPath}`);
  return true;
}

if (process.argv[1] && process.argv[1].endsWith('build-sitemap.js')) {
  buildSitemap();
}

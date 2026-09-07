import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://apex-forge-tools.pages.dev';
const PATHS = [
  '/',
  '/receipt-ocr/',
  '/regex-tester/',
  '/english-to-sql/',
  '/workflows/receipt-to-expense-analysis/',
  '/guides/',
  '/guides/how-to-photograph-receipts/',
  '/guides/tax-invoice-gstin-fields/',
  '/guides/sql-joins-with-sample-schema/',
  '/guides/sqlite-vs-postgres-syntax/',
  '/examples/',
  '/benchmarks/',
  '/privacy/',
  '/terms/',
  '/about/',
  '/contact/',
  '/robots.txt',
  '/sitemap.xml'
];

async function checkPublicDeployment() {
  console.log(`[Public Deployment Check] Auditing ${BASE_URL} across ${PATHS.length} endpoints...`);
  const results = [];
  let allPass = true;

  for (const p of PATHS) {
    const targetUrl = `${BASE_URL}${p}`;
    const t0 = Date.now();
    try {
      const res = await fetch(targetUrl, { redirect: 'follow' });
      const durationMs = Date.now() - t0;
      const isOk = res.status === 200;
      if (!isOk) allPass = false;
      const contentType = res.headers.get('content-type') || '';
      results.push({
        path: p,
        url: targetUrl,
        status: res.status,
        ok: isOk,
        contentType,
        timingMs: durationMs
      });
      console.log(`  ${isOk ? '✓' : '✗'} [${res.status}] ${p} (${durationMs}ms)`);
    } catch (err) {
      allPass = false;
      results.push({
        path: p,
        url: targetUrl,
        status: 0,
        ok: false,
        error: err.message,
        timingMs: Date.now() - t0
      });
      console.log(`  ✗ [ERROR] ${p}: ${err.message}`);
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalChecked: PATHS.length,
    passed: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    results
  };

  const reportDir = path.resolve('growth/seo');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'deployment-validation-report.json'), JSON.stringify(report, null, 2));

  const mdReport = [
    '# Public Deployment Validation Report',
    '',
    `**Target Domain:** ${BASE_URL}  `,
    `**Audit Timestamp:** ${report.timestamp}  `,
    `**Status:** ${allPass ? 'VERIFIED_PUBLIC_DEPLOYMENT' : 'PARTIAL_OR_FAILED'}  `,
    `**Results:** ${report.passed} / ${report.totalChecked} Accessible (HTTP 200)  `,
    '',
    '## Endpoint Audit Details',
    '',
    '| Route | HTTP Status | Content Type | Latency | Public Verification |',
    '| :--- | :---: | :--- | :---: | :---: |',
    ...results.map(r => `| \`${r.path}\` | ${r.status} | \`${r.contentType.split(';')[0]}\` | ${r.timingMs}ms | **${r.ok ? 'VERIFIED' : 'FAILED'}** |`),
    '',
    '## SEO & Discovery Notes',
    '- Public HTTP 200 verifies hosting availability on Cloudflare Pages global edge network.',
    '- Truthfulness Rule: A public HTTP 200 does NOT guarantee Google Search indexation or search rank. Search Console verification is tracked separately.',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(reportDir, 'deployment-validation-report.md'), mdReport);
  console.log(`\nAudit complete: ${report.passed}/${report.totalChecked} endpoints verified. Report saved.`);
  return allPass;
}

checkPublicDeployment().then(ok => {
  process.exitCode = ok ? 0 : 1;
}).catch(err => {
  console.error(err);
  process.exitCode = 1;
});

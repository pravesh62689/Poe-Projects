import fs from 'fs';
import path from 'path';

/**
 * Import & Validate Poe Creator Dashboard CSV Metrics
 * Reads growth/measurement/poe-dashboard-import-template.csv (or specified path)
 * Validates fields and schema, rejects negative or non-numeric entries,
 * and compiles daily verified metrics.
 */

const CSV_PATH = process.argv[2] || path.resolve('growth/measurement/poe-dashboard-import-template.csv');

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));
  if (lines.length < 2) {
    throw new Error('CSV file must contain a header and at least one data row.');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const expectedHeaders = ['date', 'bot_handle', 'unique_users', 'messages', 'followers', 'charges', 'estimated_earnings_usd', 'data_source', 'notes'];
  
  for (const eh of expectedHeaders) {
    if (!headers.includes(eh)) {
      throw new Error(`Missing expected header: ${eh}`);
    }
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    if (cols.length < expectedHeaders.length) continue;

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx];
    });

    // Validations
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
      throw new Error(`Row ${i}: Invalid date format: ${row.date}. Expected YYYY-MM-DD.`);
    }

    const uniqueUsers = parseInt(row.unique_users, 10);
    const messages = parseInt(row.messages, 10);
    const followers = parseInt(row.followers, 10);
    const charges = parseInt(row.charges, 10);
    const earnings = parseFloat(row.estimated_earnings_usd);

    if (isNaN(uniqueUsers) || uniqueUsers < 0) throw new Error(`Row ${i}: Invalid unique_users`);
    if (isNaN(messages) || messages < 0) throw new Error(`Row ${i}: Invalid messages`);
    if (isNaN(followers) || followers < 0) throw new Error(`Row ${i}: Invalid followers`);
    if (isNaN(charges) || charges < 0) throw new Error(`Row ${i}: Invalid charges`);
    if (isNaN(earnings) || earnings < 0) throw new Error(`Row ${i}: Invalid estimated_earnings_usd`);

    rows.push({
      date: row.date,
      bot_handle: row.bot_handle,
      unique_users: uniqueUsers,
      messages,
      followers,
      charges,
      estimated_earnings_usd: earnings,
      data_source: row.data_source,
      notes: row.notes,
      verified: true
    });
  }

  return rows;
}

try {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV file not found at: ${CSV_PATH}`);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const parsedRows = parseCSV(rawContent);

  console.log(`[Metric Importer] Successfully validated ${parsedRows.length} metric rows.`);

  // Write out structured JSON
  const outputPath = path.resolve('growth/analytics/verified-creator-metrics.json');
  fs.writeFileSync(outputPath, JSON.stringify(parsedRows, null, 2));

  // Generate Markdown summary
  let md = '# Verified Poe Platform Metrics Summary\n\n';
  md += `**Import Source:** \`${path.basename(CSV_PATH)}\`  \n`;
  md += `**Last Imported:** ${new Date().toISOString()}  \n\n`;
  md += '| Date | Bot | Unique users | Messages | Followers | Charges | Estimated earnings ($) | Data source | Verified? |\n';
  md += '| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: |\n';

  for (const r of parsedRows) {
    md += `| ${r.date} | \`${r.bot_handle}\` | ${r.unique_users} | ${r.messages} | ${r.followers} | ${r.charges} | $${r.estimated_earnings_usd.toFixed(2)} | \`${r.data_source}\` | **YES** |\n`;
  }

  const reportPath = path.resolve('growth/measurement/baseline-report.md');
  fs.writeFileSync(reportPath, md);

  console.log(`[Metric Importer] Baseline report written to ${reportPath}`);
} catch (err) {
  console.error(`[Metric Importer Error] ${err.message}`);
  process.exit(1);
}

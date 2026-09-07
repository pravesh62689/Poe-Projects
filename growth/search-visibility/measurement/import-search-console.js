import fs from 'fs';
import path from 'path';

/**
 * scripts/growth/import-search-console.js
 * Imports exported Google Search Console CSV data into structured JSON registry.
 */
export function importSearchConsole(csvPath) {
  const defaultPath = path.resolve('growth/search-visibility/measurement/search-console-import-template.csv');
  const targetFile = csvPath || defaultPath;

  if (!fs.existsSync(targetFile)) {
    console.warn(`[GSC Import] File not found: ${targetFile}`);
    return null;
  }

  const lines = fs.readFileSync(targetFile, 'utf8').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = lines[i].split(',').map(c => c.trim());
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] || '';
    });
    rows.push(row);
  }

  const outPath = path.resolve('growth/search-visibility/measurement/search-console-data.json');
  fs.writeFileSync(outPath, JSON.stringify({ updated_at: new Date().toISOString(), records: rows }, null, 2));
  console.log(`[GSC Import] Parsed ${rows.length} records -> ${outPath}`);
  return rows;
}

if (process.argv[1] && process.argv[1].endsWith('import-search-console.js')) {
  importSearchConsole(process.argv[2]);
}

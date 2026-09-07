import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (item.endsWith('.html') && !item.startsWith('google')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = walk('site');
console.log(`Auditing and updating ${htmlFiles.length} HTML files...`);

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace logo source with verified icon
  content = content.replaceAll('/assets/apex-forge/apex-forge-mark.svg', '/assets/apex-forge/apex-forge-icon.png');
  content = content.replaceAll('/assets/apex-forge/apex-forge-favicon.svg', '/assets/apex-forge/apex-forge-icon.png');
  content = content.replaceAll('type="image/svg+xml" href="/assets/apex-forge/apex-forge-icon.png"', 'type="image/png" href="/assets/apex-forge/apex-forge-icon.png"');

  // 2. Replace nav links
  content = content.replaceAll('>Apex Forge OCR</a>', '>OCR-Doc-Parser</a>');
  content = content.replaceAll('>Apex Forge Regex</a>', '>Regex-Gen-Tester</a>');
  content = content.replaceAll('>Apex Forge SQL</a>', '>English-to-SQL</a>');

  // 3. Replace footer header
  content = content.replaceAll('<h5>Tools</h5>', '<h5>Developer Bots</h5>');

  // 4. In page-specific heroes and titles
  if (file.includes('receipt-ocr')) {
    content = content.replaceAll('<li aria-current="page">Apex Forge OCR</li>', '<li aria-current="page">OCR-Doc-Parser</li>');
    content = content.replaceAll('<h1 class="section-title">Apex Forge OCR</h1>', '<h1 class="section-title">OCR-Doc-Parser</h1>');
    content = content.replaceAll('Launch Apex Forge OCR (@OCR-Doc-Parser on Poe) &rarr;', 'Open @OCR-Doc-Parser on Poe &rarr;');
  }
  if (file.includes('regex-tester')) {
    content = content.replaceAll('<li aria-current="page">Apex Forge Regex</li>', '<li aria-current="page">Regex-Gen-Tester</li>');
    content = content.replaceAll('<h1 class="section-title">Apex Forge Regex</h1>', '<h1 class="section-title">Regex-Gen-Tester</h1>');
    content = content.replaceAll('Launch Apex Forge Regex (@Regex-Gen-Tester on Poe) &rarr;', 'Open @Regex-Gen-Tester on Poe &rarr;');
  }
  if (file.includes('english-to-sql')) {
    content = content.replaceAll('<li aria-current="page">Apex Forge SQL</li>', '<li aria-current="page">English-to-SQL</li>');
    content = content.replaceAll('<h1 class="section-title">Apex Forge SQL</h1>', '<h1 class="section-title">English-to-SQL</h1>');
    content = content.replaceAll('Launch Apex Forge SQL (@English-To-SQL on Poe) &rarr;', 'Open @English-To-SQL on Poe &rarr;');
  }

  fs.writeFileSync(file, content, 'utf8');
}
console.log('All files successfully updated with real branding icon and exact bot handles.');

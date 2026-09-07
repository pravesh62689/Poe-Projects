import fs from 'fs';
import path from 'path';

// 1. Update site/index.html
const indexFile = path.resolve('site/index.html');
let indexHtml = fs.readFileSync(indexFile, 'utf8');

// Add Google Search Console verification meta tag if not present
if (!indexHtml.includes('name="google-site-verification"')) {
  indexHtml = indexHtml.replace(
    '<meta name="description"',
    '<!-- Google Search Console Verification -->\n  <meta name="google-site-verification" content="GSC_VERIFICATION_TOKEN_PLACEHOLDER">\n  <meta name="description"'
  );
}

// In product cards in index.html
indexHtml = indexHtml.replace(
  '<a href="https://poe.com/OCR-Doc-Parser" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open Bot &rarr;</a>',
  '<a href="https://poe.com/OCR-Doc-Parser" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @OCR-Doc-Parser on Poe &rarr;</a>'
);
indexHtml = indexHtml.replace(
  '<a href="https://poe.com/Regex-Gen-Tester" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open Bot &rarr;</a>',
  '<a href="https://poe.com/Regex-Gen-Tester" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @Regex-Gen-Tester on Poe &rarr;</a>'
);
indexHtml = indexHtml.replace(
  '<a href="https://poe.com/English-To-SQL" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open Bot &rarr;</a>',
  '<a href="https://poe.com/English-To-SQL" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @English-To-SQL on Poe &rarr;</a>'
);
fs.writeFileSync(indexFile, indexHtml, 'utf8');

// 2. Update receipt-ocr/index.html
const ocrFile = path.resolve('site/receipt-ocr/index.html');
let ocrHtml = fs.readFileSync(ocrFile, 'utf8');
ocrHtml = ocrHtml.replace(
  /class="btn btn-primary btn-lg" target="_blank" rel="noopener">[^<]+<\/a>/g,
  'class="btn btn-primary btn-lg" target="_blank" rel="noopener">Launch Apex Forge OCR (@OCR-Doc-Parser on Poe) &rarr;</a>'
);
ocrHtml = ocrHtml.replace(
  /class="btn btn-primary btn-sm" target="_blank" rel="noopener">[^<]+<\/a>/g,
  'class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @OCR-Doc-Parser on Poe &rarr;</a>'
);
fs.writeFileSync(ocrFile, ocrHtml, 'utf8');

// 3. Update regex-tester/index.html
const regexFile = path.resolve('site/regex-tester/index.html');
let regexHtml = fs.readFileSync(regexFile, 'utf8');
regexHtml = regexHtml.replace(
  /class="btn btn-primary btn-lg" target="_blank" rel="noopener">[^<]+<\/a>/g,
  'class="btn btn-primary btn-lg" target="_blank" rel="noopener">Launch Apex Forge Regex (@Regex-Gen-Tester on Poe) &rarr;</a>'
);
regexHtml = regexHtml.replace(
  /class="btn btn-primary btn-sm" target="_blank" rel="noopener">[^<]+<\/a>/g,
  'class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @Regex-Gen-Tester on Poe &rarr;</a>'
);
fs.writeFileSync(regexFile, regexHtml, 'utf8');

// 4. Update english-to-sql/index.html
const sqlFile = path.resolve('site/english-to-sql/index.html');
let sqlHtml = fs.readFileSync(sqlFile, 'utf8');
sqlHtml = sqlHtml.replace(
  /class="btn btn-primary btn-lg" target="_blank" rel="noopener">[^<]+<\/a>/g,
  'class="btn btn-primary btn-lg" target="_blank" rel="noopener">Launch Apex Forge SQL (@English-To-SQL on Poe) &rarr;</a>'
);
sqlHtml = sqlHtml.replace(
  /class="btn btn-primary btn-sm" target="_blank" rel="noopener">[^<]+<\/a>/g,
  'class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @English-To-SQL on Poe &rarr;</a>'
);
fs.writeFileSync(sqlFile, sqlHtml, 'utf8');

// 5. Update examples/index.html
const examplesFile = path.resolve('site/examples/index.html');
let examplesHtml = fs.readFileSync(examplesFile, 'utf8');
examplesHtml = examplesHtml.replace(
  '<a href="https://poe.com/OCR-Doc-Parser" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Launch Tool &rarr;</a>',
  '<a href="https://poe.com/OCR-Doc-Parser" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @OCR-Doc-Parser on Poe &rarr;</a>'
);
examplesHtml = examplesHtml.replace(
  '<a href="https://poe.com/Regex-Gen-Tester" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Launch Tool &rarr;</a>',
  '<a href="https://poe.com/Regex-Gen-Tester" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @Regex-Gen-Tester on Poe &rarr;</a>'
);
examplesHtml = examplesHtml.replace(
  '<a href="https://poe.com/English-To-SQL" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Launch Tool &rarr;</a>',
  '<a href="https://poe.com/English-To-SQL" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Open @English-To-SQL on Poe &rarr;</a>'
);
fs.writeFileSync(examplesFile, examplesHtml, 'utf8');

// 6. Update workflows/receipt-to-expense-analysis/index.html
const workflowFile = path.resolve('site/workflows/receipt-to-expense-analysis/index.html');
let workflowHtml = fs.readFileSync(workflowFile, 'utf8');
workflowHtml = workflowHtml.replace(
  '<a href="https://poe.com/OCR-Doc-Parser" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Launch Tool</a>',
  '<a href="https://poe.com/OCR-Doc-Parser" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Launch @OCR-Doc-Parser on Poe &rarr;</a>'
);
fs.writeFileSync(workflowFile, workflowHtml, 'utf8');

console.log('Successfully enhanced all product bot CTAs with explicit Poe links and handles!');

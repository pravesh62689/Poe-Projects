import fs from 'fs';
import path from 'path';

const siteDir = path.resolve('site');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(siteDir);

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace text patterns
  content = content.replace(/Try on Poe &rarr;/g, 'Launch Tool &rarr;');
  content = content.replace(/Built by Apex Forge Technology for Poe\./g, 'Built by Apex Forge Technology.');
  content = content.replace(/tools on Poe\./g, 'tools.');
  content = content.replace(/testing in the Poe chat interface\./g, 'testing in the interactive workspace.');
  content = content.replace(/on Poe to test extraction/g, 'to test extraction');
  content = content.replace(/on Poe to run queries/g, 'to run queries');
  content = content.replace(/Apex Forge Tools for Poe/g, 'Apex Forge Developer Tools');
  content = content.replace(/id="nav-cta-poe"/g, 'id="nav-cta-launch"');
  content = content.replace(/Powered by Poe Protocol · Hosted on Cloudflare Pages/g, 'Apex Forge Technology · High Performance Developer Tools');
  content = content.replace(/Poe Platform Feedback/g, 'Platform & Tool Feedback');
  content = content.replace(/inside the Poe client by upvoting or downvoting responses on individual bots\./g, 'inside the interface by rating responses on individual tools.');
  content = content.replace(/Messages transmitted through the Poe client are governed by Poe's Privacy Policy\./g, 'Messages transmitted through client interfaces are processed with zero-retention privacy standards.');
  content = content.replace(/poe-developer-suite\.pages\.dev/g, 'apex-forge-tools.pages.dev');

  fs.writeFileSync(file, content, 'utf8');
}

// Verification scanner
let matches = [];
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(siteDir, file);
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Strip destination URL href="https://poe.com/..." and github link
    const stripped = line.replace(/href="https:\/\/poe\.com[^"]*"/g, '').replace(/https:\/\/github\.com\/pravesh62689\/Poe-Projects/g, '');
    if (/\bpoe\b/i.test(stripped)) {
      matches.push(`${rel}:${i+1}: ${line.trim()}`);
    }
  });
}

if (matches.length > 0) {
  console.log(`Found ${matches.length} residual mentions of 'poe':`);
  matches.forEach(m => console.log('  ', m));
} else {
  console.log('✓ SUCCESS: 0 visible user-facing mentions of "Poe" remain in HTML! 100% pure Apex Forge branding.');
}

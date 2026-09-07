import fs from 'fs';
import path from 'path';

const siteDir = path.resolve('site');

function scan(dir) {
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scan(full);
    } else if (f.endsWith('.html') && !full.endsWith('404.html')) {
      let content = fs.readFileSync(full, 'utf8');
      if (!content.includes('name="robots"')) {
        content = content.replace(
          /<link rel="canonical" href="([^"]+)">/,
          '<link rel="canonical" href="$1">\n  <meta name="robots" content="index, follow">'
        );
        fs.writeFileSync(full, content, 'utf8');
        console.log('Added robots tag to:', f);
      }
    }
  }
}

scan(siteDir);
console.log('Finished updating meta robots tags.');

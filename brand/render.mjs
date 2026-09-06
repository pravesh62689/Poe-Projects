import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const bots = ['ocr-doc-bot', 'regex-bot', 'sql-bot'];

for (const b of bots) {
  const svg = readFileSync(join(dir, `${b}.svg`));
  for (const size of [512, 1024]) {
    await sharp(svg, { density: 600 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(dir, `${b}-${size}.png`));
    console.log(`wrote ${b}-${size}.png`);
  }
}

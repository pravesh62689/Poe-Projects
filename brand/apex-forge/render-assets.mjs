import sharp from 'sharp';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));

async function renderAssets() {
  console.log('[Brand Renderer] Generating raster PNG assets for Apex Forge Technology...');

  // 1. Render Mark at 512 and 1024
  const markSvg = readFileSync(join(dir, 'apex-forge-mark.svg'));
  for (const size of [512, 1024]) {
    await sharp(markSvg, { density: 600 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(dir, `apex-forge-${size}.png`));
    console.log(`  ✓ Created brand/apex-forge/apex-forge-${size}.png (${size}x${size})`);
  }

  // 2. Render Social Card at 1200x630
  const socialSvg = readFileSync(join(dir, 'social-card.svg'));
  await sharp(socialSvg, { density: 300 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(join(dir, 'apex-forge-social-card.png'));
  console.log('  ✓ Created brand/apex-forge/apex-forge-social-card.png (1200x630)');

  // 3. Populate site/assets/apex-forge/
  const siteAssetsDir = join(dir, '../../site/assets/apex-forge');
  if (!existsSync(siteAssetsDir)) mkdirSync(siteAssetsDir, { recursive: true });

  const filesToCopy = [
    'apex-forge-mark.svg',
    'apex-forge-logo.svg',
    'apex-forge-logo-light.svg',
    'apex-forge-favicon.svg',
    'apex-forge-social-card.png',
    'apex-forge-512.png',
    'apex-forge-1024.png'
  ];

  for (const f of filesToCopy) {
    const src = join(dir, f);
    const dest = join(siteAssetsDir, f);
    const data = readFileSync(src);
    sharp(data).toFile(dest).catch(() => {
      // If SVG, copy directly
      import('node:fs').then(fs => fs.copyFileSync(src, dest));
    });
  }

  // 4. Populate site/assets/bots/ with existing bot icons
  const siteBotsDir = join(dir, '../../site/assets/bots');
  if (!existsSync(siteBotsDir)) mkdirSync(siteBotsDir, { recursive: true });

  const botAssets = [
    'ocr-doc-bot.svg', 'ocr-doc-bot-512.png', 'ocr-doc-bot-1024.png',
    'regex-bot.svg', 'regex-bot-512.png', 'regex-bot-1024.png',
    'sql-bot.svg', 'sql-bot-512.png', 'sql-bot-1024.png'
  ];

  const rootBrandDir = join(dir, '..');
  const fs = await import('node:fs');
  for (const b of botAssets) {
    fs.copyFileSync(join(rootBrandDir, b), join(siteBotsDir, b));
  }
  console.log('  ✓ Copied existing bot assets to site/assets/bots/');

  // Also copy SVG assets explicitly to siteAssetsDir
  for (const f of filesToCopy) {
    fs.copyFileSync(join(dir, f), join(siteAssetsDir, f));
  }
  console.log('  ✓ Synced all brand assets to site/assets/apex-forge/');
}

renderAssets().catch(err => {
  console.error('[Brand Renderer Error]', err);
  process.exit(1);
});

async function verifyGsc() {
  console.log('Verifying Google Search Console Verification Assets Live on Edge:');

  // 1. Check HTML Verification File
  const fileUrl = 'https://apex-forge-tools.pages.dev/google74c4fffb31f7084f.html';
  const r1 = await fetch(fileUrl);
  const text1 = await r1.text();
  console.log('1. HTML Verification File:');
  console.log('   URL: ' + fileUrl);
  console.log('   HTTP Status: ' + r1.status);
  console.log('   Body Content: ' + text1.trim());

  // 2. Check HTML Meta Tag on Homepage
  const r2 = await fetch('https://apex-forge-tools.pages.dev/');
  const text2 = await r2.text();
  const metaMatch = text2.match(/<meta\s+name=["']google-site-verification["']\s+content=["']([^"']+)["']/i);
  console.log('\n2. Homepage Meta Tag:');
  console.log('   HTTP Status: ' + r2.status);
  console.log('   Found Tag: ' + (metaMatch ? metaMatch[0] : 'NOT FOUND'));

  // 3. Check Sitemap
  const r3 = await fetch('https://apex-forge-tools.pages.dev/sitemap.xml');
  console.log('\n3. Sitemap:');
  console.log('   URL: https://apex-forge-tools.pages.dev/sitemap.xml');
  console.log('   HTTP Status: ' + r3.status);
}

verifyGsc();

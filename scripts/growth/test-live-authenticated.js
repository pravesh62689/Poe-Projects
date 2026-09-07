const KEY = process.env.POE_ACCESS_KEY || '';

async function run() {
  console.log('=== TESTING LIVE PRODUCTION BOT QUERY STREAMING ===\n');

  // 1. Regex Bot
  console.log('1. Testing Regex-Gen-Tester...');
  const t0 = performance.now();
  const regRes = await fetch('https://poe-regex-bot.rathore-pravesh2002.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      version: '1.0.0',
      type: 'query',
      query: [{ role: 'user', content: 'Match email addresses\nSample: test@example.com\nSample: invalid-email' }],
      user_id: 'qa_runner',
      conversation_id: 'qa_conv_1',
      message_id: 'qa_msg_1'
    })
  });
  const regDur = Math.round(performance.now() - t0);
  console.log(`Regex Bot HTTP Status: ${regRes.status} (${regDur}ms)`);
  const regText = await regRes.text();
  console.log(`Regex Output Preview:\n${regText.substring(0, 250)}...\n`);

  // 2. SQL Bot
  console.log('2. Testing English-To-SQL...');
  const t1 = performance.now();
  const sqlContent = '```sql\nCREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);\nINSERT INTO users VALUES (1, "Alice");\n```\nShow all users.';
  const sqlRes = await fetch('https://poe-sql-bot.rathore-pravesh2002.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      version: '1.0.0',
      type: 'query',
      query: [{ role: 'user', content: sqlContent }],
      user_id: 'qa_runner',
      conversation_id: 'qa_conv_2',
      message_id: 'qa_msg_2'
    })
  });
  const sqlDur = Math.round(performance.now() - t1);
  console.log(`SQL Bot HTTP Status: ${sqlRes.status} (${sqlDur}ms)`);
  const sqlText = await sqlRes.text();
  console.log(`SQL Output Preview:\n${sqlText.substring(0, 250)}...\n`);

  // 3. OCR Doc Bot (Settings & missing attachment guidance)
  console.log('3. Testing OCR-Doc-Parser...');
  const t2 = performance.now();
  const ocrRes = await fetch('https://poe-ocr-doc-bot.onrender.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      version: '1.0.0',
      type: 'query',
      query: [{ role: 'user', content: 'Extract text' }],
      user_id: 'qa_runner',
      conversation_id: 'qa_conv_3',
      message_id: 'qa_msg_3'
    })
  });
  const ocrDur = Math.round(performance.now() - t2);
  console.log(`OCR Bot HTTP Status: ${ocrRes.status} (${ocrDur}ms)`);
  const ocrText = await ocrRes.text();
  console.log(`OCR Output Preview:\n${ocrText.substring(0, 250)}...\n`);
}

run().catch(console.error);

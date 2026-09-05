import http from 'node:http';
import { createServer as createOcrServer } from '../ocr-doc-bot/dist/server.js';
import { handleRegexWorkerRequest } from '../regex-bot/dist/worker.js';
import { handleSqlWorkerRequest } from '../sql-bot/dist/worker.js';

const TEST_KEY = 'cold_start_sim_poe_key';
// Poe Protocol Specification timeouts:
// Gateway response must start streaming within 20s. Complete response up to 300s.
const POE_FIRST_BYTE_TIMEOUT_MS = 20_000;

async function measureColdStartLatency() {
  console.log('⏱️ [Layer 4] Measuring Local Cold-Start Spin-Up to First Byte...');
  const bootStart = performance.now();

  // Fresh server instance simulating container spin-up
  const app = createOcrServer({
    accessKey: TEST_KEY,
    imageFetcher: async () => Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    ocrRunner: async () => 'COLD BOOT RECEIPT\nTOTAL: 99.00\nDate: 01/01/2024',
  });
  const server = http.createServer(app);

  const port = await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });

  const reqStart = performance.now();
  const res = await fetch(`http://127.0.0.1:${port}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TEST_KEY}`,
    },
    body: JSON.stringify({
      type: 'query',
      version: '1.0.0',
      user_id: 'u_cold',
      conversation_id: 'c_cold',
      message_id: 'm_cold',
      query: [
        {
          role: 'user',
          content: 'Process receipt',
          attachments: [{ url: 'http://localhost/cold.jpg', content_type: 'image/jpeg', name: 'cold.jpg' }],
        },
      ],
    }),
  });

  const firstChunk = await res.text();
  const totalBootToFirstResponseMs = performance.now() - bootStart;

  await new Promise((resolve) => server.close(resolve));

  console.log(`Local Cold Start Latency: ${totalBootToFirstResponseMs.toFixed(2)}ms`);
  console.log(`Poe Protocol Timeout Limit: ${POE_FIRST_BYTE_TIMEOUT_MS}ms`);

  if (totalBootToFirstResponseMs > POE_FIRST_BYTE_TIMEOUT_MS) {
    throw new Error(`Cold start latency (${totalBootToFirstResponseMs}ms) exceeded Poe 20s timeout!`);
  }
  console.log('✅ Cold start is well within Poe specification limits.\n');
}

async function simulateMultiTurnPoeConversations() {
  console.log('💬 [Layer 4] Running Multi-Turn Conversation Protocol Simulations...\n');

  // --- 1. Multi-Turn OCR Doc Bot ---
  console.log('Testing OCR Doc Bot multi-turn conversation...');
  const ocrApp = createOcrServer({
    accessKey: TEST_KEY,
    imageFetcher: async () => Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
    ocrRunner: async () => 'COFFEE SHOP\nTotal: 250.00\nDate: 15/09/2024\nGSTIN: 27AABCS1429B1Z8',
  });
  const ocrServer = http.createServer(ocrApp);
  const ocrPort = await new Promise((res) => ocrServer.listen(0, '127.0.0.1', () => res(ocrServer.address().port)));

  // Turn 1: Settings handshake
  const settingsRes = await fetch(`http://127.0.0.1:${ocrPort}/settings`, {
    headers: { Authorization: `Bearer ${TEST_KEY}` },
  });
  const settingsData = await settingsRes.json();
  if (!settingsData.allow_attachments) throw new Error('Settings failed allow_attachments');

  // Turn 2 & 3: Multi-turn message history
  const multiTurnOcrRes = await fetch(`http://127.0.0.1:${ocrPort}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TEST_KEY}`,
    },
    body: JSON.stringify({
      version: '1.0.0',
      type: 'query',
      user_id: 'multi_user',
      conversation_id: 'conv_multi_1',
      message_id: 'msg_turn_3',
      query: [
        { role: 'user', content: 'What documents do you support?' },
        { role: 'bot', content: 'I support Receipts, Bank Statements, and IDs.' },
        {
          role: 'user',
          content: 'Here is my receipt:',
          attachments: [{ url: 'http://localhost/r.jpg', content_type: 'image/jpeg', name: 'r.jpg' }],
        },
      ],
    }),
  });

  const ocrSse = await multiTurnOcrRes.text();
  if (!ocrSse.includes('COFFEE SHOP') || !ocrSse.includes('event: done')) {
    throw new Error('OCR multi-turn conversation response invalid!');
  }
  await new Promise((res) => ocrServer.close(res));
  console.log('✓ OCR Doc Bot multi-turn conversation simulation passed.');

  // --- 2. Multi-Turn Regex Bot ---
  console.log('Testing Regex Bot multi-turn conversation...');
  const multiTurnRegexReq = new Request('http://localhost/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TEST_KEY}`,
    },
    body: JSON.stringify({
      version: '1.0.0',
      type: 'query',
      user_id: 'multi_user',
      conversation_id: 'conv_multi_2',
      message_id: 'msg_turn_3',
      query: [
        { role: 'user', content: 'I need a regex for alphanumeric usernames.' },
        { role: 'bot', content: 'Here is candidate: /^[a-zA-Z0-9_-]+$/' },
        {
          role: 'user',
          content: 'Can you test it against these:\nSample: valid_user123\nSample: invalid user with spaces',
        },
      ],
    }),
  });

  const regexRes = await handleRegexWorkerRequest(multiTurnRegexReq, { POE_ACCESS_KEY: TEST_KEY });
  const regexSse = await regexRes.text();
  if (!regexSse.includes('valid_user123') || !regexSse.includes('✅ Matched') || !regexSse.includes('event: done')) {
    throw new Error('Regex multi-turn conversation response invalid!');
  }
  console.log('✓ Regex Bot multi-turn conversation simulation passed.');

  // --- 3. Multi-Turn SQL Bot ---
  console.log('Testing SQL Bot multi-turn conversation...');
  const multiTurnSqlReq = new Request('http://localhost/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TEST_KEY}`,
    },
    body: JSON.stringify({
      version: '1.0.0',
      type: 'query',
      user_id: 'multi_user',
      conversation_id: 'conv_multi_3',
      message_id: 'msg_turn_3',
      query: [
        {
          role: 'user',
          content: '```sql\nCREATE TABLE students (id INT, name TEXT, grade INT);\nINSERT INTO students VALUES (1, "Alex", 90);\nINSERT INTO students VALUES (2, "Dana", 75);\n```\nInitialized tables.',
        },
        { role: 'bot', content: 'Tables initialized successfully.' },
        {
          role: 'user',
          content: '```sql\nCREATE TABLE students (id INT, name TEXT, grade INT);\nINSERT INTO students VALUES (1, "Alex", 90);\nINSERT INTO students VALUES (2, "Dana", 75);\n```\nShow students with grade > 80.',
        },
      ],
    }),
  });

  const sqlRes = await handleSqlWorkerRequest(multiTurnSqlReq, { POE_ACCESS_KEY: TEST_KEY });
  const sqlSse = await sqlRes.text();
  if (!sqlSse.includes('Alex') || !sqlSse.includes('Verified SQL Query') || !sqlSse.includes('event: done')) {
    throw new Error('SQL multi-turn conversation response invalid!');
  }
  console.log('✓ SQL Bot multi-turn conversation simulation passed.');

  console.log('\n✅ Layer 4 Cold-Start & Multi-Turn Protocol Simulations PASSED 100%!\n');
}

async function main() {
  await measureColdStartLatency();
  await simulateMultiTurnPoeConversations();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import https from 'https';

const BOT_URL = 'https://poe-ocr-doc-bot.onrender.com';
const ACCESS_KEY = 'mYoYmVACxXdFWfqkv51azCZ89jkkHgKA';

function postRequest(path, headers, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BOT_URL);
    const options = {
      method: 'POST',
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk.toString();
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runLiveTests() {
  console.log('================================================================');
  console.log('🌐 RUNNING LIVE HTTP TESTS AGAINST PRODUCTION RENDER SERVICE');
  console.log(`Endpoint: ${BOT_URL}`);
  console.log('================================================================\n');

  // Test 1: Wrong Key Rejection (401)
  console.log('Test 1: Wrong Key Rejection (401)...');
  const res1 = await postRequest('/', { Authorization: 'Bearer WRONG_KEY' }, { type: 'query', query: [] });
  console.log(`Status: ${res1.status} (Expected: 401)`);
  if (res1.status === 401) {
    console.log('✅ PASS: Unauthorized requests properly blocked with 401.\n');
  } else {
    console.error(`❌ FAIL: Expected 401, got ${res1.status}`);
  }

  // Test 2: Settings Fetch (200)
  console.log('Test 2: Settings Request (200)...');
  const res2 = await postRequest('/', { Authorization: `Bearer ${ACCESS_KEY}` }, { type: 'settings' });
  console.log(`Status: ${res2.status} (Expected: 200)`);
  const settings = JSON.parse(res2.data);
  console.log('Settings allow_attachments:', settings.allow_attachments);
  if (res2.status === 200 && settings.allow_attachments === true) {
    console.log('✅ PASS: Bot settings endpoint returns valid Poe configuration.\n');
  } else {
    console.error('❌ FAIL: Settings mismatch');
  }

  // Test 3: Query without Attachment (Prompts user to upload)
  console.log('Test 3: Query Without Attachment (Prompt Guidance)...');
  const res3 = await postRequest(
    '/',
    { Authorization: `Bearer ${ACCESS_KEY}` },
    {
      type: 'query',
      query: [{ role: 'user', content: 'Extract this receipt' }],
      user_id: 'test-user-1',
      conversation_id: 'conv-123',
      message_id: 'msg-456',
    }
  );
  console.log(`Status: ${res3.status} (Expected: 200)`);
  console.log('Content-Type:', res3.headers['content-type']);
  const containsPrompt = res3.data.includes('No image attachment detected');
  if (res3.status === 200 && containsPrompt) {
    console.log('✅ PASS: Bot gracefully guides customer to attach an image.\n');
  } else {
    console.error('❌ FAIL: Expected guidance prompt in SSE stream');
  }

  // Test 4: Query with Real Blue Bottle Coffee Receipt Image
  console.log('Test 4: Live Processing of Blue Bottle Receipt (rec_001.jpg)...');
  const receiptUrl = 'https://raw.githubusercontent.com/pravesh62689/Poe-Projects/main/test-pack/dataset/01_receipts/rec_001.jpg';
  const res4 = await postRequest(
    '/',
    { Authorization: `Bearer ${ACCESS_KEY}` },
    {
      type: 'query',
      query: [
        {
          role: 'user',
          content: '/receipt',
          attachments: [
            {
              url: receiptUrl,
              content_type: 'image/jpeg',
              name: 'rec_001.jpg',
            },
          ],
        },
      ],
      user_id: 'test-user-2',
      conversation_id: 'conv-789',
      message_id: 'msg-012',
    }
  );
  console.log(`Status: ${res4.status}`);
  console.log('SSE Stream Output:');
  console.log(res4.data);

  // Test 5: Live Blur Gate Test (edge_001.jpg)
  console.log('\nTest 5: Live Blur Rejection Gate (edge_001.jpg)...');
  const blurUrl = 'https://raw.githubusercontent.com/pravesh62689/Poe-Projects/main/test-pack/dataset/06_edge_cases/edge_001.jpg';
  const res5 = await postRequest(
    '/',
    { Authorization: `Bearer ${ACCESS_KEY}` },
    {
      type: 'query',
      query: [
        {
          role: 'user',
          content: 'Process this blurry document',
          attachments: [
            {
              url: blurUrl,
              content_type: 'image/jpeg',
              name: 'edge_001.jpg',
            },
          ],
        },
      ],
      user_id: 'test-user-3',
      conversation_id: 'conv-blur',
      message_id: 'msg-blur-1',
    }
  );
  console.log(`Status: ${res5.status}`);
  console.log('SSE Stream Output:');
  console.log(res5.data);


  console.log('================================================================');
  console.log('🎉 ALL LIVE PRODUCTION PROTOCOL TESTS COMPLETED');
  console.log('================================================================');
}

runLiveTests().catch(console.error);

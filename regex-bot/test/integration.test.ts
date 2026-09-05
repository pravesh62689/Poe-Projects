import { describe, it, expect } from 'vitest';
import { handleRegexWorkerRequest } from '../src/worker.js';

describe('Regex Bot Worker Integration (Poe Protocol E2E)', () => {
  const testKey = 'test_worker_poe_secret_key';

  it('rejects unauthenticated requests with 401', async () => {
    const req = new Request('https://regex-bot.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'settings', version: '1.0.0' }),
    });

    const res = await handleRegexWorkerRequest(req, { POE_ACCESS_KEY: testKey });
    expect(res.status).toBe(401);
  });

  it('handles settings handshake with server_bot_dependencies', async () => {
    const req = new Request('https://regex-bot.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify({ type: 'settings', version: '1.0.0' }),
    });

    const res = await handleRegexWorkerRequest(req, { POE_ACCESS_KEY: testKey });
    expect(res.status).toBe(200);

    const data = (await res.json()) as { allow_attachments: boolean; server_bot_dependencies: Record<string, number> };
    expect(data.allow_attachments).toBe(false);
    expect(data.server_bot_dependencies['Claude-3.5-Sonnet']).toBe(1);
  });

  it('generates regex and executes it against test samples returning streamed SSE results', async () => {
    const userMessage = `
      Please match email addresses.
      Sample: test@example.com
      Sample: invalid-email
    `;

    const req = new Request('https://regex-bot.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify({
        version: '1.0.0',
        type: 'query',
        user_id: 'u1',
        conversation_id: 'c1',
        message_id: 'm1',
        query: [{ role: 'user', content: userMessage }],
      }),
    });

    const res = await handleRegexWorkerRequest(req, { POE_ACCESS_KEY: testKey });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');

    const sseBody = await res.text();
    expect(sseBody).toContain('event: text');
    expect(sseBody).toContain('Regex Execution Report');
    expect(sseBody).toContain('test@example.com');
    expect(sseBody).toContain('✅ Matched');
    expect(sseBody).toContain('invalid-email');
    expect(sseBody).toContain('❌ No Match');
    expect(sseBody).toContain('event: done\ndata: {}\n\n');
  });

  it('catches and reports catastrophic backtracking safely over SSE', async () => {
    // Inject custom upstream query that produces a pathological regex
    const customUpstream = async () => ({
      pattern: '(a+)+$',
      flags: '',
      explanation: 'Dangerous pattern for testing',
    });

    const req = new Request('https://regex-bot.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify({
        version: '1.0.0',
        type: 'query',
        user_id: 'u1',
        conversation_id: 'c1',
        message_id: 'm2',
        query: [{ role: 'user', content: 'Generate dangerous regex\nSample: aaaaaaaaa!' }],
      }),
    });

    const res = await handleRegexWorkerRequest(
      req,
      { POE_ACCESS_KEY: testKey },
      customUpstream,
    );

    expect(res.status).toBe(200);
    const sseBody = await res.text();
    expect(sseBody).toContain('Catastrophic Backtracking Alert');
    expect(sseBody).toContain('event: done\ndata: {}\n\n');
  });
});

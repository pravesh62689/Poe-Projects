import { describe, it, expect } from 'vitest';
import { handleSqlWorkerRequest } from '../src/worker.js';

describe('SQL Bot Worker Integration (Poe Protocol E2E)', () => {
  const testKey = 'test_sql_secret_access_key';

  it('rejects unauthenticated requests with 401', async () => {
    const req = new Request('https://sql-bot.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'settings', version: '1.0.0' }),
    });

    const res = await handleSqlWorkerRequest(req, { POE_ACCESS_KEY: testKey });
    expect(res.status).toBe(401);
  });

  it('handles settings handshake declaring server_bot_dependencies', async () => {
    const req = new Request('https://sql-bot.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify({ type: 'settings', version: '1.0.0' }),
    });

    const res = await handleSqlWorkerRequest(req, { POE_ACCESS_KEY: testKey });
    expect(res.status).toBe(200);

    const settings = (await res.json()) as { allow_attachments: boolean; server_bot_dependencies: Record<string, number> };
    expect(settings.allow_attachments).toBe(false);
    expect(settings.server_bot_dependencies['Claude-3.5-Sonnet']).toBe(1);
  });

  it('executes schema, verifies query against in-memory db, and streams tabular output', async () => {
    const userMessage = `
      \`\`\`sql
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        title TEXT,
        price REAL
      );
      INSERT INTO products VALUES (1, 'Mechanical Keyboard', 120.50);
      INSERT INTO products VALUES (2, 'Wireless Mouse', 45.00);
      \`\`\`
      Show all products.
    `;

    const req = new Request('https://sql-bot.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify({
        version: '1.0.0',
        type: 'query',
        user_id: 'user_sql_1',
        conversation_id: 'conv_sql_1',
        message_id: 'msg_sql_1',
        query: [{ role: 'user', content: userMessage }],
      }),
    });

    const res = await handleSqlWorkerRequest(req, { POE_ACCESS_KEY: testKey });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');

    const sseBody = await res.text();
    expect(sseBody).toContain('event: text');
    expect(sseBody).toContain('Verified SQL Query & Results');
    expect(sseBody).toContain('Mechanical Keyboard');
    expect(sseBody).toContain('Wireless Mouse');
    expect(sseBody).toContain('event: done\ndata: {}\n\n');
  });

  it('recovers from candidate query error using 1-step retry feedback loop', async () => {
    const userMessage = `
      \`\`\`sql
      CREATE TABLE orders (id INT, customer TEXT, total REAL);
      INSERT INTO orders VALUES (1, 'Alice', 250);
      \`\`\`
      Find high value orders.
    `;

    // Mock generator that initially outputs broken SQL, then repairs it
    let callCount = 0;
    const mockGenerator = async (_schema: string, _ask: string, _failed?: string, errorMsg?: string) => {
      callCount++;
      if (callCount === 1) {
        return 'SELECT non_existent_column FROM orders;';
      }
      expect(errorMsg).toMatch(/no such column/i);
      return 'SELECT customer, total FROM orders WHERE total > 100;';
    };

    const req = new Request('https://sql-bot.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify({
        version: '1.0.0',
        type: 'query',
        user_id: 'user_sql_2',
        conversation_id: 'conv_sql_2',
        message_id: 'msg_sql_2',
        query: [{ role: 'user', content: userMessage }],
      }),
    });

    const res = await handleSqlWorkerRequest(
      req,
      { POE_ACCESS_KEY: testKey },
      mockGenerator,
    );

    expect(res.status).toBe(200);
    const sseBody = await res.text();
    expect(sseBody).toContain('self-corrected through an error feedback retry');
    expect(sseBody).toContain('Alice');
    expect(sseBody).toContain('event: done\ndata: {}\n\n');
  });
});

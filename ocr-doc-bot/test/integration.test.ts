import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { createServer } from '../src/server.js';
import { QueryRequest, SettingsRequest } from '@poe-projects/poe-protocol-core';

describe('OCR Doc Bot Integration (Poe Protocol E2E)', () => {
  const testKey = 'test_poe_secret_access_key';
  let server: http.Server;
  let baseUrl: string;

  const mockImageFetcher = async (_url: string) => {
    return Buffer.from('mock_image_bytes');
  };

  const mockOcrRunner = async (_source: string | Buffer) => {
    return `
      STARBUCKS COFFEE
      TAX INVOICE
      Date: 12/05/2024
      GRAND TOTAL: 520.00
      GSTIN: 29AABCS1429B1Z8
    `;
  };

  beforeAll(async () => {
    const app = createServer({
      accessKey: testKey,
      imageFetcher: mockImageFetcher,
      ocrRunner: mockOcrRunner,
    });
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('rejects unauthorized requests with 401', async () => {
    const res = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'settings', version: '1.0.0' }),
    });

    expect(res.status).toBe(401);
  });

  it('handles settings handshake with proper flags', async () => {
    const settingsReq: SettingsRequest = {
      type: 'settings',
      version: '1.0.0',
    };

    const res = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify(settingsReq),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.allow_attachments).toBe(true);
    expect(data.enable_image_comprehension).toBe(false);
    expect(data.introduction_message).toContain('OCR-Doc-Parser');
  });

  it('prompts the user when a query is sent without an attachment', async () => {
    const queryReq: QueryRequest = {
      type: 'query',
      version: '1.0.0',
      user_id: 'user_123',
      conversation_id: 'conv_123',
      message_id: 'msg_1',
      query: [
        {
          role: 'user',
          content: 'Hello, what can you do?',
        },
      ],
    };

    const res = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify(queryReq),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');
    const bodyText = await res.text();
    expect(bodyText).toContain('No image attachment detected');
    expect(bodyText).toContain('event: done\ndata: {}\n\n');
  });

  it('processes image attachment and streams parsed structured JSON via SSE', async () => {
    const queryReq: QueryRequest = {
      type: 'query',
      version: '1.0.0',
      user_id: 'user_123',
      conversation_id: 'conv_123',
      message_id: 'msg_2',
      query: [
        {
          role: 'user',
          content: 'Please process my receipt',
          attachments: [
            {
              url: 'https://example.com/receipt.jpg',
              content_type: 'image/jpeg',
              name: 'receipt.jpg',
            },
          ],
        },
      ],
    };

    const res = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testKey}`,
      },
      body: JSON.stringify(queryReq),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');
    const bodyText = await res.text();
    expect(bodyText).toContain('event: text');
    expect(bodyText).toContain('STARBUCKS COFFEE');
    expect(bodyText).toContain('520');
    expect(bodyText).toContain('29AABCS1429B1Z8');
    expect(bodyText).toContain('event: done\ndata: {}\n\n');
  });
});

import { describe, it, expect } from 'vitest';
import {
  evaluateAuthorization,
  extractBearerToken,
  formatChunkedTextEvents,
  MAX_SSE_DATA_LENGTH,
  SSEStreamController,
} from '../src/index.js';

describe('Layer 2 Adversarial: poe-protocol-core', () => {
  const secret = 'RealSecretKey_12345';

  describe('Authorization edge cases', () => {
    it('rejects missing Authorization header entirely with 401', () => {
      const res = evaluateAuthorization(null, secret);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toContain('Missing Authorization header');
    });

    it('rejects wrong scheme (Basic instead of Bearer) with 401', () => {
      const res = evaluateAuthorization(`Basic ${secret}`, secret);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toContain('Invalid or missing Bearer token');
    });

    it('rejects correct scheme with wrong key', () => {
      const res = evaluateAuthorization('Bearer WrongSecretKey', secret);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
    });

    it('handles correct key with leading/trailing whitespace correctly', () => {
      const res = evaluateAuthorization(`   Bearer   ${secret}   `, secret);
      expect(res.authorized).toBe(true);
      expect(res.status).toBe(200);
    });

    it('strictly rejects key with wrong case (case-sensitive tokens)', () => {
      const lowerKey = secret.toLowerCase();
      expect(lowerKey).not.toBe(secret);
      const res = evaluateAuthorization(`Bearer ${lowerKey}`, secret);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
    });

    it('rejects multiple tokens or garbage injection in header', () => {
      const res = evaluateAuthorization(`Bearer ${secret} evil_token_payload`, secret);
      expect(res.authorized).toBe(false);
      expect(res.status).toBe(401);
    });
  });

  describe('SSE 512,000-character boundary & chunking', () => {
    it('formats a single event right at the 512,000 character limit', () => {
      const textAtLimit = 'A'.repeat(MAX_SSE_DATA_LENGTH);
      const chunks = formatChunkedTextEvents(textAtLimit);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toContain(textAtLimit);
    });

    it('splits text into multiple events when one character over the 512,000 limit', () => {
      const textOverLimit = 'A'.repeat(MAX_SSE_DATA_LENGTH) + 'B';
      const chunks = formatChunkedTextEvents(textOverLimit);
      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toContain('A'.repeat(MAX_SSE_DATA_LENGTH));
      expect(chunks[1]).toContain('B');
    });

    it('SSEStreamController automatically chunks oversized text over the stream', async () => {
      const controller = new SSEStreamController();
      const reader = controller.readable.getReader();
      const decoder = new TextDecoder();

      const oversizedText = 'X'.repeat(MAX_SSE_DATA_LENGTH + 50);
      controller.sendText(oversizedText);
      controller.close();

      let accumulated = '';
      let done = false;
      while (!done) {
        const result = await reader.read();
        if (result.done) {
          done = true;
        } else {
          accumulated += decoder.decode(result.value, { stream: true });
        }
      }

      // Count occurrences of 'event: text'
      const matches = accumulated.match(/event: text/g);
      expect(matches?.length).toBe(2);
      expect(accumulated).toContain('event: done');
    });
  });

  describe('Concurrent request state isolation', () => {
    it('processes multiple concurrent streams without data cross-talk or leakage', async () => {
      const ctrl1 = new SSEStreamController();
      const ctrl2 = new SSEStreamController();

      const reader1 = ctrl1.readable.getReader();
      const reader2 = ctrl2.readable.getReader();
      const decoder = new TextDecoder();

      // Interleave writes concurrently
      ctrl1.sendText('User 1 - Token A');
      ctrl2.sendText('User 2 - Token B');
      ctrl1.sendText('User 1 - Finish');
      ctrl2.sendText('User 2 - Finish');
      ctrl1.close();
      ctrl2.close();

      const readAll = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
        let text = '';
        let isDone = false;
        while (!isDone) {
          const r = await reader.read();
          if (r.done) isDone = true;
          else text += decoder.decode(r.value, { stream: true });
        }
        return text;
      };

      const [out1, out2] = await Promise.all([readAll(reader1), readAll(reader2)]);

      expect(out1).toContain('User 1 - Token A');
      expect(out1).toContain('User 1 - Finish');
      expect(out1).not.toContain('User 2');

      expect(out2).toContain('User 2 - Token B');
      expect(out2).toContain('User 2 - Finish');
      expect(out2).not.toContain('User 1');
    });
  });
});

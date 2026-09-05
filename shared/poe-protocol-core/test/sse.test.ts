import { describe, it, expect } from 'vitest';
import {
  formatSSEEvent,
  formatTextEvent,
  formatReplaceResponseEvent,
  formatSuggestedReplyEvent,
  formatErrorEvent,
  formatMetaEvent,
  formatDoneEvent,
  SSEStreamController,
} from '../src/sse.js';

describe('SSE event formatters', () => {
  it('formats arbitrary event per spec', () => {
    const raw = formatSSEEvent('text', { custom: 'value' });
    expect(raw).toBe('event: text\ndata: {"custom":"value"}\n\n');
  });

  it('formats text event with proper json payload', () => {
    const event = formatTextEvent('Hello world');
    expect(event).toBe('event: text\ndata: {"text":"Hello world"}\n\n');
  });

  it('formats replace_response event', () => {
    const event = formatReplaceResponseEvent('Full text replacement');
    expect(event).toBe('event: replace_response\ndata: {"text":"Full text replacement"}\n\n');
  });

  it('formats suggested_reply event', () => {
    const event = formatSuggestedReplyEvent('Try /help');
    expect(event).toBe('event: suggested_reply\ndata: {"text":"Try /help"}\n\n');
  });

  it('formats error event with allow_retry defaults and flags', () => {
    const defaultErr = formatErrorEvent('Fatal error');
    expect(defaultErr).toBe('event: error\ndata: {"text":"Fatal error","allow_retry":false}\n\n');

    const retryErr = formatErrorEvent('Temporary network failure', true);
    expect(retryErr).toBe(
      'event: error\ndata: {"text":"Temporary network failure","allow_retry":true}\n\n',
    );
  });

  it('formats meta event', () => {
    const meta = formatMetaEvent({
      content_type: 'text/markdown',
      linkify: true,
      suggested_replies: true,
    });
    expect(meta).toBe(
      'event: meta\ndata: {"content_type":"text/markdown","linkify":true,"suggested_replies":true}\n\n',
    );
  });

  it('formats done event with empty object', () => {
    const done = formatDoneEvent();
    expect(done).toBe('event: done\ndata: {}\n\n');
  });

  it('handles empty strings and special characters correctly', () => {
    const empty = formatTextEvent('');
    expect(empty).toBe('event: text\ndata: {"text":""}\n\n');

    const special = formatTextEvent('Quotes " & newlines\n\ttabs');
    expect(special).toBe('event: text\ndata: {"text":"Quotes \\" & newlines\\n\\ttabs"}\n\n');
  });
});

describe('SSEStreamController', () => {
  it('streams chunks into a readable stream', async () => {
    const controller = new SSEStreamController();
    const reader = controller.readable.getReader();
    const decoder = new TextDecoder();

    controller.sendText('Part 1');
    controller.sendText('Part 2');
    controller.close();

    let combined = '';
    let done = false;
    while (!done) {
      const result = await reader.read();
      if (result.done) {
        done = true;
      } else {
        combined += decoder.decode(result.value, { stream: true });
      }
    }

    expect(combined).toContain('event: text\ndata: {"text":"Part 1"}\n\n');
    expect(combined).toContain('event: text\ndata: {"text":"Part 2"}\n\n');
    expect(combined).toContain('event: done\ndata: {}\n\n');
  });

  it('streams error and meta events properly', async () => {
    const controller = new SSEStreamController();
    const reader = controller.readable.getReader();
    const decoder = new TextDecoder();

    controller.sendMeta({ content_type: 'text/plain' });
    controller.sendError('Something broke', false);
    controller.close();

    let combined = '';
    let done = false;
    while (!done) {
      const res = await reader.read();
      if (res.done) {
        done = true;
      } else {
        combined += decoder.decode(res.value, { stream: true });
      }
    }

    expect(combined).toContain('event: meta\ndata: {"content_type":"text/plain"}\n\n');
    expect(combined).toContain(
      'event: error\ndata: {"text":"Something broke","allow_retry":false}\n\n',
    );
  });
});

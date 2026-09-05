import {
  EventType,
  TextEventPayload,
  ReplaceResponseEventPayload,
  SuggestedReplyEventPayload,
  ErrorEventPayload,
  MetaEventPayload,
} from './types.js';

/**
 * Formats a generic Server-Sent Event string according to the Poe protocol spec.
 * Framing:
 *   event: <event_name>\n
 *   data: <json_string>\n\n
 */
export function formatSSEEvent(event: EventType, data: unknown): string {
  const json = JSON.stringify(data ?? {});
  return `event: ${event}\ndata: ${json}\n\n`;
}

export function formatTextEvent(text: string): string {
  const payload: TextEventPayload = { text };
  return formatSSEEvent('text', payload);
}

export function formatReplaceResponseEvent(text: string): string {
  const payload: ReplaceResponseEventPayload = { text };
  return formatSSEEvent('replace_response', payload);
}

export function formatSuggestedReplyEvent(text: string): string {
  const payload: SuggestedReplyEventPayload = { text };
  return formatSSEEvent('suggested_reply', payload);
}

export function formatErrorEvent(text: string, allowRetry = false): string {
  const payload: ErrorEventPayload = { text, allow_retry: allowRetry };
  return formatSSEEvent('error', payload);
}

export function formatMetaEvent(meta: MetaEventPayload): string {
  return formatSSEEvent('meta', meta);
}

export const MAX_SSE_DATA_LENGTH = 512_000;

/**
 * Splits large text into consecutive SSE text events within the 512,000-character limit.
 */
export function formatChunkedTextEvents(
  text: string,
  maxChunkSize = MAX_SSE_DATA_LENGTH,
): string[] {
  if (text.length <= maxChunkSize) {
    return [formatTextEvent(text)];
  }

  const events: string[] = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    const slice = text.substring(i, i + maxChunkSize);
    events.push(formatTextEvent(slice));
  }
  return events;
}

export function formatDoneEvent(): string {
  return formatSSEEvent('done', {});
}

/**
 * High-level SSE controller wrapping standard Web Streams.
 * Compatible with Cloudflare Workers Response and modern Web fetch API.
 */
export class SSEStreamController {
  private readonly encoder = new TextEncoder();
  private controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  public readonly readable: ReadableStream<Uint8Array>;
  private isClosed = false;

  constructor() {
    this.readable = new ReadableStream<Uint8Array>({
      start: (ctrl) => {
        this.controller = ctrl;
      },
    });
  }

  public write(eventString: string): void {
    if (this.isClosed) {
      return;
    }
    if (!this.controller) {
      throw new Error('Stream controller is not initialized.');
    }
    this.controller.enqueue(this.encoder.encode(eventString));
  }

  public sendText(text: string): void {
    if (text.length > MAX_SSE_DATA_LENGTH) {
      const chunks = formatChunkedTextEvents(text);
      for (const chunk of chunks) {
        this.write(chunk);
      }
    } else {
      this.write(formatTextEvent(text));
    }
  }

  public sendReplaceResponse(text: string): void {
    this.write(formatReplaceResponseEvent(text));
  }

  public sendSuggestedReply(text: string): void {
    this.write(formatSuggestedReplyEvent(text));
  }

  public sendError(text: string, allowRetry = false): void {
    this.write(formatErrorEvent(text, allowRetry));
  }

  public sendMeta(meta: MetaEventPayload): void {
    this.write(formatMetaEvent(meta));
  }

  public close(): void {
    if (this.isClosed) {
      return;
    }
    this.write(formatDoneEvent());
    this.isClosed = true;
    if (this.controller) {
      this.controller.close();
    }
  }
}

import express, { Request, Response } from 'express';
import {
  evaluateAuthorization,
  buildSettingsResponse,
  formatTextEvent,
  formatErrorEvent,
  formatDoneEvent,
  QueryRequest,
  PoeRequest,
} from '@poe-projects/poe-protocol-core';
import { runOcr, fetchImageBuffer } from './ocr.js';
import { routeAndParse } from './router.js';

export interface ServerOptions {
  accessKey?: string;
  ocrRunner?: (source: string | Buffer) => Promise<string>;
  imageFetcher?: (url: string) => Promise<Buffer>;
}

export function createServer(options: ServerOptions = {}) {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const expectedKey = options.accessKey || process.env['POE_ACCESS_KEY'] || '';
  const ocrFn = options.ocrRunner || runOcr;
  const fetchFn = options.imageFetcher || fetchImageBuffer;

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'ocr-doc-bot' });
  });

  // Settings endpoint (can also be queried directly via GET or POST)
  app.get('/settings', (_req: Request, res: Response) => {
    const settings = buildSettingsResponse({
      allowAttachments: true,
      enableImageComprehension: false,
      introductionMessage:
        'Welcome! Upload an image of a receipt, bank statement, or government ID document. You can also use /receipt, /statement, or /id to specify the parser.',
    });
    res.status(200).json(settings);
  });

  // Main Poe Protocol Handler
  app.post('/', async (req: Request, res: Response): Promise<void> => {
    // 1. Authorization check
    const authHeader = req.headers.authorization;
    const authResult = evaluateAuthorization(authHeader, expectedKey);
    if (!authResult.authorized) {
      res.status(authResult.status).json({ error: authResult.message });
      return;
    }

    const body = req.body as PoeRequest;

    // 2. Settings request
    if (body.type === 'settings') {
      const settings = buildSettingsResponse({
        allowAttachments: true,
        enableImageComprehension: false,
        introductionMessage:
          'Welcome! Upload an image of a receipt, bank statement, or government ID document.',
      });
      res.status(200).json(settings);
      return;
    }

    // 3. Feedback / Error reporting
    if (body.type === 'report_feedback' || body.type === 'report_error') {
      res.status(200).json({ status: 'received' });
      return;
    }

    // 4. Query request
    if (body.type === 'query') {
      const queryReq = body as QueryRequest;
      const lastMsg = queryReq.query[queryReq.query.length - 1];

      // Setup SSE response headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      if (!lastMsg || !lastMsg.attachments || lastMsg.attachments.length === 0) {
        // If no image was provided, prompt user
        const promptText =
          '📎 **No image attachment detected.**\n\nPlease upload or attach a photo/scan of a **Receipt**, **Bank Statement**, or **ID Document** (PAN, Aadhaar, Passport, DL) to extract structured data.\n\n*Optional commands:* `/receipt`, `/statement`, `/id`';
        res.write(formatTextEvent(promptText));
        res.write(formatDoneEvent());
        res.end();
        return;
      }

      try {
        const attachment = lastMsg.attachments[0];
        if (!attachment || !attachment.url) {
          throw new Error('Attachment object is missing a valid URL.');
        }

        res.write(formatTextEvent('🔍 *Fetching image and running local OCR...*\n\n'));

        const imageBuffer = await fetchFn(attachment.url);
        const ocrText = await ocrFn(imageBuffer);

        const prompt = lastMsg.content || '';
        const parsedResult = routeAndParse(prompt, ocrText);

        const formattedMarkdown = [
          '### 📄 Document Extraction Results',
          `**Document Type**: \`${parsedResult.documentType}\``,
          '',
          '```json',
          JSON.stringify(parsedResult, null, 2),
          '```',
          '',
          '> ℹ️ *Fields flagged with `"confidence": "low"` indicate low OCR clarity or ambiguous layout. Please verify against the source document.*',
        ].join('\n');

        res.write(formatTextEvent(formattedMarkdown));
        res.write(formatDoneEvent());
        res.end();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown OCR processing error.';
        res.write(formatErrorEvent(`Extraction failed: ${errorMsg}`, false));
        res.write(formatDoneEvent());
        res.end();
      }
      return;
    }

    res.status(400).json({ error: 'Unsupported request type.' });
  });

  return app;
}

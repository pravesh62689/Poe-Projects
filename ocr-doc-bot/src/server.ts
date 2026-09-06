import express, { Request, Response } from 'express';
import {
  evaluateAuthorization,
  buildSettingsResponse,
  formatTextEvent,
  formatSuggestedReplyEvent,
  formatErrorEvent,
  formatDoneEvent,
  QueryRequest,
  PoeRequest,
} from '@poe-projects/poe-protocol-core';
import { runOcr, fetchImageBuffer, detectBlur, deskewImage, OcrOutput } from './ocr.js';
import { routeAndParse } from './router.js';

const OCR_INTRO_MESSAGE = `📄 **OCR-Doc-Parser** turns photos of **receipts, bank statements, and ID documents** into clean, structured JSON.

**Attach an image to start.** Every field comes back with a confidence flag, and blurry scans are caught before they corrupt your data.

**Commands:** \`/receipt\` · \`/statement\` · \`/id\` (PAN, Aadhaar, Passport, DL)

Need SQL or regex instead? Try @English-To-SQL and @Regex-Gen-Tester.`;

export interface ServerOptions {
  accessKey?: string;
  ocrRunner?: (source: string | Buffer) => Promise<string | OcrOutput>;
  imageFetcher?: (url: string) => Promise<Buffer>;
  blurGateEnabled?: boolean;
  blurThreshold?: number;
}

export function createServer(options: ServerOptions = {}) {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const expectedKey = options.accessKey || process.env['POE_ACCESS_KEY'] || '';
  const ocrFn = options.ocrRunner || runOcr;
  const fetchFn = options.imageFetcher || fetchImageBuffer;
  const blurGateEnabled = options.blurGateEnabled ?? true;
  const blurThreshold = options.blurThreshold ?? 300;

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'ocr-doc-bot' });
  });

  // Settings endpoint (can also be queried directly via GET or POST)
  app.get('/settings', (_req: Request, res: Response) => {
    const settings = buildSettingsResponse({
      allowAttachments: true,
      enableImageComprehension: false,
      introductionMessage: OCR_INTRO_MESSAGE,
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
        introductionMessage: OCR_INTRO_MESSAGE,
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
          throw new Error('Image attachment missing download URL.');
        }

        res.write(formatTextEvent('🔍 *Fetching image and analyzing quality...*\n\n'));

        const imageBuffer = await fetchFn(attachment.url);

        // A. Laplacian blur detection gate
        if (blurGateEnabled) {
          const blurResult = await detectBlur(imageBuffer, blurThreshold);
          if (blurResult.isBlurred) {
            const blurWarning = [
              '⚠️ **Low Image Clarity Detected**',
              '',
              `The uploaded document image appears blurred (Clarity Score: \`${blurResult.score.toFixed(1)}\`, Minimum Required: \`${blurResult.threshold}\`).`,
              '',
              'OCR accuracy is severely degraded on blurry photos. Please provide a sharper, well-focused photo or scan for reliable data extraction.',
            ].join('\n');

            res.write(formatTextEvent(blurWarning));
            res.write(formatDoneEvent());
            res.end();
            return;
          }
        }

        // B. Guarded deskewing pass
        const { buffer: processedBuffer, angle } = await deskewImage(imageBuffer);
        if (angle !== 0) {
          res.write(formatTextEvent(`📐 *Corrected ${angle}° skew tilt...*\n\n`));
        }

        // C. OCR execution
        res.write(formatTextEvent('🔍 *Running OCR extraction...*\n\n'));
        const ocrOutput = await ocrFn(processedBuffer);

        const prompt = lastMsg.content || '';
        const parsedResult = routeAndParse(prompt, ocrOutput);

        const isHandwritten =
          (parsedResult.documentType === 'receipt' &&
            parsedResult.amount?.flagReason?.includes('Handwritten')) ||
          (parsedResult.documentType === 'receipt' &&
            parsedResult.vendor?.confidence === 'low' &&
            parsedResult.amount?.confidence === 'low');

        const rawOcrText = typeof ocrOutput === 'string' ? ocrOutput : ocrOutput.text || '';

        // Build human-readable summary table
        const tableRows: string[] = [
          '| Field | Extracted Value | Confidence |',
          '| :--- | :--- | :--- |',
        ];

        let itemsTable = '';
        const rec = parsedResult as any;
        if (parsedResult.documentType === 'receipt') {
          tableRows.push(`| **Vendor / Store** | ${rec.vendor?.value || 'Unknown'} | ${rec.vendor?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          tableRows.push(`| **Date** | ${rec.date?.value || 'Unknown'} | ${rec.date?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          if (rec.invoiceNumber) {
            tableRows.push(`| **Receipt / Invoice #** | ${rec.invoiceNumber.value} | ✅ High |`);
          }
          if (rec.subtotal) {
            tableRows.push(`| **Subtotal** | $${rec.subtotal.value.toFixed(2)} | ✅ High |`);
          }
          if (rec.tax) {
            tableRows.push(`| **Tax (GST / VAT)** | $${rec.tax.value.toFixed(2)} | ✅ High |`);
          }
          tableRows.push(`| **Total Amount** | ${rec.amount?.value !== undefined ? '$' + rec.amount.value.toFixed(2) : 'Unknown'} | ${rec.amount?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          if (rec.paymentMethod) {
            tableRows.push(`| **Payment Method** | ${rec.paymentMethod.value} | ✅ High |`);
          }
          if (rec.gstin) {
            tableRows.push(`| **GSTIN / Tax ID** | ${rec.gstin.value} | ${rec.gstin.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          }

          if (rec.lineItems && rec.lineItems.length > 0) {
            const itemRows = rec.lineItems.map((it: any) => `| ${it.description} | ${it.quantity || 1} | $${it.amount.toFixed(2)} |`);
            itemsTable = [
              '',
              '#### 🛒 Line Items Detected:',
              '| Item | Qty | Price |',
              '| :--- | :---: | ---: |',
              ...itemRows,
            ].join('\n');
          }
        } else if (parsedResult.documentType === 'statement') {
          tableRows.push(`| **Account Holder** | ${rec.accountHolder?.value || 'Unknown'} | ${rec.accountHolder?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          tableRows.push(`| **Statement Period** | ${rec.period?.value || 'Unknown'} | ${rec.period?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          tableRows.push(`| **Closing Balance** | ${rec.closingBalance?.value !== undefined ? '$' + rec.closingBalance.value.toFixed(2) : 'Unknown'} | ${rec.closingBalance?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          tableRows.push(`| **Transactions Found** | ${rec.transactions?.length || 0} entries | ✅ High |`);
        } else if (parsedResult.documentType === 'id') {
          tableRows.push(`| **ID Type** | ${rec.idType || 'Unknown'} | ✅ High |`);
          tableRows.push(`| **Document Number** | ${rec.idNumber?.value || 'Unknown'} | ${rec.idNumber?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          tableRows.push(`| **Name** | ${rec.name?.value || 'Unknown'} | ${rec.name?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
          tableRows.push(`| **Date of Birth** | ${rec.dateOfBirth?.value || 'Unknown'} | ${rec.dateOfBirth?.confidence === 'high' ? '✅ High' : '⚠️ Low'} |`);
        }

        const formattedMarkdown = [
          '### 📄 Document Extraction Results',
          `**Document Type**: \`${parsedResult.documentType}\``,
          '',
          '#### 📋 Extracted Summary:',
          tableRows.join('\n'),
          itemsTable ? itemsTable : '',
          '',
          '#### 📦 Structured JSON:',
          '```json',
          JSON.stringify(parsedResult, null, 2),
          '```',
          '',
          rawOcrText
            ? `<details>\n<summary>🔍 <b>View Full Raw OCR Text (Click to expand)</b></summary>\n\n\`\`\`text\n${rawOcrText.trim()}\n\`\`\`\n</details>\n`
            : '',
          isHandwritten
            ? '> ⚠️ **Notice**: Document text appears handwritten or has low clarity. Tesseract OCR is not optimized for handwriting; extracted values carry low confidence and must be manually verified.\n\n'
            : '',
          '> ℹ️ *Fields flagged with `"confidence": "low"` indicate low OCR clarity or ambiguous layout. Please verify against the source document.*',
        ].filter(Boolean).join('\n');

        res.write(formatTextEvent(formattedMarkdown));
        res.write(formatSuggestedReplyEvent('Extract the line items too'));
        res.write(formatSuggestedReplyEvent('Return only the total and date'));
        res.write(formatSuggestedReplyEvent('Explain the low-confidence fields'));
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

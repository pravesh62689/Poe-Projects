# OCR Document Bot (`ocr-doc-bot`)

Extracts structured data from receipts, bank statements, and ID documents into clean JSON, with routing by document type and explicit confidence flagging for uncertain fields.

## Features
- **Zero Paid Dependencies**: Runs self-hosted `tesseract.js` directly on Render's free tier.
- **Strict Poe Protocol Compliance**: Direct implementation of HTTP + Server-Sent Events (SSE) via `@poe-projects/poe-protocol-core`.
- **Honest Confidence Flagging**: Uncertain or low-contrast fields are tagged with `{ "value": "...", "confidence": "low" }` rather than silently guessed.
- **Adaptive Routing**: Supports explicit commands (`/receipt`, `/statement`, `/id`) or automatically detects the document type from OCR layout heuristics.

## Environment Variables
- `POE_ACCESS_KEY` (Required): Secret key set on the Poe Creator dashboard to authenticate incoming requests.
- `PORT` (Optional): Server port (defaults to `3000` locally, or `10000` on Render).

## Cold-Start Behavior on Render Free Tier
Render Free Web Services spin down to sleep mode after **15 minutes of inactivity**.
When a new request arrives after a sleep period:
1. The first HTTP request may experience a **30–50 second spin-up latency** while Render boots the container and Tesseract initializes worker threads.
2. Subsequent requests respond rapidly in real-time.
3. Keep-alive pings can be sent if immediate response times are required during active working hours.

## Local Development & Testing
```bash
# Run unit & integration tests
npm test --workspace=@poe-projects/ocr-doc-bot

# Build TypeScript
npm run build --workspace=@poe-projects/ocr-doc-bot

# Start server locally
npm start --workspace=@poe-projects/ocr-doc-bot
```

## Deployment
1. Connect your repository to [Render.com](https://render.com).
2. Choose **Blueprint** and point to `ocr-doc-bot/render.yaml` or create a Web Service with the Node environment.
3. Add the `POE_ACCESS_KEY` environment variable in the Render Environment tab.
4. Set the server URL in your Poe bot configuration with `Allow attachments: true` and `Enable image comprehension: false`.

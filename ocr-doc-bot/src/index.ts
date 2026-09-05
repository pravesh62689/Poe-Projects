import dotenv from 'dotenv';
import { createServer } from './server.js';

dotenv.config();

const port = process.env['PORT'] || 3000;
const app = createServer();

app.listen(port, () => {
  console.log(`[ocr-doc-bot] Server listening on port ${port}`);
});

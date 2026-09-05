import { ExtractedSqlPrompt } from './types.js';
/**
 * Separates SQL DDL/DML statements from the natural language query prompt.
 */
export declare function extractSchemaAndAsk(text: string): ExtractedSqlPrompt;

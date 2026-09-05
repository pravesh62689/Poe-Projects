import { ExtractedSqlPrompt } from './types.js';

/**
 * Separates SQL DDL/DML statements from the natural language query prompt.
 */
export function extractSchemaAndAsk(text: string): ExtractedSqlPrompt {
  // 1. Check for fenced code block containing schema
  const codeBlockMatch = text.match(/```(?:sql)?\s*([\s\S]*?)```/i);
  let schema = '';
  let ask = '';

  if (codeBlockMatch && codeBlockMatch[1]) {
    schema = codeBlockMatch[1].trim();
    ask = text.replace(codeBlockMatch[0], '').trim();
  } else {
    // 2. Scan line-by-line for CREATE TABLE / INSERT INTO / ALTER TABLE
    const lines = text.split(/\r?\n/);
    const schemaLines: string[] = [];
    const askLines: string[] = [];
    let inSchemaSection = false;

    for (const line of lines) {
      const trimmed = line.trim();
      const isSqlKeyword =
        /^(CREATE\s+TABLE|INSERT\s+INTO|DROP\s+TABLE|ALTER\s+TABLE)\b/i.test(trimmed);

      if (isSqlKeyword) {
        inSchemaSection = true;
      }

      if (inSchemaSection) {
        schemaLines.push(line);
        if (trimmed.endsWith(';')) {
          // Could be end of a statement; keep scanning next lines
        }
      } else {
        if (trimmed.length > 0) {
          askLines.push(line);
        }
      }
    }

    schema = schemaLines.join('\n').trim();
    ask = askLines.join('\n').trim();
  }

  // Fallback: If no ask was identified outside the schema, use default
  if (!ask) {
    ask = 'SELECT * FROM the primary table;';
  }

  return { schema, ask };
}

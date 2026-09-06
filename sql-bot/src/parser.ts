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
        // Handle mixed SQL + natural-language on a single semicolon-delimited line.
        // Split by `;`, keep SQL statements, and move the trailing non-SQL remainder to ask.
        const segments = trimmed.split(';');
        const sqlSegments: string[] = [];
        let foundNonSql = false;

        for (let i = 0; i < segments.length; i++) {
          const rawSeg = segments[i];
          if (!rawSeg) continue;
          const seg = rawSeg.trim();
          if (!seg) continue;

          const segIsSql =
            /^(CREATE\s+TABLE|INSERT\s+INTO|DROP\s+TABLE|ALTER\s+TABLE|SELECT\b|UPDATE\b|DELETE\b)/i.test(seg);

          if (segIsSql || (!foundNonSql && i < segments.length - 1)) {
            // SQL statement or mid-line segment before the trailing ask
            sqlSegments.push(seg + ';');
          } else {
            // Non-SQL trailing segment — this is the natural language ask
            foundNonSql = true;
            askLines.push(seg);
          }
        }

        if (sqlSegments.length > 0) {
          schemaLines.push(sqlSegments.join(' '));
        }

        // Exit schema mode after last semicolon-terminated statement if no SQL keyword continues
        if (trimmed.endsWith(';')) {
          inSchemaSection = false;
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

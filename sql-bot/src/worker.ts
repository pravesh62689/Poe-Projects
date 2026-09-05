import {
  evaluateAuthorization,
  buildSettingsResponse,
  SSEStreamController,
  QueryRequest,
  PoeRequest,
} from '@poe-projects/poe-protocol-core';
import { createDatabaseWithSchema } from './engine.js';
import { extractSchemaAndAsk } from './parser.js';
import { cleanRawSqlQuery, synthesizeSqlFromSchema, queryPoeSqlBot } from './llm.js';
import { executeWithRetry } from './retry.js';

export interface WorkerEnv {
  POE_ACCESS_KEY?: string;
}

export function checkDestructiveSql(sql: string): { isDestructive: boolean; warning?: string } {
  const upper = sql.toUpperCase();
  if (/\bDROP\s+TABLE\b/.test(upper)) {
    return {
      isDestructive: true,
      warning: '⚠️ **Destructive Statement Warning**: This query contains `DROP TABLE`, which permanently drops tables and destroys data.',
    };
  }
  if (/\bDELETE\s+FROM\b/.test(upper) && !/\bWHERE\b/.test(upper)) {
    return {
      isDestructive: true,
      warning: '⚠️ **Destructive Statement Warning**: This query contains an unconditional `DELETE` without a `WHERE` clause, which truncates all records from the target table.',
    };
  }
  return { isDestructive: false };
}

export type CustomSqlGenerator = (
  schema: string,
  ask: string,
  failedSql?: string,
  errorFeedback?: string,
) => Promise<string>;

export async function handleSqlWorkerRequest(
  request: Request,
  env: WorkerEnv = {},
  customGenerator?: CustomSqlGenerator,
): Promise<Response> {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'sql-bot' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 1. Authorization check
  const authHeader = request.headers.get('Authorization');
  const expectedKey = env.POE_ACCESS_KEY || '';
  const authResult = evaluateAuthorization(authHeader, expectedKey);
  if (!authResult.authorized) {
    return new Response(JSON.stringify({ error: authResult.message }), {
      status: authResult.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: PoeRequest;
  try {
    body = (await request.json()) as PoeRequest;
  } catch (_e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Settings request
  if (body.type === 'settings') {
    const settings = buildSettingsResponse({
      allowAttachments: false,
      enableImageComprehension: false,
      introductionMessage:
        'Welcome! Provide your CREATE TABLE statements (+ optional sample rows) and describe the query you want. I will generate and actually execute the SQL in an in-memory database to verify it before returning the results.',
      serverBotDependencies: {
        'Claude-3.5-Sonnet': 1,
      },
    });
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Feedback / Error reporting
  if (body.type === 'report_feedback' || body.type === 'report_error') {
    return new Response(JSON.stringify({ status: 'received' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Query request
  if (body.type === 'query') {
    const queryReq = body as QueryRequest;
    const lastMsg = queryReq.query[queryReq.query.length - 1];
    const userPrompt = lastMsg?.content || '';

    const stream = new SSEStreamController();

    (async () => {
      try {
        const { schema, ask } = extractSchemaAndAsk(userPrompt);

        if (!schema) {
          stream.sendText(
            '⚠️ **No SQL Schema Detected**\n\nPlease provide at least one `CREATE TABLE` statement (and optional `INSERT INTO` sample rows) along with your question so I can seed the in-memory engine and verify your query.',
          );
          stream.close();
          return;
        }

        // Initialize in-memory SQLite database
        let db;
        try {
          db = await createDatabaseWithSchema(schema);
        } catch (schemaErr) {
          const errMsg = schemaErr instanceof Error ? schemaErr.message : String(schemaErr);
          stream.sendText(
            `❌ **Schema Initialization Error**\n\nYour table definition contains a syntax or constraint error:\n\`\`\`text\n${errMsg}\n\`\`\`\nPlease review your \`CREATE TABLE\` / \`INSERT\` statements.`,
          );
          stream.close();
          return;
        }

        // Candidate query generation
        const generateCandidate = async (failedSql?: string, errorMsg?: string) => {
          if (customGenerator) {
            return customGenerator(schema, ask, failedSql, errorMsg);
          }
          if (queryReq.api_key) {
            const systemPrompt =
              'You are a SQLite SQL query expert. Respond ONLY with a valid SQLite SQL statement. Do not include explanation.';
            const prompt = errorMsg
              ? `Fix this query for schema:\n${schema}\nUser ask: ${ask}\nFailed SQL: ${failedSql}\nError: ${errorMsg}`
              : `Schema:\n${schema}\nUser ask: ${ask}`;
            return queryPoeSqlBot('Claude-3.5-Sonnet', systemPrompt, prompt, queryReq.api_key);
          }
          return synthesizeSqlFromSchema(schema, ask);
        };

        const initialQuery = cleanRawSqlQuery(await generateCandidate());

        // Execute query with 1-turn retry loop
        const outcome = await executeWithRetry(db, initialQuery, async (errStr, badSql) => {
          return cleanRawSqlQuery(await generateCandidate(badSql, errStr));
        });

        db.close();

        if (outcome.success && outcome.result) {
          const destructiveCheck = checkDestructiveSql(outcome.query);

          const lines: string[] = [
            '### 📊 Verified SQL Query & Results',
            '',
          ];

          if (destructiveCheck.isDestructive && destructiveCheck.warning) {
            lines.push(`> ${destructiveCheck.warning}`, '');
          }

          if (outcome.retried) {
            lines.push('> 🔄 *Note: The initial query generated an error and was automatically self-corrected through an error feedback retry.*');
          } else {
            lines.push('> ✅ *Verified: Query successfully executed against an in-memory copy of your schema.*');
          }

          lines.push(
            '',
            '```sql',
            outcome.query,
            '```',
            '',
            `**Execution Time**: \`${outcome.result.executionTimeMs}ms\``,
            '',
          );

          if (outcome.result.columns.length > 0) {
            lines.push('#### 📋 Tabular Output:');
            lines.push(`| ${outcome.result.columns.join(' | ')} |`);
            lines.push(`| ${outcome.result.columns.map(() => ':---').join(' | ')} |`);

            for (const row of outcome.result.values) {
              lines.push(`| ${row.map((v) => (v === null ? '*NULL*' : String(v))).join(' | ')} |`);
            }
          } else {
            lines.push('*Query executed successfully (0 rows returned).*');
          }

          lines.push(
            '',
            '> ℹ️ *Dialect Notice: This query was validated against in-memory SQLite semantics. If targeting PostgreSQL, MySQL, or SQL Server, verify dialect-specific date, string, or window functions.*',
          );

          stream.sendText(lines.join('\n'));
        } else {
          // Honest failure report per AGENTS.md requirements
          const failLines = [
            '### ❌ Query Verification Failed',
            '',
            'I generated a candidate SQL query, but it failed execution against the in-memory schema even after an automated self-correction retry.',
            '',
            '**Attempted SQL**:',
            '```sql',
            outcome.query,
            '```',
            '',
            '**Database Diagnostic Error**:',
            `\`\`\`text\n${outcome.error}\n\`\`\``,
            '',
            '> *Per engineering safety policy, unverified queries that fail execution are flagged honestly rather than guessed.*',
          ];
          stream.sendText(failLines.join('\n'));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown SQL execution error.';
        stream.sendError(errorMsg, false);
      } finally {
        stream.close();
      }
    })();

    return new Response(stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  return new Response(JSON.stringify({ error: 'Unsupported request type.' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

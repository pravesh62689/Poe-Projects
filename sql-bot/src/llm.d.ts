/**
 * Cleans markdown code fences or explanatory text from model output to isolate the pure SQL query.
 */
export declare function cleanRawSqlQuery(raw: string): string;
/**
 * Heuristic fallback SQL query generator.
 * Synthesizes standard SQL queries from schema definitions for offline test execution.
 */
export declare function synthesizeSqlFromSchema(schema: string, ask: string): string;
/**
 * Queries Poe upstream model via server_bot_dependencies.
 */
export declare function queryPoeSqlBot(botName: string, systemPrompt: string, userPrompt: string, apiKey: string, fetchFn?: typeof fetch): Promise<string>;

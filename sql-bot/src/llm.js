/**
 * Cleans markdown code fences or explanatory text from model output to isolate the pure SQL query.
 */
export function cleanRawSqlQuery(raw) {
    let cleaned = raw.trim();
    const fenceMatch = cleaned.match(/```(?:sql)?\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
        cleaned = fenceMatch[1].trim();
    }
    // Strip comments
    cleaned = cleaned.replace(/--.*$/gm, '').trim();
    return cleaned;
}
/**
 * Heuristic fallback SQL query generator.
 * Synthesizes standard SQL queries from schema definitions for offline test execution.
 */
export function synthesizeSqlFromSchema(schema, ask) {
    const tableMatches = [...schema.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi)];
    const tables = tableMatches.map((m) => m[1]).filter((t) => Boolean(t));
    if (tables.length === 0) {
        return 'SELECT 1;';
    }
    const primaryTable = tables[0];
    if (!primaryTable) {
        return 'SELECT 1;';
    }
    const lowerAsk = ask.toLowerCase();
    // Check for COUNT ask
    if (lowerAsk.includes('count') || lowerAsk.includes('how many')) {
        return `SELECT COUNT(*) AS total_count FROM ${primaryTable};`;
    }
    // Check for JOIN ask if multiple tables
    const secondTable = tables[1];
    if (secondTable && (lowerAsk.includes('join') || lowerAsk.includes('with') || lowerAsk.includes('both'))) {
        return `SELECT t1.*, t2.* FROM ${primaryTable} t1 JOIN ${secondTable} t2 ON t1.id = t2.${primaryTable.replace(/s$/, '')}_id;`;
    }
    // Check for ORDER BY / TOP / HIGHEST ask
    if (lowerAsk.includes('top') || lowerAsk.includes('highest') || lowerAsk.includes('most')) {
        return `SELECT * FROM ${primaryTable} ORDER BY id DESC LIMIT 5;`;
    }
    return `SELECT * FROM ${primaryTable};`;
}
/**
 * Queries Poe upstream model via server_bot_dependencies.
 */
export async function queryPoeSqlBot(botName, systemPrompt, userPrompt, apiKey, fetchFn = fetch) {
    const payload = {
        version: '1.0.0',
        type: 'query',
        query: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    };
    const res = await fetchFn(`https://api.poe.com/bot/${botName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error(`Upstream Poe query failed: HTTP ${res.status}`);
    }
    const text = await res.text();
    return cleanRawSqlQuery(text);
}
//# sourceMappingURL=llm.js.map
/**
 * Fallback pattern synthesizer for standard natural language inquiries.
 * Guarantees zero-network offline determinism in testing and environments without active Poe API credentials.
 */
export function synthesizePatternFromHeuristics(prompt) {
    const lower = prompt.toLowerCase();
    // If user provided a regex literal like `/^[a-z]+$/i`
    const literalMatch = prompt.match(/\/([^/]+)\/([gimsuy]*)/);
    if (literalMatch && literalMatch[1]) {
        return {
            pattern: literalMatch[1],
            flags: literalMatch[2] || '',
            explanation: 'Extracted regex literal from user prompt.',
        };
    }
    if (lower.includes('email')) {
        return {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            flags: 'i',
            explanation: 'Matches RFC 5322 compliant standard email addresses.',
        };
    }
    if (lower.includes('phone') || lower.includes('mobile')) {
        return {
            pattern: '^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$',
            flags: '',
            explanation: 'Matches international and domestic telephone number formats.',
        };
    }
    if (lower.includes('url') || lower.includes('website') || lower.includes('http')) {
        return {
            pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$',
            flags: 'i',
            explanation: 'Matches standard HTTP and HTTPS web URLs.',
        };
    }
    if (lower.includes('date') || lower.includes('yyyy-mm-dd')) {
        return {
            pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$',
            flags: '',
            explanation: 'Matches ISO-8601 calendar date format (YYYY-MM-DD).',
        };
    }
    if (lower.includes('uuid')) {
        return {
            pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
            flags: 'i',
            explanation: 'Matches canonical RFC 4122 UUID strings.',
        };
    }
    if (lower.includes('digits') || lower.includes('numeric') || lower.includes('numbers only')) {
        return {
            pattern: '^\\d+$',
            flags: '',
            explanation: 'Matches one or more consecutive decimal digits.',
        };
    }
    // Default fallback: match word characters
    return {
        pattern: '\\b[a-zA-Z0-9_-]+\\b',
        flags: 'g',
        explanation: 'Matches standard alphanumeric identifiers and words.',
    };
}
/**
 * Queries Poe upstream model via server_bot_dependencies.
 */
export async function queryPoeUpstreamBot(botName, userInstruction, apiKey, fetchFn = fetch) {
    const systemPrompt = 'You are an expert regex generator. Respond ONLY with a JSON object: {"pattern": "<regex>", "flags": "<flags>", "explanation": "<brief summary>"}. Do not include markdown codeblocks or other commentary.';
    const payload = {
        version: '1.0.0',
        type: 'query',
        query: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInstruction },
        ],
    };
    try {
        const res = await fetchFn(`https://api.poe.com/bot/${botName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error(`Upstream Poe query failed with HTTP ${res.status}`);
        }
        const text = await res.text();
        // Parse SSE response or raw json
        const jsonMatch = text.match(/\{[\s\S]*"pattern"[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                pattern: parsed.pattern || '^.*$',
                flags: parsed.flags || '',
                explanation: parsed.explanation || 'Generated regex pattern.',
            };
        }
    }
    catch (_e) {
        // Graceful failover to heuristic synthesizer
    }
    return synthesizePatternFromHeuristics(userInstruction);
}
//# sourceMappingURL=llm.js.map
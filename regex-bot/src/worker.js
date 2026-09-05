import { evaluateAuthorization, buildSettingsResponse, SSEStreamController, } from '@poe-projects/poe-protocol-core';
import { extractInstructionAndSamples, evaluateRegex } from './evaluator.js';
import { queryPoeUpstreamBot, synthesizePatternFromHeuristics } from './llm.js';
export async function handleRegexWorkerRequest(request, env = {}, customUpstreamQuery) {
    // Only accept POST (and GET for health check)
    if (request.method === 'GET') {
        const url = new URL(request.url);
        if (url.pathname === '/health') {
            return new Response(JSON.stringify({ status: 'ok', service: 'regex-bot' }), {
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
    let body;
    try {
        body = (await request.json());
    }
    catch (_e) {
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
            introductionMessage: 'Welcome! Describe the regex pattern you need, and provide sample strings (e.g. "Sample: test@example.com"). I will generate the pattern and execute it in real-time against your samples.',
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
        const queryReq = body;
        const lastMsg = queryReq.query[queryReq.query.length - 1];
        const userPrompt = lastMsg?.content || '';
        const stream = new SSEStreamController();
        // Kick off async execution without blocking stream instantiation
        (async () => {
            try {
                const { instruction, samples } = extractInstructionAndSamples(userPrompt);
                // Pattern generation (LLM assist or test injection)
                let proposal;
                if (customUpstreamQuery) {
                    proposal = await customUpstreamQuery(instruction);
                }
                else if (queryReq.api_key) {
                    proposal = await queryPoeUpstreamBot('Claude-3.5-Sonnet', instruction, queryReq.api_key);
                }
                else {
                    proposal = synthesizePatternFromHeuristics(instruction);
                }
                // Real-time deterministic execution against samples
                const evaluation = evaluateRegex(proposal.pattern, proposal.flags, samples);
                const lines = [
                    '### ⚡ Regex Execution Report',
                    '',
                    `**Pattern**: \`/${evaluation.pattern}/${evaluation.flags}\``,
                    `**Description**: ${proposal.explanation}`,
                    '',
                ];
                if (!evaluation.isSafe) {
                    lines.push(`> ⚠️ **Catastrophic Backtracking Alert**: ${evaluation.securityWarning}`, '', 'Execution was halted on user samples to preserve Cloudflare Worker free-tier CPU limits.');
                }
                else if (samples.length === 0) {
                    lines.push('> ⚠️ **Notice: No test samples provided.**', '', 'This pattern was generated from your description, but has **NOT** been verified against real test samples.', 'To execute and verify matching strings in real time, provide samples like `Sample: <text>`.');
                }
                else {
                    lines.push('#### 🔬 Real Execution Against Provided Samples:');
                    lines.push('| Sample String | Status | Execution Time | Match Groups |');
                    lines.push('| :--- | :---: | :---: | :--- |');
                    for (const s of evaluation.samples) {
                        const statusIcon = s.matched ? '✅ Matched' : '❌ No Match';
                        const groups = s.matchGroups.length > 0 ? `\`${s.matchGroups.join('`, `')}\`` : '*none*';
                        lines.push(`| \`${s.sample}\` | ${statusIcon} | ${s.executionTimeMs}ms | ${groups} |`);
                    }
                }
                stream.sendText(lines.join('\n'));
            }
            catch (err) {
                const errStr = err instanceof Error ? err.message : 'Unknown regex execution error.';
                stream.sendError(errStr, false);
            }
            finally {
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
//# sourceMappingURL=worker.js.map
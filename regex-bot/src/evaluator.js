/**
 * Checks for pathological ReDoS patterns (nested quantifiers, polynomial/exponential backtracking traps).
 */
export function checkCatastrophicBacktrackingRisk(pattern) {
    // Check for nested quantifiers e.g. (a+)+, (.*)*, ([0-9]+)+, (\w+)*
    const nestedQuantifiers = /\((?:[^()]+[+*]){1,}\)[+*]|\((?:[^()]+[+*]){1,}\)\{\d+,?\d*\}/;
    if (nestedQuantifiers.test(pattern)) {
        return {
            isSafe: false,
            warning: 'Potential Catastrophic Backtracking (ReDoS) detected: nested quantifiers like (a+)+ or (.*)+ can cause exponential CPU freeze.',
        };
    }
    // Check for repeated overlapping character classes with quantifiers
    const overlappingRepetition = /\((?:[a-zA-Z0-9]+|[a-z]+|\d+)\+?\)\+/;
    if (overlappingRepetition.test(pattern)) {
        return {
            isSafe: false,
            warning: 'Dangerous repetition pattern detected that risks catastrophic backtracking.',
        };
    }
    return { isSafe: true };
}
/**
 * Safely compiles and executes regex against user samples with time tracking and defensive boundaries.
 */
export function evaluateRegex(rawPattern, rawFlags, samples) {
    const flags = rawFlags ? rawFlags.replace(/[^gimsuy]/g, '') : '';
    const safety = checkCatastrophicBacktrackingRisk(rawPattern);
    if (!safety.isSafe) {
        return {
            pattern: rawPattern,
            flags,
            isSafe: false,
            securityWarning: safety.warning,
            samples: samples.map((s) => ({
                sample: s,
                matched: false,
                matchGroups: [],
                executionTimeMs: 0,
                error: 'Execution halted: Pattern failed safety verification.',
            })),
        };
    }
    let regex;
    try {
        regex = new RegExp(rawPattern, flags);
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Invalid regular expression syntax.';
        return {
            pattern: rawPattern,
            flags,
            isSafe: false,
            securityWarning: errorMsg,
            samples: samples.map((s) => ({
                sample: s,
                matched: false,
                matchGroups: [],
                executionTimeMs: 0,
                error: `Syntax error: ${errorMsg}`,
            })),
        };
    }
    const results = [];
    for (const sample of samples) {
        const start = performance.now();
        try {
            // Re-create regex if global flag is present so lastIndex resets per sample
            const runner = flags.includes('g') ? new RegExp(rawPattern, flags) : regex;
            const match = runner.exec(sample);
            const elapsed = performance.now() - start;
            if (match) {
                results.push({
                    sample,
                    matched: true,
                    matchGroups: Array.from(match),
                    executionTimeMs: Number(elapsed.toFixed(3)),
                });
            }
            else {
                results.push({
                    sample,
                    matched: false,
                    matchGroups: [],
                    executionTimeMs: Number(elapsed.toFixed(3)),
                });
            }
        }
        catch (err) {
            const elapsed = performance.now() - start;
            results.push({
                sample,
                matched: false,
                matchGroups: [],
                executionTimeMs: Number(elapsed.toFixed(3)),
                error: err instanceof Error ? err.message : 'Execution failed',
            });
        }
    }
    return {
        pattern: rawPattern,
        flags,
        isSafe: true,
        samples: results,
    };
}
/**
 * Extracts candidate pattern, flags, and sample strings from natural language conversation text.
 */
export function extractInstructionAndSamples(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const samples = [];
    const instructions = [];
    for (const line of lines) {
        if (line.startsWith('Test:') || line.startsWith('Sample:') || line.startsWith('- ')) {
            const cleaned = line.replace(/^(Test:|Sample:|-)\s*/i, '').replace(/^["']|["']$/g, '');
            if (cleaned)
                samples.push(cleaned);
        }
        else if (/^`.*`$/.test(line)) {
            samples.push(line.replace(/^`|`$/g, ''));
        }
        else {
            instructions.push(line);
        }
    }
    return {
        instruction: instructions.join('\n') || text,
        samples,
    };
}
//# sourceMappingURL=evaluator.js.map
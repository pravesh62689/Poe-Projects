export interface RegexPatternProposal {
    pattern: string;
    flags: string;
    explanation: string;
}
/**
 * Fallback pattern synthesizer for standard natural language inquiries.
 * Guarantees zero-network offline determinism in testing and environments without active Poe API credentials.
 */
export declare function synthesizePatternFromHeuristics(prompt: string): RegexPatternProposal;
/**
 * Queries Poe upstream model via server_bot_dependencies.
 */
export declare function queryPoeUpstreamBot(botName: string, userInstruction: string, apiKey: string, fetchFn?: typeof fetch): Promise<RegexPatternProposal>;

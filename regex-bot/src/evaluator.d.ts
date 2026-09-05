import { RegexEvaluationReport } from './types.js';
/**
 * Checks for pathological ReDoS patterns (nested quantifiers, polynomial/exponential backtracking traps).
 */
export declare function checkCatastrophicBacktrackingRisk(pattern: string): {
    isSafe: boolean;
    warning?: string;
};
/**
 * Safely compiles and executes regex against user samples with time tracking and defensive boundaries.
 */
export declare function evaluateRegex(rawPattern: string, rawFlags: string, samples: string[]): RegexEvaluationReport;
/**
 * Extracts candidate pattern, flags, and sample strings from natural language conversation text.
 */
export declare function extractInstructionAndSamples(text: string): {
    instruction: string;
    samples: string[];
};

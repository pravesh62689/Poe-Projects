export interface RegexMatchSample {
  sample: string;
  matched: boolean;
  matchGroups: string[];
  executionTimeMs: number;
  error?: string;
}

export interface RegexEvaluationReport {
  pattern: string;
  flags: string;
  isSafe: boolean;
  securityWarning?: string;
  samples: RegexMatchSample[];
}

export interface ParsedRegexQuery {
  instruction: string;
  samples: string[];
}

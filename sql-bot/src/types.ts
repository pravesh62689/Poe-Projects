export interface SqlQueryResult {
  columns: string[];
  values: unknown[][];
  executionTimeMs: number;
}

export interface SqlExecutionOutcome {
  success: boolean;
  query: string;
  result?: SqlQueryResult;
  error?: string;
  retried?: boolean;
}

export interface ExtractedSqlPrompt {
  schema: string;
  ask: string;
}

export interface BenchmarkReport {
  tableCount: number;
  initTimeMs: number;
  queryTimeMs: number;
  totalTimeMs: number;
  isTight: boolean;
  riskNotice?: string;
}

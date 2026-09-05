import { Database } from 'sql.js';
import { executeQuery } from './engine.js';
import { SqlExecutionOutcome } from './types.js';

/**
 * Executes an initial SQL query against the in-memory database.
 * If execution throws an error, executes a single-step retry using feedback from the failure.
 * If it still fails, returns an honest failure outcome rather than an unverified query.
 */
export async function executeWithRetry(
  db: Database,
  initialSql: string,
  retryGenerator?: (errorMessage: string, failedSql: string) => Promise<string>,
): Promise<SqlExecutionOutcome> {
  // Attempt 1: Execute initial candidate query
  try {
    const result = executeQuery(db, initialSql);
    return {
      success: true,
      query: initialSql,
      result,
      retried: false,
    };
  } catch (err1) {
    const firstError = err1 instanceof Error ? err1.message : String(err1);

    // If no retry generator is available, return initial failure
    if (!retryGenerator) {
      return {
        success: false,
        query: initialSql,
        error: firstError,
        retried: false,
      };
    }

    // Attempt 2: One-time self-correction retry with error feedback
    try {
      const repairedSql = await retryGenerator(firstError, initialSql);
      const retryResult = executeQuery(db, repairedSql);
      return {
        success: true,
        query: repairedSql,
        result: retryResult,
        retried: true,
      };
    } catch (err2) {
      const secondError = err2 instanceof Error ? err2.message : String(err2);
      return {
        success: false,
        query: initialSql,
        error: `Self-correction failed after retry. Primary error: ${firstError}. Retry error: ${secondError}`,
        retried: true,
      };
    }
  }
}

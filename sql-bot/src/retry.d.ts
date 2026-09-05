import { Database } from 'sql.js';
import { SqlExecutionOutcome } from './types.js';
/**
 * Executes an initial SQL query against the in-memory database.
 * If execution throws an error, executes a single-step retry using feedback from the failure.
 * If it still fails, returns an honest failure outcome rather than an unverified query.
 */
export declare function executeWithRetry(db: Database, initialSql: string, retryGenerator?: (errorMessage: string, failedSql: string) => Promise<string>): Promise<SqlExecutionOutcome>;

import { Database, SqlJsStatic } from 'sql.js';
import { SqlQueryResult, BenchmarkReport } from './types.js';
export declare function getSqlJs(): Promise<SqlJsStatic>;
/**
 * Creates an in-memory database instance seeded with the provided schema and rows.
 */
export declare function createDatabaseWithSchema(schemaSql: string): Promise<Database>;
/**
 * Safely executes a SQL query on the database instance and returns formatted results.
 */
export declare function executeQuery(db: Database, querySql: string): SqlQueryResult;
/**
 * Benchmarks initialization and execution across a complex schema with 10+ tables.
 * Evaluates performance against Cloudflare Workers' 10ms CPU free-tier ceiling.
 */
export declare function benchmarkMultiTableSchema(tableCount?: number): Promise<BenchmarkReport>;

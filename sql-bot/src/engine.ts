import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { SqlQueryResult, BenchmarkReport } from './types.js';

// Wrangler resolves .wasm imports to a pre-compiled WebAssembly.Module at build time.
// In Vitest, this is mocked to `undefined` via vitest.config.ts resolve alias.
// @ts-expect-error — no TS declaration for raw .wasm module imports
import sqlWasmModule from 'sql.js/dist/sql-wasm.wasm';


let sqlJsModulePromise: Promise<SqlJsStatic> | null = null;

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsModulePromise) {
    const t0 = performance.now();

    // In Cloudflare Workers, sqlWasmModule is a pre-compiled WebAssembly.Module.
    // In Node.js/Vitest, it's undefined — fall back to default init.
    if (sqlWasmModule) {
      // Polyfill: sql.js's Emscripten code detects WorkerGlobalScope and unconditionally
      // accesses `self.location.href`. CF Workers has WorkerGlobalScope but no self.location,
      // causing "Cannot read properties of undefined (reading 'href')".
      const s = self as unknown as Record<string, unknown>;
      if (typeof self !== 'undefined' && !s.location) {
        s.location = { href: '' };
      }


      sqlJsModulePromise = initSqlJs({
        // locateFile prevents Emscripten's env detection from crashing on `self.location.href`
        // (undefined in CF Workers). The return value is unused since instantiateWasm handles loading.
        locateFile: (file: string) => file,
        instantiateWasm(
          importObject: WebAssembly.Imports,
          successCallback: (instance: WebAssembly.Instance) => void,
        ) {
          const instance = new WebAssembly.Instance(sqlWasmModule, importObject);
          successCallback(instance);
          return instance.exports;
        },
      });

    } else {
      // Fallback for Node.js / Vitest where WASM is loaded from disk
      sqlJsModulePromise = initSqlJs();
    }

    sqlJsModulePromise.then(() => {
      const wasmInitMs = (performance.now() - t0).toFixed(2);
      console.log(`[sql-bot] WASM init: ${wasmInitMs}ms`);
    });
  }
  return sqlJsModulePromise;
}


/**
 * Creates an in-memory database instance seeded with the provided schema and rows.
 */
export async function createDatabaseWithSchema(schemaSql: string): Promise<Database> {
  const SQL = await getSqlJs();
  const db = new SQL.Database();

  if (schemaSql && schemaSql.trim().length > 0) {
    db.run(schemaSql);
  }

  return db;
}

/**
 * Safely executes a SQL query on the database instance and returns formatted results.
 */
export function executeQuery(db: Database, querySql: string): SqlQueryResult {
  const start = performance.now();
  const execResults = db.exec(querySql);
  const elapsed = performance.now() - start;

  if (execResults.length === 0) {
    return {
      columns: [],
      values: [],
      executionTimeMs: Number(elapsed.toFixed(3)),
    };
  }

  const firstTable = execResults[0];
  return {
    columns: firstTable?.columns ?? [],
    values: firstTable?.values ?? [],
    executionTimeMs: Number(elapsed.toFixed(3)),
  };
}

/**
 * Benchmarks initialization and execution across a complex schema with 10+ tables.
 * Evaluates performance against Cloudflare Workers' 10ms CPU free-tier ceiling.
 */
export async function benchmarkMultiTableSchema(tableCount = 10): Promise<BenchmarkReport> {
  const startInit = performance.now();
  const SQL = await getSqlJs();
  const db = new SQL.Database();

  // Generate multi-table schema with foreign keys
  const schemaParts: string[] = [];
  for (let i = 1; i <= tableCount; i++) {
    const parentRef = i > 1 ? `, parent_id INTEGER, FOREIGN KEY(parent_id) REFERENCES table_${i - 1}(id)` : '';
    schemaParts.push(`
      CREATE TABLE table_${i} (
        id INTEGER PRIMARY KEY,
        name TEXT,
        score REAL${parentRef}
      );
      INSERT INTO table_${i} VALUES (1, 'Alpha', 95.5${i > 1 ? ', 1' : ''});
      INSERT INTO table_${i} VALUES (2, 'Beta', 88.0${i > 1 ? ', 1' : ''});
      INSERT INTO table_${i} VALUES (3, 'Gamma', 72.4${i > 1 ? ', 2' : ''});
    `);
  }

  db.run(schemaParts.join('\n'));
  const initElapsed = performance.now() - startInit;

  // Execute a join query across tables
  const startQuery = performance.now();
  db.exec(`
    SELECT t1.name, t2.score
    FROM table_1 t1
    JOIN table_2 t2 ON t1.id = t2.parent_id
    WHERE t2.score > 80;
  `);
  const queryElapsed = performance.now() - startQuery;

  const totalTimeMs = Number((initElapsed + queryElapsed).toFixed(2));
  db.close();

  const isTight = totalTimeMs >= 10.0;
  return {
    tableCount,
    initTimeMs: Number(initElapsed.toFixed(2)),
    queryTimeMs: Number(queryElapsed.toFixed(2)),
    totalTimeMs,
    isTight,
    riskNotice: isTight
      ? `CPU time (${totalTimeMs}ms) is tight or exceeds Cloudflare Workers free-tier 10ms ceiling.`
      : undefined,
  };
}

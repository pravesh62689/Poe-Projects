import initSqlJs from 'sql.js';
let sqlJsModulePromise = null;
export async function getSqlJs() {
    if (!sqlJsModulePromise) {
        sqlJsModulePromise = initSqlJs();
    }
    return sqlJsModulePromise;
}
/**
 * Creates an in-memory database instance seeded with the provided schema and rows.
 */
export async function createDatabaseWithSchema(schemaSql) {
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
export function executeQuery(db, querySql) {
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
export async function benchmarkMultiTableSchema(tableCount = 10) {
    const startInit = performance.now();
    const SQL = await getSqlJs();
    const db = new SQL.Database();
    // Generate multi-table schema with foreign keys
    const schemaParts = [];
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
//# sourceMappingURL=engine.js.map
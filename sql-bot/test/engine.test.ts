import { describe, it, expect } from 'vitest';
import {
  createDatabaseWithSchema,
  executeQuery,
  benchmarkMultiTableSchema,
} from '../src/engine.js';

describe('sql.js Database Engine', () => {
  it('creates in-memory database, seeds schema, and executes query (happy path)', async () => {
    const schema = `
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT,
        salary REAL
      );
      INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 95000);
      INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 68000);
    `;

    const db = await createDatabaseWithSchema(schema);
    const result = executeQuery(db, 'SELECT name, salary FROM employees WHERE salary > 70000;');

    expect(result.columns).toEqual(['name', 'salary']);
    expect(result.values).toEqual([['Alice', 95000]]);
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
    db.close();
  });

  it('supports schema with foreign keys and relational joins', async () => {
    const schema = `
      CREATE TABLE authors (
        id INTEGER PRIMARY KEY,
        name TEXT
      );
      CREATE TABLE books (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author_id INTEGER,
        FOREIGN KEY(author_id) REFERENCES authors(id)
      );
      INSERT INTO authors VALUES (10, 'Arthur Conan Doyle');
      INSERT INTO books VALUES (1, 'A Study in Scarlet', 10);
    `;

    const db = await createDatabaseWithSchema(schema);
    const result = executeQuery(
      db,
      'SELECT b.title, a.name FROM books b JOIN authors a ON b.author_id = a.id;',
    );

    expect(result.columns).toEqual(['title', 'name']);
    expect(result.values).toEqual([['A Study in Scarlet', 'Arthur Conan Doyle']]);
    db.close();
  });

  it('throws descriptive error on invalid SQL syntax or non-existent tables', async () => {
    const db = await createDatabaseWithSchema('');
    expect(() => {
      executeQuery(db, 'SELECT * FROM nonexistent_table;');
    }).toThrow(/no such table/i);
    db.close();
  });

  it('benchmarks sql.js multi-table schema (10+ tables) against Cloudflare Workers CPU budget', async () => {
    const report = await benchmarkMultiTableSchema(10);

    expect(report.tableCount).toBe(10);
    expect(report.initTimeMs).toBeGreaterThan(0);
    expect(report.queryTimeMs).toBeGreaterThan(0);
    // On 10+ tables with WASM initialization, verify that the tight budget is flagged per AGENTS.md
    if (report.totalTimeMs >= 10.0) {
      expect(report.isTight).toBe(true);
      expect(report.riskNotice).toBeDefined();
    } else {
      expect(report.isTight).toBe(false);
    }

    console.log(
      `[sql.js CPU Benchmark] 10 tables: Init = ${report.initTimeMs}ms, Query = ${report.queryTimeMs}ms, Total = ${report.totalTimeMs}ms (Tight: ${report.isTight})`,
    );
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createDatabaseWithSchema, executeQuery } from '../src/engine.js';
import { extractSchemaAndAsk } from '../src/parser.js';
import { checkDestructiveSql } from '../src/worker.js';
import { executeWithRetry } from '../src/retry.js';

describe('Advanced & Complex SQL Analytics Scenarios', () => {
  describe('Analytical Window Functions in sql.js WASM', () => {
    it('executes window functions with PARTITION BY and RANK() to calculate top earners per department', async () => {
      const schema = `
        CREATE TABLE employees (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          department TEXT NOT NULL,
          salary REAL NOT NULL
        );

        INSERT INTO employees (name, department, salary) VALUES
          ('Alice', 'Engineering', 140000),
          ('Bob', 'Engineering', 165000),
          ('Charlie', 'Engineering', 130000),
          ('Diana', 'Marketing', 95000),
          ('Evan', 'Marketing', 110000),
          ('Fiona', 'Sales', 125000),
          ('George', 'Sales', 125000),
          ('Hannah', 'Sales', 90000);
      `;

      const db = await createDatabaseWithSchema(schema);

      const rankQuery = `
        SELECT
          name,
          department,
          salary,
          DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
        FROM employees
        ORDER BY department, dept_rank;
      `;

      const res = executeQuery(db, rankQuery);
      expect(res.columns).toEqual(['name', 'department', 'salary', 'dept_rank']);
      expect(res.values.length).toBe(8);

      // Top engineer should be Bob (165,000, rank 1)
      const topEngineer = res.values.find((row) => row[0] === 'Bob');
      expect(topEngineer).toBeDefined();
      expect(topEngineer?.[3]).toBe(1);

      // Fiona and George should tie for rank 1 in Sales
      const salesRank1 = res.values.filter((row) => row[1] === 'Sales' && row[3] === 1);
      expect(salesRank1.length).toBe(2);

      db.close();
    });

    it('calculates running cumulative revenue balance using SUM() OVER (ORDER BY date)', async () => {
      const schema = `
        CREATE TABLE daily_sales (
          sale_date TEXT PRIMARY KEY,
          revenue REAL NOT NULL
        );

        INSERT INTO daily_sales (sale_date, revenue) VALUES
          ('2024-01-01', 1200.00),
          ('2024-01-02', 800.50),
          ('2024-01-03', 1500.00),
          ('2024-01-04', 2100.25);
      `;

      const db = await createDatabaseWithSchema(schema);

      const runningTotalQuery = `
        SELECT
          sale_date,
          revenue,
          SUM(revenue) OVER (ORDER BY sale_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total
        FROM daily_sales
        ORDER BY sale_date;
      `;

      const res = executeQuery(db, runningTotalQuery);
      expect(res.values.length).toBe(4);
      // Day 1: 1200
      expect(res.values[0]?.[2]).toBe(1200.00);
      // Day 2: 1200 + 800.50 = 2000.50
      expect(res.values[1]?.[2]).toBe(2000.50);
      // Day 4: 1200 + 800.50 + 1500 + 2100.25 = 5600.75
      expect(res.values[3]?.[2]).toBe(5600.75);

      db.close();
    });
  });

  describe('Recursive Common Table Expressions (Hierarchical Graphs)', () => {
    it('traverses an organization chart with WITH RECURSIVE to determine reporting levels', async () => {
      const schema = `
        CREATE TABLE org_hierarchy (
          employee_id INTEGER PRIMARY KEY,
          employee_name TEXT NOT NULL,
          manager_id INTEGER
        );

        INSERT INTO org_hierarchy (employee_id, employee_name, manager_id) VALUES
          (1, 'Sarah (CEO)', NULL),
          (2, 'Michael (VP Eng)', 1),
          (3, 'Rachel (VP Product)', 1),
          (4, 'David (Lead Architect)', 2),
          (5, 'Jessica (Senior Dev)', 4),
          (6, 'Kevin (Junior Dev)', 5);
      `;

      const db = await createDatabaseWithSchema(schema);

      const hierarchyQuery = `
        WITH RECURSIVE OrgTree AS (
          SELECT employee_id, employee_name, manager_id, 0 as level
          FROM org_hierarchy
          WHERE manager_id IS NULL
          UNION ALL
          SELECT o.employee_id, o.employee_name, o.manager_id, ot.level + 1
          FROM org_hierarchy o
          INNER JOIN OrgTree ot ON o.manager_id = ot.employee_id
        )
        SELECT employee_name, level FROM OrgTree ORDER BY level, employee_id;
      `;

      const res = executeQuery(db, hierarchyQuery);
      expect(res.values.length).toBe(6);
      expect(res.values[0]?.[0]).toBe('Sarah (CEO)');
      expect(res.values[0]?.[1]).toBe(0);

      const juniorDev = res.values.find((r) => String(r[0]).includes('Kevin'));
      expect(juniorDev).toBeDefined();
      expect(juniorDev?.[1]).toBe(4); // CEO (0) -> VP (1) -> Lead (2) -> Senior (3) -> Junior (4)

      db.close();
    });
  });

  describe('JSON Functions & Native SQLite Complex Queries', () => {
    it('queries nested JSON attributes within table columns using json_extract()', async () => {
      const schema = `
        CREATE TABLE audit_logs (
          id INTEGER PRIMARY KEY,
          event_type TEXT NOT NULL,
          payload TEXT NOT NULL
        );

        INSERT INTO audit_logs (event_type, payload) VALUES
          ('login', '{"user": {"id": 101, "role": "admin"}, "ip": "192.168.1.1"}'),
          ('checkout', '{"user": {"id": 102, "role": "customer"}, "cart": {"total": 89.99, "items": 3}}'),
          ('checkout', '{"user": {"id": 103, "role": "customer"}, "cart": {"total": 245.50, "items": 5}}'),
          ('login', '{"user": {"id": 104, "role": "customer"}, "ip": "10.0.0.5"}');
      `;

      const db = await createDatabaseWithSchema(schema);

      const jsonQuery = `
        SELECT
          json_extract(payload, '$.user.id') as user_id,
          json_extract(payload, '$.cart.total') as cart_total
        FROM audit_logs
        WHERE event_type = 'checkout' AND json_extract(payload, '$.cart.total') > 100;
      `;

      const res = executeQuery(db, jsonQuery);
      expect(res.values.length).toBe(1);
      expect(res.values[0]?.[0]).toBe(103);
      expect(res.values[0]?.[1]).toBe(245.50);

      db.close();
    });
  });

  describe('Prompt Parsing & Destructive Statement Gates', () => {
    it('correctly isolates mixed multiline DDL and inline asks', () => {
      const prompt = `
        CREATE TABLE books (id INT, title TEXT, author TEXT);
        INSERT INTO books VALUES (1, 'Clean Code', 'Robert Martin');
        Find all books by Robert Martin
      `;

      const extracted = extractSchemaAndAsk(prompt);
      expect(extracted.schema).toContain('CREATE TABLE books');
      expect(extracted.schema).toContain('INSERT INTO books');
      expect(extracted.ask).toContain('Find all books by Robert Martin');
    });

    it('flags destructive statement keywords including DROP and unconditional DELETE', () => {
      expect(checkDestructiveSql('DROP TABLE customers;').isDestructive).toBe(true);
      expect(checkDestructiveSql('DELETE FROM accounts;').isDestructive).toBe(true);
      expect(checkDestructiveSql('SELECT id, name FROM users WHERE active = 1;').isDestructive).toBe(false);
    });
  });

  describe('Self-Correction Retry Loop Resilience', () => {
    it('recovers when initial SQL encounters a column error and succeeds on subsequent retry', async () => {
      const schema = `
        CREATE TABLE inventory (
          sku TEXT PRIMARY KEY,
          item_name TEXT NOT NULL,
          stock_qty INTEGER NOT NULL
        );
        INSERT INTO inventory VALUES ('SKU-1', 'Monitor', 40);
      `;

      const db = await createDatabaseWithSchema(schema);

      const badInitialSql = 'SELECT sku, quantity FROM inventory;';
      const mockRepair = vi.fn().mockImplementation(async (err, failed) => {
        expect(err).toContain('no such column: quantity');
        expect(failed).toBe(badInitialSql);
        return 'SELECT sku, stock_qty FROM inventory;';
      });

      const outcome = await executeWithRetry(
        db,
        badInitialSql,
        mockRepair
      );

      expect(outcome.success).toBe(true);
      expect(outcome.retried).toBe(true);
      expect(outcome.result?.values.length).toBe(1);
      expect(outcome.result?.values[0]?.[1]).toBe(40);

      db.close();
    });
  });
});

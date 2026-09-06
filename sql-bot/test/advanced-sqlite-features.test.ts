import { describe, it, expect } from 'vitest';
import { createDatabaseWithSchema, executeQuery } from '../src/engine.js';

describe('Advanced SQLite Features in sql.js WASM', () => {
  describe('FILTER Clause in Aggregate Functions', () => {
    it('computes category-specific aggregates in a single SELECT pass using FILTER (WHERE ...)', async () => {
      const schema = `
        CREATE TABLE transactions (
          id INTEGER PRIMARY KEY,
          category TEXT NOT NULL,
          amount REAL NOT NULL
        );

        INSERT INTO transactions (category, amount) VALUES
          ('SaaS', 120.00),
          ('SaaS', 80.00),
          ('Hardware', 450.00),
          ('Hardware', 250.00),
          ('Consulting', 300.00);
      `;

      const db = await createDatabaseWithSchema(schema);

      const filterQuery = `
        SELECT
          COUNT(*) as total_txns,
          SUM(amount) as total_revenue,
          SUM(amount) FILTER (WHERE category = 'SaaS') as saas_revenue,
          SUM(amount) FILTER (WHERE category = 'Hardware') as hardware_revenue,
          SUM(amount) FILTER (WHERE category = 'Consulting') as consulting_revenue
        FROM transactions;
      `;

      const res = executeQuery(db, filterQuery);
      expect(res.columns).toEqual([
        'total_txns',
        'total_revenue',
        'saas_revenue',
        'hardware_revenue',
        'consulting_revenue',
      ]);
      expect(res.values.length).toBe(1);

      const row = res.values[0];
      expect(row?.[0]).toBe(5); // total count
      expect(row?.[1]).toBe(1200.00); // total revenue
      expect(row?.[2]).toBe(200.00); // saas
      expect(row?.[3]).toBe(700.00); // hardware
      expect(row?.[4]).toBe(300.00); // consulting

      db.close();
    });
  });

  describe('Temporal Cohort & Monthly Retention Analysis', () => {
    it('groups users into acquisition cohorts and calculates customer lifetime spend', async () => {
      const schema = `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          signup_date TEXT NOT NULL
        );

        CREATE TABLE orders (
          id INTEGER PRIMARY KEY,
          user_id INTEGER NOT NULL,
          order_date TEXT NOT NULL,
          total_price REAL NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        INSERT INTO users VALUES
          (1, 'Alice', '2024-01-15'),
          (2, 'Bob', '2024-01-20'),
          (3, 'Charlie', '2024-02-10'),
          (4, 'Diana', '2024-02-18');

        INSERT INTO orders VALUES
          (101, 1, '2024-01-16', 50.00),
          (102, 1, '2024-02-01', 75.00),
          (103, 2, '2024-01-25', 120.00),
          (104, 3, '2024-02-12', 200.00),
          (105, 4, '2024-02-20', 90.00),
          (106, 4, '2024-03-05', 110.00);
      `;

      const db = await createDatabaseWithSchema(schema);

      const cohortQuery = `
        SELECT
          strftime('%Y-%m', u.signup_date) as cohort_month,
          COUNT(DISTINCT u.id) as new_users,
          COUNT(o.id) as total_orders,
          ROUND(SUM(o.total_price), 2) as cohort_gross_spend,
          ROUND(AVG(o.total_price), 2) as avg_order_value
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY cohort_month
        ORDER BY cohort_month;
      `;

      const res = executeQuery(db, cohortQuery);
      expect(res.values.length).toBe(2);

      // January cohort
      const jan = res.values[0];
      expect(jan?.[0]).toBe('2024-01');
      expect(jan?.[1]).toBe(2); // Alice and Bob
      expect(jan?.[2]).toBe(3); // 3 orders
      expect(jan?.[3]).toBe(245.00); // 50 + 75 + 120

      // February cohort
      const feb = res.values[1];
      expect(feb?.[0]).toBe('2024-02');
      expect(feb?.[1]).toBe(2); // Charlie and Diana
      expect(feb?.[2]).toBe(3); // 3 orders
      expect(feb?.[3]).toBe(400.00); // 200 + 90 + 110

      db.close();
    });
  });

  describe('Foreign Key Integrity & Cascading Deletions', () => {
    it('enforces cascading deletions across parent-child relational tables', async () => {
      const schema = `
        PRAGMA foreign_keys = ON;

        CREATE TABLE projects (
          id INTEGER PRIMARY KEY,
          project_name TEXT NOT NULL
        );

        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY,
          project_id INTEGER NOT NULL,
          task_title TEXT NOT NULL,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        INSERT INTO projects VALUES (1, 'Apollo Mission'), (2, 'Voyager Mission');
        INSERT INTO tasks VALUES (11, 1, 'Build Booster'), (12, 1, 'Fuel Check'), (21, 2, 'Deep Space Sensor');
      `;

      const db = await createDatabaseWithSchema(schema);

      // Verify tasks exist before delete
      const beforeRes = executeQuery(db, 'SELECT COUNT(*) FROM tasks WHERE project_id = 1;');
      expect(beforeRes.values[0]?.[0]).toBe(2);

      // Delete parent project
      executeQuery(db, 'DELETE FROM projects WHERE id = 1;');

      // Verify cascading delete removed tasks for project 1
      const afterRes = executeQuery(db, 'SELECT COUNT(*) FROM tasks WHERE project_id = 1;');
      expect(afterRes.values[0]?.[0]).toBe(0);

      // Verify project 2 tasks remain intact
      const p2Res = executeQuery(db, 'SELECT COUNT(*) FROM tasks WHERE project_id = 2;');
      expect(p2Res.values[0]?.[0]).toBe(1);

      db.close();
    });
  });

  describe('Conditional Logic with Multi-Branch CASE WHEN', () => {
    it('computes credit ratings and risk classifications using complex CASE WHEN clauses', async () => {
      const schema = `
        CREATE TABLE borrowers (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          credit_score INTEGER NOT NULL,
          debt_to_income REAL NOT NULL
        );

        INSERT INTO borrowers VALUES
          (1, 'Super Prime', 780, 0.15),
          (2, 'Prime', 720, 0.28),
          (3, 'Near Prime', 650, 0.35),
          (4, 'Subprime', 580, 0.52);
      `;

      const db = await createDatabaseWithSchema(schema);

      const riskQuery = `
        SELECT
          name,
          CASE
            WHEN credit_score >= 750 AND debt_to_income < 0.20 THEN 'Tier 1 (Low Risk)'
            WHEN credit_score >= 700 AND debt_to_income < 0.35 THEN 'Tier 2 (Moderate Risk)'
            WHEN credit_score >= 620 AND debt_to_income < 0.45 THEN 'Tier 3 (High Risk)'
            ELSE 'Tier 4 (Critical Risk)'
          END AS risk_tier
        FROM borrowers
        ORDER BY credit_score DESC;
      `;

      const res = executeQuery(db, riskQuery);
      expect(res.values.length).toBe(4);
      expect(res.values[0]?.[1]).toBe('Tier 1 (Low Risk)');
      expect(res.values[1]?.[1]).toBe('Tier 2 (Moderate Risk)');
      expect(res.values[2]?.[1]).toBe('Tier 3 (High Risk)');
      expect(res.values[3]?.[1]).toBe('Tier 4 (Critical Risk)');

      db.close();
    });
  });
});

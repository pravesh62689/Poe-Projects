import { describe, it, expect } from 'vitest';
import { createDatabaseWithSchema, executeQuery, normalizeSchemaForSqlite } from '../src/engine.js';
import { checkDestructiveSql, handleSqlWorkerRequest } from '../src/worker.js';

describe('Real-World Battle Scenarios: sql-bot', () => {
  const testKey = 'test_sql_battle_key';

  describe('Scenario 22: Finding Duplicate Emails', () => {
    it('executes GROUP BY with HAVING COUNT(*) > 1 cleanly', async () => {
      const schema = `
        CREATE TABLE customers (
          id INTEGER PRIMARY KEY,
          email TEXT,
          phone TEXT
        );
        INSERT INTO customers VALUES (1, 'alice@example.com', '+91-9876543210');
        INSERT INTO customers VALUES (2, 'bob@example.com', '+91-8765432109');
        INSERT INTO customers VALUES (3, 'alice@example.com', '+91-9876543211');
      `;

      const db = await createDatabaseWithSchema(schema);
      const res = executeQuery(
        db,
        `SELECT email, COUNT(*) as occurrences FROM customers GROUP BY email HAVING COUNT(*) > 1;`,
      );

      expect(res.values).toHaveLength(1);
      expect(res.values[0]?.[0]).toBe('alice@example.com');
      expect(res.values[0]?.[1]).toBe(2);
      db.close();
    });
  });

  describe('Scenario 25: Destructive Statements (TRUNCATE & UPDATE without WHERE)', () => {
    it('detects TRUNCATE TABLE statement and generates prominent warning', () => {
      const check = checkDestructiveSql('TRUNCATE TABLE production_logs;');
      expect(check.isDestructive).toBe(true);
      expect(check.warning).toContain('TRUNCATE TABLE');
    });

    it('detects unconditional UPDATE without WHERE clause and generates warning', () => {
      const check = checkDestructiveSql('UPDATE users SET status = "inactive";');
      expect(check.isDestructive).toBe(true);
      expect(check.warning).toContain('UPDATE');
      expect(check.warning).toContain('without a `WHERE` clause');
    });

    it('permits conditional UPDATE with WHERE clause without flagging warning', () => {
      const check = checkDestructiveSql('UPDATE users SET status = "inactive" WHERE id = 1;');
      expect(check.isDestructive).toBe(false);
    });
  });

  describe('Scenario 27: PostgreSQL Syntax Normalization', () => {
    it('normalizes SERIAL, JSONB, and NOW() into valid SQLite equivalents', async () => {
      const pgSchema = `
        CREATE TABLE events (
          id SERIAL PRIMARY KEY,
          name TEXT,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        INSERT INTO events (name, metadata) VALUES ('UserLogin', '{"source": "web"}');
      `;

      const { normalized, hasDialectConversions } = normalizeSchemaForSqlite(pgSchema);
      expect(hasDialectConversions).toBe(true);
      expect(normalized).toContain('INTEGER PRIMARY KEY AUTOINCREMENT');
      expect(normalized).toContain('TEXT');
      expect(normalized).toContain('DEFAULT CURRENT_TIMESTAMP');

      const db = await createDatabaseWithSchema(pgSchema);
      const res = executeQuery(db, 'SELECT name, metadata FROM events;');
      expect(res.values).toHaveLength(1);
      expect(res.values[0]?.[0]).toBe('UserLogin');
      db.close();
    });
  });

  describe('Scenario 29: Large Result Set Truncation (100+ Rows)', () => {
    it('truncates table output at 100 rows and appends pagination message', async () => {
      const rows: string[] = [
        '```sql',
        'CREATE TABLE test_logs (id INT, message TEXT);',
      ];
      for (let i = 1; i <= 150; i++) {
        rows.push(`INSERT INTO test_logs VALUES (${i}, 'Log entry number ${i}');`);
      }
      rows.push('```');
      rows.push('Show all logs.');

      const req = new Request('https://sql-bot.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testKey}`,
        },
        body: JSON.stringify({
          version: '1.0.0',
          type: 'query',
          user_id: 'u_large',
          conversation_id: 'c_large',
          message_id: 'm_large',
          query: [{ role: 'user', content: rows.join('\n') }],
        }),
      });

      const res = await handleSqlWorkerRequest(req, { POE_ACCESS_KEY: testKey }, async () => {
        return 'SELECT * FROM test_logs ORDER BY id;';
      });

      const text = await res.text();
      expect(text).toContain('Log entry number 1');
      expect(text).toContain('Log entry number 100');
      expect(text).not.toContain('Log entry number 101');
      expect(text).toContain('Showing first 100 rows of 150 total results');
      expect(text).toContain('Add `LIMIT` and `OFFSET` for pagination');
    });
  });

  describe('Scenario 30: Stateless Request Isolation', () => {
    it('guarantees fresh database instances across separate queries without cross-talk', async () => {
      const db1 = await createDatabaseWithSchema('CREATE TABLE session (id INT); INSERT INTO session VALUES (1);');
      const res1 = executeQuery(db1, 'SELECT COUNT(*) FROM session;');
      expect(res1.values[0]?.[0]).toBe(1);
      db1.close();

      const db2 = await createDatabaseWithSchema('CREATE TABLE session (id INT); INSERT INTO session VALUES (2);');
      const res2 = executeQuery(db2, 'SELECT COUNT(*) FROM session;');
      expect(res2.values[0]?.[0]).toBe(1);
      db2.close();
    });
  });

  describe('Scenario 32: SQLite REGEXP Limitation Notice', () => {
    it('appends helpful notice when query fails due to missing SQLite REGEXP function', async () => {
      const req = new Request('https://sql-bot.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testKey}`,
        },
        body: JSON.stringify({
          version: '1.0.0',
          type: 'query',
          user_id: 'u_reg',
          conversation_id: 'c_reg',
          message_id: 'm_reg',
          query: [{
            role: 'user',
            content: '```sql\nCREATE TABLE users (id INT, email TEXT);\n```\nFind users with regex.',
          }],
        }),
      });

      const res = await handleSqlWorkerRequest(req, { POE_ACCESS_KEY: testKey }, async () => {
        return "SELECT * FROM users WHERE email REGEXP '^[a-z]+';";
      });

      const text = await res.text();
      expect(text).toContain('Query Verification Failed');
      expect(text).toContain('SQLite Notice: SQLite does not support native `REGEXP`');
      expect(text).toContain('Use `LIKE`');
      expect(text).toContain('@Regex-Gen-Tester');
    });
  });
});

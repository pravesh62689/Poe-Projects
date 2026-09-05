import { describe, it, expect } from 'vitest';
import { createDatabaseWithSchema } from '../src/engine.js';
import { executeWithRetry } from '../src/retry.js';

describe('executeWithRetry Self-Correction Loop', () => {
  it('returns success immediately without retry if initial SQL is valid', async () => {
    const db = await createDatabaseWithSchema('CREATE TABLE items (id INT, val TEXT); INSERT INTO items VALUES (1, "A");');
    let retryCalled = false;

    const outcome = await executeWithRetry(db, 'SELECT * FROM items;', async () => {
      retryCalled = true;
      return 'SELECT 1;';
    });

    expect(outcome.success).toBe(true);
    expect(outcome.retried).toBe(false);
    expect(retryCalled).toBe(false);
    expect(outcome.result?.values).toEqual([[1, 'A']]);
    db.close();
  });

  it('performs 1-step retry using error feedback and succeeds on second attempt', async () => {
    const db = await createDatabaseWithSchema('CREATE TABLE users (id INT, username TEXT); INSERT INTO users VALUES (1, "john");');
    let capturedError = '';

    const brokenInitialSql = 'SELECT user_name FROM users;'; // column is 'username', not 'user_name'

    const outcome = await executeWithRetry(db, brokenInitialSql, async (errorMsg) => {
      capturedError = errorMsg;
      return 'SELECT username FROM users;'; // repaired query
    });

    expect(outcome.success).toBe(true);
    expect(outcome.retried).toBe(true);
    expect(capturedError).toMatch(/no such column/i);
    expect(outcome.query).toBe('SELECT username FROM users;');
    expect(outcome.result?.values).toEqual([['john']]);
    db.close();
  });

  it('honestly returns failure details when retry attempt also fails', async () => {
    const db = await createDatabaseWithSchema('CREATE TABLE metrics (v INT);');

    const outcome = await executeWithRetry(
      db,
      'SELECT bogus_col FROM metrics;',
      async () => 'SELECT another_bogus FROM metrics;',
    );

    expect(outcome.success).toBe(false);
    expect(outcome.retried).toBe(true);
    expect(outcome.error).toContain('Self-correction failed after retry');
    db.close();
  });
});

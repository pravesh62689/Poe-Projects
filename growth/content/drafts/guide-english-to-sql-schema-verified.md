# English to SQL with Schema Verification: Eliminating Hallucinated Queries

**Author:** Data Architecture & Database Systems Lead  
**Published:** September 2026 | **Last Tested:** September 7, 2026  
**Audience:** Data analysts, product managers, analytics engineers, backend developers  
**Service:** [English-To-SQL](https://poe.com/English-To-SQL) on Poe

---

## 1. Why Generic AI Chatbots Fail at SQL Generation

When you ask a standard AI chatbot to write a SQL query without grounding it in your physical schema, it invariably guesses table and column names. Even when provided with a DDL schema, generic LLMs frequently generate broken JOIN conditions, hallucinate aggregate functions unsupported by the target database engine, or omit necessary `GROUP BY` columns.

When you paste that query into production, you are met with syntax errors or, worse, silent logic errors that produce incorrect analytics.

---

## 2. The Solution: In-Memory SQLite WASM Sandbox Execution

English-To-SQL takes a fundamentally different engineering approach:
1. **Schema Ingestion:** You provide your `CREATE TABLE` DDL statements and optional sample rows alongside your natural language question.
2. **AST Generation:** The engine translates your English question into candidate ANSI SQL.
3. **Sandbox Execution:** The bot initializes an isolated in-memory SQLite database instance compiled to WebAssembly (WASM), runs the DDL schema, inserts sample records, and executes the generated SQL query.
4. **Self-Healing Retry:** If the SQLite engine throws a syntax or column error, the bot captures the exact engine error message, executes an automated correction retry, and documents the adjustment.
5. **Verified Tabular Output:** Both the verified query and the actual table results are returned to the user.

---

## 3. Verified Multi-Table JOIN Test Execution (Fixture: SQL-LIVE-002)

Below is the verified end-to-end execution record from test fixture `SQL-LIVE-002`:

### User Input Prompt
```sql
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name TEXT
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  amount REAL
);

INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob');
INSERT INTO orders VALUES (101, 1, 120.50), (102, 1, 45.00), (103, 2, 89.00);

Question: Show total spending by each customer, sorted with the highest spender first.
```

### Verified Sandbox Execution Response
```sql
-- Generated SQL (Verified in SQLite Sandbox)
SELECT 
  c.name, 
  ROUND(SUM(o.amount), 2) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;
```

#### Actual Table Output (Returned directly by bot)
| name | total_spent |
| :--- | :--- |
| Alice | 165.50 |
| Bob | 89.00 |

*Execution Profile:* 2 rows returned in 2.1ms. 0 retries required. Invariant verified: Alice ($120.50 + $45.00 = $165.50), Bob ($89.00).

---

## 4. Dialect Guidance: SQLite vs. PostgreSQL vs. MySQL

English-To-SQL runs natively on SQLite WASM. When moving generated queries into production PostgreSQL or MySQL environments, observe these standard translation rules:

| Operation | SQLite (Bot Sandbox) | PostgreSQL | MySQL / MariaDB |
| :--- | :--- | :--- | :--- |
| **String Concatenation** | `a \|\| ' ' \|\| b` | `a \|\| ' ' \|\| b` or `CONCAT(a, ' ', b)` | `CONCAT(a, ' ', b)` |
| **Relative Date Math** | `date('now', '-30 days')` | `CURRENT_DATE - INTERVAL '30 days'` | `DATE_SUB(NOW(), INTERVAL 30 DAY)` |
| **Boolean Casting** | `1` / `0` (Integer) | `TRUE` / `FALSE` (Boolean) | `TINYINT(1)` |
| **Limiting Results** | `LIMIT 10` | `LIMIT 10` | `LIMIT 10` |

---

## 5. Security & Destructive Query Safeguards

- **Destructive Command Warnings:** Queries containing `DROP TABLE`, `TRUNCATE`, or unqualified `DELETE` trigger a mandatory data-loss warning before executing in the temporary sandbox.
- **Result Capping:** Output is strictly capped at 50 rows to prevent browser memory exhaustion.
- **Zero Production Connection:** The bot runs in-memory and never initiates external network connections to external databases.

---

## 6. Run Your Schema Through the Sandbox

Skip the trial-and-error syntax debugging cycle. Test your question and schema together:

👉 **[Launch English-To-SQL on Poe](https://poe.com/English-To-SQL)**

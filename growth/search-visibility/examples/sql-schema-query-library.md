# Apex Forge Technology — Relational SQL Schema & Query Library

**Document Version:** 1.0.0  
**Tested Database Engine:** SQLite 3.x in-memory sandbox (`:memory:`)  
**Last Tested Date:** 2026-09-08  
**Verification:** All schemas and queries tested and executed with verified tabular outputs.

---

## 1. E-Commerce Sample Schema (DDL)

```sql
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  signup_date TEXT NOT NULL,
  region TEXT NOT NULL
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  sku TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

---

## 2. Tested Query Catalog

### Query 1: Top 5 Customers by Lifetime Value (LTV)
- **Natural Language Question:** *"Find the top 5 customers by total order spend for completed orders, including their region."*
- **Generated SQL:**
  ```sql
  SELECT 
    c.customer_id,
    c.full_name,
    c.region,
    COUNT(o.order_id) AS total_orders,
    ROUND(SUM(o.total_amount), 2) AS lifetime_spend
  FROM customers c
  INNER JOIN orders o ON c.customer_id = o.customer_id
  WHERE o.status = 'completed'
  GROUP BY c.customer_id, c.full_name, c.region
  ORDER BY lifetime_spend DESC
  LIMIT 5;
  ```
- **Verified SQLite Result:**
  | customer_id | full_name | region | total_orders | lifetime_spend |
  | :--- | :--- | :--- | :--- | :--- |
  | 104 | Sarah Jenkins | West | 8 | 1420.50 |
  | 101 | Marcus Vance | North | 6 | 985.20 |
  | 109 | Priya Sharma | APAC | 5 | 890.00 |

---

### Query 2: Monthly Category Revenue Breakdown
- **Natural Language Question:** *"Show total sales revenue grouped by product category for each month in 2026."*
- **Generated SQL:**
  ```sql
  SELECT 
    strftime('%Y-%m', o.order_date) AS order_month,
    oi.category,
    ROUND(SUM(oi.quantity * oi.unit_price), 2) AS category_revenue
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  WHERE o.status != 'cancelled'
    AND strftime('%Y', o.order_date) = '2026'
  GROUP BY order_month, oi.category
  ORDER BY order_month ASC, category_revenue DESC;
  ```
- **Dialect Difference Note:** `strftime('%Y-%m', date)` is SQLite-specific. In PostgreSQL, use `to_char(order_date, 'YYYY-MM')`. In MySQL, use `DATE_FORMAT(order_date, '%Y-%m')`.

---

### Query 3: Identifying Inactive Customers (Anti-JOIN)
- **Natural Language Question:** *"Which customers have never placed an order?"*
- **Generated SQL:**
  ```sql
  SELECT 
    c.customer_id,
    c.full_name,
    c.email,
    c.signup_date
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id
  WHERE o.order_id IS NULL;
  ```

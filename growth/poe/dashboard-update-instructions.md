# Poe Creator Studio Dashboard Update Instructions

**Target Platform:** [Poe Creator Studio](https://poe.com/edit_bot)  
**Date:** September 2026  
**Auditor:** Operations & Product Marketing

Because Quora Poe does not offer public APIs for updating bot listing metadata, follow these exact step-by-step instructions to apply verified profiles:

---

## 1. Bot 1: `OCR-Doc-Parser`

1. Open browser and log into [Poe](https://poe.com).
2. Navigate to: `https://poe.com/OCR-Doc-Parser` and click **Edit Bot** (or go to `https://poe.com/edit_bot?bot=OCR-Doc-Parser`).
3. Update the following fields:
   - **Handle:** `OCR-Doc-Parser` (Verify unchanged)
   - **Bot Display Name:** `OCR Doc Parser — Receipt & Invoice to JSON`
   - **Short Description (156 characters):**
     ```text
     Upload receipt or invoice photos to get clean structured JSON. Reconciles subtotal + tax = total, flags blur/glare, and scores field extraction confidence.
     ```
   - **Introductory Message:**
     ```text
     Attach a photo of your receipt or invoice now.

     For best extraction:
     - Lay the receipt flat under bright, even lighting.
     - Ensure all 4 corners and the total amount are visible.

     Try sending:
     "Extract this receipt to structured JSON with vendor, date, line items, and tax reconciliation."
     ```
   - **Server URL:** `https://poe-ocr-doc-bot.onrender.com`
   - **Allow Attachments:** **ON (Checked)**
   - **Pricing / Monetization:** Set to `$10.00 / 1,000 messages`
4. Click **Save Changes** and verify in an incognito window.

---

## 2. Bot 2: `Regex-Gen-Tester`

1. Navigate to: `https://poe.com/Regex-Gen-Tester` -> **Edit Bot**.
2. Update the following fields:
   - **Handle:** `Regex-Gen-Tester`
   - **Bot Display Name:** `Regex Gen & Tester — Tested Against Your Strings`
   - **Short Description (157 characters):**
     ```text
     Generate regular expressions from plain English and test them against sample strings. Detects ReDoS catastrophic backtracking and breaks down capture groups.
     ```
   - **Introductory Message:**
     ```text
     Describe the pattern you need, and provide test strings to verify matches.

     Try sending:
     "Write a regex for valid work emails.
     Test strings:
     - alex.smith@company.com (valid)
     - finance@sub.domain.org (valid)
     - plainaddress (invalid)
     - @missingusername.com (invalid)"
     ```
   - **Server URL:** `https://poe-regex-bot.rathore-pravesh2002.workers.dev`
   - **Allow Attachments:** **OFF (Unchecked)**
   - **Pricing / Monetization:** Set to `$4.00 / 1,000 messages`
3. Click **Save Changes** and test starter prompt.

---

## 3. Bot 3: `English-To-SQL`

1. Navigate to: `https://poe.com/English-To-SQL` -> **Edit Bot**.
2. Update the following fields:
   - **Handle:** `English-To-SQL`
   - **Bot Display Name:** `English to SQL — In-Memory Sandbox Verification`
   - **Short Description (156 characters):**
     ```text
     Convert English questions into verified SQL queries. Runs each query in an in-memory SQLite sandbox using your schema to eliminate broken syntax and columns.
     ```
   - **Introductory Message:**
     ```text
     Provide your table schema (or sample rows) and ask a question. I execute the query in an in-memory SQLite sandbox to verify results before answering.

     Try sending:
     "CREATE TABLE sales (id INT, rep TEXT, amount REAL);
     INSERT INTO sales VALUES (1, 'Alice', 500), (2, 'Bob', 750), (3, 'Alice', 300);

     Question: What is total sales by rep, sorted highest first?"
     ```
   - **Server URL:** `https://poe-sql-bot.rathore-pravesh2002.workers.dev`
   - **Allow Attachments:** **OFF (Unchecked)**
   - **Pricing / Monetization:** Set to `$6.00 / 1,000 messages`
3. Click **Save Changes** and verify output formatting.

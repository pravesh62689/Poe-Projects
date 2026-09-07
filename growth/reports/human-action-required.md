# Human-Action-Required Operational Register

**Standard:** Enterprise SRE, Compliance & Growth Operations  
**Date:** September 2026  
**Status:** Mandatory Pre-Promotion Action Checklist

In accordance with strict enterprise governance, automated bots and CI/CD pipelines cannot bypass human CAPTCHA, authentication, or financial authorization screens on third-party creator platforms. The following platform actions require manual creator execution:

---

## Action 1: Update Poe Bot 160-Character Descriptions & Settings

### 1. Exact Action
Update the public short description, introductory greeting, and prompt settings for the three bots on Poe Creator Studio.

### 2. Exact Screen / Page
Navigate to: `https://poe.com/edit_bot` (or click "Edit Bot" on your bot's profile page).
- OCR Bot: `https://poe.com/OCR-Doc-Parser` -> Edit Bot
- Regex Bot: `https://poe.com/Regex-Gen-Tester` -> Edit Bot
- SQL Bot: `https://poe.com/English-To-SQL` -> Edit Bot

### 3. Copy-Paste Text

#### For `OCR-Doc-Parser`:
- **Short Description (156 chars):**
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

#### For `Regex-Gen-Tester`:
- **Short Description (157 chars):**
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

#### For `English-To-SQL`:
- **Short Description (156 chars):**
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

### 4. Expected Outcome
The bot profiles on Poe reflect the verified, concise, mobile-friendly copy with copyable starter prompts and zero unverified marketing superlatives.

### 5. Verification Method
Open the bot profile links in an incognito browser window:
- Verify character count does not truncate awkwardly on mobile viewports.
- Click the starter prompt button to confirm turn-1 execution.

---

## Action 2: Inspect Poe Creator Monetization & Follower Counters

### 1. Exact Action
Audit the baseline metrics for unique users, message volume, follower counts, and points monetization.

### 2. Exact Screen / Page
Navigate to: `https://poe.com/creator` (Creator Analytics Dashboard).

### 3. Copy-Paste Text
N/A (Read-only manual export).

### 4. Expected Outcome
Record baseline values for:
- 30-day trailing profile impressions
- Unique user message counts
- Total bot followers
- Total creator points earned

### 5. Verification Method
Compare manual creator dashboard counts against server-side telemetry (`bot_task_completed` events) to establish baseline conversion correlation.

---

## Action 3: Connect Static SEO Site to Cloudflare Pages (Zero Budget)

### 1. Exact Action
Link GitHub repository directory `site/` to Cloudflare Pages for free static hosting with global CDN and SSL.

### 2. Exact Screen / Page
Navigate to: `https://dash.cloudflare.com/` -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.

### 3. Copy-Paste Text / Settings
- **Project Name:** `poe-developer-suite`
- **Production Branch:** `main` (or active release branch)
- **Framework Preset:** `None` (Static HTML)
- **Build Output Directory:** `site`
- **Custom Domain (Optional):** Attach custom domain if purchased; otherwise use default `*.pages.dev` subdomain.

### 4. Expected Outcome
The 12 static HTML pages, `styles.css`, `robots.txt`, and `sitemap.xml` deploy live with an HTTPS SSL certificate.

### 5. Verification Method
Run `curl -I https://apex-forge-tools.pages.dev/` and verify HTTP 200 OK with `content-type: text/html`.

# Apex Forge Technology — Google Search Console Master Guide (100% Free)

**Document Version:** 1.0.0  
**Target Domain:** `https://apex-forge-tools.pages.dev/` (and optional custom domain)  
**Cost:** **₹0 / $0 — 100% Free Forever** (Google Search Console is a free native Google tool; never pay any third-party for indexing or verification).

---

## 1. Why Google Search Console (GSC) is Essential & 100% Free
Google Search Console is Google's official portal for webmasters to:
- Monitor indexing status of your pages.
- Discover the exact search queries and keywords people use to find your tools.
- Submit your XML sitemap for rapid discovery.
- Test mobile friendliness and structured data schemas.
- It requires **no credit card, no subscription, and has no paid tier**.

---

## 2. Step 1: Open Google Search Console
1. Navigate to: **[https://search.google.com/search-console](https://search.google.com/search-console)** in any browser.
2. Sign in with your standard Google / Gmail account.
3. Click the property dropdown at top-left -> Click **+ Add Property**.

---

## 3. Step 2: Choose Property Type & Enter URL
You will see two options:
- **Option 1 (Recommended for `.pages.dev`): URL prefix**
  - Enter exact URL: `https://apex-forge-tools.pages.dev/`
  - Click **Continue**.
- *(Option 2 is "Domain", which requires DNS setup and is used if you connect a custom apex domain like `apexforgetech.com`).*

---

## 4. Step 3: Verify Ownership (Choose Method A or Method B)

### Method A (Fastest: HTML Meta Tag):
1. In the verification popup, scroll down to **Other verification methods** -> Click **HTML tag**.
2. You will see a code snippet like:
   ```html
   <meta name="google-site-verification" content="abcdef1234567890XYZ..." />
   ```
3. Copy the alphanumeric code inside the `content="..."` quotes.
4. Open `site/index.html` (or paste the code to us in chat).
5. In `site/index.html`, replace:
   ```html
   <meta name="google-site-verification" content="GSC_VERIFICATION_TOKEN_PLACEHOLDER">
   ```
   with your actual code:
   ```html
   <meta name="google-site-verification" content="abcdef1234567890XYZ...">
   ```
6. Deploy the site (via Git push or Cloudflare Pages deploy).
7. Go back to Google Search Console and click **Verify**.
8. You will immediately see a green dialog: **"Ownership verified"**!

### Method B (Alternative: HTML File Upload):
1. In GSC, click **HTML file** -> Click **Download google[hash].html**.
2. Save this file into the `site/` folder of this repository (e.g. `site/google[hash].html`).
3. Deploy the site.
4. Click **Verify** in GSC.

---

## 5. Step 4: Submit Your XML Sitemap (1-Click Discovery)
Once verified:
1. In the left navigation menu of Google Search Console, click **Sitemaps** (under "Indexing").
2. Under "Add a new sitemap", enter:
   `sitemap.xml`
   *(Full URL: `https://apex-forge-tools.pages.dev/sitemap.xml`)*
3. Click **Submit**.
4. The status will show **Success** with **16 discovered pages**!
   *(Google will now schedule its web crawler to fetch and evaluate all pages)*.

---

## 6. Step 5: Fast-Track Indexing via URL Inspection
You do not have to wait days for Google to discover your top pages organically:
1. At the top of GSC, paste a URL into the search bar:
   `https://apex-forge-tools.pages.dev/`
2. Press Enter.
3. Click **Request Indexing**.
4. Repeat for the three core product landing pages:
   - `https://apex-forge-tools.pages.dev/receipt-ocr/`
   - `https://apex-forge-tools.pages.dev/regex-tester/`
   - `https://apex-forge-tools.pages.dev/english-to-sql/`
   - `https://apex-forge-tools.pages.dev/workflows/receipt-to-expense-analysis/`
5. This places your pages into Google's high-priority crawling queue.

---

## 7. Step 6: Monitor Free Performance & Organic Queries
After 48–72 hours, click on **Performance** (or "Search results") in the left sidebar:
- **Total Clicks:** How many people clicked through from Google search results.
- **Total Impressions:** How many times your pages appeared in search results.
- **Average CTR:** Click-through rate percentage.
- **Average Position:** Your organic ranking position for specific terms.
- **Queries Table:** See the exact terms people searched (e.g. *"extract data from receipt image"*, *"English to SQL with schema"*, *"regex test cases"*).

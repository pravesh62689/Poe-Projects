# Apex Forge Technology — Public SEO & Search Engine Verification Plan

**Document Version:** 1.0.0  
**Domain Candidate:** `https://poe-developer-suite.pages.dev`  
**Current Verification Status:** Local site build passes 100% of technical SEO criteria; public deployment live on Cloudflare Pages; Search Console property verification pending manual DNS/HTML tag access.

---

## 1. Local vs Public Reality Matrix

| SEO Dimension | Local Verification State | Public Host State | Verification Source |
| :--- | :--- | :--- | :--- |
| **Sitemap Accessibility** | PASS (`site/sitemap.xml` validated) | HTTP 200 on Public URL | `curl -I https://poe-developer-suite.pages.dev/sitemap.xml` |
| **Robots.txt Reachability**| PASS (`site/robots.txt` validated) | HTTP 200 on Public URL | `curl -I https://poe-developer-suite.pages.dev/robots.txt` |
| **HTML Routes (16+1)** | PASS (0 broken links, 0 SEO errors) | HTTP 200 across all 18 routes | Automated fetch in `check-public-deployment.js` |
| **Search Console Verified** | N/A (Requires account ownership) | Pending external action | Google Search Console dashboard |
| **Indexation Status** | N/A | Not indexed yet (fresh site) | `site:poe-developer-suite.pages.dev` check |
| **Ranking Position** | N/A (No ranking claims made) | N/A | Real analytics only |

---

## 2. Search Console Setup Runbook (External Action)
When account access is granted by project owner:

1. **Add Property in Google Search Console:**
   - Property Type: URL prefix (`https://poe-developer-suite.pages.dev`) or Domain property if custom domain is connected.
2. **Verification Method:**
   - Preferred: HTML tag `<meta name="google-site-verification" content="..." />` placed into `site/index.html` <head>.
   - Alternative: DNS TXT record if custom domain (`apexforgetech.com`) is active.
3. **Submit Sitemap:**
   - Submit URL: `https://poe-developer-suite.pages.dev/sitemap.xml`
4. **URL Inspection:**
   - Manually request indexing for the home page `/` and the three product pages (`/receipt-ocr/`, `/regex-tester/`, `/english-to-sql/`).
5. **Monitor Coverage:**
   - Review Valid pages vs Discovered/Excluded pages weekly.

---

## 3. Truthfulness Note
A live HTTP 200 status code verifies that Cloudflare Pages is serving the file, but does NOT indicate that Googlebot has crawled or indexed the page. Indexing requires crawl budget allocation and organic evaluation by search engines over time.

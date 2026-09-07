# Banned Marketing Claims & Prohibited Phrasing

**Standard:** Anti-Deception & Regulatory Compliance  
**Date:** September 2026

The following phrases are strictly banned from all repository documentation, website pages, Poe bot listings, meta tags, and advertising. The automated claim validator (`scripts/growth/check-claims.js`) automatically fails any build containing these terms:

---

## 1. Prohibited Terms Register

| Prohibited Phrase | Why It Is Prohibited | Truthful Approved Alternative |
| :--- | :--- | :--- |
| **"100% accurate"** | Optical character recognition inherently makes character errors under poor lighting or complex layouts. | *"Field confidence scores flag uncertain characters."* |
| **"Zero hallucinations"** | Large language models inherently possess probabilistic generation risks. | *"Verifies generated SQL inside an in-memory SQLite sandbox to eliminate guessed columns."* |
| **"Guaranteed safe regex"** | Mathematical ReDoS safety across all custom Turing-complete regex engines cannot be guaranteed. | *"Scans for common catastrophic backtracking structures before executing."* |
| **"Extracts receipts in 3 seconds"** | Render free containers experience cold starts (~45s); real latency depends on network and document size. | *"Processes documents in approximately 4 seconds once warmed."* |
| **"MNC-grade" / "Enterprise-grade"** | Meaningless promotional fluff that cannot be empirically measured. | *"Tested against empirical ground-truth test suites."* |
| **"Works with all receipts"** | Does not work on cursive handwriting, crumpled/torn bills, or washed-out thermal ink. | *"Optimized for printed retail receipts and invoices."* |
| **"World's best" / "Perfect"** | Unsubstantiated superlative violating advertising guidelines. | Drop superlative; describe concrete user outcome. |
| **"Free forever"** | Free tiers depend on vendor allowances (Render/Cloudflare); unsustainable for high-compute workloads. | State exact current pricing terms. |
| **"Completely secure" / "Compliant"** | Claims of full compliance require external third-party SOC2/ISO audits. | State exact technical security controls (e.g. ephemeral RAM execution, 401 unauthenticated rejection). |

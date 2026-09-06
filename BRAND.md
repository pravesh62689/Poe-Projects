# BRAND.md — Premium visual identity for the 3 bots

Goal: the bots should look like a paid product studio, not a weekend project. Consistency
across the three is what reads as "premium" — same fonts, same icon system, same palette.

---

## 1. Type system (use ONE system across all 3 + your profile + any future page)

**Primary — free, genuinely premium quality:**

| Role | Font | Weight | Source |
|---|---|---|---|
| Wordmark / headlines | **Clash Display** | Semibold / Bold | <https://www.fontshare.com/fonts/clash-display> |
| UI / body text | **Satoshi** | Regular / Medium | <https://www.fontshare.com/fonts/satoshi> |
| Code / technical accents | **JetBrains Mono** | Medium / Bold | <https://www.jetbrains.com/lp/mono/> or <https://fonts.google.com/specimen/JetBrains+Mono> |

Fontshare is by the Indian Type Foundry — free for commercial use, and Satoshi / Clash Display
are the fonts a lot of paid SaaS products actually use. That is the "bought" feel.

**Fallback — single-source (all Google Fonts):**
Space Grotesk (display) + Inter (body) + JetBrains Mono (code).

**Avoid** (reads as "free template"): Montserrat, Poppins, Lato, Open Sans, default Roboto/Arial.

---

## 2. Palette

Unified dark base, one accent per bot — so the three icons read as a family.

| Token | Value |
|---|---|
| Background (all 3) | `#0B0B0F` |
| Glyph | `#FFFFFF` |
| ocr-doc-bot accent | indigo `#6366F1` |
| regex-bot accent | lime `#A3E635` |
| sql-bot accent | cyan `#22D3EE` |

---

## 3. Icons — finished, ready to upload

The set is built and rendered in [`brand/`](brand/):

| Bot | Upload this | Mark |
|---|---|---|
| ocr-doc-bot | `brand/ocr-doc-bot-1024.png` | scan viewfinder + two text lines (one indigo) |
| regex-bot | `brand/regex-bot-1024.png` | `.*` — lime dot + geometric asterisk on a baseline |
| sql-bot | `brand/sql-bot-1024.png` | data table with a cyan header row |

All three: `#0A0A0E → #1A1A22` tile, 22% corner radius, top-lit edge highlight, one accent
colour each, matching optical weight — a product family, not three separate bots.

**To edit:** the sources are `brand/<bot>.svg`; re-run `node brand/render.mjs` to regenerate the
512 and 1024 PNGs (uses the repo's `sharp`). `-512.png` is also there if Poe prefers the
smaller upload.

---

## 4. Creator profile (part of the "premium" signal)

- Avatar: `#0B0B0F` tile with your initials in **Clash Display Bold**, white.
- Display name: a studio-style name, not your personal handle.
- Bio, one line, no emoji: `Developer tools on Poe — verified SQL, regex, and document OCR.`
- Same icon style + naming across all bots → looks like a studio, not a hobby.

---

## 5. Response formatting (the bots already do most of this)

- Markdown tables, fenced code blocks, one leading emoji per section max — already in the code.
- Keep the intro message tight; lead with the keyword (see SEO.md §3).
- Don't add more emoji or ASCII art — restraint reads as premium.

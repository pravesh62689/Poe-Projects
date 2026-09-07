# Apex Forge Technology — Comprehensive Regular Expression Test Library

**Document Version:** 1.0.0  
**Tested Engine:** V8 JavaScript / PCRE compatible regex engine  
**Last Tested Date:** 2026-09-08  
**Safety Validation:** All patterns checked for catastrophic backtracking (ReDoS) vulnerability.

---

## 1. Validated Pattern Catalog

### 1.1 RFC 5322 Simplified Email Pattern
- **Pattern:** `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- **ReDoS Risk:** Low (linear $O(n)$ matching, zero nested quantifiers).
- **Positive Test Cases:**
  - `dev.support@apex-forge-tools.pages.dev` (PASS)
  - `alex+filter@subdomain.example.org` (PASS)
  - `user123@company.co.in` (PASS)
- **Negative Test Cases:**
  - `user@domain` (FAIL - missing top-level domain)
  - `@missing-local.com` (FAIL - missing local part)
  - `user@.com` (FAIL - missing domain name)
- **Limitation:** Validates syntax only; does not verify DNS MX records or mailbox existence.

---

### 1.2 Indian 10-Digit Mobile Phone Number
- **Pattern:** `^(?:\+91[\-\s]?)?[6-9]\d{9}$`
- **ReDoS Risk:** None (fixed length sequence).
- **Positive Test Cases:**
  - `+91 9876543210` (PASS)
  - `+91-8765432109` (PASS)
  - `7654321098` (PASS)
  - `6123456789` (PASS)
- **Negative Test Cases:**
  - `5123456789` (FAIL - invalid starting digit)
  - `987654321` (FAIL - only 9 digits)
  - `+91 98765432100` (FAIL - 11 digits)

---

### 1.3 UUID v4 Pattern
- **Pattern:** `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$`
- **ReDoS Risk:** None (deterministic fixed-length tokenization).
- **Positive Test Cases:**
  - `c2a8f8d2-4e89-4a9b-9c2e-8d8a5f3e1b7c` (PASS)
  - `00000000-0000-4000-8000-000000000000` (PASS)
- **Negative Test Cases:**
  - `c2a8f8d2-4e89-3a9b-9c2e-8d8a5f3e1b7c` (FAIL - version 3, not v4)
  - `c2a8f8d24e894a9b9c2e8d8a5f3e1b7c` (FAIL - missing hyphens)

---

### 1.4 Indian GSTIN (Goods and Services Tax Identification Number)
- **Pattern:** `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`
- **Structure Breakdown:**
  - 2 digits: State code (e.g. `27` for Maharashtra, `07` for Delhi).
  - 10 alphanumeric: PAN of the entity (5 letters, 4 digits, 1 letter).
  - 1 character: Entity number of the same PAN holder in the state.
  - 1 character: Constant `Z`.
  - 1 character: Check code.
- **Positive Test Cases:**
  - `27AAAAA0000A1Z5` (PASS)
  - `07AABCB1234C2Z1` (PASS)
- **Negative Test Cases:**
  - `27AAAAA0000A1A5` (FAIL - 14th character must be Z)
  - `2AAAA0000A1Z5` (FAIL - only 1 digit state code)

---

## 2. ReDoS Warning Heuristics
When authoring regex:
- **Avoid Nested Quantifiers:** `(a+)+` or `([a-zA-Z]+)*` causes exponential $O(2^n)$ backtracking on non-matching strings.
- **Avoid Overlapping Alternation:** `(a|aa)+` triggers super-linear branching.
- **Enforce Anchor Boundaries:** Always anchor with `^` and `$` where matching whole tokens.

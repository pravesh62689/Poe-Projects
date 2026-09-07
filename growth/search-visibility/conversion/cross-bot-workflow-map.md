# Apex Forge Technology — Cross-Bot Handoff & Retention Architecture

**Document Version:** 1.0.0  
**Retention Thesis:** Increase user lifetime value and repeat sessions by offering natural, value-adding transitions between the three complementary tools in the Apex Forge suite.

---

## 1. Natural Cross-Product Transitions

```
[Apex Forge OCR]
       |
       | User extracts receipt line items
       | Suggested reply chip: "Analyze these expense rows with SQL?"
       v
[Apex Forge SQL]
       ^
       | User needs to validate complex string formats before database insertion
       | Suggested reply chip: "Validate column values with regex?"
       |
[Apex Forge Regex]
```

---

## 2. Contextual Suggested Reply Logic

### Scenario A: From OCR to SQL
- **Condition:** OCR successfully extracts an invoice with >= 3 line items.
- **Bot Follow-Up Chip:** *"Would you like a sample SQL table and query to aggregate these expenses by category? Try @English-To-SQL."*
- **User Benefit:** Solves the entire accounting journey from paper slip to spreadsheet query.

### Scenario B: From Regex to SQL
- **Condition:** User generates a regex for customer email or order ID formats.
- **Bot Follow-Up Chip:** *"Need to query database rows matching this pattern? Open @English-To-SQL to run SQLite regex queries."*

### Scenario C: From SQL to Regex
- **Condition:** User asks how to filter a text column with a complex pattern in SQLite.
- **Bot Follow-Up Chip:** *"SQLite lacks built-in full regex without extensions. Need to design and test an exact regex pattern first? Check @Regex-Gen-Tester."*

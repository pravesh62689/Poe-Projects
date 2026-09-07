# Apex Forge Technology — Paid Acquisition Measurement Plan

**Document Version:** 1.0.0  
**Status:** Architectural Specification (Zero Active Tracking Pixels Currently Installed)  
**Governing Standard:** Strict user privacy, zero client-side finger-printing, aggregated anonymous metrics only.

---

## 1. Funnel Measurement Architecture
When a paid media campaign is sanctioned with explicit budget:
```
[Paid Search Impression]
        |
        v
[Landing Page Visit (/receipt-ocr/, etc.)]
        |
        +---> [Local Storage / URL Parameters (UTM Source, Campaign)]
        |
        v
[Primary CTA Click: "Open on Poe"]
        |
        +---> [Outbound Link with Aggregated UTM Tags]
        |
        v
[Poe Bot Session Initiation]
        |
        v
[Creator Studio Analytics (Verified Export Only)]
```

---

## 2. Event Tracking Specifications (Privacy-Safe)

| Event Name | Trigger Condition | Payload Parameters | Privacy Controls |
| :--- | :--- | :--- | :--- |
| `ad_landing_view` | User arrives on page with `utm_medium=cpc` | `page_path`, `campaign_id`, `device_type` | Zero IP addresses stored; zero cookie IDs; zero cross-site fingerprinting |
| `copy_prompt_click` | User clicks copy button on sample prompt | `product_id`, `prompt_topic` | Raw prompt text not logged; only categorical topic logged |
| `poe_outbound_click` | User clicks "Open on Poe" CTA | `product_id`, `destination_url`, `utm_campaign` | Strips all query params except standard campaign attribution |
| `workflow_step_view` | User scrolls to workflow stages | `step_number` (1, 2, or 3) | Aggregated view count only |

---

## 3. Financial Attribution & Efficiency Metrics
1. **Customer Acquisition Cost (CAC):** Total Ad Spend ÷ Net New Poe Bot Users (from verified Poe export).
2. **Cost Per Outbound Click (CPOC):** Total Ad Spend ÷ Verified Clicks on Poe CTA buttons.
3. **Poe Activation Rate:** (New Poe Bot Users) ÷ (Verified Outbound Clicks).
4. **ROI / ROAS Formulation:** Poe Creator Earnings attributable to campaign cohort ÷ Ad Spend.

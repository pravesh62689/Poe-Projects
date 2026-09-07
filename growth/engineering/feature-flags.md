# Feature Flag Architecture & Experiment Configuration

**Author:** Growth Engineering Lead  
**Scope:** Environment-controlled feature flags enabling zero-downtime A/B testing of introduction copy, suggested reply heuristics, cross-bot handoffs, and telemetry sampling.

---

## 1. Feature Flag Registry & Defaults

All feature flags are controlled via environment variables in Node.js (`process.env`) and Cloudflare Workers (`env` bindings). All experiments fail safe to stable defaults if an environment variable is undefined.

| Flag Name | Type | Default Value | Allowed Values | Description |
| :--- | :---: | :---: | :---: | :--- |
| `FEATURE_INTRO_VARIANT` | String | `"A"` | `"A"`, `"B"` | Selects between Control (Feature-focused) and Challenger (Action-focused) introduction message. |
| `FEATURE_SUGGESTED_REPLIES_ENABLED` | Boolean | `true` | `true`, `false` | Enables contextual SSE `suggested_reply` events before the `done` event. |
| `FEATURE_CROSS_BOT_HANDOFF_ENABLED` | Boolean | `true` | `true`, `false` | Enables contextual banners recommending sibling bots after task success. |
| `FEATURE_OCR_COMPACT_OUTPUT` | Boolean | `false` | `true`, `false` | Emits a compact summary table first rather than full JSON code block. |
| `FEATURE_ANALYTICS_ENABLED` | Boolean | `true` | `true`, `false` | Enables privacy-safe structured telemetry logging. |
| `FEATURE_ANALYTICS_SAMPLE_RATE` | Float | `1.0` | `0.0` to `1.0` | Sampling rate for telemetry logging (1.0 = 100% of queries). |
| `DEBUG_MODE` | Boolean | `false` | `true`, `false` | Enables verbose execution timing in logs. **Disabled by default in production.** |

---

## 2. Configuration by Deployment Target

### 2.1 Render Environment (OCR-Doc-Bot)
In Render Dashboard $\rightarrow$ Environment Variables:
```ini
FEATURE_INTRO_VARIANT=B
FEATURE_SUGGESTED_REPLIES_ENABLED=true
FEATURE_CROSS_BOT_HANDOFF_ENABLED=true
FEATURE_ANALYTICS_ENABLED=true
FEATURE_ANALYTICS_SAMPLE_RATE=1.0
DEBUG_MODE=false
```

### 2.2 Cloudflare Workers (`wrangler.toml` for Regex & SQL Bots)
```toml
[vars]
FEATURE_INTRO_VARIANT = "B"
FEATURE_SUGGESTED_REPLIES_ENABLED = "true"
FEATURE_CROSS_BOT_HANDOFF_ENABLED = "true"
FEATURE_ANALYTICS_ENABLED = "true"
FEATURE_ANALYTICS_SAMPLE_RATE = "1.0"
DEBUG_MODE = "false"
```

---

## 3. Code Integration Pattern (TypeScript)

```typescript
export interface FeatureFlags {
  introVariant: 'A' | 'B';
  suggestedRepliesEnabled: boolean;
  crossBotHandoffEnabled: boolean;
  analyticsEnabled: boolean;
}

export function resolveFeatureFlags(env: Record<string, string | undefined>): FeatureFlags {
  return {
    introVariant: env['FEATURE_INTRO_VARIANT'] === 'B' ? 'B' : 'A',
    suggestedRepliesEnabled: env['FEATURE_SUGGESTED_REPLIES_ENABLED'] !== 'false',
    crossBotHandoffEnabled: env['FEATURE_CROSS_BOT_HANDOFF_ENABLED'] !== 'false',
    analyticsEnabled: env['FEATURE_ANALYTICS_ENABLED'] !== 'false',
  };
}
```

# QA Gate Blockers Register

**Date:** 2026-09-07T07:28:52.999Z  

| Blocker ID | Severity | Description | Remediation |
| :--- | :---: | :--- | :--- |
| `BLOCKER-CRED-01` | **HIGH** | POE_ACCESS_KEY environment variable is missing. Authenticated live queries to production endpoints cannot be executed. | Export POE_ACCESS_KEY=<valid_key> in the environment or GitHub Actions repository secrets. |

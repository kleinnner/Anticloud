---
title: "Data Loss Prevention (DLP)"
sidebar_position: 99
description: "Content inspection engine that scans AI outputs for sensitive data —"
tags: [features]
---

# Data Loss Prevention (DLP)

## What It Does
Content inspection engine that scans AI outputs for sensitive data —
PII (personally
identifiable information), secrets, classified terms, custom regex
patterns — before the
output is returned to the user.
Prevents data leakage by intercepting and redacting sensitive content
inline in the Rust
output pipeline.
## How It Works
DLP is implemented in the Rust module `ai-oss-gateway/src/dlp.rs`.
The DLP scanner runs inline in the output pipeline — after the AI
model produces a
response (Qwen2-VL-2B-Instruct-Q4_K_M.gguf on CUDA) but before the
response is sent over
WebSocket to port 3030.
Patterns are compiled at startup into deterministic finite automata
(DFAs) for O(n)
scanning performance — there is no regex backtracking, no catastrophic
backtracking
vulnerability.
The DLP engine supports multiple pattern types: built-in PII patterns
(email addresses,
phone numbers, social security numbers, credit card numbers, passport
numbers, driver's
license numbers, bank account numbers, IP addresses), custom regex
patterns (defined in
`opencode.json` or via `dlp_config_update` over WebSocket),
dictionary-based term lists
(classified codewords, project code names, proprietary technology
names), and
context-aware patterns (credit card number near "SSN" has different
sensitivity than near
"payment").
When a pattern matches, the DLP engine can take configurable actions:
redact (replace the
matched content with [REDACTED]), block (prevent the entire response
from being sent),
warn (return the response but include a warning header), or log (record
the match without
action).
The action is configurable per pattern in `opencode.json`.
The DLP scanner also supports allowlisting — certain users, codices,
or contexts can be
exempted from specific patterns.
For example, HR users querying the HR codex can see PII, but a marketing
user querying the
same data would have it redacted.
The HTTP UI on port 8081 renders the `DlpDashboardView` with pattern
management, scan
history, and incident review.
CLI commands (`api-oss dlp scan —content`, `api-oss dlp test
—pattern "ssn" —value
"123-45-6789"`) provide terminal testing, one of 87 CLI commands across
9 subcommand
groups (auth, service, sync, backup, etc.).
All DLP events (matches, redactions, blocks) are recorded in the
immutable ledger at
`data/ledger/` in `.aioss` format.
The gateway runs as a single binary via `api-oss start`, fully
air-gapped.
## How to Operate
1.
**View active patterns**: Open `https://localhost:8081/dlp` to see all active DLP patterns and their configured actions.
2.
**Test a pattern**: `api-oss dlp test --pattern "ssn" --value "123-45-6789"` shows whether the pattern matches and what action would be taken.
3.
**Add a custom pattern**: In the DLP dashboard, click "Add Pattern" and define a regex or dictionary list.
Example: add "ProjectNightingale" as a codeword that must be redacted in
all outputs.
4.
**Configure exceptions**: In `opencode.json`, set `dlp.exemptions: [{"user": "hr_admin", "codices": ["hr"]}]` to allow PII in the HR codex for authorized users.
5.
**Review scan history**: The dashboard shows recent DLP matches with context — which pattern matched, what action was taken, which user and codex were involved.
6.
**Monitor trends**: The DLP dashboard shows match frequency over time, enabling the security team to identify data leakage trends.
7.
**Audit**: Check `data/ledger/` for `.aioss` entries recording every DLP match with cryptographic proof.
## The Moat
- **Inline scanning in the Rust output pipeline**: DLP runs before the response is sent over WebSocket.
No data reaches the frontend unexamined — preventing leakage through
the client-side
rendering pipeline.
- **DFA-compiled patterns for O(n) performance**: Patterns are compiled to DFAs at startup.
There is no regex backtracking, no performance cliffs, no ReDoS
vulnerability.
- **Multi-pattern type support**: Built-in PII, custom regex, dictionary lists, and context-aware patterns provide comprehensive coverage for all data types.
- **Context-aware enforcement**: The allowlisting system ensures that legitimate access to sensitive data (HR viewing PII) is not blocked, while unauthorized access is stopped.
- **Multiple response actions**: Redact, block, warn, or log — providing graduated enforcement based on severity and context.
- **Air-gapped DLP**: All pattern matching is local.
No data leaves the instance for content inspection — critical for
classified
environments.
## Why Choose API-OSS
OpenAI provides no DLP on outputs — API responses are returned as-is
with no content
inspection.
Palantir offers DLP but requires cloud-based content inspection,
defeating the purpose for
sensitive data.
Snowflake has no AI output DLP.
API-OSS provides inline DLP scanning as a built-in feature of the output
pipeline —
every AI response is scanned for sensitive content before it reaches the
user.
For organizations that handle PII, PCI, PHI, or classified data, API-OSS
DLP provides the
content inspection that cloud vendors cannot deliver without sending
data to their
infrastructure.
## Competitive Comparison
- **OpenAI**: No DLP on outputs — API responses are returned as-is.
Users must implement their own output scanning, adding latency and
complexity.
- **Palantir**: DLP available but requires cloud-based content inspection — data must leave your network for scanning, defeating the purpose for sensitive data.
- **Snowflake**: No AI output DLP — Snowflake does not have an AI output pipeline.
- **Anthropic**: No DLP on outputs.
## Cost-Benefit Analysis
Enterprise DLP solutions (Symantec DLP, Digital Guardian, Forcepoint)
cost
$20k-$100k+/year and require network-level deployment — they cannot
inspect AI outputs
inline.
Building custom AI output scanning costs 2-4 months of engineering.
API-OSS provides inline DLP for AI outputs at zero additional cost.
Time savings: 2-4 months of scanning infrastructure development
eliminated.
Risk reduction: the average cost of a data breach involving PII is
$4.45M (IBM 2023
report) — DLP prevents PII from appearing in AI outputs that could be
shared externally,
significantly reducing breach risk.
## Applications
- **Consumer**: N/A
- **Government / Defense**: Prevents classified term leakage in AI-generated reports — dictionary-based patterns for classified codewords ensure that no AI output contains terms that should only appear in classified documents.
All outputs are scanned before the user sees them.
- **Enterprise**: PCI/PII/PHI redaction in customer-facing AI outputs — when a customer service AI system generates a response, credit card numbers, SSNs, and medical information are automatically redacted before the response reaches the customer service agent.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FSHFZF
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg

---
title: "API Reference 14: Council Engine API"
sidebar_position: 14
description: "curl http://localhost:8080/v1/council/agents"
tags: [api]
---

# API Reference 14: Council Engine API

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/council/agents` | List configured agents |
| POST | `/v1/council/agents` | Create agent definition |
| GET | `/v1/council/agents/{id}` | Get agent details |
| PUT | `/v1/council/agents/{id}` | Update agent |
| DELETE | `/v1/council/agents/{id}` | Delete agent |
| POST | `/v1/council/deliberate` | Run council deliberation |
| GET | `/v1/council/decisions` | List past decisions |
| GET | `/v1/council/decisions/{id}` | Get decision details |
| POST | `/v1/council/vote` | Cast a vote (for user agents) |

## Agent Definitions

### Pre-built Agents

```bash
curl http://localhost:8080/v1/council/agents \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "risk_analyst",
      "name": "Risk Analyst",
      "role": "Risk assessment specialist",
      "model": "qwen2.5-7b-q4",
      "temperature": 0.3,
      "directive": "Prioritize downside protection over revenue",
      "tools": ["graph_search", "web_search", "calculator"],
      "color": "#ef4444",
      "status": "active",
      "performance": {
        "accuracy": 0.91,
        "avg_confidence": 0.85,
        "decisions_participated": 234
      }
    },
    {
      "id": "legal_analyst",
      "name": "Legal Analyst",
      "role": "Legal compliance advisor",
      "model": "qwen2.5-7b-q4",
      "temperature": 0.2,
      "directive": "Ensure all decisions comply with applicable laws",
      "tools": ["graph_search", "document_read", "contradiction_check"],
      "color": "#3b82f6",
      "status": "active",
      "performance": {
        "accuracy": 0.94,
        "avg_confidence": 0.88,
        "decisions_participated": 189
      }
    }
  ]
}
```

### Create Custom Agent

```bash
curl -X POST http://localhost:8080/v1/council/agents \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Compliance Officer",
    "role": "Regulatory compliance specialist",
    "model": "qwen2.5-7b-q4",
    "temperature": 0.2,
    "system_prompt": "You are a compliance officer for a multinational corporation...",
    "directive": "Ensure all recommendations meet GDPR, SOX, and internal policy",
    "tools": ["graph_search", "contradiction_check", "document_read"],
    "color": "#10b981",
    "codex_id": "compliance"
  }'
```

## Run Council Deliberation

```bash
curl -X POST http://localhost:8080/v1/council/deliberate \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "proposal": "Should we remove the liability cap from Clause 4?",
    "agents": ["risk_analyst", "legal_analyst", "strategist", "finance_director"],
    "context": {
      "codex_id": "project-alpha",
      "referenced_nodes": ["uuid_clause_4", "uuid_insurance_policy"]
    },
    "voting_method": "majority",
    "require_consensus": false,
    "max_deliberation_rounds": 3,
    "include_reasoning": true
  }'
```

Response:
```json
{
  "deliberation_id": "delib_001",
  "proposal": "Should we remove the liability cap from Clause 4?",
  "status": "completed",
  "duration_ms": 28400,
  "rounds": 2,
  "votes": [
    {
      "agent_id": "risk_analyst",
      "vote": "reject",
      "confidence": 0.91,
      "reasoning": "Removing the cap exposes the company to unlimited liability...",
      "referenced_nodes": ["uuid_insurance_policy", "uuid_eu_directive"]
    },
    {
      "agent_id": "legal_analyst",
      "vote": "reject",
      "confidence": 0.88,
      "reasoning": "Clause 4 references insurance policy Section 4.2 which requires a minimum cap..."
    },
    {
      "agent_id": "strategist",
      "vote": "abstain",
      "confidence": 0.55,
      "reasoning": "Insufficient data on competitive positioning with/without cap. Recommend further market analysis."
    },
    {
      "agent_id": "finance_director",
      "vote": "approve",
      "confidence": 0.72,
      "reasoning": "Removing the cap could increase deal velocity by 15% based on historical data..."
    }
  ],
  "result": {
    "decision": "reject",
    "confidence": 0.84,
    "vote_summary": {
      "approve": 1,
      "reject": 2,
      "abstain": 1
    },
    "winner": "reject"
  },
  "council_ledger_entry": "ledger_entry_abc123"
}
```

## Voting Methods

| Method | Description | When to Use |
|--------|-------------|-------------|
| `majority` | Simple majority (>50%) wins | Fast decisions |
| `consensus` | All must agree (or abstain) | Critical decisions |
| `weighted` | Votes weighted by agent confidence | High-stakes |
| `ranked_choice` | Ranked preference voting | Multiple options |
| `unanimous` | All must agree (no abstain) | Security decisions |

## Streaming Deliberation

For real-time streaming of agent deliberation:

```bash
curl -X POST http://localhost:8080/v1/council/deliberate \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "proposal": "Should we invest in the new market?",
    "agents": ["risk_analyst", "strategist", "finance_director"],
    "stream": true
  }'
```

Stream:
```text
data: {"type":"agent_deliberating","agent":"risk_analyst","status":"thinking"}

data: {"type":"agent_vote","agent":"risk_analyst","vote":"reject","confidence":0.88}

data: {"type":"agent_deliberating","agent":"strategist","status":"thinking"}

data: {"type":"agent_vote","agent":"strategist","vote":"approve","confidence":0.76}

data: {"type":"deliberation_complete","result":{"decision":"reject","confidence":0.82}}
```

## List Decisions

```bash
curl "http://localhost:8080/v1/council/decisions?limit=10&codex_id=project-alpha" \
  -H "Authorization: Bearer sk-aioss-xxxxxxxxxxxx"
```

```json
{
  "data": [
    {
      "id": "decision_001",
      "proposal": "Should we remove the liability cap?",
      "result": "reject",
      "confidence": 0.84,
      "voted_at": "2026-05-31T10:30:00Z",
      "agents_participated": 4,
      "ledger_entry": "ledger_entry_abc123"
    }
  ]
}
```

## WebSocket Council Messages

| Type | Direction | Description |
|------|-----------|-------------|
| `council.deliberate` | Client → Server | Start deliberation |
| `council.agent_thinking` | Server → Client | Agent is reasoning |
| `council.agent_vote` | Server → Client | Agent cast vote |
| `council.agent_message` | Server → Client | Agent message during debate |
| `council.result` | Server → Client | Deliberation result |
| `council.error` | Server → Client | Deliberation error |
| `council.agents_list` | Server → Client | Agent list update |

## See Also

Related API, CLI, and SDK reference documentation.

- [OpenAPI Spec](../spec/openapi.yaml)
- [CLI Reference](../cli/01-getting-started.md)
- [SDK Documentation](../dev/01-getting-started.md)
- [Reference Guide](../reference/01-reference-overview.md)

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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/3VDF75
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg

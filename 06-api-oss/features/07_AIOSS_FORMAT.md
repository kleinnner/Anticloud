---
title: "AI-OSS Audit Ledger Format (.aioss): The Cryptographically-Linked Decision Trail"
sidebar_position: 99
description: "The .aioss file is the permanent record of everything AI-OSS does. Every query, every tool call, every graph mutation, every decision is written to an append-only JSON ledger that chains back to genes"
tags: [features]
---

# AI-OSS Audit Ledger Format (.aioss): The Cryptographically-Linked Decision Trail

The .aioss file is the permanent record of everything AI-OSS does. Every query, every tool call, every graph mutation, every decision is written to an append-only JSON ledger that chains back to genesis using content-addressed hashing.

This is what makes AI-OSS auditable for regulated industries: legal, finance, healthcare, government.

## Why a File Format?

Most AI tools are black boxes — no record of what tools were called, what graph nodes were read/written, what the AI was thinking. If a regulator asks "Why did the AI recommend X?" — you have nothing to show them.

AI-OSS solves this with the .aioss ledger: every file is a complete forensic record. Tamper-evident by design (hash-chained entries). Machine-readable JSON.

## File Naming Convention

Format: `{session_id}_{timestamp}.aioss`

Example: `a1b2c3d4_2026-05-07T14-30-00Z.aioss`

Storage: `./data/ledger/` (configurable in config)

## JSON Schema (Root Object)

```json
{
  "$schema": "https://ai-oss.dev/ledger/v1/schema",
  "version": "1.0.0",
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2026-05-07T14:30:00Z",
  "completed_at": null,
  "status": "active",
  "session_type": "interactive",
  "model": "qwen2.5-7b-instruct-q4_k_m",
  "gateway_version": "0.1.0",
  "codex_id": "project-alpha",
  "entry_count": 142,
  "genesis_hash": "00000000000000000000000000000000",
  "head_hash": "e3b0c44298fc1c149afbf4c8996fb924",
  "entries": []
}
```

## Entry Schema

```json
{
  "index": 0,
  "timestamp": "2026-05-07T14:30:00.123Z",
  "type": "user_message",
  "actor": "user",
  "actor_label": "Lois K.",
  "content": {},
  "hash": "abc123...",
  "parent_hash": "00000000...",
  "signature": null
}
```

Fields: `index` (0-based), `timestamp` (ISO 8601), `type`, `actor` (user|ai|system|tool), `actor_label`, `content`, `hash` (SHA-256 of this entry), `parent_hash` (SHA-256 of previous entry), `signature` (future GPG/ed25519).

## Entry Types

### user_message
```json
{
  "type": "user_message",
  "actor": "user",
  "content": {
    "text": "Should we remove the liability cap?",
    "attachments": [],
    "mentioned_nodes": []
  }
}
```

### ai_message
```json
{
  "type": "ai_message",
  "actor": "ai",
  "content": {
    "text": "Based on the graph analysis...",
    "reasoning": "The user is asking about liability cap...",
    "confidence": 0.88,
    "referenced_nodes": ["uuid_insurance_policy"],
    "tokens_in": 1240,
    "tokens_out": 342,
    "duration_ms": 4820
  }
}
```

### tool_call
```json
{
  "type": "tool_call",
  "actor": "ai",
  "content": {
    "tool": "graph_search",
    "arguments": { "query": "liability cap", "max_results": 10 },
    "result": { "success": true, "data": [...] },
    "duration_ms": 230
  }
}
```

### graph_mutation
```json
{
  "type": "graph_mutation",
  "actor": "system",
  "content": {
    "operation": "create_node",
    "node": { "id": "uuid_new_concept", "node_type": "Concept", "label": "Liability Cap Removal" },
    "reason": "User query triggered document retrieval"
  }
}
```

### contradiction
```json
{
  "type": "contradiction",
  "actor": "system",
  "content": {
    "contradiction_id": "uuid_contra_001",
    "severity": "high",
    "node_a": "uuid_sarah_jenkins",
    "node_b": "uuid_legal_analyst",
    "summary": "Sarah Jenkins (FOR removal) contradicts Legal Analyst (AGAINST removal)",
    "confidence": 0.94,
    "resolved": false
  }
}
```

### decision
```json
{
  "type": "decision",
  "actor": "system",
  "content": {
    "proposal": "Should we remove the liability cap?",
    "options": [
      {"label": "Remove", "votes": 3},
      {"label": "Keep", "votes": 5}
    ],
    "winner": "Keep",
    "agents": [
      {"name": "Risk", "vote": "Keep", "confidence": 0.91},
      {"name": "Legal", "vote": "Keep", "confidence": 0.88}
    ]
  }
}
```

## Hashing Rule

Each entry's hash: `SHA-256(canonical_json(entry_without_hash))`

- Keys sorted alphabetically, no whitespace, UTF-8, no trailing newline
- Forms a hash chain: entry 0 → entry 1 → entry 2 → ...
- Tampering with ANY entry changes its hash, breaking the chain

## Verification

To verify a .aioss file:
1. Iterate entries in order
2. Reconstruct hash: SHA-256(canonical_json(entry minus "hash"))
3. Verify matches stored hash
4. Verify parent_hash matches previous entry's hash
5. Verify genesis_hash matches entry[0]'s hash
6. Verify head_hash matches last entry's hash

## Configuration

```json
{
  "ledger": {
    "enabled": true,
    "directory": "./data/ledger",
    "auto_flush": true,
    "max_entries_per_file": 10000,
    "compress_after_days": 30,
    "signing_key": null
  }
}
```

## See Also

Related features, architecture, and roadmap documentation.

- [Features Overview](../features/README.md)
- [Architecture Overview](../architecture/01-system-architecture.md)
- [API Reference](../api-reference/01-overview.md)
- [Roadmap](../roadmap/01-product-vision.md)

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  As seen on:                                                       !
!  Harvard Dataverse ! Zenodo/CERN ! Academia.edu ! HuggingFace      !
!  anticloud.telepedia.net ! anticloud.fandom.com                    !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Bluesky ! Mastodon                           !
!  Internet Archive ! ORCID ! Figshare                               !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ
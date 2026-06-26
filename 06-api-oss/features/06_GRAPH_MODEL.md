---
title: "AI-OSS Knowledge Graph Model: The Graph That Remembers Everything"
sidebar_position: 99
description: "The knowledge graph is what makes AI-OSS different from every other AI tool. Instead of stateless conversations, every piece of information becomes a persistent node in a graph that grows with every d"
tags: [features]
---

# AI-OSS Knowledge Graph Model: The Graph That Remembers Everything

The knowledge graph is what makes AI-OSS different from every other AI tool. Instead of stateless conversations, every piece of information becomes a persistent node in a graph that grows with every document you ingest, every question you ask, and every decision you make.

## The Core Insight

Most AI tools are black boxes:

```
User: "Should we remove the liability cap?"
AI:   "No, because insurance policy requires it."

But YOU CAN'T SEE:
→ Which specific clause in which specific document?
→ Who argued this? What's their stake?
→ What other nodes does this connect to?
→ What contradicts this recommendation?
→ How confident is the AI?
```

AI-OSS graph is transparent:

```
User: "Should we remove the liability cap?"
AI:   "No. See node:insurance_policy (confidence: 94%)
        which CONTRADICTS node:remove_cap via edge:Clause4-Violation
        Evidence chain:
        insurance_policy → CONTRADICTS → remove_cap
        EU_Directive_2009 → REFERENCES → insurance_policy
        sarah_jenkins (stance: AGAINST) → ESCALATES_TO → legal_risk
        Legal Analyst (EU) → REJECTS removal, confidence: 88%"
```

Every answer is traceable. Every recommendation is sourced.

## Node Types

### ENTITY (Yellow nodes)
Real-world things: people, companies, locations.

```json
{
  "id": "uuid_sarah_jenkins",
  "node_type": "Entity",
  "label": "Sarah Jenkins",
  "content": "General Counsel, 15 years experience. Specializes in EU contract law.",
  "stance": "Con",
  "sentiment": -0.72,
  "metadata": {
    "role": "General Counsel",
    "jurisdiction": "EU (Frankfurt)",
    "employer": "Acme Corp",
    "experience_years": 15
  }
}
```

### CONCEPT (Blue nodes)
Abstract ideas, policies, regulations, principles.

```json
{
  "id": "uuid_clause4",
  "node_type": "Concept",
  "label": "Clause 4 — Liability Cap",
  "content": "$5M liability cap in Master Service Agreement.",
  "metadata": {
    "document_source": "Master_MSA_v4.pdf",
    "clause_number": 4,
    "jurisdiction": "US (Delaware)",
    "original_cap": 5000000
  }
}
```

### DOCUMENT (Green nodes)
Files: PDFs, DOCX, memos, emails, transcripts.

```json
{
  "id": "uuid_master_msa",
  "node_type": "Document",
  "label": "Master_MSA_v4.pdf",
  "content": "[Full extracted text]",
  "metadata": {
    "file_type": "pdf",
    "pages": 47,
    "nodes_extracted": 142
  }
}
```

### AGENT (Purple nodes)
AI agents in the council: virtual personas that vote.

```json
{
  "id": "uuid_risk_analyst",
  "node_type": "Agent",
  "label": "Risk Analyst",
  "content": "AI agent persona: Risk-averse strategist.",
  "stance": "Con",
  "sentiment": -0.4,
  "metadata": {
    "persona": "Risk Analyst",
    "demographic": "EU (Frankfurt), 45-55",
    "directive": "Prioritize downside protection over revenue"
  }
}
```

### DECISION (Orange nodes)
Conclusions, votes, and choices made during analysis.

```json
{
  "id": "uuid_decision_001",
  "node_type": "Decision",
  "label": "Modify to $10M Cap",
  "content": "Modify Clause 4 to include a $10M per-incident cap.",
  "metadata": {
    "vote_result": { "approve": 1, "reject": 2, "revise": 1 },
    "confidence": 0.84
  }
}
```

### EVIDENCE (Gray nodes)
Supporting data points, citations, data rows.

## Edge Types

| Edge Type | Meaning | Example |
|-----------|---------|---------|
| SUPPORTS | Confirms, aligns with | Evidence supports policy |
| CONTRADICTS | Conflicts with (**killer feature**) | Remove cap contradicts policy |
| REFERENCES | Cites, links to | Clause references document |
| BELONGSTO | Is part of | Evidence belongs to clause |
| ESCALATESTO | Escalates to higher concern | Legal risk → Enterprise risk |
| RESPONDSTO | Answers, addresses | Resolution responds to concern |
| PRECEDES | Happens before | Signature precedes execution |

## Graph Query Examples

**Find all contradictions with the 'remove cap' proposal:**

```sql
SELECT n.* FROM nodes n
JOIN edges e ON (e.source_id = n.id OR e.target_id = n.id)
WHERE (e.source_id = 'uuid_remove_cap' OR e.target_id = 'uuid_remove_cap')
  AND e.edge_type = 'Contradicts'
ORDER BY e.weight DESC;
```

**Full context chain for a decision:**

```sql
MATCH (d:Decision {label: "Modify to $10M Cap"})
MATCH (d)-[r1]-(n1)
MATCH (n1)-[r2]-(n2)
RETURN d, r1, n1, r2, n2 LIMIT 50;
```

## The Brain Map (UI Visualization)

The radial canvas visualizes the graph with color-coded nodes:
- **Emotional (Pink)**: Stakeholder feelings, resistance
- **Rational (Blue)**: Legal logic, regulations, data
- **Commercial (Green)**: Revenue impact, market position

Interactions: hover for details, click to expand, drag to reposition, scroll to zoom.

## The Prediction Map

The second canvas view shows scenario branches with probabilities:

```
NOW ───→ [Decision Node] ───→ Outcome
(0%)      │
          ├─→ HIGH RISK (15%) ──→ Insurance Breach
          ├─→ MODERATE (35%) ──→ Partial Renegotiation
          └─→ OPTIMAL (50%) ──→ $10M Cap ✓
```

## How Nodes Get Created

1. **Document ingestion**: PDF → OCR → entity/concept extraction → embedding → nodes
2. **User query**: Creates transient nodes for query concepts + proposed decisions
3. **Council vote**: Agents vote, creating decision nodes + evidence edges

## Embeddings for Semantic Search

Every node has a vector embedding (384–768 dimensions) enabling:
- Semantic search: cosine similarity between embeddings
- Contradiction detection: high similarity + opposing stance
- Auto-linking: recommended edges based on embedding proximity

```sql
CREATE TABLE node_embeddings (
  node_id TEXT PRIMARY KEY REFERENCES nodes(id),
  embedding BLOB NOT NULL
);
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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ
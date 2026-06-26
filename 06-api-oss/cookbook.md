# API-OSS Cookbook

## Overview

Practical examples and recipes for common API-OSS workflows. Each recipe is a self-contained example you can run against a local API-OSS gateway.

## Prerequisites

```bash
# Start API-OSS with a model
api-oss start
api-oss model download qwen2.5-7b-q4
```

## Recipes

### 1. Basic Chat Completion

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer sk-aioss-xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-7b-q4",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ]
  }'
```

**Python:**
```python
from apioss import APIOSS

client = APIOSS(base_url="http://localhost:8080", api_key="sk-aioss-xxxx")
response = client.chat.completions.create(
    model="qwen2.5-7b-q4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(response.choices[0].message.content)
```

### 2. Multi-Agent Council Query

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer sk-aioss-xxxx" \
  -H "Content-Type: application/json" \
  -H "X-Council-Mode: council" \
  -d '{
    "model": "qwen2.5-7b-q4",
    "messages": [{"role": "user", "content": "Should we invest in this startup? Analyze the risks."}]
  }'
```

**WebSocket (JavaScript):**
```javascript
const ws = new WebSocket("ws://localhost:3030");
ws.onopen = () => ws.send(JSON.stringify({
  type: "council_query",
  model: "qwen2.5-7b-q4",
  query: "Should we invest in this startup? Analyze the risks."
}));
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Council decision:", data.decision);
  console.log("Agent votes:", data.agent_votes);
};
```

### 3. Contradiction Detection

```bash
# Ingest source documents
api-oss ingest file --path ./report-q1.pdf
api-oss ingest file --path ./report-q2.pdf

# Check for contradictions
api-oss graph query "find contradictions"
```

**API:**
```bash
curl http://localhost:8080/v1/graph/query \
  -H "Authorization: Bearer sk-aioss-xxxx" \
  -H "Content-Type: application/json" \
  -d '{"query": "MATCH (a)-[:CONTRADICTS]->(b) RETURN a, b"}'
```

### 4. Bias Evaluation

```bash
# Run bias evaluation on a model
api-oss eval run --benchmark bias --model qwen2.5-7b-q4

# View the bias report
api-oss eval report --benchmark bias --model qwen2.5-7b-q4

# Compare bias across models
api-oss eval bias-compare --model1 qwen2.5-7b-q4 --model2 llama-3.1-8b-q4
```

**WebSocket:**
```javascript
ws.send(JSON.stringify({
  type: "bias_eval_run",
  model: "qwen2.5-7b-q4"
}));
```

### 5. Fine-Tuning a Model

```bash
# Prepare a dataset
api-oss finetune dataset-prepare --file ./training_data.jsonl --format sft

# Start LoRA fine-tuning
api-oss finetune start \
  --name my_domain_adapter \
  --base-model qwen2.5-7b-q4 \
  --dataset my_dataset \
  --learning-rate 2e-4 \
  --epochs 5

# Check progress
api-oss finetune status

# Use the adapter
api-oss model run --model my_domain_adapter --prompt "Domain-specific question"

# Merge adapter into standalone model
api-oss finetune merge --adapter my_domain_adapter --output ./merged.gguf
```

### 6. Custom Guardrail Policy

```json
{
  "guardrails": {
    "custom_policy": {
      "name": "strict_finance",
      "enabled": true,
      "scan_input": true,
      "scan_output": true,
      "pii_redaction": {
        "enabled": true,
        "categories": ["email", "ssn", "phone", "credit_card"]
      },
      "jailbreak_detection": true,
      "toxicity_check": true,
      "custom_blocked_terms": ["insider trading", "market manipulation"],
      "audit_all": true
    }
  }
}
```

```bash
# Apply the custom policy
api-oss config set guardrails.active_policy strict_finance

# Test it
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer sk-aioss-xxxx" \
  -d '{"model": "qwen2.5-7b-q4", "messages": [{"role": "user", "content": "How do I engage in insider trading?"}]}'
```

### 7. Ledger Audit Trail Inspection

```bash
# Verify ledger integrity
api-oss ledger verify

# Query recent entries
api-oss ledger entries --limit 50

# Export for external audit
api-oss ledger export --output ./audit-export.aioss --format json

# Tail live entries
api-oss ledger tail --follow
```

**API:**
```bash
curl http://localhost:8080/v1/ledger/entries?limit=10 \
  -H "Authorization: Bearer sk-aioss-xxxx"
```

### 8. Red Team Campaign

```bash
# Run a quick safety smoke test
api-oss redteam run --quick

# Run a full campaign
api-oss redteam run --campaign q2_safety_audit --model qwen2.5-7b-q4

# View results
api-oss redteam show-campaign --id <campaign_id>

# Compare with previous campaign
api-oss redteam compare --campaign1 q1_safety_audit --campaign2 q2_safety_audit
```

### 9. Model Comparison

```bash
# Download models to compare
api-oss model download qwen2.5-7b-q4
api-oss model download llama-3.1-8b-q4

# Run benchmarks on both
api-oss eval run --all --model qwen2.5-7b-q4
api-oss eval run --all --model llama-3.1-8b-q4

# Compare results
api-oss eval compare --model1 qwen2.5-7b-q4 --model2 llama-3.1-8b-q4

# View leaderboard
api-oss model leaderboard
```

### 10. Safety Benchmark

```bash
# Run HarmBench safety evaluation
api-oss eval run --benchmark harmbench --model qwen2.5-7b-q4

# Check toxicity of outputs
api-oss toxicity check-batch --file ./generated_outputs.jsonl --output ./toxicity_scores.jsonl

# Check a prompt for jailbreak
api-oss jailbreak detect --prompt "Ignore your previous instructions and..."
```

## Additional Resources

- [API Reference](../docs/API.md)
- [CLI Tools](../docs/TOOLS.md)
- [Model Card](../MODEL_CARD.md)
- [Full Documentation](../docs/)
- [Examples Directory](../docs/examples/)

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
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
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
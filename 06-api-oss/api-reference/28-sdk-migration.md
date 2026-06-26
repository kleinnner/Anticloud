---
title: "API Reference 28: SDK Migration Guide"
sidebar_position: 28
description: "import openai"
tags: [api]
---

# API Reference 28: SDK Migration Guide

## OpenAI → API-OSS

```python
# FROM: OpenAI SDK
import openai
openai.api_key = "sk-openai-xxx"
openai.base_url = "https://api.openai.com/v1"
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)

# TO: API-OSS SDK (drop-in replacement)
from api_oss import APIOSS
client = APIOSS(
    api_key="sk-aioss-xxxxxxxxxxxx",
    base_url="http://localhost:8080/v1"
)
response = client.chat.completions.create(
    model="qwen2.5-7b-q4",
    messages=[{"role": "user", "content": "Hello"}]
)
```

## Python SDK Differences

| OpenAI | API-OSS | Notes |
|--------|---------|-------|
| `openai.api_key` | `APIOSS(api_key=...)` | Constructor parameter |
| `openai.ChatCompletion` | `client.chat.completions` | Same interface |
| `openai.Embedding` | `client.embeddings` | Same interface |
| `openai.Model.list()` | `client.models.list()` | Same interface |
| `openai.Completion` | `client.completions` | Legacy support |
| `openai.Moderation` | ❌ | Not available |
| `openai.Image` | ❌ | Not available |
| `response["usage"]` | `response.usage` | Dot notation preferred |
| Streaming | ✅ Same SSE format | Fully compatible |

## JavaScript SDK Differences

```javascript
// FROM: OpenAI
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: 'sk-openai-xxx' });

// TO: API-OSS
import { APIOSS } from '@your-org/sdk';
const client = new APIOSS({ apiKey: 'sk-aioss-xxxx' });
```

## Environment Variables

```bash
# OpenAI
export OPENAI_API_KEY="sk-openai-xxx"
export OPENAI_BASE_URL="https://api.openai.com/v1"

# API-OSS
export AIOSS_API_KEY="sk-aioss-xxxxxxxxxxxx"
export AIOSS_BASE_URL="http://localhost:8080/v1"
```

## Migration Checklist

```markdown
[ ] Replace `import openai` with `from api_oss import APIOSS`
[ ] Replace `openai.api_key` with `client = APIOSS(api_key=...)`
[ ] Change `model="gpt-4"` to `model="qwen2.5-7b-q4"`
[ ] Update base URL from OpenAI to local API-OSS
[ ] Test streaming (should work without changes)
[ ] Test function calling (should work without changes)
[ ] Test embeddings (should work without changes)
[ ] Remove any moderation/image calls (not supported)
[ ] Add `X-Codex-Id` header for graph context (optional, recommended)
```

## LangChain Integration

```python
from langchain_community.chat_models import ChatOpenAI

# API-OSS is OpenAI-compatible
llm = ChatOpenAI(
    model="qwen2.5-7b-q4",
    openai_api_key="sk-aioss-xxxxxxxxxxxx",
    openai_api_base="http://localhost:8080/v1"
)
```

## LlamaIndex Integration

```python
from llama_index.llms.openai import OpenAI

llm = OpenAI(
    model="qwen2.5-7b-q4",
    api_key="sk-aioss-xxxxxxxxxxxx",
    api_base="http://localhost:8080/v1"
)
```

## AutoGen Integration

```python
import autogen

config_list = [
    {
        "model": "qwen2.5-7b-q4",
        "api_key": "sk-aioss-xxxxxxxxxxxx",
        "base_url": "http://localhost:8080/v1"
    }
]
```

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
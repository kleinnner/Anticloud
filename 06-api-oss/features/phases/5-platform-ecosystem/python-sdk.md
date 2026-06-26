---
title: "Python SDK"
sidebar_position: 99
description: "A PyPI package (`api-oss`) providing a full WebSocket protocol wrapper for Python 3.10+."
tags: [features]
---

# Python SDK

## What It Does
A PyPI package (`api-oss`) providing a full WebSocket protocol wrapper for Python 3.10+.
Includes Pandas integration for DataFrame-based graph analysis, Jupyter notebook helpers
for rich interactive output, and Pydantic models for all 810 WebSocket message types.
Enables Python developers to query, modify, and manage the API-OSS knowledge graph
programmatically. The SDK handles automatic reconnection with exponential backoff, heartbeat
management, and request-response correlation via message IDs.

## How It Works
The Python SDK uses the `websockets` async library for bidirectional communication with the
API-OSS gateway on port 3030. Message serialization uses Python `dataclasses` with JSON
encoding matching the Rust serde-tagged enum format — the `type` field discriminator aligns
with Rust's `#[serde(tag = "type")]` on `ClientMessage` and `ServerMessage` enums. Pydantic
models define the request/response structures for all 810 message types, providing runtime
validation and IDE autocomplete. The SDK provides both async/await and synchronous APIs
(using `asyncio.run()` internally for sync wrappers). Core API: `ApiOssClient` class with
methods mirroring the CLI's 87 commands: `client.graph.query()`, `client.graph.add_node()`,
`client.ledger.verify()`, `client.model.infer()`, `client.sync.status()`, etc. The Pandas
integration is a key differentiator: `graph.query().to_dataframe()` converts graph query
results directly to a Pandas DataFrame with columns matching node properties, enabling
seamless integration with the Python data science stack: `df.groupby('type').size()`,
`df.plot()`, `sns.scatterplot(data=df)`, `df.to_excel()`. Jupyter notebook helpers:
`display(client.graph.query('Person').to_dataframe())` renders an interactive table with
sorting and filtering in the notebook. The SDK also provides IPython display integration
for rich output — `display(client.model.info())` renders as a styled HTML table. The SDK
handles automatic reconnection with jittered exponential backoff (1s, 2s, 4s, ... 60s max)
matching the gateway's retry policy, heartbeat management, and concurrent request-response
correlation via message IDs. The SDK is published on PyPI (`pip install api-oss`) with
dependencies: `websockets`, `pydantic`, and `pandas` (optional, for DataFrame support).

The code generation pipeline that produces the Python SDK reads the Rust protocol enums
from `protocol.rs` using `syn` (Rust's parsing library) via a build script. For each
`ClientMessage` and `ServerMessage` variant annotated with `#[serde(tag = "type")]`, the
codegen extracts the variant name (e.g., `GraphQuery`),'s serde rename (e.g.,
`"graph_query"`), its payload `struct` type, and each field's name and type. It then
generates a Pydantic `BaseModel` class for each struct (e.g., `class GraphQuery(BaseModel)`)
with proper field type annotations, default values, and JSON schema generation. The
discriminated union — `ClientMessage` as a `Union` type with `Field(discriminator='type')` —
ensures Pydantic validates the JSON `type` field matches the correct payload schema at
runtime, exactly mirroring the Rust serde tagged enum behavior. The `ApiOssClient` class
internally uses an `asyncio` event loop with a single WebSocket connection managed by the
`websockets` library. Each call to a client method (e.g., `client.graph.query()`) creates a
coroutine that serializes a `dict` matching the Pydantic model, sends it as JSON over the
WebSocket with a unique UUID4 `id`, and awaits a response with a matching `id` from an
internal `asyncio.Future` dictionary. This request-response correlation pattern supports
concurrent calls — multiple queries can be in-flight simultaneously, each waiting on its own
future. The sync API wrappers use `asyncio.run()` to execute the coroutine in a new event
loop, with a shared connection pool to reuse the same WebSocket across calls.

## How to Operate
1. Install: `pip install api-oss`. With Pandas: `pip install api-oss[pandas]`.
2. Ensure gateway running: `api-oss start` or run binary directly.
3. Basic usage:
   ```python
   from api_oss import ApiOssClient
   client = ApiOssClient(host='localhost', port=3030)
   client.connect()
   result = client.graph.query(type='Person', limit=10)
   ```
4. Pandas integration:
   ```python
   df = client.graph.query(type='Person', limit=1000).to_dataframe()
   print(df.describe())
   ```
5. Async usage:
   ```python
   from api_oss import AsyncApiOssClient
   async with AsyncApiOssClient() as client:
       result = await client.graph.query(type='Person')
   ```
6. Ledger: `status = client.ledger.verify()`.
7. Model: `response = client.model.infer(prompt="Capital of France?")`.
8. Jupyter: results auto-displayed with rich formatting.
9. Error handling: typed exceptions.
10. Connection: `client.disconnect()` or context manager.

## The Moat
- Competitors lack first-class Python SDKs with full protocol coverage — Palantir's SDK is
  REST-only and limited; OpenAI's is REST-only with no persistent connection.
- The Pandas integration — converting graph queries directly to DataFrames — saves data
  scientists hours of boilerplate data extraction code per analysis.
- Pydantic models for all 810 message types ensure type safety and IDE autocomplete.
- Jupyter notebook integration makes API-OSS a native part of the Python data science
  ecosystem.

## Why Choose API-OSS
A data scientist runs `client.graph.query('SalesData').to_dataframe()` and has 10,000
records in a DataFrame for analysis — no REST API wrangling, no JSON parsing, no pagination
code. An ML engineer extracts training data from the knowledge graph with one method call.
A Python developer integrates with the full API-OSS feature set through a clean, typed API.

## Competitive Comparison
- **Palantir**: Python SDK exists but REST-only, limited functionality.
- **OpenAI**: Python SDK is REST-only with SSE, no persistent connection.
- **Anthropic**: Python SDK is REST-only.
- **Snowflake**: Snowpark is SQL-only, not a decision engine SDK.
- **Google**: Vertex AI Python SDK requires cloud auth, no offline mode.

## Cost-Benefit Analysis
Custom Python WebSocket client for 810 messages: weeks of development ($5k–$15k). SDK is
free. Pandas integration saves 1–2 hours per data extraction — 5 extractions/week =
5–10 hours saved weekly ($500–$1,000/week at $100/hour). OpenAI SDK requires API calls
at $0.15/M tokens — extracting 10k nodes via API costs $15–$150. API-OSS extraction costs
$0. Snowpark requires active Snowflake warehouse ($2–$8/credit/hour).

## Applications
- **Consumer**: Python scripting for home automation. Jupyter notebooks for personal data
  analysis with Pandas integration.
- **Government / Defense**: Integrate with Python-based intelligence analysis pipelines.
  Jupyter notebooks for analyst workflows. Full offline support.
- **Enterprise**: Data science workflows, Jupyter dashboards, ML pipeline integration.
  Automated reporting with pandas. Custom tooling on the typed SDK API.

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
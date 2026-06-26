<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# API Reference

This reference documents the Kazkade runtime API including REST endpoints, IPC protocol, and FFI bindings.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   External Clients                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ REST     │  │ IPC      │  │ FFI (C/Python)   │  │
│  │ HTTP/1.1 │  │ Unix Sock│  │ libkazcade.so    │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                 │            │
└───────┼──────────────┼─────────────────┼────────────┘
        │              │                 │
        ▼              ▼                 ▼
┌─────────────────────────────────────────────────────┐
│                Kazkade Runtime Server                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Router   │  │ IPC      │  │ FFI Bridge       │  │
│  │ (Axum)   │  │ Handler  │  │ (cbindgen)       │  │
│  └────┬─────┘  └──────────┘  └──────────────────┘  │
│       │                                              │
│       ▼                                              │
│  ┌────────────────────────────────────────────────┐  │
│  │ Core Engine                                     │  │
│  │  .acol Store · SQL Engine · Ledger · Bench     │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## REST API

The REST server runs on port 8742 by default.

### Base URL

```
http://127.0.0.1:8742/api/v1
```

### Authentication

```bash
# Bearer token (configurable)
Authorization: Bearer <token>
```

### Endpoints

#### System

**GET /api/v1/info**

System information.

```bash
curl http://127.0.0.1:8742/api/v1/info
```

Response:
```json
{
  "version": "0.6.0",
  "cpu": "AMD Ryzen 9 7950X",
  "simd": ["AVX512-F", "AVX512-VL", "AVX512-BW"],
  "memory_mb": 65536,
  "uptime_secs": 3600,
  "plugins": 0,
  "acol_files": 12
}
```

**GET /api/v1/health**

Health check.

```bash
curl http://127.0.0.1:8742/api/v1/health
```

Response: `{ "status": "ok" }`

#### Storage

**GET /api/v1/storage**

List `.acol` files in the workspace.

```bash
curl http://127.0.0.1:8742/api/v1/storage
```

Response:
```json
{
  "files": [
    {
      "name": "transactions.acol",
      "path": "/data/transactions.acol",
      "size_bytes": 42300000,
      "columns": 12,
      "rows": 1048576,
      "codecs": ["Delta", "RLE", "Bitpack", "Dict"],
      "checksum": "sha3-256:a1b2..."
    }
  ]
}
```

**GET /api/v1/storage/:name**

Get metadata for a specific `.acol` file.

```bash
curl http://127.0.0.1:8742/api/v1/storage/transactions.acol
```

Response:
```json
{
  "name": "transactions.acol",
  "columns": [
    {"name": "ts", "type": "i64", "codec": "Delta", "cardinality": 1048576},
    {"name": "amount", "type": "f64", "codec": "Bitpack", "cardinality": 256234},
    {"name": "category", "type": "utf8", "codec": "Dict", "cardinality": 12}
  ],
  "stats": {
    "rows": 1048576,
    "size_bytes": 42300000,
    "compression_ratio": 3.2
  }
}
```

#### Query

**POST /api/v1/query**

Execute a SQL query.

```bash
curl -X POST http://127.0.0.1:8742/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT category, COUNT(*) as cnt, AVG(amount) FROM transactions GROUP BY category",
    "params": {},
    "format": "json",
    "limit": 100
  }'
```

Request schema:
```json
{
  "sql": "string (required)",
  "params": "object (optional, for parameterized queries)",
  "format": "string (optional, default: 'json', options: 'json', 'csv', 'arrow')",
  "limit": "integer (optional, default: 10000)"
}
```

Response:
```json
{
  "columns": ["category", "cnt", "avg(amount)"],
  "types": ["utf8", "i64", "f64"],
  "rows": [
    ["Electronics", 234000, 129.50],
    ["Clothing", 189000, 45.20],
    ["Food", 320000, 23.10]
  ],
  "elapsed_ms": 12.5,
  "rows_returned": 12
}
```

**POST /api/v1/query/stream**

Stream query results via Server-Sent Events.

```bash
curl -N -X POST http://127.0.0.1:8742/api/v1/query/stream \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM transactions", "format": "csv"}'
```

Response (SSE stream):
```
data: {"type": "metadata", "columns": ["ts", "amount", "category"], "types": ["i64", "f64", "utf8"]}
data: {"type": "row", "data": [1700000000000000000, 129.50, "Electronics"]}
data: {"type": "row", "data": [1700000000000000001, 45.20, "Clothing"]}
data: {"type": "done", "rows_returned": 1048576, "elapsed_ms": 850}
```

#### Ledger

**GET /api/v1/ledger**

Get ledger status.

```bash
curl http://127.0.0.1:8742/api/v1/ledger
```

Response:
```json
{
  "entries": 142,
  "last_entry": "2026-06-19T12:00:00Z",
  "integrity": "verified",
  "genesis_hash": "sha3-256:aaaa..."
}
```

**GET /api/v1/ledger/entries**

List ledger entries with pagination.

```bash
curl "http://127.0.0.1:8742/api/v1/ledger/entries?offset=0&limit=20"
```

**POST /api/v1/ledger/verify**

Verify a ledger entry or file.

```bash
curl -X POST http://127.0.0.1:8742/api/v1/ledger/verify \
  -F "file=@result.aioss"
```

#### Benchmark

**POST /api/v1/bench/run**

Run a benchmark.

```bash
curl -X POST http://127.0.0.1:8742/api/v1/bench/run \
  -H "Content-Type: application/json" \
  -d '{"suite": "standard", "record": true}'
```

**GET /api/v1/bench/results**

List benchmark results.

**GET /api/v1/bench/leaderboard**

Get community leaderboard.

### Error Handling

```json
{
  "error": {
    "code": "QUERY_TIMEOUT",
    "message": "Query exceeded timeout of 30 seconds",
    "details": {"elapsed_ms": 30000, "query": "SELECT ..."}
  }
}
```

Error codes:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `QUERY_ERROR` | 400 | SQL syntax or execution error |
| `QUERY_TIMEOUT` | 408 | Query exceeded timeout |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Missing or invalid auth |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `STORAGE_ERROR` | 500 | `.acol` storage error |

## IPC Protocol (Unix Domain Socket)

For local high-performance communication.

### Connection

```bash
# Default socket path
~/.kazcade/run/kazcade.sock
```

### Message Format

Length-delimited protobuf messages:

```
┌──────────────┬────────────────────────────┐
│ Length (u32) │ Protobuf Message (bytes)   │
│ 4 bytes      │ variable                   │
└──────────────┴────────────────────────────┘
```

### IPC Endpoints

```protobuf
service KazkadeIPC {
  rpc Query(QueryRequest) returns (QueryResponse);
  rpc QueryStream(QueryRequest) returns (stream QueryResponse);
  rpc Inspect(InspectRequest) returns (InspectResponse);
  rpc Bench(BenchRequest) returns (BenchResponse);
  rpc LedgerGet(LedgerGetRequest) returns (LedgerGetResponse);
  rpc LedgerVerify(LedgerVerifyRequest) returns (LedgerVerifyResponse);
}
```

### Example (Rust)

```rust
use kazcade::ipc::client::IpcClient;

let mut client = IpcClient::connect("~/.kazcade/run/kazcade.sock").await?;
let result = client.query("SELECT * FROM data LIMIT 10").await?;
println!("{:?}", result.columns);
```

## FFI Bindings

### C API

```c
#include <kazcade.h>

int main() {
    kazcade_handle_t* handle = kazcade_init("/path/to/workspace", NULL);
    
    // Query
    kazcade_result_t* result = kazcade_query(handle, "SELECT * FROM data LIMIT 10");
    
    // Access columns
    const char** col_names = kazcade_result_column_names(result);
    int num_cols = kazcade_result_num_columns(result);
    int64_t num_rows = kazcade_result_num_rows(result);
    
    // Get data
    const int64_t* int_col = kazcade_result_column_i64(result, 0);
    for (int64_t i = 0; i < num_rows; i++) {
        printf("%ld\n", int_col[i]);
    }
    
    kazcade_result_free(result);
    kazcade_free(handle);
    return 0;
}
```

### C API Reference

| Function | Description |
|----------|-------------|
| `kazcade_init(workspace, config)` | Initialize runtime |
| `kazcade_free(handle)` | Shutdown runtime |
| `kazcade_query(handle, sql)` | Execute SQL query |
| `kazcade_query_with_params(handle, sql, params)` | Parameterized query |
| `kazcade_result_free(result)` | Free result |
| `kazcade_result_num_columns(result)` | Column count |
| `kazcade_result_num_rows(result)` | Row count |
| `kazcade_result_column_name(result, i)` | Column name |
| `kazcade_result_column_type(result, i)` | Column type |
| `kazcade_result_column_i64(result, i)` | Int64 column |
| `kazcade_result_column_f64(result, i)` | Float64 column |
| `kazcade_result_column_utf8(result, i)` | String column |
| `kazcade_inspect(handle, path)` | Inspect file |
| `kazcade_bench(handle, suite)` | Run benchmark |

### Python FFI

```python
import kazkade

# Initialize
runtime = kazkade.Runtime("/path/to/workspace")

# Query
result = runtime.query("SELECT category, AVG(amount) FROM data GROUP BY category")
print(result.columns)   # ['category', 'avg(amount)']
print(result.types)     # ['utf8', 'f64']

# Iterate rows
for row in result:
    print(row)

# NumPy integration
import numpy as np
amounts = np.array(result.column("amount"))
print(amounts.mean())
```

### WASM Plugin API

```rust
use kazkade_plugin::*;

#[no_mangle]
pub extern "C" fn kazkade_plugin_init() -> PluginHandle {
    PluginHandle::new("my-plugin", "0.1.0")
}

#[no_mangle]
pub extern "C" fn kazkade_plugin_query(ctx: &mut QueryContext) -> Result<()> {
    let input = ctx.input_column("amount")?.as_f64()?;
    let output: Vec<f64> = input.iter().map(|v| v * 2.0).collect();
    ctx.set_output_column("doubled", output)?;
    Ok(())
}
```

## gRPC API (Experimental)

```protobuf
service Kazkade {
  rpc Query(QueryRequest) returns (QueryResponse);
  rpc QueryStream(QueryRequest) returns (stream Row);
  rpc Inspect(InspectRequest) returns (FileMetadata);
  rpc RunBench(BenchRequest) returns (BenchResult);
  rpc LedgerStatus(Empty) returns (LedgerInfo);
}
```

---

*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID ! Figshare   !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885

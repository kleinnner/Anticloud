<!--
  __   ___                      __                        __                     
  ¦¦  ¦¦¯                       ¦¦                        ¦¦                     
  ___¦  ¦¦_¦¦      _¦¦¦¦¦_  ¦¦¦¦¦¦¦¦  ¦¦ _¦¦¯    _¦¦¦¦¦_   _¦¦¦_¦¦   _¦¦¦¦_   ¦___     
  __¦¯¯¯    ¦¦¦¦¦      ¯ ___¦¦      _¦¯   ¦¦_¦¦      ¯ ___¦¦  ¦¦¯  ¯¦¦  ¦¦____¦¦    ¯¯¯¦__ 
  ¯¯¦___    ¦¦  ¦¦_   _¦¦¯¯¯¦¦    _¦¯     ¦¦¯¦¦_    _¦¦¯¯¯¦¦  ¦¦    ¦¦  ¦¦¯¯¯¯¯¯    ___¦¯¯ 
      ¯¯¯¦  ¦¦   ¦¦_  ¦¦___¦¦¦  _¦¦_____  ¦¦  ¯¦_   ¦¦___¦¦¦  ¯¦¦__¦¦¦  ¯¦¦____¦  ¦¯¯¯     
           ¯¯    ¯¯   ¯¯¯¯ ¯¯  ¯¯¯¯¯¯¯¯  ¯¯   ¯¯¯   ¯¯¯¯ ¯¯    ¯¯¯ ¯¯    ¯¯¯¯¯
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Integration Patterns

This guide covers integrating Kazkade with message brokers, streaming pipelines, and microservices.

## Overview

```
+----------+   +----------+   +----------+   +----------+
¦ Kafka    ¦   ¦ RabbitMQ ¦   ¦ gRPC     ¦   ¦ REST     ¦
¦ Producer ¦   ¦ Producer ¦   ¦ Client   ¦   ¦ Client   ¦
+----------+   +----------+   +----------+   +----------+
     ¦               ¦              ¦               ¦
     ?               ?              ?               ?
+----------------------------------------------------------+
¦                 Kazkade Integration Layer                 ¦
¦  +----------+ +----------+ +----------+ +----------+   ¦
¦  ¦ Kafka    ¦ ¦ AMQP     ¦ ¦ gRPC     ¦ ¦ HTTP     ¦   ¦
¦  ¦ Connector¦ ¦ Connector¦ ¦ Server   ¦ ¦ Server   ¦   ¦
¦  +----------+ +----------+ +----------+ +----------+   ¦
¦                          ¦                               ¦
¦                          ?                               ¦
¦                 +------------------+                    ¦
¦                 ¦   .acol Store    ¦                    ¦
¦                 ¦ (zero-copy mmap) ¦                    ¦
¦                 +------------------+                    ¦
+----------------------------------------------------------+
```

## Kafka Integration

### Prerequisites

```bash
# Install Kafka connector
kazkade connector install kafka
```

### Configuration

```toml
# ~/.kazcade/connectors/kafka.toml
[connector.kafka]
bootstrap_servers = ["localhost:9092", "node2:9092"]
consumer_group = "kazcade-consumer"
auto_offset_reset = "earliest"
batch_size = 10000
linger_ms = 100
```

### Consuming from Kafka

```rust
use kazcade::connector::kafka::KafkaSource;

#[tokio::main]
async fn main() -> Result<()> {
    let rt = kazcade::Runtime::new("/data")?;

    // Create Kafka source
    let source = KafkaSource::new("transactions")
        .bootstrap_servers(["localhost:9092"])
        .topic("raw-transactions")
        .value_format("json")
        .build()?;

    // Stream into .acol store
    let mut stream = source.into_stream(rt.clone());
    while let Some(batch) = stream.next().await {
        let batch = batch?;
        rt.append_to_store("transactions.acol", batch)?;
        println!("Appended {} rows", batch.num_rows());
    }

    Ok(())
}
```

### CLI Usage

```bash
# Start Kafka consumer
kazkade connector run kafka \
  --topic raw-transactions \
  --output transactions.acol \
  --format json

# Start Kafka producer (publish .acol data)
kazkade connector produce kafka \
  --topic processed-results \
  --input results.acol \
  --format avro
```

### Python Example

```python
import kazkade

rt = kazkade.Runtime("/data")

# Define streaming pipeline
pipeline = (
    rt.from_kafka("raw-transactions", bootstrap_servers="localhost:9092")
    .parse_json()
    .transform(lambda df: df[df["amount"] > 0])
    .to_acol("valid_transactions.acol")
)

# Run
pipeline.run()
```

## RabbitMQ Integration

```bash
kazkade connector install rabbitmq
```

```toml
[connector.rabbitmq]
url = "amqp://guest:guest@localhost:5672"
exchange = "kazcade.data"
queue = "analytics"
routing_key = "transactions.#"
prefetch_count = 100
```

### Consuming

```rust
use kazcade::connector::rabbitmq::RabbitMQSource;

let source = RabbitMQSource::new("analytics")
    .url("amqp://guest:guest@localhost:5672")
    .queue("analytics")
    .auto_ack(false)
    .build()?;

let stream = source.into_stream(rt);
```

### Publishing

```rust
use kazcade::connector::rabbitmq::RabbitMQSink;

let sink = RabbitMQSink::new("analytics")
    .url("amqp://guest:guest@localhost:5672")
    .exchange("kazcade.results")
    .routing_key("analytics.complete")
    .build()?;

sink.send(batch).await?;
```

## gRPC Integration

### Server

```rust
use kazcade::grpc::*;

#[tokio::main]
async fn main() -> Result<()> {
    let rt = kazcade::Runtime::new("/data")?;

    let server = GrpcServer::new(rt)
        .bind("[::1]:50051")
        .tls("cert.pem", "key.pem")
        .max_message_size(100 * 1024 * 1024) // 100 MB
        .build()?;

    server.serve().await?;
    Ok(())
}
```

### Client

```rust
use kazcade::grpc::client::GrpcClient;

let client = GrpcClient::connect("https://localhost:50051")
    .tls_client("ca.pem", "client.pem", "client-key.pem")
    .build()?;

// Query
let result = client.query("SELECT * FROM transactions LIMIT 10").await?;

// Stream
let mut stream = client.query_stream("SELECT * FROM large_table").await?;
while let Some(row) = stream.next().await {
    process(row?);
}
```

### Proto Definition

```protobuf
service KazkadeAnalytics {
  rpc Query(QueryRequest) returns (QueryResponse);
  rpc QueryStream(QueryRequest) returns (stream Row);
  rpc Ingest(IngestRequest) returns (IngestResponse);
  rpc ListFiles(Empty) returns (FileList);
}

message QueryRequest {
  string sql = 1;
  map<string, Value> params = 2;
  int32 limit = 3;
}

message Row {
  repeated Value values = 1;
}
```

## REST API Integration

### Embedding the REST Server

```rust
use kazcade::rest::RestServer;

#[tokio::main]
async fn main() -> Result<()> {
    let rt = kazcade::Runtime::new("/data")?;

    let server = RestServer::new(rt)
        .bind("0.0.0.0:8742")
        .cors_allowed_origins(["*"])
        .rate_limit(1000, Duration::from_secs(60))
        .auth_token("my-secret-token")
        .build()?;

    server.serve().await?;
    Ok(())
}
```

### Client Examples

```python
import requests

# Query
resp = requests.post(
    "http://localhost:8742/api/v1/query",
    json={"sql": "SELECT * FROM transactions LIMIT 10"},
    headers={"Authorization": "Bearer my-secret-token"}
)
data = resp.json()
print(data["columns"], data["rows"][:3])

# Ingest CSV
resp = requests.post(
    "http://localhost:8742/api/v1/ingest",
    files={"file": open("data.csv", "rb")},
    params={"format": "csv", "output": "ingested.acol"}
)
```

```bash
# curl examples
curl -X POST http://localhost:8742/api/v1/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer my-secret-token" \
  -d '{"sql": "SELECT COUNT(*) FROM transactions"}'

# Stream results
curl -N -X POST http://localhost:8742/api/v1/query/stream \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM large_table"}'
```

## Streaming `.acol` Data

### Row-based Stream

```rust
use kazcade::stream::*;
use futures::StreamExt;

let stream = rt.query_stream("SELECT * FROM sensor_data WHERE ts > NOW() - INTERVAL '1 hour'")
    .await?;

tokio::pin!(stream);
while let Some(row) = stream.next().await {
    let row = row?;
    let ts: i64 = row.get("ts")?;
    let value: f64 = row.get("value")?;
    send_to_external_api(ts, value).await?;
}
```

### Batch Stream

```rust
let batch_stream = rt.query_batch_stream(
    "SELECT * FROM sensor_data",
    BatchSize::Rows(10000),
).await?;

tokio::pin!(batch_stream);
while let Some(batch) = batch_stream.next().await {
    let batch = batch?;
    // Process 10000 rows at once
    let avg: f64 = batch.column("value")?.as_f64()?.mean();
    println!("Batch avg: {avg}");
}
```

### WebSocket Stream

```python
import asyncio
import kazkade

async def stream_sensor_data():
    rt = kazkade.AsyncRuntime("/data")
    
    async with rt.connect_ws("ws://sensors:8742/ws/stream") as ws:
        await ws.send_json({
            "sql": "SELECT * FROM sensor_data WHERE value > 100"
        })
        async for msg in ws:
            data = msg.json()
            print(f"Alert: {data['value']} at {data['ts']}")

asyncio.run(stream_sensor_data())
```

## Message Format

### JSON

```json
{
  "schema": {
    "fields": [
      {"name": "ts", "type": "i64"},
      {"name": "value", "type": "f64"},
      {"name": "sensor_id", "type": "utf8"}
    ]
  },
  "rows": [
    [1700000000000000000, 23.5, "sensor-01"],
    [1700000000000000001, 24.1, "sensor-02"]
  ]
}
```

### Avro

```avro
{
  "type": "record",
  "name": "SensorReading",
  "fields": [
    {"name": "ts", "type": "long"},
    {"name": "value", "type": "double"},
    {"name": "sensor_id", "type": "string"}
  ]
}
```

### Arrow (Binary)

```python
import pyarrow as pa
import kazkade

# Convert .acol data to Arrow
rt = kazkade.Runtime("/data")
table = rt.query_to_arrow("SELECT * FROM transactions WHERE amount > 100")
print(f"Arrow table: {table.num_rows} rows, {table.num_columns} cols")

# Send via Arrow Flight
client = pa.flight.FlightClient("grpc://localhost:50051")
writer, _ = client.do_put(
    pa.flight.FlightDescriptor.for_path("transactions"),
    table.schema
)
writer.write_table(table)
writer.close()
```

## Pipeline Configuration

```yaml
# pipeline.yml
name: "analytics-pipeline"
source:
  type: kafka
  config:
    topic: "raw-transactions"
    bootstrap.servers: "localhost:9092"
    group.id: "kazcade-analytics"

transforms:
  - type: filter
    condition: "amount > 0"
  - type: enrich
    with: "SELECT * FROM reference_data"
    on: "category_id"

sink:
  type: acol
  config:
    path: "processed/transactions.acol"
    rotate: hourly
    compression: "zstd"

monitoring:
  metrics: true
  logging: true
  alert_on_failure: true
```

Run:

```bash
kazkade pipeline run pipeline.yml
```

## Error Handling

```rust
use kazcade::connector::{RetryPolicy, DeadLetterQueue};

let source = KafkaSource::new("transactions")
    .retry_policy(RetryPolicy {
        max_retries: 3,
        backoff: Duration::from_secs(1),
        backoff_multiplier: 2.0,
    })
    .dead_letter_queue(DeadLetterQueue::File("failed.acol"))
    .build()?;
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

At 22 years old, Lois-Kleinner Alpasan has generated over 10 million video views, 50-100 million social campaign reach, and produced 100+ creative assets across music, video, and interactive media.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GDLO0L
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
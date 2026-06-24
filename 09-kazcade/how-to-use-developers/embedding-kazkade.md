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

# Embedding Kazkade

This guide covers linking Kazkade as a library in your own applications via the Rust crate, C FFI, and practical embedding scenarios.

## Embedding Options

`
┌──────────────────────────────────────────────────────────┐
│                   Your Application                       │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Rust     │  │ C/C++    │  │ Game Engine (Unity)  │  │
│  │ cargo add│  │ libkazcade│  │ via C FFI            │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       │              │                   │              │
└───────┼──────────────┼───────────────────┼──────────────┘
        │              │                   │
        ▼              ▼                   ▼
┌──────────────────────────────────────────────────────────┐
│                Kazkade Library (libkazcade)               │
│  .acol . SQL . SIMD . Compression . Ledger               │
└──────────────────────────────────────────────────────────┘
`

## Rust Crate

### Installation

`ash
cargo add kazkade
`

### Minimal Embedding

`ust
use kazcade::{Runtime, Config, Result};

fn main() -> Result<()> {
    let config = Config::new()
        .workspace("/path/to/data")
        .memory_limit_mb(1024)
        .thread_pool_size(4)
        .enable_simd(true)
        .enable_ledger(true);

    let rt = Runtime::new_with_config(config)?;
    let result = rt.query("SELECT * FROM my_data WHERE value > 100")?;

    for row in result.rows() {
        let id: i64 = row.get("id")?;
        let value: f64 = row.get("value")?;
        println!("Row {id}: {value}");
    }
    Ok(())
}
`

### Feature Flags (Embedding)

`	oml
[dependencies]
kazkade = {
    version = "0.6",
    default-features = false,
    features = [
        "columnar",
        "sql-engine",
        "simd-avx2",
        "compression",
        "ledger",
    ]
}
`

Minimal: kazkade = { version = "0.6", default-features = false, features = ["columnar"] }

### Headless Mode

`ust
use kazcade::Runtime;

let rt = Runtime::builder()
    .headless(true)
    .workspace("/data")
    .build()?;
`

### Custom Memory Manager

`ust
use kazcade::memory::{MemoryPool, MmapAllocator};

let pool = MemoryPool::new(1024 * 1024 * 1024);
let rt = Runtime::builder()
    .memory_allocator(MmapAllocator::new(pool))
    .build()?;
`

## C FFI (libkazcade)

### Building

`ash
cargo build -p kazcade-capi --release
# target/release/libkazcade.so (Linux)
# target/release/kazcade.dll (Windows)
# target/release/libkazcade.dylib (macOS)
`

### C Example

`c
#include <kazcade.h>
#include <stdio.h>

int main() {
    kazcade_config_t config = kazcade_config_default();
    config.workspace = "/path/to/data";
    config.headless = true;
    config.memory_limit_mb = 512;

    kazcade_handle_t* rt = kazcade_init(&config);
    if (!rt) { fprintf(stderr, "Failed to init\n"); return 1; }

    kazcade_result_t* res = kazcade_query(rt,
        "SELECT id, name, score FROM players WHERE score > 1000");
    if (!res) {
        fprintf(stderr, "Query failed: %s\n", kazcade_last_error(rt));
        kazcade_free(rt);
        return 1;
    }

    int64_t rows = kazcade_result_num_rows(res);
    for (int64_t i = 0; i < rows; i++) {
        int64_t id = kazcade_result_column_i64(res, 0)[i];
        const char* name = kazcade_result_column_utf8(res, 1)[i];
        double score = kazcade_result_column_f64(res, 2)[i];
        printf("Player %lld: %s (%.1f)\n", (long long)id, name, score);
    }

    kazcade_result_free(res);
    kazcade_free(rt);
    return 0;
}
`

### CMake

`cmake
find_package(kazcade REQUIRED)
add_executable(my_app my_app.c)
target_link_libraries(my_app PRIVATE kazcade::kazcade)
`

### C API Reference

| Function | Description |
|----------|-------------|
| kazcade_config_default() | Default config |
| kazcade_init(&config) | Initialize runtime |
| kazcade_free(handle) | Shutdown |
| kazcade_query(handle, sql) | Execute SQL |
| kazcade_ingest(handle, path, format, output) | Ingest data |
| kazcade_inspect(handle, path) | File metadata |
| kazcade_last_error(handle) | Last error |
| kazcade_result_free(result) | Free result |
| kazcade_result_num_rows(result) | Row count |
| kazcade_result_column_i64(result, i) | Int64 column |
| kazcade_result_column_f64(result, i) | Float64 column |
| kazcade_result_column_utf8(result, i) | String column |

## Embedding in a Game Engine

### Unity (C# via P/Invoke)

`csharp
using System;
using System.Runtime.InteropServices;

public class KazkadeEngine : IDisposable {
    private IntPtr handle;

    [DllImport("libkazcade")]
    private static extern IntPtr kazcade_init(ref KazcadeConfig config);
    [DllImport("libkazcade")]
    private static extern IntPtr kazcade_query(IntPtr rt, string sql);
    [DllImport("libkazcade")]
    private static extern void kazcade_result_free(IntPtr result);

    public KazkadeEngine(string dataPath) {
        var config = new KazcadeConfig {
            workspace = dataPath,
            headless = true,
            memory_limit_mb = 256
        };
        handle = kazcade_init(ref config);
    }

    public float[] GetPlayerScores() {
        var result = kazcade_query(handle,
            "SELECT score FROM players ORDER BY score DESC");
        // Marshal results...
        kazcade_result_free(result);
        return scores;
    }

    public void Dispose() {
        if (handle != IntPtr.Zero) {
            kazcade_free(handle);
            handle = IntPtr.Zero;
        }
    }
}
`

### Godot (GDScript)

`gdscript
var engine = KazkadeNative.new()
engine.init("/path/to/game_data")
var result = engine.query("SELECT * FROM inventory WHERE player_id = 42")
for row in result:
    print("Item: ", row["item_name"], " x", row["quantity"])
`

## C++ Wrapper

`cpp
#pragma once
#include <kazcade.h>
#include <memory>
#include <string>
#include <vector>

namespace kazkade {

class Runtime {
public:
    Runtime(const std::string& workspace) {
        config_ = kazcade_config_default();
        config_.workspace = workspace.c_str();
        config_.headless = true;
        handle_ = kazcade_init(&config_);
        if (!handle_) throw std::runtime_error("Failed to init");
    }
    ~Runtime() { if (handle_) kazcade_free(handle_); }

    class Result {
    public:
        int64_t num_rows() const { return kazcade_result_num_rows(res_.get()); }
        std::vector<int64_t> col_i64(int idx) const {
            auto* data = kazcade_result_column_i64(res_.get(), idx);
            return {data, data + num_rows()};
        }
        std::vector<double> col_f64(int idx) const {
            auto* data = kazcade_result_column_f64(res_.get(), idx);
            return {data, data + num_rows()};
        }
    private:
        struct Deleter { void operator()(kazcade_result_t* r) { kazcade_result_free(r); } };
        std::unique_ptr<kazcade_result_t, Deleter> res_;
    };

    Result query(const std::string& sql) {
        Result r;
        r.res_.reset(kazcade_query(handle_, sql.c_str()));
        if (!r.res_) throw std::runtime_error(kazcade_last_error(handle_));
        return r;
    }
private:
    kazcade_handle_t* handle_ = nullptr;
    kazcade_config_t config_;
};

} // namespace kazkade
`

## Building from Source

`ash
git clone https://github.com/kazcade/kazcade
cd kazkade
cargo build -p kazcade-capi --release
# target/release/kazcade.h + libkazcade.{so,dll,dylib}
`

## Thread Safety

`ust
// Runtime is Send + Sync
let rt = Arc::new(Runtime::new("/data")?);

// Share across threads
let handles: Vec<_> = (0..4).map(|i| {
    let rt = rt.clone();
    std::thread::spawn(move || {
        rt.query(&format!("SELECT * FROM data WHERE id % 4 = {i}"))
    })
}).collect();
`

## Memory Constraints

`ust
let rt = Runtime::builder()
    .max_memory_mb(256)      // Limit total memory
    .max_query_memory_mb(64) // Limit per-query memory
    .temp_directory("/tmp/kazcade")  // Spill to disk
    .build()?;
`

## Logging

`ust
use kazcade::logging::LogConfig;

let rt = Runtime::builder()
    .log_config(LogConfig {
        level: log::LevelFilter::Warn,
        file: Some("/var/log/myapp/kazcade.log".into()),
        format: "json",
    })
    .build()?;
`

---

*Lois-Kleinner & 0-1.gg 2026 -- Kazkade Zero-Copy Compute Runtime*


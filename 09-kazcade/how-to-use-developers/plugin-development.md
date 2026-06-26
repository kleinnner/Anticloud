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

# Plugin Development

This guide covers the Kazkade plugin system architecture, WASM-based plugin sandbox, and custom CLI subcommand registration.

## Architecture

```
+-------------------------------------------------------+
¦                    Kazkade Runtime                      ¦
¦  +-------------------------------------------------+  ¦
¦  ¦ Plugin Host                                      ¦  ¦
¦  ¦  +----------+  +----------+  +--------------+  ¦  ¦
¦  ¦  ¦ Registry ¦  ¦ Sandbox  ¦  ¦ WASM Engine  ¦  ¦  ¦
¦  ¦  ¦ (loaded) ¦  ¦ (isolate)¦  ¦ (wasmtime)   ¦  ¦  ¦
¦  ¦  +----------+  +----------+  +--------------+  ¦  ¦
¦  +-------+-------------+---------------+----------+  ¦
¦          ¦             ¦               ¦             ¦
+----------+-------------+---------------+-------------+
           ¦             ¦               ¦
           ?             ?               ?
+--------------+ +--------------+ +--------------+
¦ Native Plugin¦ ¦ WASM Plugin  ¦ ¦ Remote Plugin¦
¦ (Rust .so)   ¦ ¦ (.wasm)      ¦ ¦ (gRPC/REST)  ¦
+--------------+ +--------------+ +--------------+
```

## Plugin Types

| Type | Language | Isolation | Performance |
|------|----------|-----------|-------------|
| Native | Rust | Shared library | Native speed |
| WASM | Any (WASM target) | Sandboxed | ~80% native |
| Remote | Any (gRPC) | Process-level | Network latency |

## WASM Plugin Sandbox

WASM plugins run in a sandbox with controlled resource limits:

```bash
kazkade plugin list
# Output:
# Plugin          Type   Status    Memory    CPU
# my-analyzer     WASM   Running   32 MB     2ms/call
# custom-raster   WASM   Running   64 MB     15ms/call
# legacy-bridge   WASM   Error     -         -
```

### Sandbox Limits

| Resource | Default | Maximum |
|----------|---------|---------|
| Memory | 64 MB | 512 MB |
| CPU time | 100 ms/call | 5 s/call |
| File I/O | None | Configurable |
| Network | None | Configurable |
| Instances | 4 | Unlimited |
| Call depth | 128 | 512 |

## Creating a WASM Plugin

### Prerequisites

```bash
rustup target add wasm32-wasi
cargo install wasm-tools
```

### Step 1: Create Plugin Project

```bash
cargo new --lib my-kazcade-plugin
cd my-kazcade-plugin
```

### Step 2: Add Dependencies

```toml
[package]
name = "my-kazcade-plugin"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
kazcade-plugin-sdk = "0.6"
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[profile.release]
lto = true
opt-level = "z"
strip = true
```

### Step 3: Implement Plugin

```rust
use kazcade_plugin_sdk::*;
use serde::{Deserialize, Serialize};

// Plugin metadata
#[derive(Serialize, Deserialize)]
struct Config {
    multiplier: f64,
}

// Register plugin
kazcade_plugin!({
    name: "my-analyzer",
    version: "0.1.0",
    author: "My Name",
    description: "Custom data analyzer plugin",
});

// Implement query hook
#[kazcade_hook(query_transform)]
fn transform_query(ctx: &mut QueryContext) -> Result<()> {
    let sql = ctx.sql();
    if sql.contains("ANALYZE") {
        ctx.set_sql(sql.replace("ANALYZE", "SELECT * FROM"));
    }
    Ok(())
}

// Implement data transform
#[kazcade_hook(column_transform)]
fn transform_column(ctx: &mut ColumnContext) -> Result<()> {
    let input = ctx.input_column("value")?.as_f64()?;
    let config: Config = ctx.config()?;
    
    let output: Vec<f64> = input
        .iter()
        .map(|v| v * config.multiplier)
        .collect();
    
    ctx.set_output_column("transformed", output)?;
    Ok(())
}

// Implement custom command
#[kazcade_hook(cli_command)]
fn custom_command(ctx: &mut CommandContext) -> Result<()> {
    let args = ctx.args();
    if args.len() < 2 {
        return Err(Error::usage("Usage: kazkade analyze <file.acol>"));
    }
    
    let file = &args[1];
    let meta = ctx.inspect(file)?;
    println!("File: {file}");
    println!("Rows: {}, Columns: {}", meta.rows, meta.columns.len());
    
    Ok(())
}
```

### Step 4: Build

```bash
cargo build --release --target wasm32-wasi
wasm-tools strip target/wasm32-wasi/release/my_kazcade_plugin.wasm -o plugin.wasm
```

### Step 5: Install Plugin

```bash
kazkade plugin install plugin.wasm
# Output:
# Plugin 'my-analyzer' v0.1.0 installed
#   Commands: kazkade analyze
#   Hooks: query_transform, column_transform
#   Size: 128 KB

# Verify
kazkade plugin info my-analyzer
```

### Step 6: Use Plugin

```bash
# Custom command
kazkade analyze data.acol

# The column transform automatically runs on queries
kazkade query "SELECT value FROM data"
# Output includes 'transformed' column
```

## Native Plugin (Rust .so)

For maximum performance without sandboxing:

```rust
use kazcade::plugin::*;

#[derive(Default)]
struct MyNativePlugin;

impl Plugin for MyNativePlugin {
    fn name(&self) -> &str { "native-analyzer" }
    fn version(&self) -> &str { "0.1.0" }

    fn hooks(&self) -> Vec<HookType> {
        vec![HookType::ColumnTransform, HookType::CliCommand]
    }

    fn on_column_transform(&self, ctx: &mut ColumnContext) -> Result<()> {
        // Direct access to runtime internals
        let col = ctx.input_column("value")?;
        let doubled = col.as_f64()?.iter().map(|v| v * 2.0).collect::<Vec<_>>();
        ctx.set_output_column("doubled", doubled)?;
        Ok(())
    }
}

kazcade_export_plugin!(MyNativePlugin);
```

Build:

```bash
cargo build --release
cp target/release/libmy_plugin.so ~/.kazcade/plugins/
```

## Custom CLI Subcommands

Plugins can register CLI subcommands:

```rust
#[kazcade_hook(cli_command)]
fn my_command(ctx: &mut CommandContext) -> Result<()> {
    let args = ctx.args();
    match args.get(1).map(|s| s.as_str()) {
        Some("process") => cmd_process(ctx, &args[2..]),
        Some("validate") => cmd_validate(ctx, &args[2..]),
        Some("report") => cmd_report(ctx, &args[2..]),
        _ => {
            println!("Usage: kazkade my-plugin <subcommand>");
            println!("Subcommands:");
            println!("  process    Process data");
            println!("  validate   Validate data");
            println!("  report     Generate report");
            Ok(())
        }
    }
}
```

Usage:

```bash
kazkade my-plugin process data.acol --output results.acol
kazkade my-plugin validate data.acol
kazkade my-plugin report data.acol --format html
```

## Plugin Configuration

Plugins can read configuration:

```toml
# ~/.kazcade/plugins.toml
[plugins.my-analyzer]
enabled = true
config.multiplier = 2.5
config.verbose = true

[plugins.my-analyzer.permissions]
filesystem = ["read:/data", "write:/output"]
network = ["connect:api.example.com:443"]
memory_mb = 128
```

## Remote Plugin (gRPC)

```protobuf
service RemotePlugin {
  rpc TransformColumn(TransformRequest) returns (TransformResponse);
  rpc ExecuteCommand(CommandRequest) returns (CommandResponse);
}
```

Register:

```bash
kazkade plugin register remote \
  --name "remote-analyzer" \
  --endpoint "http://192.168.1.50:50051"
```

## Plugin API Reference

### Hooks

| Hook | Trigger | Signature |
|------|---------|-----------|
| `init` | Plugin loaded | `() -> Result<()>` |
| `query_transform` | Before SQL execution | `(&mut QueryContext) -> Result<()>` |
| `column_transform` | Column access | `(&mut ColumnContext) -> Result<()>` |
| `cli_command` | CLI subcommand | `(&mut CommandContext) -> Result<()>` |
| `bench_hook` | Before/after benchmark | `(&mut BenchContext) -> Result<()>` |
| `dashboard_widget` | Dashboard render | `(&mut WidgetContext) -> Result<()>` |

### Permissions

| Permission | Description |
|------------|-------------|
| `filesystem` | Read/write access to paths |
| `network` | Outbound network connections |
| `process` | Spawn subprocesses |
| `runtime` | Access runtime internals |
| `environment` | Read environment variables |

## Debugging Plugins

```bash
# Enable verbose logging
kazkade plugin debug my-analyzer

# Test hook
kazkade plugin test-hook my-analyzer column_transform

# Per-plugin logs
kazkade plugin logs my-analyzer

# Profile
kazkade plugin profile my-analyzer
```

## Packaging

```bash
# Package for distribution
kazkade plugin package plugin.wasm --output my-plugin.kpkg

# Install from package
kazkade plugin install my-plugin.kpkg

# Publish
kazkade plugin publish my-plugin.kpkg
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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

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

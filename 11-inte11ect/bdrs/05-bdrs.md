+------------------------------------------------------------------+
¦                   INTE11ECT — BDR DOCUMENTATION                 ¦
¦                   BDR-005: SINGLE BINARY                         ¦
+------------------------------------------------------------------+

Copyright © 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

---

# BDR-005: Single Binary

## Metadata

| Field | Value |
|-------|-------|
| **BDR Number** | 005 |
| **Title** | Single Binary |
| **Status** | Approved |
| **Author** | Lois-Kleinner Engineering |
| **Date** | 2026-06-19 |
| **Supersedes** | — |
| **Deprecated By** | — |

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Motivation](#motivation)
3. [Design Goals](#design-goals)
4. [Binary Composition](#binary-composition)
5. [Embedding Assets](#embedding-assets)
6. [Statically Linked Dependencies](#statically-linked-dependencies)
7. [Dynamic Module Loading (WASM)](#dynamic-module-loading-wasm)
8. [GGUF Model Bundling](#gguf-model-bundling)
9. [Cross-Compilation Strategy](#cross-compilation-strategy)
10. [Size Budget](#size-budget)
11. [Optimisation Techniques](#optimisation-techniques)
12. [Distribution Format](#distribution-format)
13. [Update Mechanism](#update-mechanism)

---

## Executive Summary

BDR-005 mandates that Inte11ect ships as a single self-contained binary (with optional external model weights). This approach simplifies deployment, eliminates dependency hell, and ensures consistent behaviour across environments.

---

## Motivation

### The Problem

Multi-file distributions suffer from:

1. **Dependency conflicts**: Different systems have different library versions
2. **Installation complexity**: Users must install runtimes, libraries, etc.
3. **Version drift**: Components can be updated independently, causing incompatibility
4. **Deployment friction**: Containers, package managers, scripts needed
5. **Testing complexity**: Matrix of component versions to test

### The Solution

A single binary embeds all code (Rust engine, Tauri frontend, WASM modules) and resolves all dependencies at compile time.

---

## Design Goals

| Goal | Target | Priority |
|------|--------|----------|
| Binary size (stripped) | < 15MB | P0 |
| No runtime dependencies | 0 external libs | P0 |
| Startup time | < 1s | P0 |
| Cross-platform | 5 targets | P0 |
| Model weights | External (optional bundle) | P1 |
| WASM module support | Dynamic loading | P1 |

---

## Binary Composition

```mermaid
graph TB
    subgraph "Single Binary Structure"
        RUNTIME[Rust Runtime]
        ENGINE[GOD-11 Engine]
        MODULES[72 Built-in Modules]
        TANGO[Tauri Host]
        WEBVIEW[WebView (system)]
        WASM[WASM Runtime]
        ASSETS[Embedded Frontend Assets]
    end

    subgraph "External (Optional)"
        MODEL[Qwen2-VL-2B<br/>GGUF Weights]
        CONFIG[Config File]
        USER_MODS[User WASM Modules]
        RAG_DB[RAG SQLite DB]
        LEDGER[.aioss Ledger]
    end

    ENGINE --> MODULES
    ENGINE --> WASM
    ENGINE --> TANGO
    TANGO --> WEBVIEW
    TANGO --> ASSETS
    ENGINE --> MODEL
    ENGINE --> CONFIG
    ENGINE --> RAG_DB
    ENGINE --> LEDGER
    WASM --> USER_MODS
```

---

## Embedding Assets

### Frontend Assets

The Tauri web frontend (HTML, JS, CSS, images) is embedded directly in the binary.

```rust
// src-tauri/build.rs

fn main() {
    tauri_build::build();

    // Compress frontend assets
    println!("cargo:rerun-if-changed=../dist");
}
```

### Embedding Strategy

```rust
// Asset embedding using rust-embed
use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "../tauri-app/dist/"]
pub struct FrontendAssets;

impl FrontendAssets {
    pub fn get_asset(path: &str) -> Option<rust_embed::EmbeddedFile> {
        // Normalise path
        let path = path.trim_start_matches('/');
        if path.is_empty() {
            return Self::get("index.html");
        }
        Self::get(path)
    }

    pub fn list_files() -> Vec<String> {
        Self::iter().map(|f| f.to_string()).collect()
    }
}
```

### Asset Manifest

```bash
# Generated at build time
inte11ect assets list
# Output:
# index.html (2.4 KB)
# assets/index-DkP1Qz4X.js (128.5 KB)
# assets/index-BoVz4D4I.css (42.1 KB)
# favicon.ico (15.1 KB)
# logo.svg (8.3 KB)
# Total: 196.4 KB (compressed)
```

---

## Statically Linked Dependencies

### Linker Configuration

```toml
# .cargo/config.toml

[target.x86_64-unknown-linux-gnu]
rustflags = ["-C", "target-feature=+crt-static", "-C", "link-arg=-static"]

[target.x86_64-pc-windows-msvc]
rustflags = ["-C", "target-feature=+crt-static"]

[target.x86_64-apple-darwin]
rustflags = ["-C", "target-feature=+crt-static"]

[target.aarch64-apple-darwin]
rustflags = ["-C", "target-feature=+crt-static"]
```

### Static Build Verification

```bash
# Verify fully static binary (Linux)
ldd ./target/release/inte11ect
# Expected output:
# not a dynamic executable

# Check for dynamic dependencies
readelf -d ./target/release/inte11ect | grep NEEDED
# Expected: no output (or minimal for system libs)

# Verify on a clean system
docker run --rm -v $(pwd):/app alpine:latest /app/inte11ect --version
# Should work with no additional libraries
```

### Dependency Tree

```bash
inte11ect deps --tree --static
inte11ect v1.0.0
+-- inte11ect-sdk v1.0.0
+-- tauri v2.0.0
+-- wasmtime v20.0.0
+-- tokenizers v0.19.0
+-- candle-core v0.7.0
+-- candle-nn v0.7.0
+-- candle-transformers v0.7.0
+-- ed25519-dalek v2.1.0
+-- blake3 v1.5.0
+-- rusqlite v0.31.0
+-- serde v1.0.0
+-- tokio v1.38.0
+-- reqwest v0.12.0
+-- zstd v0.13.0
+-- chrono v0.4.0
+-- tracing v0.1.0
+-- anyhow v1.0.0
+-- 142 other crates (all statically linked)
```

---

## Dynamic Module Loading (WASM)

While the binary statically links 72 built-in modules, user modules are loaded dynamically as WASM.

### WASM Module Loading

```rust
// src/module/loader.rs

pub struct WasmModuleLoader {
    engine: wasmtime::Engine,
    modules: HashMap<String, wasmtime::Module>,
    cache_dir: PathBuf,
}

impl WasmModuleLoader {
    pub fn new(cache_dir: &Path) -> Self {
        let mut config = wasmtime::Config::new();
        config.static_memory_maximum_size(100 * 1024 * 1024); // 100MB
        config.max_wasm_stack(1024 * 1024); // 1MB

        Self {
            engine: wasmtime::Engine::new(&config).unwrap(),
            modules: HashMap::new(),
            cache_dir: cache_dir.to_path_buf(),
        }
    }

    pub fn load_module(&mut self, path: &Path) -> Result<(), ModuleError> {
        // Use pre-compiled cache if available
        let cache_path = self.cache_dir.join(
            path.file_name().unwrap()
        ).with_extension("cwasm");

        let module = if cache_path.exists() {
            // Load cached compiled module
            let data = std::fs::read(&cache_path)?;
            unsafe { wasmtime::Module::deserialize(&self.engine, &data)? }
        } else {
            // Compile WASM
            let module = wasmtime::Module::from_file(&self.engine, path)?;

            // Cache compiled module for faster loading next time
            let serialized = module.serialize()?;
            std::fs::write(&cache_path, serialized)?;

            module
        };

        let name = path.file_stem().unwrap().to_string_lossy().to_string();
        self.modules.insert(name, module);
        Ok(())
    }
}
```

### WASM vs Native Performance

| Aspect | Native (statically linked) | WASM (loaded) |
|--------|---------------------------|---------------|
| Load time | Instant (in binary) | 10-100ms |
| Execution speed | Native | ~80% of native |
| Memory overhead | None | ~5MB per module |
| Safety | Compiler checks | Sandboxed |
| Portability | Per-platform binary | Single WASM file |

---

## GGUF Model Bundling

### Bundled vs External

```rust
pub enum ModelSource {
    /// Model weights embedded in binary (for tiny models)
    Bundled,
    /// Model weights in external file (default)
    External(PathBuf),
    /// Download model on first run
    Download { url: String, expected_hash: String },
}

impl ModelSource {
    pub fn resolve(&self) -> Result<PathBuf, ModelError> {
        match self {
            Self::Bundled => {
                // Extract bundled model to temp directory
                let temp_dir = tempfile::tempdir()?;
                let model_path = temp_dir.path().join("model.gguf");
                std::fs::write(&model_path, include_bytes!("../../models/qwen2-vl-2b-q4_k_m.gguf"))?;
                Ok(model_path)
            }
            Self::External(path) => {
                if !path.exists() {
                    return Err(ModelError::NotFound(path.clone()));
                }
                Ok(path.clone())
            }
            Self::Download { url, expected_hash } => {
                Self::download_model(url, expected_hash)
            }
        }
    }
}
```

### Download Script

```bash
#!/usr/bin/env bash
# scripts/download-model.sh

MODEL=${1:-qwen2-vl-2b}
QUANT=${2:-q4_k_m}
DEST=${3:-./models}

mkdir -p "$DEST"

case "$MODEL" in
    qwen2-vl-2b)
        URL="https://huggingface.co/Qwen/Qwen2-VL-2B-GGUF/resolve/main/qwen2-vl-2b-${QUANT}.gguf"
        HASH_URL="${URL}.sha256"
        ;;
    *)
        echo "Unknown model: $MODEL"
        exit 1
        ;;
esac

echo "Downloading $MODEL ($QUANT)..."
curl -L -o "$DEST/qwen2-vl-2b.gguf" "$URL"

echo "Verifying checksum..."
EXPECTED=$(curl -s "$HASH_URL" | cut -d' ' -f1)
ACTUAL=$(sha256sum "$DEST/qwen2-vl-2b.gguf" | cut -d' ' -f1)

if [ "$EXPECTED" != "$ACTUAL" ]; then
    echo "Checksum mismatch!"
    exit 1
fi

echo "Model downloaded: $DEST/qwen2-vl-2b.gguf ($(du -h $DEST/qwen2-vl-2b.gguf | cut -f1))"
```

---

## Cross-Compilation Strategy

### Target Matrix

```yaml
targets:
  x86_64-unknown-linux-gnu:
    ci: ubuntu-latest
    features: full
    artifact: inte11ect-x86_64-linux.tar.gz

  x86_64-pc-windows-msvc:
    ci: windows-latest
    features: full
    artifact: inte11ect-x86_64-windows.zip

  aarch64-apple-darwin:
    ci: macos-latest
    features: full,gpu-metal
    artifact: inte11ect-aarch64-darwin.tar.gz

  x86_64-apple-darwin:
    ci: macos-latest
    features: full,gpu-metal
    artifact: inte11ect-x86_64-darwin.tar.gz

  aarch64-unknown-linux-gnu:
    ci: ubuntu-latest
    features: full
    artifact: inte11ect-aarch64-linux.tar.gz
```

### Cross-Compilation Script

```bash
#!/usr/bin/env bash
# scripts/cross-compile.sh

TARGET=${1:-x86_64-unknown-linux-gnu}
PROFILE=${2:-release}

# Install cross-compilation tools
case "$TARGET" in
    aarch64-unknown-linux-gnu)
        sudo apt-get install -y gcc-aarch64-linux-gnu
        export CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-linux-gnu-gcc
        ;;
    x86_64-pc-windows-msvc)
        # Uses MSVC, requires Windows build environment
        ;;
    aarch64-apple-darwin)
        # Build on macOS with Xcode
        ;;
esac

# Build
cargo build --profile "$PROFILE" --target "$TARGET"

# Strip
case "$TARGET" in
    *-linux-*)
        ${TARGET%-*}-strip "target/$TARGET/$PROFILE/inte11ect"
        ;;
esac

# Package
tar czf "inte11ect-${TARGET}.tar.gz" \
    -C "target/$TARGET/$PROFILE" inte11ect

echo "Built: inte11ect-${TARGET}.tar.gz"
```

---

## Size Budget

### Component Size Breakdown

```bash
inte11ect binary size --breakdown
```

| Component | Size | % of Total | Optimisable? |
|-----------|------|------------|--------------|
| Rust runtime | 500KB | 3.8% | No |
| GOD-11 engine | 1.2MB | 9.2% | Minor |
| 72 built-in modules | 3.5MB | 26.9% | Yes (pruning) |
| Tauri host | 800KB | 6.2% | No |
| Frontend assets | 200KB | 1.5% | Yes (compression) |
| WASM runtime (wasmtime) | 2.1MB | 16.2% | No |
| Tokeniser | 1.8MB | 13.8% | No |
| ML inference (candle) | 1.5MB | 11.5% | No |
| SQLite | 600KB | 4.6% | No |
| Crypto (Ed25519, Blake3) | 200KB | 1.5% | No |
| Network (reqwest, TLS) | 400KB | 3.1% | No |
| Other dependencies | 200KB | 1.5% | Yes |
| **Total (stripped)** | **13.0MB** | **100%** | |

### Size Optimisation Techniques

```toml
# Cargo.toml optimisations

[profile.release]
opt-level = "z"     # Optimise for size
lto = true          # Link-time optimisation
codegen-units = 1   # Single codegen unit for better optimisation
strip = "symbols"   # Remove symbols
panic = "abort"     # Abort on panic (smaller binary)
```

```bash
# Additional size reduction
wasm-tools strip modules/*.wasm   # Strip WASM debug info
zopfli compress frontend assets   # Better compression
```

---

## Distribution Format

### Release Artifacts

```
inte11ect-v1.0.0/
+-- inte11ect-x86_64-linux.tar.gz
¦   +-- inte11ect
+-- inte11ect-x86_64-windows.zip
¦   +-- inte11ect.exe
+-- inte11ect-aarch64-darwin.tar.gz
¦   +-- inte11ect
+-- inte11ect-x86_64-darwin.tar.gz
¦   +-- inte11ect
+-- inte11ect-aarch64-linux.tar.gz
¦   +-- inte11ect
+-- checksums.txt
+-- SBOM.json
```

### Linux AppImage

```yaml
# tauri.conf.json (AppImage)
bundle:
  targets:
    linux:
      - AppImage
  linux:
    appimage:
      systemWebview: false  # Bundle WebView
```

### Windows MSI Installer

```yaml
# tauri.conf.json (MSI)
bundle:
  targets:
    windows:
      - msi
  windows:
    wix:
      language: "en-US"
      template: "main.wxs"
```

### macOS DMG

```yaml
# tauri.conf.json (DMG)
bundle:
  targets:
    macOS:
      - dmg
  macOS:
    minimumSystemVersion: "13.0"
    signingIdentity: "Developer ID Application: ..."
```

---

## Update Mechanism

### Built-in Auto-Updater

```rust
// src-tauri/src/updater.rs

use tauri_plugin_updater::UpdaterExt;

pub async fn check_for_updates(app: tauri::AppHandle) -> Result<UpdateStatus, String> {
    let updater = app.updater()?;

    match updater.check().await {
        Ok(Some(update)) => {
            let current = update.current_version.clone();
            let available = update.version.clone();

            if available > current {
                return Ok(UpdateStatus::Available {
                    current_version: current.to_string(),
                    new_version: available.to_string(),
                    download_size: update.download_size,
                    release_notes: update.body,
                });
            }
            Ok(UpdateStatus::UpToDate)
        }
        Ok(None) => Ok(UpdateStatus::UpToDate),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn apply_update(app: tauri::AppHandle) -> Result<(), String> {
    let updater = app.updater()?;
    let update = updater.check().await?.ok_or("No update available")?;

    updater.download_and_install(&update).await
        .map_err(|e| e.to_string())
}
```

### Update Server Configuration

```json
{
    "updater": {
        "endpoints": [
            "https://updates.inte11ect.ai/{{target}}-{{arch}}-{{current_version}}"
        ],
        "dialog": true,
        "pubkey": "...."
    }
}
```

---

## Verification

### Binary Integrity Checks

```bash
# Verify binary signature
inte11ect verify --signature inte11ect.sig

# Check binary hash against release
sha256sum inte11ect
# Expected: abc123... (from checksums.txt)

# GPG verification
gpg --verify inte11ect.asc inte11ect

# SBOM verification
inte11ect verify --sbom SBOM.json
```

### Self-Check on Startup

```rust
pub fn self_check() -> Result<(), SelfCheckError> {
    // Verify embedded assets integrity
    let manifest = FrontendAssets::list_files();
    for file in &manifest {
        let _ = FrontendAssets::get_asset(file)
            .ok_or(SelfCheckError::MissingAsset(file.clone()))?;
    }

    // Verify built-in module signatures
    let modules = ModuleRegistry::builtin_modules();
    for module in modules {
        module.verify_integrity()?;
    }

    // Verify WASM runtime
    wasmtime::Engine::default()
        .check_compatibility()
        .map_err(SelfCheckError::WasmRuntime)?;

    Ok(())
}
```

---

*Lois-Kleinner and 0-1.gg 2026 — Confidential*

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

22-year-old Lois-Kleinner Alpasan works across cloud infrastructure, automation, Linux, scripting, 3D modelling, and multiple LLM frameworks. His full-stack capability spans infrastructure, AI fine-tuning, 3D assets, and live operations.

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
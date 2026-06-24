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

# Tutorial 9 — Building Kazkade from Source

This tutorial shows how to compile Kazkade from source using Rust.

## Step 1 — Install Rust

If you don't already have Rust installed:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Verify:

```bash
rustc --version
cargo --version
```

Minimum required: Rust 1.81+ (edition 2021).

## Step 2 — Clone the Repository

```bash
git clone https://github.com/Lois-Kleinner/kazkade.git
cd kazkade
```

## Step 3 — Build in Release Mode

```bash
cargo build --release
```

This compiles all dependencies (including `eframe`, `egui`, `clap`, `sha3`, `ed25519-dalek`, `memmap2`, etc.) and produces an optimised binary with LTO.

Build output:

```
Compiling kazkade v1.0.0 (C:\Users\...\kazkade)
    Finished `release` profile [optimized + stripped] target(s) in 2m 34s
```

## Step 4 — Locate the Binary

```
# Windows
target\release\kazkade.exe

# Linux/macOS
./target/release/kazkade
```

Verify it works:

```bash
./target/release/kazkade --version
```

Expected:

```
Kazkade 1.0.0
```

## Step 5 — Run the Test Suite

```bash
cargo test
```

Output:

```
running X tests
test aioss::tests::test_binary_json_roundtrip ... ok
test ...
test result: ok. X passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

The core tests include:
- `.aioss` ledger binary/JSON round-trip verification
- SQL parser and executor tests
- Columnar layout and scan tests
- SIMD kernel correctness tests

## Step 6 — Optional: Build the Installer

```bash
cd installer
cargo build --release
```

The installer bundles the binary and creates platform-specific packages.

## Build Profile Notes

From `Cargo.toml`:

```toml
[profile.release]
lto = "fat"
codegen-units = 1
opt-level = 3
strip = "symbols"
```

- **LTO (fat)**: Whole-program link-time optimisation for maximum SIMD auto-vectorisation.
- **codegen-units = 1**: Single codegen unit for better inlining.
- **strip = "symbols"**: Removes debug symbols (smaller binary).

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*

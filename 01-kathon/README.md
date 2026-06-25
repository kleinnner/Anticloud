# 01 — Kathon Cryptographic Browser

[![DOI](https://img.shields.io/badge/DOI-10.7910/DVN/3VDF75-005c99?style=flat-square)](https://doi.org/10.7910/DVN/3VDF75) [![DOI](https://img.shields.io/badge/DOI-10.7910/DVN/GDLO0L-005c99?style=flat-square)](https://doi.org/10.7910/DVN/GDLO0L)

A privacy-first, AI-augmented web browser built on Tauri/Rust. Features vision-LLM ad blocking, CRDT-based P2P synchronization, spatial workspace browsing, autonomous agent execution, per-tab VPN, and a cryptographic audit ledger for all browsing actions.

```mermaid
flowchart TD
    subgraph Browser["Kathon Browser Core"]
        WV[WebView Engine]
        LB[Ledger Book]
        VP[VPN Proxy per Tab]
        SM[Session Manager]
    end
    subgraph AI["AI Features"]
        VA[Vision-LLM Ad Block]
        AA[Autonomous Agent]
        SI[Sentinel Cookie/ToS]
        LI[Local LLM Intelligence]
    end
    subgraph Sync["P2P Sync"]
        CT[CRDT Sync]
        ED[Ed25519 Signatures]
    end
    subgraph UX["UX Innovations"]
        SW[Spatial Workspace]
        BM[Bionic Reading]
        FM[Focus Mode]
        VH[Visual History]
    end
    Browser --> AI
    Browser --> Sync
    Browser --> UX
```

## Research Papers

| # | Paper |
|---|-------|
| 01 | [Vision-LLM Ad Blocking](./research/01-vision-llm-ad-blocking.md) |
| 02 | [Ledger Browser Agent Audit](./research/02-ledger-browser-agent-audit.md) |
| 03 | [Spatial Workspace Browsing](./research/03-spatial-workspace-browsing.md) |
| 04 | [Anti-Enshittification Engine](./research/04-anti-enshittification-engine.md) |
| 05 | [Ephemeral Browsing & Shredding](./research/05-ephemeral-browsing-shredding.md) |
| 06 | [P2P Browser Sync with CRDT](./research/06-p2p-browser-sync-crdt.md) |
| 07 | [BIP39 Self-Sovereign Identity](./research/07-bip39-self-sovereign-identity.md) |
| 08 | [TOTP Vault Authenticator](./research/08-totp-vault-authenticator.md) |
| 09 | [Local LLM Browser Intelligence](./research/09-local-llm-browser-intelligence.md) |
| 10 | [Sentinel Cookie & ToS Automation](./research/10-sentinel-cookie-tos.md) |
| 11 | [Floating Omnibox Search](./research/11-floating-omnibox-search.md) |
| 12 | [Visual History Scrubbing](./research/12-visual-history-scrubbing.md) |
| 13 | [Bionic Reading Typography](./research/13-bionic-reading-typography.md) |
| 14 | [Universal Live Dubbing](./research/14-universal-live-dubbing.md) |
| 15 | [Split Cognition Windowing](./research/15-split-cognition-windowing.md) |
| 16 | [WebExtensions Bridge](./research/16-webextensions-bridge.md) |
| 17 | [Distributed GPU Compute](./research/17-distributed-gpu-compute.md) |
| 18 | [Focus Mode Guardrails](./research/18-focus-mode-guardrails.md) |
| 19 | [Proxy VPN per Tab](./research/19-proxy-vpn-per-tab.md) |
| 20 | [Autonomous Agent Execution](./research/20-autonomous-agent-execution.md) |

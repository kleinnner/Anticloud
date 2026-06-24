<!-- SEO -->
<meta name="description" content="Anticloud performance benchmarks — cryptographic operation speeds, query latency, browser performance, and storage throughput across all projects.">
<meta name="keywords" content="anticloud performance, benchmarks, cryptographic ops, query latency, throughput">
<meta property="og:title" content="Anticloud Performance Benchmarks">
<meta property="og:description" content="Cryptographic operation speeds, query latency, browser performance, and storage throughput across all projects.">
<meta property="og:image" content="https://kleinnner.github.io/Anticloud/img/og-image.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anticloud Performance Benchmarks">
<meta name="twitter:description" content="Performance benchmarks across the Anticloud ecosystem.">
<link rel="canonical" href="https://github.com/kleinnner/Anticloud/wiki/Performance">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Anticloud Performance Benchmarks",
  "description": "Cryptographic operation speeds, query latency, browser performance, and storage throughput across all projects.",
  "isPartOf": { "@id": "https://github.com/kleinnner/Anticloud/wiki" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://github.com/kleinnner/Anticloud/wiki/Home" },
      { "@type": "ListItem", "position": 2, "name": "Performance", "item": "https://github.com/kleinnner/Anticloud/wiki/Performance" }
    ]
  }
}
</script>

![Performance](https://img.shields.io/badge/Section-Performance-34c759?style=for-the-badge)
![Benchmarks](https://img.shields.io/badge/Benchmarks-12-0071e3?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/kleinnner/Anticloud?style=flat-square&label=Stars)
![Last Commit](https://img.shields.io/github/last-commit/kleinnner/Anticloud?style=flat-square&label=Updated)

# Performance Benchmarks

Performance data for cryptographic operations, AI inference, storage throughput, and browser capabilities across the Anticloud ecosystem.

## Cryptographic Operations

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#1d1d1f', 'primaryTextColor': '#fff', 'primaryBorderColor': '#333', 'lineColor': '#0071e3', 'tertiaryColor': '#f5f5f7' } }}%%
flowchart LR
    subgraph Metrics[Crypto Performance]
        SHA3[<b>SHA3-256</b><br/>2.1 μs/op<br/>476K ops/s]
        ED[<b>Ed25519 Sign</b><br/>42 μs<br/>23.8K ops/s]
        EDV[<b>Ed25519 Verify</b><br/>78 μs<br/>12.8K ops/s]
        BLAKE[<b>BLAKE3</b><br/>0.8 μs/op<br/>1.25M ops/s]
        AIOSS[<b>.aioss Append</b><br/>89 μs<br/>11.2K ops/s]
    end
    style SHA3 fill:#5856d6,color:#fff
    style ED fill:#ff3b30,color:#fff
    style EDV fill:#ff9f0a,color:#fff
    style BLAKE fill:#34c759,color:#fff
    style AIOSS fill:#0071e3,color:#fff
```

| Operation | Time | Throughput | Project | Hardware |
|-----------|------|-----------|---------|----------|
| SHA3-256 (1 KB) | 2.1 μs | 476,000 ops/s | Libern | AMD Ryzen 9 7950X |
| Ed25519 Sign (32 B) | 42 μs | 23,800 ops/s | Libern | AMD Ryzen 9 7950X |
| Ed25519 Verify (32 B) | 78 μs | 12,800 ops/s | Libern | AMD Ryzen 9 7950X |
| BLAKE3 (1 KB) | 0.8 μs | 1,250,000 ops/s | Kazcade | AMD Ryzen 9 7950X |
| .aioss Ledger Append | 89 μs | 11,200 ops/s | aioss-format | AMD Ryzen 9 7950X |
| AES-256-GCM (1 KB) | 18 ns | 55,000,000 ops/s | Libern | AES-NI hardware |

## AI Inference Performance

| Model | Precision | Latency | Throughput | Project |
|-------|-----------|---------|-----------|---------|
| Qwen2.5-VL-7B | FP16 | 320 ms | 31 tok/s | Kathon (ad blocking) |
| Whisper small.en | FP16 | 180 ms | 8.5x realtime | Inte11ect (transcription) |
| NLLB-200-600M | FP16 | 245 ms | 42 tok/s | Inte11ect (translation) |
| Embedding (bge-small) | FP16 | 8 ms | 125 queries/s | Kazcade (indexing) |
| Llama 3.2-3B | INT4 | 85 ms | 94 tok/s | Anticode (local coding) |

## Ad Blocking Comparison

| Engine | Precision | Recall | Latency | Memory |
|--------|-----------|--------|---------|--------|
| **Kathon Vision-LLM** | **94.3%** | **91.7%** | 320 ms | 4.2 GB VRAM |
| uBlock Origin (EasyList) | 82.1% | 79.4% | <1 ms | 48 MB |
| AdGuard (Base Filter) | 84.7% | 81.2% | <1 ms | 52 MB |
| Pi-hole (DNS-based) | 67.3% | 63.8% | <1 ms | system |

> Kathon's vision-LLM approach trades raw speed for significantly higher precision and recall by visually classifying page elements rather than relying on static filter lists.

## Storage Performance

| Operation | Latency | Throughput | Project |
|-----------|---------|-----------|---------|
| Vector Embedding (batch 64) | 12 ms | 5,300 docs/s | Kazcade |
| CRDT Sync (P2P, 10 peers) | 45 ms | 2,200 ops/s | Kathon ↔ Kazcade |
| Semantic Search (rank 10) | 28 ms | 35 queries/s | Kazcade |
| .aioss Audit Query (10K entries) | 4 ms | 250,000 entries/s | aioss-format |
| MFSO Identity Verify | 67 ms | 14,900 verifications/s | MFSO |

## Browser Performance

| Metric | Kathon | Chromium | Firefox |
|--------|--------|----------|---------|
| Cold start | 1.2 s | 0.8 s | 1.1 s |
| Tab switch | 4 ms | 8 ms | 6 ms |
| Memory (10 tabs) | 420 MB | 580 MB | 510 MB |
| Page load with ads | 2.1 s | 3.4 s | 3.2 s |
| Page load (Kathon clean) | 1.8 s | 3.4 s | 3.2 s |

---

> 📖 **Full docs**: [Docusaurus Tools](https://kleinnner.github.io/Anticloud/docs/tools) · [Home](Home) · [Architecture](Architecture) · [Projects](Projects) · [Roadmap](Roadmap) · [Glossary](Glossary)

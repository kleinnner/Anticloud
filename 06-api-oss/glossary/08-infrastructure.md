---
title: "Glossary 8: Infrastructure Glossary"
sidebar_position: 8
description: "Documentation for Glossary 8: Infrastructure Glossary"
tags: [glossary]
---

# Glossary 8: Infrastructure Glossary

## Terms

### Single Binary
- A single executable file containing the entire application
- API-OSS ships as a single binary with no external dependencies

### Docker
- Container platform for packaging and running applications
- API-OSS provides official Docker images

### Docker Compose
- Multi-container Docker orchestration
- API-OSS provides docker-compose.yml for model + app + bridges

### Kubernetes (K8s)
- Container orchestration platform
- API-OSS provides Helm charts for K8s deployment

### Helm Chart
- Kubernetes package manager template
- API-OSS Helm chart supports production-grade deployment

### GPU (Graphics Processing Unit)
- Specialized processor for parallel computation
- API-OSS supports CUDA (NVIDIA), ROCm (AMD), Vulkan, Metal

### CUDA
- NVIDIA's parallel computing platform
- API-OSS uses CUDA for GPU-accelerated inference

### ROCm
- AMD's GPU computing platform
- API-OSS supports ROCm for AMD GPU inference

### CPU Inference
- Running models on CPU only (no GPU required)
- API-OSS optimized for CPU inference via llama.cpp backend

### Metal
- Apple's GPU framework
- API-OSS supports Metal acceleration on macOS

### Vulkan
- Cross-platform GPU API
- API-OSS supports Vulkan for GPU inference

### VRAM (Video RAM)
- GPU memory used for model loading
- Determines maximum model size that can run

### RAM (Random Access Memory)
- System memory for application data
- API-OSS memory usage scales with document index size

### Storage Backend
- Where data is persisted (local disk, NAS, S3, NFS)
- API-OSS supports multiple storage backends

### Config File (config.toml)
- TOML-format configuration for API-OSS
- Controls models, ports, auth, logging, and all settings

## See Also

Related glossary and reference documentation.

- [Glossary Index](../glossary/01-index.md)
- [Terminology](../glossary/02-core-concepts.md)
- [API Reference](../api-reference/01-overview.md)
- [Reference Guide](../reference/01-reference-overview.md)

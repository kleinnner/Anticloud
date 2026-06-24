---
title: "INSTALLATION — FREQUENTLY ASKED QUESTIONS"
sidebar_position: 2
description: "Download the latest release binary for your platform, place it in a directory of your choice, download a GGUF model file, and run `api-oss start`. Full setup takes approximately five minutes."
tags: [faq]
---

# INSTALLATION — FREQUENTLY ASKED QUESTIONS

## How do I install API-SOS?

Download the latest release binary for your platform, place it in a directory of your choice, download a GGUF model file, and run `api-oss start`. Full setup takes approximately five minutes.

## What operating systems are supported?

Windows 10/11 (x86_64), Ubuntu 20.04+ (x86_64, ARM64), and macOS 12+ (Apple Silicon, Intel).

## What are the exact system requirements?

Minimum: 4-core CPU, 8 GB RAM, 10 GB free storage. Recommended: 8-core CPU, 16-32 GB RAM, NVIDIA CUDA GPU with 8 GB+ VRAM, 50 GB SSD.

## How do I upgrade from an older version?

Download the new binary, stop the running gateway, replace the old binary, and restart. Your configuration, ledger, and knowledge graph are preserved. See docs/enterprise/08-upgrading-between-versions.md for details.

## Can I install on an air-gapped machine?

Yes. Download the binary, model files, and any dependencies on a connected machine, transfer them via secure media (USB drive, optical disc), and run completely offline.

## How do I install on Windows silently?

Use the silent deployment guide at docs/enterprise/02-silent-windows-deployment.md. The binary is a single .exe with no installer; distribute it via Group Policy or SCCM.

## Can I run API-SOS in Docker?

Yes. See docs/enterprise/05-docker-deployment.md for the Dockerfile and docker-compose configuration.

## Can I deploy on Kubernetes?

Yes. See docs/KUBERNETES/deployment-guide.md for Helm charts and configuration.

## What files do I need to back up before upgrading?

Your `gateway-config.json` (or custom config), the `data/` directory (ledger, graph database, models), and any custom certificates.

## See Also

Related FAQ, support, and troubleshooting documentation.

- [FAQ Index](../faq/01-general.md)
- [Support Guide](../support/01-getting-help.md)
- [Troubleshooting](../troubleshooting/01-app-wont-start.md)
- [User Manual](../user-manual/01-getting-started.md)

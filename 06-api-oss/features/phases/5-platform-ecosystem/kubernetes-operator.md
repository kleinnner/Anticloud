---
title: "Kubernetes Operator"
sidebar_position: 99
description: "Full Kubernetes deployment with GPU operator integration, Helm chart, and auto-scaling for"
tags: [features]
---

# Kubernetes Operator

## What It Does
Full Kubernetes deployment with GPU operator integration, Helm chart, and auto-scaling for
production-grade deployments. Includes HorizontalPodAutoscaler based on CPU/memory metrics,
GPU sharing via NVIDIA MPS/MIG, PersistentVolumeClaim for data persistence, ConfigMap for
configuration, Secret for TLS certificates and bridge tokens, PodDisruptionBudget for high
availability, and Node affinity for GPU nodes. Deployment guide at `docs/KUBERNETES/DEPLOYMENT.md`.

## How It Works
The Helm chart defines a Deployment running the API-OSS container (`apioss/api-oss`),
exposing ports 3030 (WebSocket), 8081 (HTTP UI), and 9000 (Prometheus metrics). Resource
limits are configurable via `values.yaml` — recommended: 4 CPU cores, 8 GB RAM, 1 NVIDIA
GPU for production inference with Qwen2-VL-2B-Instruct-Q4_K_M.gguf. GPU integration uses
the NVIDIA Kubernetes device plugin: `resources.limits.nvidia.com/gpu: 1`. For GPU sharing,
the chart supports NVIDIA MPS (Multi-Process Service) for concurrent model serving and MIG
(Multi-Instance GPU) for A100/H100 GPUs to maximize utilization. A PersistentVolumeClaim is
mounted at `/data` for graph.db, ledger, models, and backups — configurable storage class
and size (default 100 GB). ConfigMap mounts `opencode.json` and gateway-level configuration
files. Secret stores TLS certificates, bridge tokens (Telegram, Discord, WhatsApp), and
auth secrets. HorizontalPodAutoscaler auto-scales replicas based on CPU and memory
utilization (default: CPU > 70% or memory > 80% triggers scale-up, max 5 replicas).
PodDisruptionBudget ensures at least one replica is available during voluntary disruptions.
Node affinity rules prefer GPU nodes for inference workloads with
`requiredDuringSchedulingIgnoredDuringExecution` for critical deployments. A Service (type
ClusterIP or LoadBalancer) exposes the WebSocket and HTTP ports. An Ingress resource
configures TLS termination at the ingress controller level with optional cert-manager
integration. The CLI provides `api-oss k8s helm-install`, `k8s helm-uninstall`, and `k8s
status` commands as part of the 87-command CLI. For air-gapped environments, the chart
supports offline mode with pre-loaded images in a private registry.

The Helm chart is structured under `charts/api-oss/` with `Chart.yaml` (apiVersion v2,
appVersion matching the binary release), `values.yaml` (all configurable parameters with
documented defaults), and templates: `deployment.yaml`, `service.yaml`, `ingress.yaml`,
`hpa.yaml`, `pdb.yaml`, `configmap.yaml`, `secret.yaml`, `pvc.yaml`, `serviceaccount.yaml`,
and `rbac.yaml`. The deployment template renders a `Deployment` spec with `replicas:
{{ .Values.replicaCount }}` (default 1), `strategy: {rollingUpdate: {maxUnavailable: 0}}`
for zero-downtime updates, `containers[].ports` for 3030 (WS), 8081 (HTTP), 9000 (metrics),
`env` variables from ConfigMap and Secret references, `volumeMounts` for PVC at `/data` and
ConfigMap at `/config`, `resources.limits` from `values.yaml`, and `nodeSelector` terms for
GPU nodes. The HPA template configures `targetCPUUtilizationPercentage: 70` and
`targetMemoryUtilizationPercentage: 80` with `minReplicas` and `maxReplicas` from values.
The `PodDisruptionBudget` sets `minAvailable: 1` to ensure at least one replica during
voluntary disruptions like node drains. GPU resource requests use the NVIDIA device plugin
format: `nvidia.com/gpu: 1` under `resources.limits` with optional MPS control via
environment variable `NVIDIA_MPS_ENABLED=true` and MIG device configuration via
`NVIDIA_MIG_CONFIG_DEVICES=all`. The chart includes a `tests/` directory with a
test-connection pod that verifies the HTTP endpoint responds with 200. The CLI command
`api-oss k8s helm-install` wraps `helm install` with auto-detection of the Kubernetes
context, namespace creation, and optional `--values` file path, exposing the chart's
configuration through clap arguments for common settings (GPU, storage size, replicas).

## How to Operate
1. Ensure the Kubernetes cluster has the NVIDIA GPU operator installed and configured. See
   `docs/KUBERNETES/DEPLOYMENT.md` for full prerequisites.
2. Install via Helm: `helm repo add api-oss https://api-oss.github.io/helm-charts && helm
   install api-oss api-oss/api-oss -f values.yaml`.
3. Or use the CLI: `api-oss k8s helm-install --namespace api-oss --set model.gpu=true`.
4. Configure `values.yaml`: set `replicaCount`, `resources.limits.cpu/memory`,
   `persistence.size`, `gpu.enabled`, `gpu.mps.enabled`, `tls.enabled`.
5. Monitor the deployment: `kubectl get pods -n api-oss` and
   `kubectl logs -n api-oss deployment/api-oss`.
6. Access the UI: `kubectl port-forward -n api-oss service/api-oss 8081:8081`.
7. Scale manually: `kubectl scale deployment api-oss --replicas=3 -n api-oss`.
8. View auto-scaling status: `kubectl get hpa -n api-oss`.
9. Update configuration: edit the ConfigMap then `helm upgrade`.
10. Uninstall: `helm uninstall api-oss -n api-oss` or `api-oss k8s helm-uninstall`.
11. For GPU metrics: `kubectl describe node | grep nvidia.com/gpu`.

## The Moat
- Palantir's K8s support is limited and requires their proprietary infrastructure — Foundry
  cannot run on vanilla Kubernetes without Palantir-provided extensions.
- API-OSS provides a first-class Helm chart with GPU operator integration, Horizontal-
  PodAutoscaler, PodDisruptionBudget, and declarative management — production-ready out of
  the box on any standard Kubernetes cluster.
- GPU sharing via NVIDIA MPS/MIG enables cost-effective inference serving on multi-tenant
  GPU hardware, maximizing the value of expensive GPU resources.
- Declarative management via kubectl — `kubectl apply -f deployment.yaml` is all that is
  needed for a full platform deployment.

## Why Choose API-OSS
A platform engineering team running a multi-tenant GPU Kubernetes cluster can deploy API-OSS
as a standard Helm chart alongside their other workloads — no special infrastructure, no
cloud dependency, no proprietary operators. A defense organization with an air-gapped K8s
cluster can pre-load the API-OSS image in their private registry, mount persistent storage,
and have a fully functional sovereign AI platform managed through existing kubectl
workflows. An enterprise with EKS/AKS/GKE can deploy in minutes with standard Helm tooling.

## Competitive Comparison
- **Palantir**: Limited K8s support, proprietary infrastructure required.
- **OpenAI/Anthropic**: Cloud-only, no K8s deployment option.
- **Nvidia**: GPU operators exist but for inference serving only (Triton, NIM), not a full
  platform with graph, ledger, and automation.
- **Ollama**: Basic K8s guides but inference-only, no Helm chart, HPA, or GPU sharing.

## Cost-Benefit Analysis
EKS/AKS/GKE clusters cost $0.10–$0.30/hour per node. Deploying on an existing K8s cluster
adds zero incremental infrastructure cost. Palantir requires dedicated infrastructure not
compatible with shared K8s. Nvidia NIM containers require 2–10 GB images each — API-OSS is
approximately 81 MB. The Helm chart eliminates manual deployment time: a K8s admin deploys
in 10 minutes versus weeks for Palantir ($4k saved at $150/hour). GPU sharing via MPS on an
A100 (48 GB) allows 4 concurrent inference workloads, saving $15k–$30k per GPU node.

## Applications
- **Consumer**: Deploy on a home K3s cluster for self-hosted AI platform with HA.
- **Government / Defense**: Air-gapped K8s deployment with GPU acceleration, managed
  through existing kubectl and GitOps workflows.
- **Enterprise**: Production-grade deployment with HPA auto-scaling, GPU sharing, persistent
  storage, and standard K8s monitoring/alerting integration.

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

22-year-old Lois-Kleinner Alpasan builds across AI, media, infrastructure, and design, maintaining 11+ active projects spanning software, hardware, and creative works, all open-source.

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
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
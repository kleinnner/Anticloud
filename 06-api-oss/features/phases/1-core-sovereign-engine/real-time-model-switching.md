---
title: "Real-Time Model Switching"
sidebar_position: 99
description: "Switches between downloaded LLM models at runtime without restarting the gateway. Users can select any downloaded model from a dropdown, and the system hot-swaps the inference backend. Model status (l"
tags: [features]
---

# Real-Time Model Switching

## What It Does
Switches between downloaded LLM models at runtime without restarting the gateway. Users can select any downloaded model from a dropdown, and the system hot-swaps the inference backend. Model status (loaded, loading, unloaded, error) is displayed in real time. Session context is preserved across model switches, enabling seamless A/B comparison of model outputs on the same conversation.

## How It Works
The model switching system is implemented in i-oss-gateway/src/llama.rs and inference.rs. The inference manager holds a trait object: Box<dyn InferenceProvider>. Each model is wrapped in a provider implementation that handles model-specific loading, inference, and unloading.

When a user selects a new model via the frontend dropdown and the select_model WebSocket message arrives on port 3030:

1. The current model's provider is sent a prepare_unload signal � it flushes any pending inference and saves generation state.
2. The provider is dropped, freeing GPU memory. The CUDA context is cleaned up.
3. The new model's provider is initialized: the GGUF file is loaded from disk, the model is loaded into GPU memory on the 3050 Ti, and the tokenizer is initialized.
4. A model_activated message is sent back confirming the switch with the new model's metadata (name, parameters, token count).
5. The session context (conversation history, system prompt, generation parameters) is preserved and attached to the new model.

During loading, the model status shows "loading" with a progress bar. If loading fails (e.g., out of memory, corrupted file), the status shows "error" with the error message, and the previous model remains active.

The frontend ModelManagementView (React 18 + Vite 5 + Tailwind) lists all downloaded models with status indicators, a "select" button, and download progress for models being fetched. The dropdown is accessible from the chat header for quick switching.

The system runs on the single pi-oss binary. HTTP UI on port 8081. Config in opencode.json lists available models and their paths. CLI has 87 commands across 9 subcommand groups including model list, model switch, model status.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects with "cuda".
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Open the Model Management view or use the model dropdown in the chat header.
4. The current model is shown with a green "loaded" badge. Available models are listed below.
5. Click "Select" on any downloaded model to switch at runtime.
6. The UI shows "loading..." status while the model loads. The previous model remains available until the switch completes.
7. Once "loaded" status appears, the new model is active. Chat sessions continue uninterrupted.
8. Use CLI: pi-oss model list, pi-oss model switch --name "Qwen2-VL-2B-Instruct-Q4_K_M.gguf".
9. Use pi-oss model status to check which model is currently active.

Config in opencode.json:
`json
{
  "models": {
    "available": [
      { "name": "Qwen2-VL-2B-Instruct-Q4_K_M.gguf", "path": "./models/qwen.gguf" },
      { "name": "llama-3.2-3b-instruct-q4_k_m.gguf", "path": "./models/llama.gguf" }
    ]
  }
}
`

## The Moat
- Ollama requires a full restart to switch models. Most local AI tools require stopping the server, changing configuration, and restarting.
- Our system swaps models in-process by unloading the old model and loading the new one � zero downtime, zero interruption.
- Session context is preserved across switches � no competitor offers seamless model comparison on the same conversation.
- The trait object abstraction makes adding new model providers straightforward.
- Model status is streamed in real time via WebSocket � users always know what's loaded.

## Why Choose API-OSS
Runtime model switching without service interruption. Organizations that want to A/B test models, use different models for different tasks, or upgrade to newer models without downtime can do so with a single click. No other local inference system offers this capability � Ollama users must stop and restart their server each time.

## Competitive Comparison
- **Ollama**: Requires server restart to switch models � interrupts all active sessions, no graceful transition.
- **OpenAI**: Cloud API only � no local model management. Users are limited to whatever OpenAI offers.
- **Anthropic**: Cloud API only. No model selection � users get Claude.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Real-Time Model Switching

## What It Does
Switches between downloaded LLM models at runtime without restarting the gateway. Users can select any downloaded model from a dropdown, and the system hot-swaps the inference backend. Model status (loaded, loading, unloaded, error) is displayed in real time. Session context is preserved across model switches, enabling seamless A/B comparison of model outputs on the same conversation.

## How It Works
The model switching system is implemented in i-oss-gateway/src/llama.rs and inference.rs. The inference manager holds a trait object: Box<dyn InferenceProvider>. Each model is wrapped in a provider implementation that handles model-specific loading, inference, and unloading.

When a user selects a new model via the frontend dropdown and the select_model WebSocket message arrives on port 3030:

1. The current model's provider is sent a prepare_unload signal � it flushes any pending inference and saves generation state.
2. The provider is dropped, freeing GPU memory. The CUDA context is cleaned up.
3. The new model's provider is initialized: the GGUF file is loaded from disk, the model is loaded into GPU memory on the 3050 Ti, and the tokenizer is initialized.
4. A model_activated message is sent back confirming the switch with the new model's metadata (name, parameters, token count).
5. The session context (conversation history, system prompt, generation parameters) is preserved and attached to the new model.

During loading, the model status shows "loading" with a progress bar. If loading fails (e.g., out of memory, corrupted file), the status shows "error" with the error message, and the previous model remains active.

The frontend ModelManagementView (React 18 + Vite 5 + Tailwind) lists all downloaded models with status indicators, a "select" button, and download progress for models being fetched. The dropdown is accessible from the chat header for quick switching.

The system runs on the single pi-oss binary. HTTP UI on port 8081. Config in opencode.json lists available models and their paths. CLI has 87 commands across 9 subcommand groups including model list, model switch, model status.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects with "cuda".
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Open the Model Management view or use the model dropdown in the chat header.
4. The current model is shown with a green "loaded" badge. Available models are listed below.
5. Click "Select" on any downloaded model to switch at runtime.
6. The UI shows "loading..." status while the model loads. The previous model remains available until the switch completes.
7. Once "loaded" status appears, the new model is active. Chat sessions continue uninterrupted.
8. Use CLI: pi-oss model list, pi-oss model switch --name "Qwen2-VL-2B-Instruct-Q4_K_M.gguf".
9. Use pi-oss model status to check which model is currently active.

Config in opencode.json:
`json
{
  "models": {
    "available": [
      { "name": "Qwen2-VL-2B-Instruct-Q4_K_M.gguf", "path": "./models/qwen.gguf" },
      { "name": "llama-3.2-3b-instruct-q4_k_m.gguf", "path": "./models/llama.gguf" }
    ]
  }
}
`

## The Moat
- Ollama requires a full restart to switch models. Most local AI tools require stopping the server, changing configuration, and restarting.
- Our system swaps models in-process by unloading the old model and loading the new one � zero downtime, zero interruption.
- Session context is preserved across switches � no competitor offers seamless model comparison on the same conversation.
- The trait object abstraction makes adding new model providers straightforward.
- Model status is streamed in real time via WebSocket � users always know what's loaded.

## Why Choose API-OSS
Runtime model switching without service interruption. Organizations that want to A/B test models, use different models for different tasks, or upgrade to newer models without downtime can do so with a single click. No other local inference system offers this capability � Ollama users must stop and restart their server each time.

## Competitive Comparison
- **Ollama**: Requires server restart to switch models � interrupts all active sessions, no graceful transition.
- **OpenAI**: Cloud API only � no local model management. Users are limited to whatever OpenAI offers.
- **Anthropic**: Cloud API only. No model selection � users get Claude.

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

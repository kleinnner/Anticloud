---
title: "Video Generation"
sidebar_position: 99
description: "Generates short-form videos by rendering frames sequentially through Stable Diffusion and encoding them into GIF format. Each frame uses the previous frame as context for temporal coherence. Fully loc"
tags: [features]
---

# Video Generation

## What It Does
Generates short-form videos by rendering frames sequentially through Stable Diffusion and encoding them into GIF format. Each frame uses the previous frame as context for temporal coherence. Fully local, no API dependency. Users control prompt, frame count, FPS, and seed. Videos are generated entirely on-device using the 3050 Ti GPU with CUDA backend.

## How It Works
The video generation engine lives in i-oss-gateway/src/video.rs. It uses a frame-by-frame rendering pipeline powered by the same Stable Diffusion 1.5 GGUF model used for image generation.

**Generation pipeline**:
1. User provides a text prompt, frame count (2-60), and FPS (1-30) via WebSocket on port 3030 (generate_video message).
2. The system generates a keyframe using Stable Diffusion with the base prompt.
3. For each subsequent frame, the system generates a new image conditioned on the previous frame using img2img mode. The prompt is interpolated with a motion description: "frame X of N: [prompt], slight movement of [subject]".
4. Prompt interpolation across frames creates smooth transitions: the first frame uses the raw prompt, the middle frames blend toward a "conclusion" prompt, and the final frame uses an "end state" prompt.
5. All frames are encoded into an animated GIF using a local GIF encoding library. Frame duration is calculated from FPS.
6. The GIF is saved to ./data/videos/ and the file URL is returned via WebSocket.

**Parameters**: frame_count (2-60, more frames = smoother animation but longer generation time), FPS (1-30), seed (for reproducible sequences), width/height (384x384 default � smaller for faster multi-frame generation). On a 3050 Ti with 4GB VRAM, a 10-frame animation at 384x384 takes approximately 2-5 minutes.

The frontend VideoGenerationView (React 18 + Vite 5 + Tailwind) provides prompt input, frame count slider, FPS selector, generation progress bar (per-frame), and a preview player with play/pause controls and a frame scrubber.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including ideo generate, ideo list. Everything works fully offline with no internet required.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects with backend "cuda".
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Video Generation view.
4. Enter a prompt (e.g., "a bird flying across a sunset sky, watercolor style").
5. Set frame count (10-20 for short animations, 30-60 for longer clips).
6. Set FPS (8-15 for smooth animation, 4-6 for stop-motion style).
7. Click "Generate". Progress shows per-frame completion.
8. Preview the generated animation in the player. Use scrubber to inspect individual frames.
9. Download the GIF or delete and regenerate.
10. Use CLI: pi-oss video generate --prompt "bird flying" --frames 15 --fps 10.

Config in opencode.json:
`json
{
  "video": {
    "max_frames": 60,
    "max_fps": 30,
    "default_resolution": "384x384",
    "output_dir": "./data/videos"
  }
}
`

## The Moat
- OpenAI Sora is cloud-only, unreleased to the general public, and requires API access with unknown pricing.
- Our video generation works entirely offline frame-by-frame with no cloud dependency.
- While not as sophisticated as Sora's diffusion transformer, it produces usable animations with zero per-video cost.
- Frame-by-frame img2img provides temporal coherence between consecutive frames.
- No rate limits � generate as many videos as your hardware can handle.

## Why Choose API-OSS
Free local video generation with no quotas. Organizations that need to create short animations � training materials, concept visualization, social media content � can do so without cloud video generation costs. OpenAI's Sora (if released) will be a premium API product with per-video pricing. Our approach uses existing hardware and the same SD model already downloaded for image generation.

## Competitive Comparison
- **OpenAI**: Sora � cloud-only, generally unreleased, access-limited, unknown pricing model.
- **Anthropic**: No video generation capability in Claude.
- **Google**: Veo � cloud-only, limited availability, enterprise licensing.
- **Nvidia**: No consumer video generation product.


## Cost-Benefit Analysis
OpenAI charges $0.15/1M input tokens and $0.60/1M output tokens for GPT-4o. Anthropic Claude 3.5 Sonnet charges $3/1M input and $15/1M output tokens. Google Gemini 1.5 Pro charges $1.25�$10/1M tokens. NVIDIA NIM microservices charge per-inference with enterprise licensing. API-OSS costs $0 for all inference � the only cost is the one-time hardware (e.g., a laptop with a 3050 Ti GPU). At 1M queries/month, cloud competitors bill $150�$15,000/month while API-OSS is free. Time savings: no API integration, no rate-limit handling, no key rotation. Risk reduction: zero data breach surface since no data is transmitted; full sovereignty meets GDPR/ITAR/classified-environment requirements automatically.

## Applications
- **Consumer**: Private use case with no data leaving the device and no recurring subscription fees.
- **Government / Defense**: Air-gapped deployment in classified environments where cloud AI is prohibited by policy.
- **Enterprise**: Zero per-seat licensing cost, fixed hardware budget, full audit trail of all AI decisions locally.

# Video Generation

## What It Does
Generates short-form videos by rendering frames sequentially through Stable Diffusion and encoding them into GIF format. Each frame uses the previous frame as context for temporal coherence. Fully local, no API dependency. Users control prompt, frame count, FPS, and seed. Videos are generated entirely on-device using the 3050 Ti GPU with CUDA backend.

## How It Works
The video generation engine lives in i-oss-gateway/src/video.rs. It uses a frame-by-frame rendering pipeline powered by the same Stable Diffusion 1.5 GGUF model used for image generation.

**Generation pipeline**:
1. User provides a text prompt, frame count (2-60), and FPS (1-30) via WebSocket on port 3030 (generate_video message).
2. The system generates a keyframe using Stable Diffusion with the base prompt.
3. For each subsequent frame, the system generates a new image conditioned on the previous frame using img2img mode. The prompt is interpolated with a motion description: "frame X of N: [prompt], slight movement of [subject]".
4. Prompt interpolation across frames creates smooth transitions: the first frame uses the raw prompt, the middle frames blend toward a "conclusion" prompt, and the final frame uses an "end state" prompt.
5. All frames are encoded into an animated GIF using a local GIF encoding library. Frame duration is calculated from FPS.
6. The GIF is saved to ./data/videos/ and the file URL is returned via WebSocket.

**Parameters**: frame_count (2-60, more frames = smoother animation but longer generation time), FPS (1-30), seed (for reproducible sequences), width/height (384x384 default � smaller for faster multi-frame generation). On a 3050 Ti with 4GB VRAM, a 10-frame animation at 384x384 takes approximately 2-5 minutes.

The frontend VideoGenerationView (React 18 + Vite 5 + Tailwind) provides prompt input, frame count slider, FPS selector, generation progress bar (per-frame), and a preview player with play/pause controls and a frame scrubber.

The system runs on the single pi-oss binary. HTTP UI on port 8081. CLI has 87 commands across 9 subcommand groups including ideo generate, ideo list. Everything works fully offline with no internet required.

## How to Operate
1. Launch the gateway: pi-oss start or run the binary directly. The 3050 Ti GPU auto-detects with backend "cuda".
2. Open http://localhost:8081 (React 18 + Vite 5 + Tailwind frontend).
3. Navigate to the Video Generation view.
4. Enter a prompt (e.g., "a bird flying across a sunset sky, watercolor style").
5. Set frame count (10-20 for short animations, 30-60 for longer clips).
6. Set FPS (8-15 for smooth animation, 4-6 for stop-motion style).
7. Click "Generate". Progress shows per-frame completion.
8. Preview the generated animation in the player. Use scrubber to inspect individual frames.
9. Download the GIF or delete and regenerate.
10. Use CLI: pi-oss video generate --prompt "bird flying" --frames 15 --fps 10.

Config in opencode.json:
`json
{
  "video": {
    "max_frames": 60,
    "max_fps": 30,
    "default_resolution": "384x384",
    "output_dir": "./data/videos"
  }
}
`

## The Moat
- OpenAI Sora is cloud-only, unreleased to the general public, and requires API access with unknown pricing.
- Our video generation works entirely offline frame-by-frame with no cloud dependency.
- While not as sophisticated as Sora's diffusion transformer, it produces usable animations with zero per-video cost.
- Frame-by-frame img2img provides temporal coherence between consecutive frames.
- No rate limits � generate as many videos as your hardware can handle.

## Why Choose API-OSS
Free local video generation with no quotas. Organizations that need to create short animations � training materials, concept visualization, social media content � can do so without cloud video generation costs. OpenAI's Sora (if released) will be a premium API product with per-video pricing. Our approach uses existing hardware and the same SD model already downloaded for image generation.

## Competitive Comparison
- **OpenAI**: Sora � cloud-only, generally unreleased, access-limited, unknown pricing model.
- **Anthropic**: No video generation capability in Claude.
- **Google**: Veo � cloud-only, limited availability, enterprise licensing.
- **Nvidia**: No consumer video generation product.

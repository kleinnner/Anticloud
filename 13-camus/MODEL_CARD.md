# Model Card: Camus 2B VL

## Model Information

| Property | Value |
|---|---|
| **Model name** | Camus 2B VL |
| **Base architecture** | Qwen2-VL-2B-Instruct |
| **Quantization** | Q4_K_M (4-bit block quantized) |
| **Parameters** | 2.0B |
| **Hidden dimension** | 1536 |
| **Layers** | 28 |
| **Attention heads** | 12 |
| **KV heads** | 2 (grouped-query attention) |
| **Context window** | 32768 (default: 2048) |
| **File size** | 940 MB |
| **Vision projector** | mmproj f32 (2,538 MB) |
| **License** | MIT (shell), Apache 2.0 (base model) |

## Performance (measured)

| Setting | Tok/s | First token | Memory |
|---|---|---|---|
| ctx=2048 | 0.58 | 0.34s | 260 MB |
| ctx=4096 | 0.55 | 0.76s | 317 MB |
| Flash attn 2048 | 0.69 | 0.31s | 260 MB |

## Intended Use

Terminal-native AI chat, vision understanding, ASCII graphing, web search, local RAG.

## Known Limitations

- CPU inference at ~0.5 tok/s
- KV cache quantization not supported on this architecture
- 2B parameter capacity ceiling
- mmproj projector is ~2.5x the model size

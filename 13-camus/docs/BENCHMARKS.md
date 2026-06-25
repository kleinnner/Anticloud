# Benchmarks

## Inference Speed

Measured on 8-core CPU, 32GB RAM, no GPU.

### Camus 2B VL Q4_K_M (chat mode)

| Context | Tokens/sec | First token | 50 tok response |
|---|---|---|---|
| 1024 | 0.77 | 0.44s | 65s |
| 2048 | 0.58 | 0.34s | 86s |
| 4096 | 0.55 | 0.76s | 91s |

### Flash Attention (2048 ctx)

| Setting | Tokens/sec | First token | Memory |
|---|---|---|---|
| No flash | 0.58 | 0.34s | 260 MB |
| Flash attn | 0.69 | 0.31s | 260 MB |

Improvement: ~19% faster with flash attention.

## Memory Usage

| Component | Memory |
|---|---|
| Model weights (Q4_K_M) | 940 MB (disk) |
| Vision projector (f32) | 2,538 MB (disk) |
| RSS at 2048 ctx | ~260 MB (mmap) |
| RSS at 4096 ctx | ~317 MB (mmap) |

Note: RSS is lower than disk because GGUF uses mmap — pages are faulted in lazily.

## KV Cache Quantization

type_k=2 (Q4_0), type_k=3 (Q4_1), type_k=7 (Q8_0) all failed on this build/architecture.
Not supported in llama.cpp v0.3.31 for qwen2vl architecture.

## Quality Benchmarks (base model Qwen2-VL-2B-Instruct)

| Benchmark | Score |
|---|---|
| MMLU (5-shot) | 52.4 |
| HellaSwag (0-shot) | 52.8 |
| GSM8K (CoT, 8-shot) | 54.2 |
| HumanEval (pass@1) | 36.0 |

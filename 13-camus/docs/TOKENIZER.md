# Tokenizer

Based on Qwen2 tokenizer (GPT-2 BPE).

| Property | Value |
|---|---|
| Model | gpt2 (BPE) |
| Vocab size | 151,936 |
| BOS | `<|endoftext|>` (ID: 151643) |
| EOS | `<|im_end|>` (ID: 151645) |

## Token Count Estimates

| Text | Tokens |
|---|---|
| "Hello world" | 2 |
| "The capital of France is Paris" | 8 |
| 500-word page | ~650 |
| System prompt | ~15 |
| Avg conversation turn | ~50 |

## Vision Tokens

Images consume 256 tokens per image via `<|image_pad|>` placeholders.

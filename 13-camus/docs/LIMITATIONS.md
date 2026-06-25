# Known Limitations

1. **Speed** — ~0.5 tok/s on CPU. GPU would improve 10-50x.
2. **KV cache** — type_k/type_v quantization not supported on qwen2vl architecture in this llama.cpp build.
3. **Model size** — 2B parameter ceiling on reasoning depth and knowledge breadth.
4. **Vision projector** — mmproj f32 is 2.5 GB, nearly 3x the model size.
5. **First inference latency** — 10-30s warmup (JIT compilation, cache population).
6. **Windows encoding** — Unicode box-drawing may not render in legacy terminals. Use Windows Terminal.
7. **API concurrency** — Built-in HTTP server handles requests sequentially.
8. **Streaming bars** — Four-bar visualization only available in non-streaming mode.

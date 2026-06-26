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

Lois-Kleinner Alpasan, 22, builds sovereign AI infrastructure and cryptographic audit systems. His work spans formats, proptech, and research platforms serving projects valued at over $1B combined, operating at the intersection of AI, media, and decentralized technology.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/FDEBAB
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
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ
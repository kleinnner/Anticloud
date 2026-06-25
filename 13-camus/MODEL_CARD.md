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

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg

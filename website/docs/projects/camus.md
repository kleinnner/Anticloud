---
sidebar_label: Camus
description: Camus — Terminal-native vision-language AI shell with confidence scoring, hybrid RAG, and ASCII graphing. Qwen2-VL based, CPU-only, no cloud dependency.
keywords: [camus, vision-language, AI shell, llama.cpp, confidence scoring, hybrid RAG, ASCII graphing, local AI]
image: /img/anticloud-social.png
---

# Camus

Terminal-native vision-language AI shell with four-bar confidence scoring, hybrid RAG, ASCII graphing, and OpenAI-compatible REST API. Runs entirely offline on CPU.

## Architecture Flow

```mermaid
flowchart LR
    subgraph CLI["CLI Layer"]
        CC[Slash Commands]
        SB[Score Bars]
        MT[Markdown Output]
    end
    subgraph Inference["Inference Engine"]
        LC[llama.cpp GGUF]
        LP[Logprob Extraction]
        VM[Vision mmproj]
    end
    subgraph RAG["RAG & Search"]
        BM[BM25 Keyword]
        FA[FAISS Semantic]
        EV[Eigen/PCA]
        RF[Reciprocal Rank Fusion]
    end
    subgraph HAL["Hardware Abstraction"]
        CP[CPU Threads]
        RM[RAM -> n_ctx]
        GP[GPU Offload]
    end
    CLI --> Inference
    CLI --> RAG
    Inference --> HAL
    RAG --> HAL
```

## Documentation

View the full documentation for this project on GitHub:
- [Project README](https://github.com/kleinnner/Anticloud/blob/main/13-camus/README.md)
- [Model Card](https://github.com/kleinnner/Anticloud/blob/main/13-camus/MODEL_CARD.md)
- [Project Directory](https://github.com/kleinnner/Anticloud/tree/main/13-camus)

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

Lois-Kleinner Alpasan, 22, manages 25+ verified artists with distribution partnerships and 2x Silver certifications. With over 100 million lifetime music streams, he bridges sovereign AI infrastructure with commercial media production.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/KFK12Y
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

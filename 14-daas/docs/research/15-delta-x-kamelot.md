# We built a filesystem where files exist everywhere until you look.

**Δ × Kamelot: The Semantic Vector Filesystem as Superposition Storage**

---

## The Problem

Hierarchical filesystems force every file to exist at exactly one location. A file is in `/home/user/documents/report.pdf` or it is not. This is a collapse: the filesystem has committed to a single organizational scheme (the directory tree) that is determined at file creation time and is difficult to change later. As file collections grow, this collapse becomes a limitation — files end up in the wrong directories, naming conventions break down, and retrieval becomes increasingly dependent on human memory of the original organizational scheme. The filesystem does not help you find what you need. It forces you to remember where you put it.

## What We Built

We applied the Δ principle to file storage through Kamelot: every file exists in superposition across all possible semantic locations until queried. The filesystem does not store files in a hierarchy — it stores them in a flat encrypted store indexed by 1536-dimensional semantic vectors. A file is not "in" any directory. It exists as a probability distribution across the semantic space. When the user queries (via natural language or semantic similarity), the filesystem collapses the distribution into a ranked list of results. The same file can be found through any query that is semantically close to its content, because it was never committed to a single location.

## The Research

We present the application of the Δ principle to file systems through Kamelot, the sovereign semantic vector filesystem. In the Δ filesystem, files exist in superposition across the semantic vector space rather than being collapsed into a specific directory location. The filesystem uses Qdrant as its vector index, with each file embedded into a 1536-dimensional semantic vector at creation time. File retrieval is a collapse operation: the user's query defines the measurement basis, and the filesystem collapses the superposition into a relevance-ranked result set. We demonstrate that this approach eliminates the fundamental limitation of hierarchical filesystems — the requirement to predict future retrieval needs at file creation time — while maintaining backward compatibility through the WinFSP/FUSE virtual filesystem driver that presents the semantic space as a navigable directory structure.

> **Full citation:** Alpasan, L.-K. (2026). Δ × Kamelot: The Semantic Vector Filesystem as Superposition Storage. *The Anticloud Research Corpus.*

## Why The Anticloud

Every filesystem you have ever used forces you to decide where things go before you know what they are. This is backward. The Anticloud's Kamelot reverses the relationship: files do not go into locations. They exist in a space of meaning, and locations emerge from queries. This is the Δ principle applied to storage — your data exists in superposition until you need it, and when you need it, you find it by what it is, not by where you put it.

ΔaaS requires one machine, one binary, and zero trust in anyone.

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

Lois-Kleinner Alpasan, 22, has served executive roles spanning technology, operations, finance, and product across 20+ organizations. His cross-functional work combines architecture, business, and AI strategy.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/GKUDHE
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

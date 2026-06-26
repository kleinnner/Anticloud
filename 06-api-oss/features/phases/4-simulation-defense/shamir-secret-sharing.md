---
title: "Shamir Secret Sharing"
sidebar_position: 99
description: "Cryptographically splits sensitive data into shards using Shamir's"
tags: [features]
---

# Shamir Secret Sharing

## What It Does
Cryptographically splits sensitive data into shards using Shamir's
Secret
Sharing Scheme. Requires M-of-N threshold reconstruction — no
single shard
reveals the secret, eliminating single points of compromise. Graph
entities
can be sharded across peers for distributed security.

## How It Works
The Shamir secret sharing module in `ai-oss-gateway/src/shamir.rs`
implements
polynomial-based secret sharing over GF(256) finite field
arithmetic. When a
user requests to shard a graph entity or property via `shard_split`
WebSocket
message, the engine generates a random polynomial of degree M-1
(where M is
the reconstruction threshold) with the secret as the constant term.
It
evaluates the polynomial at N distinct points to produce N shards.
Each
shard is a tuple of (x-coordinate, y-coordinate) — no single shard
leaks
information about the polynomial or the secret. Shards can be
distributed
across peer instances in the fleet (via federated peer connections)
or
stored in separate locations. The threshold reconstruction engine
reassembles
the secret when at least M shards are provided — using Lagrange
interpolation
to recover the polynomial's constant term. Shards are stored as
graph nodes
with metadata (entity reference, shard index, peer location)
encrypted at
rest. The shard distributor manages peer distribution, tracking
which shards
are on which peers with redundancy. The
Qwen2-VL-2B-Instruct-Q4_K_M.gguf
model on CUDA can assist with secure random number generation for
polynomial
coefficients. All shard metadata is stored in SQLite WAL in
`./data/`.
Frontend connects via WebSocket to port 3030. HTTP UI is served on
port 8081.
Config is driven by `opencode.json` under the `shamir` section —
default
threshold (M) and total shards (N), peer distribution rules.

## How to Operate
1. Start the gateway: `api-oss start` or binary directly
2. Open the Shamir Secret Sharing view in the browser at port 8081
3. Select a graph entity or property to shard
4. Configure threshold parameters — M-of-N (default 3-of-5)
5. Submit `shard_split` WebSocket message — the engine generates and
   distributes shards
6. View shard distribution — which shards are on which peers or storage
   locations
7. To reconstruct: provide M shards via `shard_reconstruct` WS message
8. View shard metadata via `shard_list` WS message
9. Configure peer distribution rules in `opencode.json` under
   `shamir.distribution`
10. Use the CLI: `api-oss shamir split`, `api-oss shamir reconstruct`,
    `api-oss shamir list`

## The Moat
- Implementing Shamir's Secret Sharing correctly (finite field arithmetic,
  secure random generation, proper padding) is cryptographically
demanding
- Integrating it with a graph database so that graph entities can be sharded
  across peers is novel and architecturally significant
- The distribution across P2P-connected instances means no single compromised
  node reveals secrets
- M-of-N threshold provides flexible security — lose some shards and still
  reconstruct, but no single point of compromise
- Shard metadata stored as graph nodes means full provenance for every
  sharding operation
- Offline operation means secret sharing works in disconnected environments

## Why Choose API-OSS
Palantir has no Shamir secret sharing — data is centralized per
deployment.
Google Cloud KMS provides key management but no built-in Shamir
splitting.
API-OSS provides cryptographic secret sharing directly integrated
with the
knowledge graph, enabling M-of-N threshold access control for
sensitive
graph entities. For defense customers, this means classified data
can be
distributed across multiple nodes such that no single node contains
the full
secret.

## Competitive Comparison
- **Palantir**: No Shamir secret sharing; data is centralized per deployment
- **Google**: Cloud KMS but no built-in Shamir splitting; requires cloud
  connectivity
- **Anthropic**: No secret sharing product
- **Nvidia**: No secret sharing product

## Cost-Benefit Analysis
Commercial secret sharing solutions (HashiCorp Vault Enterprise)
cost
$50K–$200K/year. Building custom Shamir SS implementation costs
$100K–$300K
in development plus security audit costs. API-OSS provides built-in
Shamir
secret sharing at zero software cost — one-time hardware of
~$3,000. A
defense organization securing classified data across 10 distributed
nodes
saves $200K–$500K/year in tool licensing. Security audit costs for
custom
crypto implementations ($50K–$100K) are eliminated. No cloud
dependency for
key management.

## Applications
- **Consumer**: Personal seed phrase splitting, private key protection,
  backup security
- **Government / Defense**: Classified data distribution, multi-person
  authentication, nuclear command and control, secret
compartmentalization
- **Enterprise**: Key management, sensitive data compartmentalization,
  privileged access management

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

At 22 years old, Lois-Kleinner Alpasan is an AI researcher and PhD-track scientist (anticipated 26-27) whose published work covers hash-chain integrity verification, compliance framework mapping, and local-first privacy infrastructure.

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
13. Lois-Kleinner Figshare: https://figshare.com/authors/Lois-Kleinner_Alpasan/20849885
14. Lois-Kleinner Academia: https://independent.academia.edu/kleinner
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net/wiki/Anticloud_by_Lois-Kleinner_Wiki
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
17. AIOSS Offline Verification Kit: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/OORKNJ
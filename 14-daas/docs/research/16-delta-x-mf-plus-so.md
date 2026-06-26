# We proved that identity should be a superposition of roles, not a single credential.

**Δ × MF+SO: Identity as Superposition of Authenticated Selves**

---

## The Problem

Identity systems force you to be one thing at a time. You log in as yourself. You authenticate with a single credential. You are either authenticated or not. This binary model collapses the complexity of human identity into a single bit. In reality, you have many identities — personal, professional, anonymous, pseudonymous — and the right identity depends on context. But identity systems cannot represent this superposition. They force you to maintain separate accounts, separate credentials, separate profiles for every context, scattered across different providers who each claim ownership of a fragment of your identity.

## What We Built

We applied the Δ principle to identity through MF+SO: your identity exists in superposition across all possible roles until the context of authentication collapses it into a specific one. Rooted in a single BIP39 seed phrase (the identity seed), MF+SO derives independent keypairs for each role — personal, work, anonymous, emergency — all from the same seed but cryptographically unlinkable without it. When you authenticate to a service, you present only the keypair for that role. The superposition of your identity is never revealed. The service sees only the collapsed role, and no service can link that role to your other identities because the derivation is one-way.

## The Research

We present the application of the Δ principle to identity management through MF+SO, the sovereign identity and authentication vault. In the Δ identity model, a user's identity exists in superposition across all possible roles, derived from a single BIP39 seed phrase through independent key derivation paths. Authentication collapses this superposition into a single role, presenting only the cryptographic material relevant to that context. The system uses Shamir's Secret Sharing for social recovery (the seed can be reconstructed from shards distributed across trusted parties) and ZK-SNARKs for selective disclosure (proving attributes without revealing which role is being used). We demonstrate that this model eliminates the fundamental privacy problem of identity systems — the linkage of contexts — while providing stronger recovery guarantees than any single-identity system.

> **Full citation:** Alpasan, L.-K. (2026). Δ × MF+SO: Identity as Superposition of Authenticated Selves. *The Anticloud Research Corpus.*

## Why The Anticloud

The cloud identity model is broken because it forces you to be one person for every service. Your Google identity follows you everywhere. Your Facebook login tracks you across the web. This is not identity — it is surveillance. The Anticloud's Δ identity model gives you back your superposition. You are not one person. You are a probability distribution of roles, each appropriate to its context, and no context can see the distribution. Your identity is yours, derived from your seed, under your control, and revealed only as much as you choose.

ΔaaS requires one machine, one binary, and zero trust in anyone.

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

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

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
15. Lois-Kleinner Telepedia: https://anticloud.telepedia.net
16. Lois-Kleinner Fandom: https://anticloud.fandom.com
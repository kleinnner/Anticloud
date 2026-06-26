# We designed a kernel that cannot be turned off by a foreign government.

**Kernel-Level Sovereignty: TPM-Rooted Attestation for Superposition Computing**

---

## The Problem

Geopolitical risk in computing is usually discussed at the application level — data residency, jurisdiction, compliance. But the most dangerous point of control is the kernel. A kernel that phones home to a certificate authority, that accepts updates from a centralized repository, that trusts a hardware root that can be revoked by a state actor — this is not sovereign infrastructure. It is infrastructure that someone else can turn off. The cloud providers know this. That is why they invest so heavily in kernel-level integration. Control the kernel, and you control everything above it.

## What We Built

We designed a kernel-level sovereign attestation architecture using TPM 2.0 hardware roots of trust. The Δ kernel measures every component during boot — firmware, bootloader, kernel image, initramfs — and extends these measurements into TPM Platform Configuration Registers. Before any workload runs, the kernel produces an attestation quote signed by the TPM's Attestation Identity Key. This quote proves that the system booted exactly the software it expects, on exactly the hardware it trusts. No remote attestation server is required. The attestation is local, self-verifying, and anchored in hardware that cannot be revoked remotely. The kernel does not ask anyone for permission to boot. It verifies itself and proceeds.

## The Research

Sovereign computing requires hardware-rooted trust that cannot be revoked by external authorities. We present the Δ kernel attestation architecture, which uses TPM 2.0 for measured boot, platform identity, and local attestation without dependence on remote verification servers. The system produces signed attestation quotes at boot time, binding the software state to the hardware state through SHA3-256 hash chains extended into TPM PCRs. The attestation is self-verifying — the kernel does not need to phone home to confirm its own integrity. This creates a closed loop of trust: the hardware attests to the software, the software attests to the workload, and the workload attests to the user. No external party is necessary at any point.

> **Full citation:** Alpasan, L.-K. (2026). Kernel-Level Sovereignty: TPM-Rooted Attestation for Superposition Computing. *The Anticloud Research Corpus.*

## Why The Anticloud

The cloud industry tells you that your data is safe because they have certifications. But certifications can be revoked. Data centers can be seized. Companies can be acquired by hostile actors. The only trust that matters is the trust you can verify locally, without asking anyone's permission. The Anticloud's kernel-level attestation means you never have to ask — not a cloud provider, not a certificate authority, not a government — whether your system is still yours. You verify it yourself, on your hardware, with your keys.

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
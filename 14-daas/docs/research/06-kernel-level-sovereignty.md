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

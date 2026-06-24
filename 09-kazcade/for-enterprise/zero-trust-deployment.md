<!--
  ▄▄   ▄▄▄                      ▄▄                        ▄▄                     
  ██  ██▀                       ██                        ██                     
  ▄▄▄█  ██▄██      ▄█████▄  ████████  ██ ▄██▀    ▄█████▄   ▄███▄██   ▄████▄   █▄▄▄     
  ▄▄█▀▀▀    █████      ▀ ▄▄▄██      ▄█▀   ██▄██      ▀ ▄▄▄██  ██▀  ▀██  ██▄▄▄▄██    ▀▀▀█▄▄ 
  ▀▀█▄▄▄    ██  ██▄   ▄██▀▀▀██    ▄█▀     ██▀██▄    ▄██▀▀▀██  ██    ██  ██▀▀▀▀▀▀    ▄▄▄█▀▀ 
      ▀▀▀█  ██   ██▄  ██▄▄▄███  ▄██▄▄▄▄▄  ██  ▀█▄   ██▄▄▄███  ▀██▄▄███  ▀██▄▄▄▄█  █▀▀▀     
           ▀▀    ▀▀   ▀▀▀▀ ▀▀  ▀▀▀▀▀▀▀▀  ▀▀   ▀▀▀   ▀▀▀▀ ▀▀    ▀▀▀ ▀▀    ▀▀▀▀▀
  Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime
-->

# Zero Trust Deployment — Air-Gapped & Offline Operation

## Overview

Kazkade is architected for zero-trust environments where network connectivity cannot be assumed or is explicitly prohibited. The runtime operates fully offline — no telemetry, no external calls, no dependency on remote services. This makes Kazkade suitable for classified networks, critical infrastructure, air-gapped data centers, and environments subject to strict data sovereignty requirements.

## No Network Required

Unlike many modern runtimes that require periodic phone-home checks, license validation servers, or update pings, Kazkade is intentionally network-independent. The following features operate without any network access:

- Benchmark execution and result computation
- `.aioss` ledger initialization, writing, and verification
- Binary integrity checking via SHA3-256 checksums
- Configuration parsing and validation
- Local result visualization

There are no background threads, scheduled callbacks, or lazy-loaded network resources. A packet-filter rule blocking all outbound traffic from the Kazkade binary will not affect functionality in any way.

## Fully Local .aioss Ledger

The `.aioss` ledger is written to the local filesystem at the path specified during installation. It is never transmitted, cached, or replicated to any external service. The ledger's hash chain and Ed25519 signatures are computed and verified entirely on the local CPU.

For audit purposes, an administrator may export the ledger to a portable medium (USB drive, secured file share) using `kazkade ledger export`. This is an explicit, administrator-initiated action — never automatic.

## Offline Verification

Binary integrity can be verified without network access using the embedded SHA3-256 checksum and the release manifest:

```bash
# On an internet-connected build machine, download the manifest
curl -O https://releases.kazkade.dev/v1.2.3/release.sig

# Transfer release.sig to the air-gapped node via approved media
# On the air-gapped node:
kazkade verify-self --manifest release.sig
```

The `verify-self` command computes the SHA3-256 hash of the running binary and compares it against the signed manifest. If the binary has been tampered with — even a single byte — the hash will not match and the command will exit with code 1.

## SHA3-256 Checksums

Kazkade uses SHA3-256 (not SHA-256) for all integrity operations. SHA3-256 was selected for its resistance to length-extension attacks and its status as a NIST-standardized primitive suitable for classified and government use.

Every release artifact is published with a corresponding `.sha3-256` checksum file:

```bash
sha3sum -a 256 kazkade-linux-x86_64.tar.gz  # external verification
kazkade hash --file kazkade-linux-x86_64.tar.gz  # internal computation
```

## No Telemetry Data Exfiltration

Kazkade contains zero telemetry instrumentation. There are no anonymous usage statistics, crash reporters, error uploaders, or analytics beacons. The binary does not:

- Send HTTP requests to any endpoint
- Resolve DNS names
- Open outbound sockets
- Connect to databases or message queues
- Upload logs to remote services
- Phone home for license validation

This is a design invariant verified by the build pipeline. Any pull request that introduces a network dependency is rejected during code review.

## Deployment in Air-Gapped Environments

### Initial Installation

1. Download the Kazkade release archive on an internet-connected workstation
2. Verify the archive checksum against the published `.sha3-256` file
3. Transfer the archive to the air-gapped environment via approved media (removable drive, optical disc, secured file transfer)
4. Extract and run `kazkade-installer --silent --verify`
5. The `--verify` flag validates the binary using the checksum embedded in the installer

### Ongoing Operation

- All `.aioss` ledger operations are local
- Benchmark results remain on the node until explicitly exported
- Configuration changes are applied locally with no external validation required
- Logs are written to local files only; forwarding to a SIEM requires explicit export

### Update Process

1. Transfer the new release archive to the air-gapped environment
2. Run `kazkade-installer --silent --version <new>` alongside the existing installation
3. Kazkade supports side-by-side binary versions for rollback safety
4. Verify the new binary with `kazkade verify-self --manifest <new-manifest>`

## Threat Model

| Threat | Mitigation |
|--------|------------|
| Network exfiltration of benchmark data | No network code in binary |
| Telemetry leakage | Zero telemetry instrumentation |
| Supply chain compromise | SHA3-256 checksums + Ed25519 signatures |
| Binary tampering at rest | On-demand self-verification |
| Audit log tampering | Hash chain + cryptographic signatures |
| Covert channel via dependencies | Pinned Cargo.lock + offline dependency audit |

---
*Lois-Kleinner & 0-1.gg 2026 — Kazkade Zero-Copy Compute Runtime*
